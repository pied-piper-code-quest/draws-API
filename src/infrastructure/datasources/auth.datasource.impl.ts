import { UserAdminModel } from "../../data/mongo-db";
import { AuthDatasourceInterface } from "../../domain/datasources/";
import { DiscordUserAdminEntity, UserAdminEntity } from "../../domain/entities";
import {
  AuthUserFromDiscordDto,
  LoginUserAdminDto,
  RegisterUserAdminDto,
} from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import { UserAdminMapper } from "../mappers/user-admin.mapper";
import type { CompareFunction, HashFunction } from "../interfaces";

export class AuthDatasource implements AuthDatasourceInterface {
  constructor(
    private readonly hashPassword: HashFunction,
    private readonly comparePassword: CompareFunction,
  ) {}
  authFromDiscord(
    authUserFromDiscordDto: AuthUserFromDiscordDto,
  ): Promise<DiscordUserAdminEntity> {
    throw new Error("Method not implemented.");
  }

  async login(loginUserAdminDto: LoginUserAdminDto): Promise<UserAdminEntity> {
    const { username, password } = loginUserAdminDto;
    try {
      const findUser = await UserAdminModel.findOne({ username });
      if (!findUser) {
        throw CustomError.badRequest("Invalid Credentials");
      }
      const passwordMatch = this.comparePassword(password, findUser.password);
      if (!passwordMatch) {
        throw CustomError.badRequest("Invalid Credentials");
      }

      return UserAdminMapper.UserAdminEntityFromObject(findUser);
    } catch (error) {
      this.handleError(error);
    }
  }

  async register(
    registerUserAdminDto: RegisterUserAdminDto,
  ): Promise<UserAdminEntity> {
    const { name, lastName, phone, username, email, password } =
      registerUserAdminDto;
    try {
      const findUser = await UserAdminModel.findOne({
        $or: [{ username }, { email }],
      });
      if (findUser) {
        // throw CustomError.badRequest("(Username | Email) already exist");
        throw CustomError.badRequest("Invalid Credentials");
      }

      const user = await UserAdminModel.create({
        name,
        lastName,
        phone,
        username,
        email,
        password: this.hashPassword(password),
      });

      await user.save();

      return UserAdminMapper.UserAdminEntityFromObject(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof CustomError) {
      throw error;
    }
    throw CustomError.internalServer(error);
  }
}
