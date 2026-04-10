import { Hono } from "hono";

import { logger } from "hono/logger";

import { createAuthRoutes } from "./routes/auth_route.js";
import { createGameRoutes } from "./routes/game_route.js";
import { createRoomRoutes } from "./routes/room_route.js";
import { createStaticRoutes } from "./routes/static_route.js";
import { setContext } from "./utils/context.js";

export const createApp = (roomManager, players, sessionToRoomMap) => {
  const app = new Hono();

  app.use(logger());

  app.use(setContext(players, roomManager, sessionToRoomMap));

  app.route("/room", createRoomRoutes());
  app.route("/auth", createAuthRoutes());
  app.route("/game", createGameRoutes());
  // registerRoomRoutes(app);
  app.route("/", createStaticRoutes());

  return app;
};
