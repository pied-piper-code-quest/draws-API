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
export interface OAuthProviderConfig {
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
  redirectUrl: string;
  clientUrl: string;
  tokenSecret: string;
  tokenExpiration: number;
}
