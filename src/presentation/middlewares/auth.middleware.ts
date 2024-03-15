import type { NextFunction, Request, Response } from "express";
import { JwtAdapter, type TokenPayload } from "../../config/jwt.adapter";
import { DiscordUserModel, UserAdminModel } from "../../data/mongo-db";
import { CustomError } from "../../domain/errors";
import { UserType } from "../../domain/entities";
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
      throw CustomError.unauthorized("No se ha podido autenticar");
    if (!authorization.startsWith("Bearer "))
      throw CustomError.unauthorized("Bearer token inválido");

    const token = authorization.split(" ").at(1) || "";

    const payload = await JwtAdapter.verifyToken(token);
    if (!payload) {
      throw CustomError.unauthorized("Token inválido");
    }
    return payload;
  };
  private ValidateUserAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
    payload: TokenPayload,
  ) => {
    try {
      const user = await UserAdminModel.findById(payload.id);
      if (!user) {
        throw this.JWTError;
      }
      if (!user.isActive) {
        throw CustomError.unauthorized("No autorizado");
      }

      // @ts-ignore
      req.userAdmin = user;
      // @ts-ignore
      req.userType = UserType.admin;
      next();
    } catch (error) {
      this.handleError(error, res);
    }
  };
  private ValidateDiscordUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
    payload: TokenPayload,
  ) => {
    try {
      const discordUser = await DiscordUserModel.findById(payload.id);
      if (!discordUser) {
        throw this.JWTError;
      }

      // @ts-ignore
      req.discordUser = discordUser;
      // @ts-ignore
      req.userType = UserType.discord;
      next();
    } catch (error) {
      this.handleError(error, res);
    }
  };

  ValidateUser =
    (...userTypes: UserType[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const payload = await this.ValidateJWT(req, res);
        if (
          userTypes &&
          userTypes.length > 0 &&
          !userTypes.includes(payload.userType)
        ) {
          throw CustomError.unauthorized("No autorizado");
        }
        if (payload.userType === UserType.admin) {
          return this.ValidateUserAdmin(req, res, next, payload);
        }
        if (payload.userType === UserType.discord) {
          return this.ValidateDiscordUser(req, res, next, payload);
        }
        throw this.JWTError;
      } catch (error) {
        this.handleError(error, res);
      }
    };
}
export const authMiddleware = new AuthMiddleware();
