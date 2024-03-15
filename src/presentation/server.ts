import express, { type Router } from "express";
import { Server as WebsocketsServer } from "socket.io";
import http from "http";
import cors from "cors";
import morgan from "morgan";
// import { envs } from "../config";

interface Options {
  port: number;
  routes: Router;
  gateways: (io: WebsocketsServer) => void;
}
export class Server {
  private readonly app = express();
  private readonly server = http.createServer(this.app);
  private readonly io = new WebsocketsServer(this.server);

  private readonly port: number;
  private readonly logger = morgan;
  private readonly routes: Router;
  private readonly gateways: (io: WebsocketsServer) => void;

  constructor(options: Options) {
    const { port, routes, gateways } = options;
    this.port = port;
    this.routes = routes;
    this.gateways = gateways;
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
    this.gateways(this.io);

    // Start server
    this.server.listen(this.port, () => {
      console.log(`App running on port ${this.port}`);
    });
  }
}
