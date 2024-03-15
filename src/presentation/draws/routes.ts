import { Router } from "express";
import { UserType } from "../../domain/entities";
import { DrawsDatasource, DrawsRepository } from "../../infrastructure";
import { DrawsController } from "./controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export class DrawRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new DrawsDatasource();
    const drawsRepository = new DrawsRepository(datasource);

    const controller = new DrawsController(drawsRepository);

    router.get("/", authMiddleware.ValidateUser(), controller.getDraws);
    router.get("/:id", authMiddleware.ValidateUser(), controller.getDrawById);

    router.post(
      "/subscribe/:id",
      authMiddleware.ValidateUser(UserType.discord),
      controller.subscribeToDraw,
    );

    router.post(
      "/manage",
      authMiddleware.ValidateUser(UserType.admin),
      controller.createNewDraw,
    );
    router.put(
      "/manage/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.updateDraw,
    );
    router.delete(
      "/manage/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.cancelDraw,
    );
    router.patch(
      "/finish/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.finishDraw,
    );

    return router;
  }
}
