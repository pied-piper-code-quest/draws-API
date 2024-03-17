import { Schema, model } from "mongoose";
import { DrawInterface, DrawStatus } from "../interfaces";

const drawSchema = new Schema<DrawInterface>(
  {
    title: {
      type: Schema.Types.String,
      required: [true, "El título es requerido"],
    },
    description: {
      type: Schema.Types.String,
      required: [true, "La descripción es requerida"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User-Admin",
      required: [true, "El createdBy es requerido"],
    },
    status: {
      type: Schema.Types.String,
      enum: [
        DrawStatus.pending,
        DrawStatus.live,
        DrawStatus.finished,
        DrawStatus.canceled,
      ],
      default: DrawStatus.pending,
    },
    available: {
      type: Schema.Types.Boolean,
      default: true,
    },
    maxParticipants: {
      type: Schema.Types.Number,
      required: false,
      default: null,
    },
    numberOfWinners: {
      type: Schema.Types.Number,
      default: 1,
      min: 1,
    },
    prizes: [
      {
        type: Schema.Types.String,
      },
    ],
    maxDateToJoin: {
      type: Schema.Types.Date,
      default: null,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "DiscordUser",
      },
    ],
    winners: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "DiscordUser",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const DrawModel = model<DrawInterface>("Draw", drawSchema);
