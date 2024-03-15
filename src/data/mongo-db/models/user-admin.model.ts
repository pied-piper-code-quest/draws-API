import { Schema, model } from "mongoose";
import type { UserAdminInterface } from "../interfaces";

const userAdminSchema = new Schema<UserAdminInterface>(
  {
    username: {
      type: Schema.Types.String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: [true, "Email is required"],
    },
    password: {
      type: Schema.Types.String,
      required: [true, "Password is required"],
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserAdminModel = model<UserAdminInterface>(
  "User-Admin",
  userAdminSchema,
);
