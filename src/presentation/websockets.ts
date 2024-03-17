import { Server as WebsocketsServer } from "socket.io";

export class AppWebsockets {
  constructor(public readonly io: WebsocketsServer) {
    this.io.on("connection", socket => {
      console.log("a user connected");
      if (!socket.handshake.auth) {
        socket.disconnect();
      }
    });
  }
}
