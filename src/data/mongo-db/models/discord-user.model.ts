import { Document, Schema, model } from "mongoose";

// const avatarLink = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=80`

export interface DiscordUserInterface extends Document {
  discordId: string;
  username: string;
  avatar: string;
  discriminator: string;
  globalName: string;
  email: string;
  verified: boolean;
}
const discordUserSchema = new Schema(
  {
    discordId: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
    },
    avatar: {
      type: Schema.Types.String,
      required: true,
    },
    discriminator: {
      type: Schema.Types.String,
      required: true,
    },
    globalName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const DiscordUserModel = model("DiscordUser", discordUserSchema);
