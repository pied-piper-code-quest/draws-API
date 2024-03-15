import { Validators } from "../../../config";
import { DtoResponse } from "../../interfaces";

export class RegisterUserAdminDto {
  private constructor(
    public username: string,
    public email: string,
    public password: string,
  ) {}

  static create(props: Record<string, any>): DtoResponse<RegisterUserAdminDto> {
    const { username, email, password } = props;

    const errors: string[] = [];

    if (!username) errors.push("username is required");
    if (!email) errors.push("email is required");
    if (!Validators.isEmail(email)) errors.push("Invalid email");

    if (!password) errors.push("password is required");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }

    return [
      null,
      new RegisterUserAdminDto(
        (username as string).toLowerCase(),
        (email as string).toLowerCase(),
        password,
      ),
    ];
  }
}
