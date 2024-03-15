import { Validators } from "../../../config";
import type { DtoResponse } from "../../interfaces";

export class CreateDrawDto {
  private constructor(
    public title: string,
    public description: string,
    public createdBy: string,
    public maxParticipants: number | null,
    public numberOfWinners: number,
    public alternativeWinners: number,
    public prizes: string[],
    public resultDate: string | null,
    public maxDateToJoin: string | null,
    public manual: boolean,
  ) {}

  static create(props: Record<string, any>): DtoResponse<CreateDrawDto> {
    const {
      title,
      description,
      createdBy,
      maxParticipants,
      numberOfWinners,
      alternativeWinners,
      prizes,
      resultDate,
      maxDateToJoin,
      manual,
    } = props;
    const errors: string[] = [];

    if (!title) errors.push("title is required");
    if (!description) errors.push("description is required");
    if (!createdBy) errors.push("createdBy Id is required");
    if (maxParticipants && maxParticipants < 1)
      errors.push(
        "maxParticipants should be null or an integer positive number",
      );
    if (!numberOfWinners) errors.push("numberOfWinners is required");
    if (!Validators.isNumber(numberOfWinners))
      errors.push("numberOfWinners should be a number");
    if (!prizes) errors.push("prizes is required");
    if (prizes.length === 0) errors.push("Is required at least 1 prize");
    if (numberOfWinners !== prizes.length)
      errors.push(
        "The amount of prizes should be the same as number of winners",
      );
    if (alternativeWinners && alternativeWinners < 0)
      errors.push("alternativeWinners should be equals or greater than 0");
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
        title,
        description,
        createdBy,
        maxParticipants || null,
        numberOfWinners,
        alternativeWinners || 0,
        prizes,
        resultDate,
        maxDateToJoin,
        manual,
      ),
    ];
  }
}
