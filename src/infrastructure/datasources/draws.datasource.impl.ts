import type { FilterQuery } from "mongoose";
import { type DrawInterface, DrawModel, DrawStatus } from "../../data/mongo-db";
import { DrawsDatasourceInterface } from "../../domain/datasources";
import type {
  CreateDrawDto,
  FindWithPaginationDto,
  GenerateWinnerDto,
  UpdateDrawDto,
} from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import type { DrawEntity } from "../../domain/entities";
import type { ResponseWithPagination } from "../../domain/interfaces";
import { type NeverReturn, handleDBError } from "../handle-errors";
import { DrawMapper } from "../mappers";
import { FindModelWithPagination } from "../utils";
import { Validators } from "../../config";

export class DrawsDatasource implements DrawsDatasourceInterface {
  private handleError: NeverReturn = handleDBError;

  private findOneById = async (id: string) => {
    try {
      const draw = await DrawModel.findById(id);
      if (!draw) {
        throw CustomError.notFound("Sorteo no encontrado");
      }
      return draw;
    } catch (error) {
      this.handleError(error);
    }
  };

  find = async (
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<DrawEntity>> => {
    const { startDate, endDate, limit, page } = findWithPaginationDto;

    const query: FilterQuery<DrawInterface> = {};
    if (startDate) {
      query.createdAt ??= {};
      query.createdAt.$gte = new Date(startDate + " 00:00:00");
    }
    if (endDate) {
      query.createdAt ??= {};
      query.createdAt.$lte = new Date(endDate + " 23:59:59");
    }

    const { currentPage, data, totalPages } = await FindModelWithPagination({
      model: DrawModel,
      filter: query,
      limit,
      page,
      sort: { createdAt: -1 },
    });

    return {
      // data: data.map(element => DrawMapper.DrawEntityFromObject(element)),
      data: data.map(DrawMapper.DrawEntityFromObject),
      totalPages: totalPages,
      currentPage: currentPage,
    };
  };
  findOne = async (id: string): Promise<DrawEntity> => {
    const draw = await this.findOneById(id);
    return DrawMapper.DrawEntityFromObject(draw);
  };
  createDraw = async (createDrawDto: CreateDrawDto): Promise<DrawEntity> => {
    try {
      const newDraw = await DrawModel.create(createDrawDto);
      return DrawMapper.DrawEntityFromObject(newDraw);
    } catch (error) {
      this.handleError(error);
    }
  };
  updateDraw = async (
    id: string,
    updateDrawDto: UpdateDrawDto,
  ): Promise<DrawEntity> => {
    const draw = await this.findOneById(id);
    if (draw.status !== DrawStatus.pending) {
      throw CustomError.forbidden("El sorteo ya ha comenzado");
    }
    try {
      const updatedDraw = await DrawModel.findByIdAndUpdate(id, updateDrawDto);
      return DrawMapper.DrawEntityFromObject(updatedDraw!);
    } catch (error) {
      this.handleError(error);
    }
  };
  startDraw = async (id: string): Promise<DrawEntity> => {
    const draw = await this.findOneById(id);
    console.log(draw.status);
    if (draw.status !== DrawStatus.pending) {
      throw CustomError.badRequest(
        "El sorteo debe estar en pendiente para comenzar",
      );
    }
    draw.available = false;
    draw.status = DrawStatus.live;
    await draw.save();
    return DrawMapper.DrawEntityFromObject(draw);
  };
  cancelDraw = async (id: string): Promise<DrawEntity> => {
    const draw = await this.findOneById(id);
    if (draw.status !== DrawStatus.finished) {
      throw CustomError.forbidden("El sorteo ya ha terminado");
    }
    draw.available = false;
    draw.status = DrawStatus.canceled;
    await draw.save();
    return DrawMapper.DrawEntityFromObject(draw);
  };
  generateWinner = async (
    id: string,
    finishDrawDto: GenerateWinnerDto,
  ): Promise<DrawEntity> => {
    const { winnerPosition, manualWinner, winnerId } = finishDrawDto;

    const draw = await this.findOneById(id);
    if (draw.status !== DrawStatus.live) {
      throw CustomError.badRequest("El sorteo no ha comenzado");
    }
    if (winnerPosition > draw.numberOfWinners) {
      throw CustomError.badRequest(
        "El puesto ganador seleccionado no está disponible en este sorteo",
      );
    }
    let selectedWinner: string;
    if (manualWinner) {
      const drawParticipants = draw.participants as string[];
      const winnerIsValid = drawParticipants.some(
        discordId => discordId.toString() === winnerId.toString(),
      );
      if (!winnerIsValid) {
        throw CustomError.badRequest(
          "El ganador seleccionado no es participante del sorteo",
        );
      }
      selectedWinner = winnerId;
    } else {
      const drawWinners = draw.winners as string[];
      let randomWinner: string;
      do {
        const randomWinnerIndex = Math.floor(
          Math.random() * draw.participants.length,
        );
        randomWinner = draw.participants[randomWinnerIndex] as string;
      } while (drawWinners.includes(randomWinner));
      selectedWinner = randomWinner;
    }
    draw.winners ??= [];
    let winnersReady = 0;
    for (let i = 0; i < draw.numberOfWinners; i++) {
      if (i === winnerPosition - 1) {
        draw.winners[i] = selectedWinner;
        winnersReady++;
        continue;
      }
      if (draw.winners[i]) {
        winnersReady++;
      } else {
        draw.winners[i] = null;
      }
    }

    if (winnersReady === draw.numberOfWinners) {
      draw.status = DrawStatus.finished;
    }
    await draw.save();
    await draw.populate([
      "winners",
      {
        path: "winners",
        select: "_id username avatar globalName",
      },
    ]);
    return DrawMapper.DrawEntityFromObject(draw);
  };

  subscribeToDraw = async (
    drawId: string,
    discordId: string,
  ): Promise<DrawEntity> => {
    const draw = await this.findOneById(drawId);
    if (
      draw.maxDateToJoin &&
      Validators.dateIsBeforeOfNow(draw.maxDateToJoin)
    ) {
      draw.available = false;
      await draw.save();
      // throw CustomError.forbidden("El sorteo ya no se encuentra disponible");
    }
    if (!draw.available) {
      throw CustomError.forbidden("El sorteo ya no se encuentra disponible");
    }
    const drawParticipants = draw.participants as string[];
    if (drawParticipants.includes(discordId))
      throw CustomError.badRequest(
        "El usuario ya está inscrito en este sorteo",
      );

    drawParticipants.push(discordId);
    draw.participants = drawParticipants;
    if (
      draw.maxParticipants &&
      draw.participants.length === draw.maxParticipants
    ) {
      draw.available = false;
    }
    await draw.save();

    return DrawMapper.DrawEntityFromObject(draw);
  };
}
