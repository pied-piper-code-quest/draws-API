import { UserAdminEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class UserAdminMapper {
  static UserAdminEntityFromObject(
    props: Record<string, any>,
  ): UserAdminEntity {
    const { id, _id, username, email, isActive, createdAt, updatedAt } = props;

    if (!id && !_id) {
      throw CustomError.badRequest("Falta id");
    }
    if (!username) {
      throw CustomError.badRequest("Falta username");
    }
    if (!email) {
      throw CustomError.badRequest("Falta email");
    }
    if (!createdAt) {
      throw CustomError.badRequest("Falta createdAt");
    }
    if (!updatedAt) {
      throw CustomError.badRequest("Falta updatedAt");
    }
    // if (!password) {
    //   throw CustomError.badRequest("Falta password");
    // }
    return new UserAdminEntity(
      id || _id,
      username,
      email,
      // password,
      isActive,
      createdAt,
      updatedAt,
    );
  }
}
