import type { DtoResponse } from "../../interfaces";

export class FinishDrawDtoDto {
  private constructor(public winners: string[]) {}

  static create(props: Record<string, any>): DtoResponse<FinishDrawDtoDto> {
    const { winners } = props;
    const errors: string[] = [];
    if (!winners) errors.push("winners is required");
    if (winners.length === 0)
      errors.push("winners should contains at least 1 user");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [null, new FinishDrawDtoDto(winners)];
  }
}
