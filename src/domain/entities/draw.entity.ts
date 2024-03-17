import type {
  DiscordUserInterface,
  DrawStatus,
  // UserAdminInterface,
} from "../../data/mongo-db";

export class DrawEntity {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    // public createdBy: string | UserAdminInterface,
    public status: DrawStatus,
    public available: boolean,
    public maxParticipants: number | null,
    public numberOfWinners: number,
    public prizes: string[],
    public maxDateToJoin: string | null,
    public participants: string[] | DiscordUserInterface[],
    public winners: string[] | DiscordUserInterface[] | null[],

    public createdAt: string,
    public updatedAt: string,
  ) {}
}
