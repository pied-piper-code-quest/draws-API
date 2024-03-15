import { FindWithPaginationDto, RegisterUserAdminDto } from "../dtos";
import { DiscordUserEntity, UserAdminEntity } from "../entities";
import { ResponseWithPagination } from "../interfaces/index";

export abstract class UsersDatasourceInterface {
  abstract seedUserAdmins(): Promise<UserAdminEntity>;
  abstract registerUserAdmin(
    registerUserAdminDto: RegisterUserAdminDto,
  ): Promise<UserAdminEntity>;

  abstract findUserAdmins(
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<UserAdminEntity>>;
  abstract findOneUserAdmin(id: string): Promise<UserAdminEntity>;
  abstract deleteUserAdmin(id: string): Promise<UserAdminEntity>;

  abstract findDiscordUsers(
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<DiscordUserEntity>>;
  abstract findOneDiscordUser(id: string): Promise<DiscordUserEntity>;
}
