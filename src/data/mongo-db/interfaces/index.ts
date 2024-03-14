import { Document } from "mongoose";

// export interface UserAdminBase {
export interface UserAdminInterface {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
}
// export interface UserAdminInterface extends UserAdminBase, Document {}

// export interface DiscordUserBase {
export interface DiscordUserInterface {
  discordId: string;
  username: string;
  avatar: string;
  discriminator: string;
  globalName: string;
  email: string;
  verified: boolean;
}
// export interface DiscordUserInterface extends DiscordUserBase, Document {}

export enum DrawStatus {
  pending = "pending",
  finished = "finished",
  canceled = "canceled",
}
// export interface DrawBase {
export interface DrawInterface {
  createdBy: string | UserAdminInterface;
  status: DrawStatus;
  available: boolean;
  maxParticipants: number | null;
  numberOfWinners: number;
  prizes: string[];
  resultDate: string | null;
  maxDateToJoin: string | null;
  manual: boolean;
  participants: string[] | DiscordUserInterface[];
  winners: string[] | DiscordUserInterface[];
}
// export interface DrawInterface extends DrawBase, Document {}
