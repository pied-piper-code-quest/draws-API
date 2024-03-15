import { DtoResponse } from "../../interfaces";
// import type { DiscordUserResponse } from '../../../config/oauth.adapter';

export class AuthUserFromDiscordDto {
  private constructor(
    public access_token: string,
    public discordId: string,
    public username: string,
    public avatar: string,
    public discriminator: string,
    public globalName: string,
    public email: string,
    public verified: boolean,
  ) {}

  static create(
    props: Record<string, any>,
  ): DtoResponse<AuthUserFromDiscordDto> {
    const {
      access_token,
      id,
      username,
      avatar,
      discriminator,
      public_flags,
      premium_type,
      flags,
      banner,
      accent_color,
      global_name,
      avatar_decoration_data,
      banner_color,
      mfa_enabled,
      locale,
      email,
      verified,
    } = props;
    const errors: string[] = [];

    if (!access_token) errors.push("access_token es requerido");
    if (!id) errors.push("id es requerido");
    if (!username) errors.push("username es requerido");
    if (!avatar) errors.push("avatar es requerido");
    if (!discriminator) errors.push("discriminator es requerido");
    if (!global_name) errors.push("global_name es requerido");
    if (!email) errors.push("email es requerido");
    if (!verified) errors.push("verified es requerido");

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
        avatar,
        discriminator,
        global_name,
        email,
        verified,
      ),
    ];
  }
}
