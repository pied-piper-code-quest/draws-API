import { Schema, model } from "mongoose";
import type { DiscordUserInterface } from "../interfaces";

// const avatarLink = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=80`

const discordUserSchema = new Schema<DiscordUserInterface>(
  {
    access_token: {
      type: Schema.Types.String,
      required: [true, "El token de acceso es requerido"],
    },
    discordId: {
      type: Schema.Types.String,
      required: [true, "El id de discord es requerido"],
    },
    username: {
      type: Schema.Types.String,
      required: [true, "El nombre de usario de discord es requerido"],
    },
    avatar: {
      type: Schema.Types.String,
      default: null,
    },
    email: {
      type: Schema.Types.String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

export const DiscordUserModel = model("DiscordUser", discordUserSchema);
