import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { UsersRoutes } from "./users/routes";
import { DrawRoutes } from "./draws/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/auth", AuthRoutes.routes);
    router.use("/users", UsersRoutes.routes);
    router.use("/draws", DrawRoutes.routes);
    return router;
  }
}
