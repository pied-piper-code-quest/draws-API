import { DrawsRepositoryInterface } from "../../domain/repositories";
import type { DrawsDatasourceInterface } from "../../domain/datasources";
import type { CreateDrawDto } from "../../domain/dtos";
import type { DrawEntity } from "../../domain/entities";

export class DrawsRepository implements DrawsRepositoryInterface {
  constructor(private readonly datasource: DrawsDatasourceInterface) {}

  createDraw(createDrawDto: CreateDrawDto): Promise<DrawEntity> {
    return this.datasource.createDraw(createDrawDto);
  }
}
