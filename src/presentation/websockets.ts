import { Server as WebsocketsServer } from "socket.io";
import { JwtAdapter } from "../config/jwt.adapter";

export class AppWebsockets {
  constructor(public readonly io: WebsocketsServer) {
    this.io.on("connection", async socket => {
      try {
        const authToken = socket.handshake.headers?.["auth-token"] as string;
        // console.log(authToken);
        if (!authToken) {
          throw new Error("No token provided");
        }
        const payload = await JwtAdapter.verifyToken(authToken);
        if (!payload) throw new Error("Unable to authenticate");
        // console.log("User connected: ", payload);
      } catch (error) {
        socket.disconnect();
      }
    });
  }
}
