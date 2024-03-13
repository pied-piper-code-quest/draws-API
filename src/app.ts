import { envs } from "./config";
import { MongoDatabase } from "./data/mongo-db";
import { AppGateways } from "./presentation/gateways";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

async function main() {
  await MongoDatabase.connect({
    mongoUri: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
    auth: {
      password: envs.MONGO_PASSWORD,
      username: envs.MONGO_USERNAME,
    },
  });
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
    gateways: AppGateways.gateways,
  });
  server.start();
}

(() => {
  main();
})();
