import {
  CreateDrawDto,
  FindWithPaginationDto,
  GenerateWinnerDto,
  UpdateDrawDto,
} from "../dtos";
import type { DrawEntity } from "../entities";
import type { ResponseWithPagination } from "../interfaces";

export abstract class DrawsDatasourceInterface {
  abstract find(
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<DrawEntity>>;

  abstract findOne(id: string): Promise<DrawEntity>;

  abstract createDraw(createDrawDto: CreateDrawDto): Promise<DrawEntity>;

  abstract updateDraw(
    id: string,
    updateDrawDto: UpdateDrawDto,
  ): Promise<DrawEntity>;

  abstract cancelDraw(id: string): Promise<DrawEntity>;

  abstract generateWinner(
    id: string,
    generateWinnerDto: GenerateWinnerDto,
  ): Promise<DrawEntity>;

  abstract subscribeToDraw(
    drawId: string,
    discordId: string,
  ): Promise<DrawEntity>;
}
