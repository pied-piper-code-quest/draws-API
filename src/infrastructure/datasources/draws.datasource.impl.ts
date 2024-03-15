import type { FilterQuery } from "mongoose";
import { type DrawInterface, DrawModel, DrawStatus } from "../../data/mongo-db";
import { DrawsDatasourceInterface } from "../../domain/datasources";
import type {
  CreateDrawDto,
  FindByIdDto,
  FindWithPaginationDto,
  FinishDrawDtoDto,
  UpdateDrawDto,
} from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import type { DrawEntity } from "../../domain/entities";
import type { ResponseWithPagination } from "../../domain/interfaces";
import { DrawMapper } from "../mappers";

export class DrawsDatasource implements DrawsDatasourceInterface {
  private findOneById = async (id: string) => {
    const draw = await DrawModel.findById(id);
    if (!draw) {
      throw CustomError.notFound("Draw not found");
    }
    return draw;
  };
  private handleError(error: any): never {
    if (error instanceof CustomError) {
      throw error;
    }
    throw CustomError.internalServer(error);
  }

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
    const offset = (page - 1) * limit;

    const totalDraws = await DrawModel.countDocuments(query);
    const draws = await DrawModel.find(query).limit(limit).skip(offset);
    const totalPages = Math.ceil(totalDraws / limit);
    return {
      // data: draws.map(element => DrawMapper.DrawEntityFromObject(element)),
      data: draws.map(DrawMapper.DrawEntityFromObject),
      totalPages: totalPages,
      currentPage: page,
    };
  };
  findOne = async (findByIdDto: FindByIdDto): Promise<DrawEntity> => {
    const { id } = findByIdDto;
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
  cancelDraw = async (findByIdDto: FindByIdDto): Promise<DrawEntity> => {
    const { id } = findByIdDto;
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
        "There is at least 1 winner who does not participate in the draw.",
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
    // TODO: Implementar lógica para verificar que el usuario existe en BBDD
    // TODO: Implementar lógica para validar que el usuario está en la comunidad de discord

    const draw = await this.findOneById(drawId);
    const drawParticipants = draw.participants as string[];
    if (drawParticipants.includes(discordId))
      throw CustomError.badRequest("User already subscribed");

    drawParticipants.push(discordId);
    draw.participants = drawParticipants;
    await draw.save();

    return DrawMapper.DrawEntityFromObject(draw);
  };
}
