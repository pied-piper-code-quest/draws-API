import { DrawEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors";

interface foo {
  discordId: string;
  username: string;
  avatar: string;
  discriminator: string;
  globalName: string;
  email: string;
  verified: boolean;
}

export class DrawMapper {
  static DrawEntityFromObject(props: Record<string, any>): DrawEntity {
    const {
      id,
      _id,
      title,
      description,
      status,
      available,
      maxParticipants,
      numberOfWinners,
      prizes,
      resultDate,
      maxDateToJoin,
      participants,
      winners,
      createdAt,
      updatedAt,
    } = props;

    if (!id && !_id) {
      throw CustomError.badRequest("Missing id");
    }
    if (!title) {
      throw CustomError.badRequest("Missing title");
    }
    if (!description) {
      throw CustomError.badRequest("Missing description");
    }
    if (!status) {
      throw CustomError.badRequest("Missing status");
    }
    if (!available) {
      throw CustomError.badRequest("Missing available");
    }
    if (!numberOfWinners) {
      throw CustomError.badRequest("Missing numberOfWinners");
    }
    if (!prizes) {
      throw CustomError.badRequest("Missing prizes");
    }
    if (!participants) {
      throw CustomError.badRequest("Missing participants");
    }
    if (!winners) {
      throw CustomError.badRequest("Missing winners");
    }
    if (!createdAt) {
      throw CustomError.badRequest("Missing createdAt");
    }
    if (!updatedAt) {
      throw CustomError.badRequest("Missing updatedAt");
    }
    return new DrawEntity(
      id || _id,
      title,
      description,
      status,
      available,
      maxParticipants,
      numberOfWinners,
      prizes,
      resultDate,
      maxDateToJoin,
      participants,
      winners,
      createdAt,
      updatedAt,
    );
  }
}
