import { Schema, model } from "mongoose";
import type { UserAdminInterface } from "../interfaces";

const userAdminSchema = new Schema<UserAdminInterface>(
  {
    username: {
      type: Schema.Types.String,
      required: [true, "El nombre de usuario es requerido"],
      unique: true,
    },
    name: {
      type: Schema.Types.String,
      required: [true, "El nombre es requerido"],
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: [true, "El correo es requerido"],
    },
    password: {
      type: Schema.Types.String,
      required: [true, "La contraseña es requerida"],
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
