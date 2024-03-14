import { CreateDrawDto } from "../dtos";
import { DrawEntity } from "../entities";

export abstract class DrawsRepositoryInterface {
  abstract createDraw(createDrawDto: CreateDrawDto): Promise<DrawEntity>;

  // abstract updateDraw(updateDrawDto: UpdateDrawDto): Promise<DrawEntity>;

  // abstract find(findDrawsDto: FindDrawsDto): Promise<DrawEntity[]>;

  // abstract findOne(findOneDrawDto: FindOneDrawDto): Promise<DrawEntity>;

  // abstract cancelDraw(cancelDrawDto: CancelDrawDto): Promise<DrawEntity>;

  // abstract finishDraw(finishDrawDto: FinishDrawDto): Promise<DrawEntity>;

  // abstract subscribeToDraw(subscribeToDrawDto: SubscribeToDrawDto): Promise<DrawEntity>;
}
