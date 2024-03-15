import { UsersDatasourceInterface } from "../../domain/datasources";
import { FindWithPaginationDto, RegisterUserAdminDto } from "../../domain/dtos";
import { UserAdminEntity, DiscordUserEntity } from "../../domain/entities";
import { ResponseWithPagination } from "../../domain/interfaces";
import { UsersRepositoryInterface } from "../../domain/repositories";

export class UsersRepository implements UsersRepositoryInterface {
  constructor(private readonly datasource: UsersDatasourceInterface) {}
  seedUserAdmins(): Promise<UserAdminEntity> {
    return this.datasource.seedUserAdmins();
  }
  registerUserAdmin(
    registerUserAdminDto: RegisterUserAdminDto,
  ): Promise<UserAdminEntity> {
    return this.datasource.registerUserAdmin(registerUserAdminDto);
  }

  findUserAdmins(
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<UserAdminEntity>> {
    return this.datasource.findUserAdmins(findWithPaginationDto);
  }
  findOneUserAdmin(id: string): Promise<UserAdminEntity> {
    return this.datasource.findOneUserAdmin(id);
  }
  deleteUserAdmin(id: string): Promise<UserAdminEntity> {
    return this.datasource.deleteUserAdmin(id);
  }

  findDiscordUsers(
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<DiscordUserEntity>> {
    return this.datasource.findDiscordUsers(findWithPaginationDto);
  }
  findOneDiscordUser(id: string): Promise<DiscordUserEntity> {
    return this.datasource.findOneDiscordUser(id);
  }
}
