import { Validators } from "../../../config";
import type { DtoResponse } from "../../interfaces";

export class FindWithPaginationDto {
  private constructor(
    public startDate: string,
    public endDate: string,
    public limit: number,
    public page: number,
  ) {}

  static create(
    props: Record<string, any>,
  ): DtoResponse<FindWithPaginationDto> {
    const { startDate, endDate, limit, page } = props;
    const errors: string[] = [];
    if (startDate && !Validators.isDate(startDate))
      errors.push("Invalid startDate");
    if (endDate && !Validators.isDate(endDate)) errors.push("Invalid endDate");
    // if (page && page < 1) errors.push("Invalid page");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new FindWithPaginationDto(
        startDate || "",
        endDate || "",
        limit || 20,
        page || 1,
      ),
    ];
  }
}
