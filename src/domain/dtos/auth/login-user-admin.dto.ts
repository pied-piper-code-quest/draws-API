import { DtoResponse } from "../../interfaces";

export class LoginUserAdminDto {
  private constructor(
    public username: string,
    public password: string,
  ) {}

  static create(props: Record<string, any>): DtoResponse<LoginUserAdminDto> {
    const { username, password } = props;
    const errors: string[] = [];
    if (!username) errors.push("username is required");

    if (!password) errors.push("password is required");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new LoginUserAdminDto((username as string).toLowerCase(), password),
    ];
  }
}
