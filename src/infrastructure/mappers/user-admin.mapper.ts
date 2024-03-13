import { UserAdminEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class UserAdminMapper {
  static UserAdminEntityFromObject(
    props: Record<string, any>,
  ): UserAdminEntity {
    const { id, _id, username, email, isActive, createdAt, updatedAt } = props;

    if (!id && !_id) {
      throw CustomError.badRequest("Missing id");
    }
    if (!username) {
      throw CustomError.badRequest("Missing username");
    }
    if (!email) {
      throw CustomError.badRequest("Missing email");
    }
    if (!createdAt) {
      throw CustomError.badRequest("Missing createdAt");
    }
    if (!updatedAt) {
      throw CustomError.badRequest("Missing updatedAt");
    }
    // if (!password) {
    //   throw CustomError.badRequest("Missing password");
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
