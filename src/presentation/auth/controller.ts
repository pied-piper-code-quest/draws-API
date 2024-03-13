import type { Request, Response } from "express";
import { OAuthProvider } from "../../config";
import {
  AuthUserFromDiscordDto,
  LoginUserAdminDto,
  RegisterUserAdminDto,
} from "../../domain/dtos";
import { AuthRepositoryInterface } from "../../domain/repositories";
import { ResponseError } from "../custom-errors";
import { JwtAdapter } from "../../config/jwt.adapter";
import { CustomError } from "../../domain/errors";
import { DiscordUserResponse, TokenResponse } from "../../config/oauth.adapter";

export class AuthController {
  private handleError = ResponseError;

  constructor(
    private readonly authRepository: AuthRepositoryInterface,
    private readonly OAuth: OAuthProvider,
  ) {}

  registerUser = async (req: Request, res: Response) => {
    const [error, registerUserAdminDto] = RegisterUserAdminDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const user = await this.authRepository.register(registerUserAdminDto);
      const token = await this.generateUserToken({ id: user.id });
      res.status(201).json({ user, token });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserAdminDto] = LoginUserAdminDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const user = await this.authRepository.login(loginUserAdminDto);
      const token = await this.generateUserToken(user.id);
      res.status(201).json({ user, token });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  sendProviderOAuthUrl = (req: Request, res: Response) => {
    res.json({
      url: `${this.OAuth.config.authUrl}?${this.OAuth.authParams}`,
    });
  };

  verifyProviderToken = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code)
      return res
        .status(400)
        .json({ message: "Authorization code must be provided" });
    try {
      const tokenProps = this.OAuth.tokenProps(code);

      const request = await fetch(`${this.OAuth.config.tokenUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: tokenProps.auth,
        },
        body: tokenProps.params,
      });
      console.log("status: ", request.status);
      if (request.status !== 200) {
        throw CustomError.unauthorized("Unauthorized");
      }
      const { access_token, token_type }: TokenResponse = await request.json();
      // Get user info from id token

      const requestUser = await fetch(this.OAuth.config.userUrl, {
        method: "GET",
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      });
      if (requestUser.status !== 200) {
        throw CustomError.internalServer("User not found in discord");
      }
      const responseUser: DiscordUserResponse = await requestUser.json();

      console.log("responseUser: ", responseUser);
      const [error, authUserFromDiscordDto] =
        AuthUserFromDiscordDto.create(responseUser);
      if (error !== null)
        throw CustomError.internalServer(
          "Bad format in authUserFromDiscordDto",
        );
      console.log("authUserFromDiscordDto: ", authUserFromDiscordDto);
      const discordUser = await this.authRepository.authFromDiscord(
        authUserFromDiscordDto,
      );
      const newToken = await this.generateUserToken({
        id: discordUser.id,
      });
      return res.json({
        user: responseUser,
        token: newToken,
      });
    } catch (err: any) {
      console.error("Error: ", err);
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  verifyJWTToken = async (req: Request, res: Response) => {
    // @ts-ignore
    const discordUser = req.discordUser;
    res.send({ data: discordUser });
  };

  authUserFromDiscord = async (req: Request, res: Response) => {
    const [error, loginUserAdminDto] = LoginUserAdminDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const user = await this.authRepository.login(loginUserAdminDto);
      const token = await this.generateUserToken({ id: user.id });
      res.status(201).json({ user, token });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  private generateUserToken = <T = { id: string }>(payload: T) => {
    return JwtAdapter.generateToken({
      // username: user.username,
      // email: user.email,
      // id: id,
      payload,
    });
  };
}
