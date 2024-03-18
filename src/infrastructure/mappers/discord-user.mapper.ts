import { DiscordUserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

export class DiscordUserMapper {
  static DiscordUserEntityFromObject(
    props: Record<string, any>,
  ): DiscordUserEntity {
    const {
      id,
      _id,
      discordId,
      username,
      avatar,
      email,
      createdAt,
      updatedAt,
    } = props;
    if (!id && !_id) {
      throw CustomError.badRequest("Falta id");
    }
    if (!discordId) {
      throw CustomError.badRequest("Falta discordId");
    }
    if (!username) {
      throw CustomError.badRequest("Falta username");
    }

    if (!createdAt) {
      throw CustomError.badRequest("Falta createdAt");
    }
    if (!updatedAt) {
      throw CustomError.badRequest("Falta updatedAt");
    }
    return new DiscordUserEntity(
      id || _id,
      discordId,
      username,
      avatar || null,
      email || null,
      createdAt,
      updatedAt,
    );
  }
}
