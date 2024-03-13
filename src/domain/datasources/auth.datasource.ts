import { DiscordUserEntity, UserAdminEntity } from "../entities";
import {
  AuthUserFromDiscordDto,
  LoginUserAdminDto,
  RegisterUserAdminDto,
} from "../dtos";

export abstract class AuthDatasourceInterface {
  abstract authFromDiscord(
    authUserFromDiscordDto: AuthUserFromDiscordDto,
  ): Promise<DiscordUserEntity>;

  abstract login(
    loginUserAdminDto: LoginUserAdminDto,
  ): Promise<UserAdminEntity>;

  abstract register(
    registerUserAdminDto: RegisterUserAdminDto,
  ): Promise<UserAdminEntity>;
}
