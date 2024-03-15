import { CustomError } from "../../domain/errors";

export type NeverReturn = (error: any) => never;
export const handleDBError: NeverReturn = (error: any) => {
  if (error instanceof CustomError) {
    throw error;
  }
  if (error.kind === "ObjectId") {
    throw CustomError.badRequest("Mal formato en id");
  }
  throw CustomError.internalServer(error);
};
