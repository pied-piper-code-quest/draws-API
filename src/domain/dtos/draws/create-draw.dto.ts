import { Validators } from "../../../config";
import type { DtoResponse } from "../../interfaces";

export class CreateDrawDto {
  private constructor(
    public createdBy: string,
    public maxParticipants: number | null,
    public numberOfWinners: number,
    public prizes: string[],
    public resultDate: string | null,
    public maxDateToJoin: string | null,
    public manual: boolean,
  ) {}

  static create(props: Record<string, any>): DtoResponse<CreateDrawDto> {
    const {
      createdBy,
      maxParticipants = null,
      numberOfWinners = 1,
      prizes,
      resultDate,
      maxDateToJoin,
      manual,
    } = props;
    const errors: string[] = [];
    if (!createdBy) errors.push("createdBy Id is required");
    maxParticipants;
    numberOfWinners;
    if (!prizes || prizes.length === 0) errors.push("prizes is required");
    if (numberOfWinners >= 1 && numberOfWinners !== prizes.length)
      errors.push(
        "There must be the same amount of prizes and number of winners",
      );
    if (resultDate && !Validators.isDate(resultDate))
      errors.push("Invalid resultDate");
    if (maxDateToJoin && !Validators.isDate(maxDateToJoin))
      errors.push("Invalid maxDateToJoin");
    if (!Validators.isBoolean(manual)) errors.push("manual is required");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new CreateDrawDto(
        createdBy,
        maxParticipants,
        numberOfWinners,
        prizes,
        resultDate,
        maxDateToJoin,
        manual,
      ),
    ];
  }
}
