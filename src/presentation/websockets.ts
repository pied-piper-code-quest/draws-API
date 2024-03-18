import { Server as WebsocketsServer } from "socket.io";
import { JwtAdapter } from "../config/jwt.adapter";
import { WEBSOCKETS_MESSAGES } from "../domain/constants";

interface MessageProps {
  id: string;
  username: string;
  message: string;
}

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

        socket.on(WEBSOCKETS_MESSAGES.SEND_MESSAGE, (message: MessageProps) => {
          console.log("new message", message);
          socket.broadcast.emit(WEBSOCKETS_MESSAGES.NEW_MESSAGE, {
            id: payload.id,
            username: message.username,
            message: message.message,
          });
        });
        // console.log("User connected: ", payload);
      } catch (error) {
        socket.disconnect();
      }
    });
  }
}
