import { NextFunction, Request, Response } from "express";
import { JwtAdapter, type TokenPayload } from "../../config/jwt.adapter";
import { DiscordUserModel, UserAdminModel } from "../../data/mongo-db";
import { CustomError } from "../../domain/errors";
import { ResponseError } from "../custom-errors";
import { UserType } from "../../domain/entities";

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
        throw CustomError.unauthorized("Unauthorized");
      }
      // if (roles && roles.length > 0 && !roles.includes(user.role)) {
      //   return res.status(401).json({ message: "Unauthorized" });
      // }

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
          throw CustomError.unauthorized("Unauthorized");
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
