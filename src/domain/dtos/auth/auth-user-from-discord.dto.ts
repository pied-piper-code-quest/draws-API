import { DtoResponse } from "../../interfaces";
// import type { DiscordUserResponse } from '../../../config/oauth.adapter';

export class AuthUserFromDiscordDto {
  private constructor(
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

    if (!id) errors.push("id is required");
    if (!username) errors.push("username is required");
    if (!avatar) errors.push("avatar is required");
    if (!discriminator) errors.push("discriminator is required");
    if (!global_name) errors.push("global_name is required");
    if (!email) errors.push("email is required");
    if (!verified) errors.push("verified is required");

    if (errors.length > 0) {
      if (errors.length === 1) return [errors[0]];
      return [{ errors: errors }];
    }
    return [
      null,
      new AuthUserFromDiscordDto(
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
