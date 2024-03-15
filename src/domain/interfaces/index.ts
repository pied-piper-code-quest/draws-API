type Errors = { errors: string[] };
export type DtoResponse<T> = [string | Errors] | [null, T];

export interface ResponseWithPagination<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
}
