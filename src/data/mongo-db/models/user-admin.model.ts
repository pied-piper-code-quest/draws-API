import { Document, Schema, model } from "mongoose";

export interface UserAdminInterface extends Document {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
}

const userAdminSchema = new Schema(
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
