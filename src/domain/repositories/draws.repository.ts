import {
  CreateDrawDto,
  FindByIdDto,
  FindWithPaginationDto,
  FinishDrawDtoDto,
  UpdateDrawDto,
} from "../dtos";
import type { DrawEntity } from "../entities";
import type { ResponseWithPagination } from "../interfaces";

export abstract class DrawsRepositoryInterface {
  abstract find(
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<DrawEntity>>;

  abstract findOne(findByIdDto: FindByIdDto): Promise<DrawEntity>;

  abstract createDraw(createDrawDto: CreateDrawDto): Promise<DrawEntity>;

  abstract updateDraw(
    id: string,
    updateDrawDto: UpdateDrawDto,
  ): Promise<DrawEntity>;

  abstract cancelDraw(findByIdDto: FindByIdDto): Promise<DrawEntity>;

  abstract finishDraw(
    id: string,
    finishDrawDto: FinishDrawDtoDto,
  ): Promise<DrawEntity>;

  abstract subscribeToDraw(
    drawId: string,
    discordId: string,
  ): Promise<DrawEntity>;
}
