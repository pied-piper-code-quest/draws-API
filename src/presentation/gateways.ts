import { Server as WebsocketsServer } from "socket.io";

export class AppGateways {
  static gateways(io: WebsocketsServer) {
    io.on("connection", socket => {
      console.log("a user connected");
      socket.disconnect();
    });
  }
}
