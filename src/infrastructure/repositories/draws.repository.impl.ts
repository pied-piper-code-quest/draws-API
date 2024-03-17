import { DrawsRepositoryInterface } from "../../domain/repositories";
import type { DrawsDatasourceInterface } from "../../domain/datasources";
import type {
  CreateDrawDto,
  FindWithPaginationDto,
  GenerateWinnerDto,
  UpdateDrawDto,
} from "../../domain/dtos";
import type { DrawEntity } from "../../domain/entities";
import type { ResponseWithPagination } from "../../domain/interfaces";

export class DrawsRepository implements DrawsRepositoryInterface {
  constructor(private readonly datasource: DrawsDatasourceInterface) {}

  find(
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<DrawEntity>> {
    return this.datasource.find(findWithPaginationDto);
  }
  findOne(id: string): Promise<DrawEntity> {
    return this.datasource.findOne(id);
  }
  createDraw(createDrawDto: CreateDrawDto): Promise<DrawEntity> {
    return this.datasource.createDraw(createDrawDto);
  }
  updateDraw(id: string, updateDrawDto: UpdateDrawDto): Promise<DrawEntity> {
    return this.datasource.updateDraw(id, updateDrawDto);
  }
  cancelDraw(id: string): Promise<DrawEntity> {
    return this.datasource.cancelDraw(id);
  }
  generateWinner(
    id: string,
    finishDrawDto: GenerateWinnerDto,
  ): Promise<DrawEntity> {
    return this.datasource.generateWinner(id, finishDrawDto);
  }
  subscribeToDraw(drawId: string, discordId: string): Promise<DrawEntity> {
    return this.datasource.subscribeToDraw(drawId, discordId);
  }
}
