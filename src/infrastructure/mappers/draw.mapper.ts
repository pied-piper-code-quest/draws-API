import { Validators } from "../../config";
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
      maxDateToJoin,
      participants,
      winners,
      createdAt,
      updatedAt,
    } = props;

    if (!id && !_id) {
      throw CustomError.badRequest("Falta id");
    }
    if (!title) {
      throw CustomError.badRequest("Falta title");
    }
    if (!description) {
      throw CustomError.badRequest("Falta description");
    }
    if (!status) {
      throw CustomError.badRequest("Falta status");
    }
    if (!Validators.isBoolean(available)) {
      throw CustomError.badRequest("Falta available");
    }
    if (!numberOfWinners) {
      throw CustomError.badRequest("Falta numberOfWinners");
    }
    if (!prizes) {
      throw CustomError.badRequest("Falta prizes");
    }
    if (!participants) {
      throw CustomError.badRequest("Falta participants");
    }
    if (!winners) {
      throw CustomError.badRequest("Falta winners");
    }
    if (!createdAt) {
      throw CustomError.badRequest("Falta createdAt");
    }
    if (!updatedAt) {
      throw CustomError.badRequest("Falta updatedAt");
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
      maxDateToJoin,
      participants,
      winners,
      createdAt,
      updatedAt,
    );
  }
}
