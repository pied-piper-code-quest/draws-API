import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config/jwt.adapter";
import { DiscordUserModel, UserAdminModel } from "../../data/mongo-db";
import { CustomError } from "../../domain/errors";
import { ResponseError } from "../custom-errors";

class AuthMiddleware {
  private readonly handleError = ResponseError;
  private readonly JWTError = new CustomError(
    500,
    "Invalid Token by internal server error",
  );
  private ValidateJWT = async (req: Request, res: Response) => {
    const authorization = req.header("Authorization");
    if (!authorization)
      throw CustomError.unauthorized("Unable to authenticate");
    if (!authorization.startsWith("Bearer "))
      throw CustomError.unauthorized("Invalid Bearer token");

    const token = authorization.split(" ").at(1) || "";

    const payload = await JwtAdapter.verifyToken(token);
    if (!payload) {
      throw CustomError.unauthorized("Invalid token");
    }
    return payload;
  };

  ValidateUserAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { payload } = await this.ValidateJWT(req, res);
      const user = await UserAdminModel.findById(payload.id);
      if (!user) {
        throw this.JWTError;
      }
      if (!user.isActive) {
        throw CustomError.unauthorized("Unauthorized");
      }
      // if (roles && roles.length > 0 && !roles.includes(user.role)) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }

      // @ts-ignore
      req.userAdmin = user;
      next();
    } catch (error) {
      this.handleError(error, res);
    }
  };
  ValidateDiscordUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { payload } = await this.ValidateJWT(req, res);
      const discordUser = await DiscordUserModel.findById(payload.id);
      if (!discordUser) {
        throw this.JWTError;
      }

      // @ts-ignore
      req.discordUser = discordUser;
      next();
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
export const authMiddleware = new AuthMiddleware();
