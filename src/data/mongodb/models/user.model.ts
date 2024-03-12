import { Document, Schema, model } from "mongoose";
import { Roles } from "../../../domain/entities";

export interface UserInterface extends Document {
  username: string;
  email: string;
  password: string;
  role: Roles;
  isActive: boolean;
}

const userSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: [true, "Username is required"],
    },
    email: {
      type: Schema.Types.String,
      required: [true, "Email is required"],
    },
    password: {
      type: Schema.Types.String,
      required: [true, "Password is required"],
    },
    role: {
      type: Schema.Types.String,
      default: Roles.user,
      enum: [Roles.user, Roles.admin],
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

export const UserModel = model<UserInterface>("User", userSchema);
