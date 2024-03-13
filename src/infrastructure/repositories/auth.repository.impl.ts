import { AuthDatasourceInterface } from "../../domain/datasources";
import { AuthRepositoryInterface } from "../../domain/repositories";
import { DiscordUserAdminEntity, UserAdminEntity } from "../../domain/entities";
import {
  AuthUserFromDiscordDto,
  LoginUserAdminDto,
  RegisterUserAdminDto,
} from "../../domain/dtos";

export class AuthRepository implements AuthRepositoryInterface {
  constructor(private readonly datasource: AuthDatasourceInterface) {}

  authFromDiscord(
    authUserFromDiscordDto: AuthUserFromDiscordDto,
  ): Promise<DiscordUserAdminEntity> {
    return this.datasource.authFromDiscord(authUserFromDiscordDto);
  }

  login(loginUserAdminDto: LoginUserAdminDto): Promise<UserAdminEntity> {
    return this.datasource.login(loginUserAdminDto);
  }

  register(
    registerUserAdminDto: RegisterUserAdminDto,
  ): Promise<UserAdminEntity> {
    return this.datasource.register(registerUserAdminDto);
  }
}
