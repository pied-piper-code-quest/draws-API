import jwt from "jsonwebtoken";
import { envs } from "./envs";
import { UserType } from "../domain/entities";

const JWT_SEED = envs.JWT_SECRET_KEY;

export type TokenPayload = { id: string; userType: UserType };

export class JwtAdapter {
  static async generateToken(
    payload: TokenPayload,
    duration: string = "7d",
  ): Promise<string | null> {
    return new Promise(resolve => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err || !token) return resolve(null);
        resolve(token);
      });
    });
  }

  static verifyToken(token: string): Promise<TokenPayload | null> {
    return new Promise(resolve => {
      jwt.verify(token, JWT_SEED, (err, decoded: any) => {
        if (err || !decoded) return resolve(null);
        resolve(decoded as TokenPayload);
      });
    });
  }
  static decode(token: string) {
    return jwt.decode(token) as any | null;
  }
}
