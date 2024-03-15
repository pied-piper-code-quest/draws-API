import { AuthDatasourceInterface } from "../../domain/datasources";
import { AuthRepositoryInterface } from "../../domain/repositories";
import { DiscordUserEntity, UserAdminEntity } from "../../domain/entities";
import { AuthUserFromDiscordDto, LoginUserAdminDto } from "../../domain/dtos";

export class AuthRepository implements AuthRepositoryInterface {
  constructor(private readonly datasource: AuthDatasourceInterface) {}

  authFromDiscord(
    authUserFromDiscordDto: AuthUserFromDiscordDto,
  ): Promise<DiscordUserEntity> {
    return this.datasource.authFromDiscord(authUserFromDiscordDto);
  }

  login(loginUserAdminDto: LoginUserAdminDto): Promise<UserAdminEntity> {
    return this.datasource.login(loginUserAdminDto);
  }
}
