import { serveStatic } from "hono/deno";
import {
  allowExistingPlayer,
  preventVictoryPageAccess,
  redirectIfGameInProgress,
  redirectIfInRoom,
  requireGameAccess,
} from "../middleware/route_middleware.js";

export const registerStaticRoutes = (app) => {
  app.get(
    "/",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ path: "/public/lobby.html" }),
  );

  app.get(
    "/game.html",
    allowExistingPlayer,
    requireGameAccess,
    serveStatic({ root: "/public" }),
  );

  app.get("/routes-data", serveStatic({ path: "src/static-data/route.json" }));
  app.get("/finish-game", serveStatic({ path: "./public/victory.html" }));

  app.get(
    "/lobby.html",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ root: "public" }),
  );

  app.get(
    "/host.html",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ root: "public" }),
  );

  app.get(
    "/join.html",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ root: "public" }),
  );

  app.get(
    "/victory.html",
    allowExistingPlayer,
    preventVictoryPageAccess,
    serveStatic({ root: "public" }),
  );

  app.get(
    "/waiting_room.html",
    allowExistingPlayer,
    redirectIfInRoom,
    serveStatic({ root: "public" }),
  );
  app.get("*", serveStatic({ root: "public" }));
};
