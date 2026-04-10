import { Hono } from "hono";

import { logger } from "hono/logger";

import { registerAuthRoutes } from "./routes/auth_route.js";
import { registerGameRoutes } from "./routes/game_route.js";
import { registerRoomRoutes } from "./routes/room_route.js";
import { registerStaticRoutes } from "./routes/static_route.js";
import { setContext } from "./utils/context.js";

export const createApp = (roomManager, players, sessionToRoomMap) => {
  const app = new Hono();

  app.use(logger());

  app.use(setContext(players, roomManager, sessionToRoomMap));

  registerAuthRoutes(app);
  registerGameRoutes(app);
  registerRoomRoutes(app);
  registerStaticRoutes(app);

  return app;
};
