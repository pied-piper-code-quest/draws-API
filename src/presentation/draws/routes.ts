import { Router } from "express";
import { OAuthAdapter } from "../../config";
import { UserType } from "../../domain/entities";
import { DrawsDatasource, DrawsRepository } from "../../infrastructure";
import { DrawsController } from "./controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { webSockets } from "../server";

export class DrawRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new DrawsDatasource();
    const drawsRepository = new DrawsRepository(datasource);

    const controller = new DrawsController(
      webSockets.io,
      drawsRepository,
      OAuthAdapter.Discord,
    );

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

    router.post(
      "/start/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.startDraw,
    );
    router.post(
      "/assign-winner/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.generateWinner,
    );

    return router;
  }
}
