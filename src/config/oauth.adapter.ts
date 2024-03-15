import { envs } from "./envs";

export interface TokenResponse {
  token_type: "Bearer" | string;
  access_token: string;
  expires_in: 604800 | number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUserResponse {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  premium_type: number;
  flags: number;
  banner: string | null;
  accent_color: number | null;
  global_name: string;
  avatar_decoration_data: string | null;
  banner_color: null;
  mfa_enabled: false;
  locale: string;
  email: string;
  verified: boolean;
}

class parseQueryParams {
  static toString(props: Record<string, any>): string {
    const params: string[] = [];
    Object.entries(props).forEach(([key, value]) => {
      params.push(`${key}=${value}`);
    });
    return params.join("&");
  }
  static toURLSearchParams(props: Record<string, any>): URLSearchParams {
    const queryParams = new URLSearchParams();
    Object.entries(props).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    return queryParams;
  }
}

export abstract class OAuthProvider {
  abstract get config(): any;
  abstract get authParams(): any;
  abstract tokenProps: (code: string) => {
    auth: string;
    params: URLSearchParams;
  };
}
class DiscordProvider implements OAuthProvider {
  get config() {
    return {
      clientId: envs.DISCORD_CLIENT_ID,
      clientSecret: envs.DISCORD_CLIENT_SECRET,
      authUrl: "https://discord.com/oauth2/authorize",
      tokenUrl: "https://discord.com/api/oauth2/token",
      userUrl: "https://discord.com/api/users/@me",
      redirectUrl: envs.REDIRECT_URL,
      clientUrl: envs.CLIENT_URL,
      tokenSecret: envs.JWT_SECRET_KEY,
      // tokenExpiration: 36000,
      tokenExpiration: 604800,
    };
  }

  get authParams() {
    return parseQueryParams.toString({
      client_id: this.config.clientId,
      // redirect_uri: discordConfig.redirectUrl,
      response_type: "code",
      scope: "guilds.members.read+identify",
    });
  }

  tokenProps = (code: string): { auth: string; params: URLSearchParams } => {
    return {
      auth: `Basic ${btoa(`${envs.DISCORD_CLIENT_ID}:${envs.DISCORD_CLIENT_SECRET}`)}`,
      params: parseQueryParams.toURLSearchParams({
        client_id: envs.DISCORD_CLIENT_ID,
        client_secret: envs.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: envs.REDIRECT_URL,
      }),
    };
  };
}

export class OAuthAdapter {
  static Discord = new DiscordProvider();
}
