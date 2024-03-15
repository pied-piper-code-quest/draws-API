import type { DtoResponse } from "../../interfaces";

export class FindByIdDto {
  private constructor(public id: string) {}

  static create(props: Record<string, any>): DtoResponse<FindByIdDto> {
    const { id } = props;
    if (!id) return ["id is required"];

    return [null, new FindByIdDto(id)];
  }
}
