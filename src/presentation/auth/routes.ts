import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasource, AuthRepository } from "../../infrastructure";
import { BcryptAdapter, OAuthAdapter } from "../../config";
import { authMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new AuthDatasource(BcryptAdapter.compare);
    const authRepository = new AuthRepository(datasource);

    const controller = new AuthController(authRepository, OAuthAdapter.Discord);

    router.post("/login", controller.loginUser);

    router.get("/oauth-url", controller.sendProviderOAuthUrl);

    router.get("/oauth-token", controller.verifyProviderToken);

    router.get(
      "/verify-token",
      authMiddleware.ValidateUser(),
      controller.verifyJWTToken,
    );

    return router;
  }
}
