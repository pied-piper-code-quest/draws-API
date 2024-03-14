import { DiscordUserInterface, UserAdminInterface } from "./data/mongo-db";
import { UserType } from "./domain/entities";

declare global {
  namespace Express {
    interface Request {
      userAdmin?: UserAdminInterface;
      discordUser?: DiscordUserInterface;
      userType?: UserType;
    }
  }
}
