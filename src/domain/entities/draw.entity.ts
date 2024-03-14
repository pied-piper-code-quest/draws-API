import type {
  DiscordUserInterface,
  DrawStatus,
  UserAdminInterface,
} from "../../data/mongo-db";

export class DrawEntity {
  constructor(
    public createdBy: string | UserAdminInterface,
    public status: DrawStatus,
    public available: boolean,
    public maxParticipants: number | null,
    public numberOfWinners: number,
    public prizes: string[],
    public resultDate: string | null,
    public maxDateToJoin: string | null,
    public manual: boolean,
    public participants: string[] | DiscordUserInterface[],
    public winners: string[] | DiscordUserInterface[],

    public createdAt: string,
    public updatedAt: string,
  ) {}
}
