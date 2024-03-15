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

    if (!username) errors.push("username es requerido");
    if (!email) errors.push("email es requerido");
    if (!Validators.isEmail(email)) errors.push("Correo inválido");

    if (!password) errors.push("password es requerido");

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
