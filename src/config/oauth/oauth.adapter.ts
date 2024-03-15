import type { OAuthProviderConfig } from "./oauth.interfaces";

export abstract class OAuthProvider {
  abstract get config(): OAuthProviderConfig;
  abstract get authParams(): string;
  abstract tokenProps: (code: string) => {
    auth: string;
    params: URLSearchParams;
  };
}
export abstract class DiscordOAuthProvider extends OAuthProvider {
  abstract override get config(): OAuthProviderConfig & {
    checkGuildMemberUrl: string;
  };
  abstract checkIfUserExistInServer: (
    access_token: string,
  ) => Promise<Response>;
}
