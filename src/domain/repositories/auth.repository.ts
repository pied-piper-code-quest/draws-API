import { DiscordUserAdminEntity, UserAdminEntity } from "../entities";
import {
  AuthUserFromDiscordDto,
  LoginUserAdminDto,
  RegisterUserAdminDto,
} from "../dtos";

export abstract class AuthRepositoryInterface {
  abstract authFromDiscord(
    authUserFromDiscordDto: AuthUserFromDiscordDto,
  ): Promise<DiscordUserAdminEntity>;

  abstract login(
    loginUserAdminDto: LoginUserAdminDto,
  ): Promise<UserAdminEntity>;

  abstract register(
    registerUserAdminDto: RegisterUserAdminDto,
  ): Promise<UserAdminEntity>;
}
