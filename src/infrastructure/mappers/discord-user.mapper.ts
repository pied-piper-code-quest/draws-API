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
      discriminator,
      globalName,
      email,
      verified,
      createdAt,
      updatedAt,
    } = props;
    if (!id && !_id) {
      throw CustomError.badRequest("Missing id");
    }
    if (!discordId) {
      throw CustomError.badRequest("Missing discordId");
    }
    if (!username) {
      throw CustomError.badRequest("Missing username");
    }
    if (!avatar) {
      throw CustomError.badRequest("Missing avatar");
    }
    if (!discriminator) {
      throw CustomError.badRequest("Missing discriminator");
    }
    if (!globalName) {
      throw CustomError.badRequest("Missing globalName");
    }
    if (!email) {
      throw CustomError.badRequest("Missing email");
    }
    if (!verified) {
      throw CustomError.badRequest("Missing verified");
    }
    if (!createdAt) {
      throw CustomError.badRequest("Missing createdAt");
    }
    if (!updatedAt) {
      throw CustomError.badRequest("Missing updatedAt");
    }
    return new DiscordUserEntity(
      id || _id,
      discordId,
      username,
      avatar,
      discriminator,
      globalName,
      email,
      verified,
      createdAt,
      updatedAt,
    );
  }
}
