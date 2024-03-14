import { DrawsDatasourceInterface } from "../../domain/datasources";
import type { CreateDrawDto } from "../../domain/dtos";
import type { DrawEntity } from "../../domain/entities";

export class DrawsDatasource implements DrawsDatasourceInterface {
  createDraw(createDrawDto: CreateDrawDto): Promise<DrawEntity> {
    throw new Error("Method not implemented.");
  }
}
