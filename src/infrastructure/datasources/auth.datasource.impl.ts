import { DiscordUserModel, UserAdminModel } from "../../data/mongo-db";
import { AuthDatasourceInterface } from "../../domain/datasources/";
import { DiscordUserEntity, UserAdminEntity } from "../../domain/entities";
import { AuthUserFromDiscordDto, LoginUserAdminDto } from "../../domain/dtos";
import { CustomError } from "../../domain/errors";
import { type NeverReturn, handleDBError } from "../handle-errors";
import { DiscordUserMapper, UserAdminMapper } from "../mappers";
import type { CompareFunction } from "../interfaces";

export class AuthDatasource implements AuthDatasourceInterface {
  constructor(private readonly comparePassword: CompareFunction) {}

  private handleError: NeverReturn = handleDBError;

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
        throw CustomError.badRequest("Credenciales inválidas");
      }
      const passwordMatch = this.comparePassword(password, findUser.password);
      if (!passwordMatch) {
        throw CustomError.badRequest("Credenciales inválidas");
      }

      return UserAdminMapper.UserAdminEntityFromObject(findUser);
    } catch (error) {
      this.handleError(error);
    }
  };
}
