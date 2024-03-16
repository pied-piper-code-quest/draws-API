import { Validators } from "../../../config";
import { DtoResponse } from "../../interfaces";

export class RegisterUserAdminDto {
  private constructor(
    public name: string,
    public username: string,
    public email: string,
    public password: string,
  ) {}

  static create(props: Record<string, any>): DtoResponse<RegisterUserAdminDto> {
    const { name, username, email, password } = props;

    const errors: string[] = [];

    if (!name) errors.push("name es requerido");
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
        name,
        (username as string).toLowerCase().trim(),
        (email as string).toLowerCase().trim(),
        (password as string).trim(),
      ),
    ];
  }
}
