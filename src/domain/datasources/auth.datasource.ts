import { DiscordUserEntity, UserAdminEntity } from "../entities";
import { AuthUserFromDiscordDto, LoginUserAdminDto } from "../dtos";

export abstract class AuthDatasourceInterface {
  abstract authFromDiscord(
    authUserFromDiscordDto: AuthUserFromDiscordDto,
  ): Promise<DiscordUserEntity>;

  abstract login(
    loginUserAdminDto: LoginUserAdminDto,
  ): Promise<UserAdminEntity>;
}
