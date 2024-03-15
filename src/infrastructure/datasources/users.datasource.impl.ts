import { DiscordUserModel, UserAdminModel } from "../../data/mongo-db";
import { UsersDatasourceInterface } from "../../domain/datasources";
import type {
  FindWithPaginationDto,
  RegisterUserAdminDto,
} from "../../domain/dtos";
import type { UserAdminEntity, DiscordUserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";
import type { ResponseWithPagination } from "../../domain/interfaces";
import type { HashFunction } from "../interfaces";
import { DiscordUserMapper, UserAdminMapper } from "../mappers";
import { FindModelWithPagination } from "../utils";

export class UsersDatasource implements UsersDatasourceInterface {
  constructor(private readonly hashPassword: HashFunction) {}
  private findUserAdminById = async (id: string) => {
    const userAdmin = await UserAdminModel.findOne({ _id: id, isActive: true });
    if (!userAdmin) {
      throw CustomError.notFound("Admin not found");
    }
    return userAdmin;
  };
  private findDiscordUserById = async (id: string) => {
    const discordUser = await DiscordUserModel.findById(id);
    if (!discordUser) {
      throw CustomError.notFound("Discord user not found");
    }
    return discordUser;
  };
  seedUserAdmins = async (): Promise<UserAdminEntity> => {
    const findUserAdmins = await UserAdminModel.countDocuments();
    if (findUserAdmins !== 0) {
      throw CustomError.forbidden("Ya existe un usuario administrador");
    }
    try {
      const userAdmin = await UserAdminModel.create({
        email: "admin@admin.com",
        isActive: true,
        username: "admin",
        password: this.hashPassword("admin"),
      });
      return UserAdminMapper.UserAdminEntityFromObject(userAdmin);
    } catch (error) {
      throw CustomError.internalServer(error);
    }
  };
  registerUserAdmin = async (
    registerUserAdminDto: RegisterUserAdminDto,
  ): Promise<UserAdminEntity> => {
    const { username, email, password } = registerUserAdminDto;
    try {
      const findUser = await UserAdminModel.findOne({
        username,
      });
      if (findUser) {
        throw CustomError.badRequest("username already exist");
        // throw CustomError.badRequest("Invalid Credentials");
      }

      const user = await UserAdminModel.create({
        username,
        email,
        password: this.hashPassword(password),
      });

      await user.save();

      return UserAdminMapper.UserAdminEntityFromObject(user);
    } catch (error) {
      this.handleError(error);
    }
  };

  findUserAdmins = async (
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<UserAdminEntity>> => {
    const { limit, page } = findWithPaginationDto;

    const { currentPage, data, totalPages } = await FindModelWithPagination({
      model: UserAdminModel,
      filter: { isActive: true },
      limit,
      page,
    });

    return {
      // data: data.map(element => UserAdminMapper.UserAdminEntityFromObject(element)),
      data: data.map(UserAdminMapper.UserAdminEntityFromObject),
      totalPages: totalPages,
      currentPage: currentPage,
    };
  };
  findOneUserAdmin = async (id: string): Promise<UserAdminEntity> => {
    const userAdmin = await this.findUserAdminById(id);
    return UserAdminMapper.UserAdminEntityFromObject(userAdmin);
  };
  deleteUserAdmin = async (id: string): Promise<UserAdminEntity> => {
    const userAdmin = await this.findUserAdminById(id);
    userAdmin.isActive = false;
    await userAdmin.save();

    return UserAdminMapper.UserAdminEntityFromObject(userAdmin);
  };
  findDiscordUsers = async (
    findWithPaginationDto: FindWithPaginationDto,
  ): Promise<ResponseWithPagination<DiscordUserEntity>> => {
    const { limit, page } = findWithPaginationDto;

    const { currentPage, data, totalPages } = await FindModelWithPagination({
      model: DiscordUserModel,
      limit,
      page,
    });

    return {
      // data: data.map(element => DiscordUserMapper.DiscordUserEntityFromObject(element)),
      data: data.map(DiscordUserMapper.DiscordUserEntityFromObject),
      totalPages: totalPages,
      currentPage: currentPage,
    };
  };
  findOneDiscordUser = async (id: string): Promise<DiscordUserEntity> => {
    const discordUser = await this.findDiscordUserById(id);
    return DiscordUserMapper.DiscordUserEntityFromObject(discordUser);
  };

  private handleError(error: any): never {
    if (error instanceof CustomError) {
      throw error;
    }
    throw CustomError.internalServer(error);
  }
}
