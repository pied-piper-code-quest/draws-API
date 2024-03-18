import { DtoResponse } from "../../interfaces";
// import type { DiscordUserResponse } from '../../../config/oauth.adapter';

export class AuthUserFromDiscordDto {
  private constructor(
    public access_token: string,
    public discordId: string,
    public username: string,
    public avatar: string | null,
    public email: string | null,
  ) {}

  static create(
    props: Record<string, any>,
  ): DtoResponse<AuthUserFromDiscordDto> {
    const { access_token, id, username, avatar, email } = props;
    const errors: string[] = [];

    if (!access_token) errors.push("access_token es requerido");
    if (!id) errors.push("id es requerido");
    if (!username) errors.push("username es requerido");
    if (!avatar) errors.push("avatar es requerido");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new AuthUserFromDiscordDto(
        access_token,
        id,
        username,
        avatar || null,
        email || null,
      ),
    ];
  }
}
