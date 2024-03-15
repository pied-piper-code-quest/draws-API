import { Schema, model } from "mongoose";
import type { DiscordUserInterface } from "../interfaces";

// const avatarLink = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=80`

const discordUserSchema = new Schema<DiscordUserInterface>(
  {
    access_token: {
      type: Schema.Types.String,
      required: true,
    },
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
