import { DiscordUserInterface, UserAdminInterface } from "./data/mongo-db";

declare global {
  namespace Express {
    interface Request {
      userAdmin?: UserAdminInterface;
      discordUser?: DiscordUserInterface;
    }
  }
}
