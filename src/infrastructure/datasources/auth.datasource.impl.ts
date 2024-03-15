import { DiscordUserModel, UserAdminModel } from "../../data/mongo-db";
import { AuthDatasourceInterface } from "../../domain/datasources/";
import { DiscordUserEntity, UserAdminEntity } from "../../domain/entities";
import { AuthUserFromDiscordDto, LoginUserAdminDto } from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import type { CompareFunction } from "../interfaces";
import { DiscordUserMapper, UserAdminMapper } from "../mappers";

export class AuthDatasource implements AuthDatasourceInterface {
  constructor(private readonly comparePassword: CompareFunction) {}
  authFromDiscord = async (
    authUserFromDiscordDto: AuthUserFromDiscordDto,
  ): Promise<DiscordUserEntity> => {
    try {
      const { discordId, access_token } = authUserFromDiscordDto;
      const user = await DiscordUserModel.findOne({ discordId: discordId });
      if (user) {
        user.access_token = access_token;
        await user.save();
        return DiscordUserMapper.DiscordUserEntityFromObject(user);
      }
      const newUser = await DiscordUserModel.create(authUserFromDiscordDto);
      return DiscordUserMapper.DiscordUserEntityFromObject(newUser);
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer(error);
    }
  };

  login = async (
    loginUserAdminDto: LoginUserAdminDto,
  ): Promise<UserAdminEntity> => {
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
  };

  private handleError(error: any): never {
    if (error instanceof CustomError) {
      throw error;
    }
    throw CustomError.internalServer(error);
  }
}
