import type { Request, Response } from "express";
import { AuthUserFromDiscordDto, LoginUserAdminDto } from "../../domain/dtos";
import { AuthRepositoryInterface } from "../../domain/repositories";
import { ResponseError } from "../custom-errors";
import { JwtAdapter, TokenPayload } from "../../config/jwt.adapter";
import { CustomError } from "../../domain/errors";
import type {
  DiscordOAuthProvider,
  DiscordUserResponse,
  TokenResponse,
} from "../../config/oauth";
import { UserType } from "../../domain/entities";

export class AuthController {
  private handleError = ResponseError;

  constructor(
    private readonly authRepository: AuthRepositoryInterface,
    private readonly OAuth: DiscordOAuthProvider,
  ) {}

  loginUser = async (req: Request, res: Response) => {
    const [error, loginUserAdminDto] = LoginUserAdminDto.create(req.body);
    if (error !== null) return res.status(400).json({ message: error });

    try {
      const user = await this.authRepository.login(loginUserAdminDto);
      const token = await this.generateUserToken({
        id: user.id,
        userType: UserType.admin,
      });
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
        .json({ message: "Se debe proveer el código de autorización" });
    try {
      const tokenProps = this.OAuth.tokenProps(code);

      // Verificar si el usuario existe en discord
      const request = await fetch(`${this.OAuth.config.tokenUrl}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: tokenProps.auth,
        },
        body: tokenProps.params,
      });
      if (request.status !== 200) {
        throw CustomError.unauthorized("No autorizado");
      }
      const { access_token, token_type }: TokenResponse = await request.json();

      // Obtener datos del usuario por medio de su token
      const requestUser = await fetch(this.OAuth.config.userUrl, {
        method: "GET",
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      });
      if (requestUser.status !== 200) {
        throw CustomError.internalServer("Usuario no encontrado en Discord");
      }
      const responseUser: DiscordUserResponse = await requestUser.json();

      const [error, authUserFromDiscordDto] = AuthUserFromDiscordDto.create({
        ...responseUser,
        access_token,
      });
      console.log(error);
      if (error !== null)
        throw CustomError.internalServer(
          "Mal formato en authUserFromDiscordDto: " + error,
        );
      const discordUser = await this.authRepository.authFromDiscord(
        authUserFromDiscordDto,
      );
      const newToken = await this.generateUserToken({
        id: discordUser.id,
        userType: UserType.discord,
      });
      return res.json({
        user: discordUser,
        token: newToken,
      });
    } catch (err: any) {
      console.error("Error: ", err);
      res.status(401).json({ message: err.message ?? "No autorizado" });
    }
  };

  verifyJWTToken = async (req: Request, res: Response) => {
    // @ts-ignore
    const user = req.discordUser || req.userAdmin;
    // @ts-ignore
    const userType = req.userType;
    res.send({ user, userType });
  };

  private generateUserToken = (payload: TokenPayload) => {
    return JwtAdapter.generateToken(payload);
  };
}
