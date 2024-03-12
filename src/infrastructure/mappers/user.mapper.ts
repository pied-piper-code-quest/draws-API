import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class UserMapper {
  static UserEntityFromObject(props: Record<string, any>): UserEntity {
    const { id, _id, username, email, isActive, role, createdAt, updatedAt } =
      props;

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
    return new UserEntity(
      id || _id,
      username,
      email,
      role,
      // password,
      isActive,
      createdAt,
      updatedAt,
    );
  }
}
