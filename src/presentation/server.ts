import express, { type Router } from "express";
import { Server as WebsocketsServer } from "socket.io";
import http from "http";
import cors from "cors";
import morgan from "morgan";
import { envs } from "../config";
import { AppWebsockets } from "./websockets";
import { AppRoutes } from "./routes";

interface Options {
  port: number;
  routes: Router;
}

const AppExpress = express();
const ServerHTTP = http.createServer(AppExpress);
const SocketsIO = new WebsocketsServer(ServerHTTP);
export const webSockets = new AppWebsockets(SocketsIO);

export class Server {
  private readonly app = AppExpress;
  private readonly server = ServerHTTP;
  private readonly io = SocketsIO;

  private readonly port: number;
  private readonly logger = morgan;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  async start() {
    // Middlewares
    // this.app.use(cors({ origin: [envs.CLIENT_URL], credentials: true }));
    // this.app.use(cors({ origin: "*", credentials: true }));
    this.app.use(cors({ origin: "*" }));
    this.app.use(this.logger("dev"));
    this.app.use(express.json());

    // Routes & Gateways
    this.app.use("/api", this.routes);

    // Start server
    this.server.listen(this.port, () => {
      console.log(`App running on port ${this.port}`);
    });
  }
}
