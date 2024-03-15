import type { FilterQuery } from "mongoose";
import { type DrawInterface, DrawModel, DrawStatus } from "../../data/mongo-db";
import { DrawsDatasourceInterface } from "../../domain/datasources";
import type {
  CreateDrawDto,
  FindWithPaginationDto,
  FinishDrawDtoDto,
  UpdateDrawDto,
} from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import type { DrawEntity } from "../../domain/entities";
import type { ResponseWithPagination } from "../../domain/interfaces";
import { type NeverReturn, handleDBError } from "../handle-errors";
import { DrawMapper } from "../mappers";
import { FindModelWithPagination } from "../utils";

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
    await this.findOneById(id);
    try {
      const updatedDraw = await DrawModel.findByIdAndUpdate(id, updateDrawDto);
      return DrawMapper.DrawEntityFromObject(updatedDraw!);
    } catch (error) {
      this.handleError(error);
    }
  };
  cancelDraw = async (id: string): Promise<DrawEntity> => {
    const draw = await this.findOneById(id);
    draw.available = false;
    draw.status = DrawStatus.canceled;
    await draw.save();
    return DrawMapper.DrawEntityFromObject(draw);
  };
  finishDraw = async (
    id: string,
    finishDrawDto: FinishDrawDtoDto,
  ): Promise<DrawEntity> => {
    const { winners } = finishDrawDto;

    const verifiedWinners = winners;
    // TODO: Implementar lógica para verificar que los usuarios existen en BBDD
    // TODO: Implementar lógica para validar que los ganadores están en la comunidad de discord
    const draw = await this.findOneById(id);

    const drawParticipants = draw.participants as string[];
    const errorInWinners = winners.some(
      discordId => !drawParticipants.includes(discordId),
    );
    if (errorInWinners)
      throw CustomError.badRequest(
        "Al menos 1 de los ganadores seleccionados no participa en el sorteo",
      );
    draw.available = false;
    draw.status = DrawStatus.finished;
    draw.winners = verifiedWinners;
    await draw.save();

    return DrawMapper.DrawEntityFromObject(draw);
  };
  subscribeToDraw = async (
    drawId: string,
    discordId: string,
  ): Promise<DrawEntity> => {
    const draw = await this.findOneById(drawId);
    const drawParticipants = draw.participants as string[];
    if (drawParticipants.includes(discordId))
      throw CustomError.badRequest(
        "El usuario ya está inscrito en este sorteo",
      );

    drawParticipants.push(discordId);
    draw.participants = drawParticipants;
    await draw.save();

    return DrawMapper.DrawEntityFromObject(draw);
  };
}
