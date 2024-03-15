import { DrawsRepositoryInterface } from "../../domain/repositories";
import type { DrawsDatasourceInterface } from "../../domain/datasources";
import type {
  CreateDrawDto,
  FindByIdDto,
  FindWithPaginationDto,
  FinishDrawDtoDto,
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
  findOne(findByIdDto: FindByIdDto): Promise<DrawEntity> {
    return this.datasource.findOne(findByIdDto);
  }
  createDraw(createDrawDto: CreateDrawDto): Promise<DrawEntity> {
    return this.datasource.createDraw(createDrawDto);
  }
  updateDraw(id: string, updateDrawDto: UpdateDrawDto): Promise<DrawEntity> {
    return this.datasource.updateDraw(id, updateDrawDto);
  }
  cancelDraw(findByIdDto: FindByIdDto): Promise<DrawEntity> {
    return this.datasource.cancelDraw(findByIdDto);
  }
  finishDraw(id: string, finishDrawDto: FinishDrawDtoDto): Promise<DrawEntity> {
    return this.datasource.finishDraw(id, finishDrawDto);
  }
  subscribeToDraw(drawId: string, discordId: string): Promise<DrawEntity> {
    return this.datasource.subscribeToDraw(drawId, discordId);
  }
}
