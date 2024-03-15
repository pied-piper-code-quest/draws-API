import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserType } from "../../domain/entities";
import { UsersDatasource, UsersRepository } from "../../infrastructure";
import { UsersController } from "./controller";
import { BcryptAdapter } from "../../config";

export class UsersRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new UsersDatasource(BcryptAdapter.hash);
    const usersRepository = new UsersRepository(datasource);

    const controller = new UsersController(usersRepository);

    router.get("/seed", controller.executeUserSeed);
    router.post(
      "/register/admin",
      authMiddleware.ValidateUser(UserType.admin),
      controller.registerUserAdmin,
    );

    router.get(
      "/admin",
      authMiddleware.ValidateUser(UserType.admin),
      controller.getUserAdmins,
    );
    router.get(
      "/admin/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.getUserAdminById,
    );
    router.delete(
      "/admin/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.deleteUserAdminById,
    );

    router.get(
      "/discord",
      authMiddleware.ValidateUser(UserType.admin),
      controller.getDiscordUsers,
    );
    router.get(
      "/discord/:id",
      authMiddleware.ValidateUser(UserType.admin),
      controller.getDiscordUserById,
    );

    return router;
  }
}
