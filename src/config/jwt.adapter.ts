import jwt from "jsonwebtoken";
import { envs } from "./envs";

const JWT_SEED = envs.JWT_SECRET_KEY;

interface TokenPayload<T> {
  payload: T;
  iat: number;
  exp: number;
}

export class JwtAdapter {
  static async generateToken(
    payload: Object,
    duration: string = "7d",
  ): Promise<string | null> {
    return new Promise(resolve => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err || !token) return resolve(null);
        resolve(token);
      });
    });
  }

  static verifyToken<T = { id: string }>(
    token: string,
  ): Promise<TokenPayload<T> | null> {
    return new Promise(resolve => {
      jwt.verify(token, JWT_SEED, (err, decoded: any) => {
        if (err || !decoded) return resolve(null);
        resolve(decoded as TokenPayload<T>);
      });
    });
  }
  static decode(token: string) {
    return jwt.decode(token) as any | null;
  }
}
