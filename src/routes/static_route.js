import { serveStatic } from "hono/deno";
import {
  allowExistingPlayer,
  doesPlayerNotExist,
  preventVictoryPageAccess,
  redirectIfGameInProgress,
  redirectIfInRoom,
  requireGameAccess,
} from "../middleware/route_middleware.js";
import { Hono } from "hono";

export const createStaticRoutes = () => {
  const staticRoutes = new Hono();

  staticRoutes.get(
    "/login.html",
    doesPlayerNotExist,
    serveStatic({ root: "/public" }),
  );
  staticRoutes.get(
    "/",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ path: "/public/lobby.html" }),
  );

  staticRoutes.get(
    "/game.html",
    allowExistingPlayer,
    requireGameAccess,
    serveStatic({ root: "/public" }),
  );

  staticRoutes.get(
    "/routes-data",
    serveStatic({ path: "src/static-data/route.json" }),
  );
  staticRoutes.get(
    "/finish-game",
    allowExistingPlayer,
    preventVictoryPageAccess,
    serveStatic({ path: "./public/victory.html" }),
  );

  staticRoutes.get(
    "/lobby.html",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ root: "public" }),
  );

  staticRoutes.get(
    "/host.html",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ root: "public" }),
  );

  staticRoutes.get(
    "/join.html",
    allowExistingPlayer,
    redirectIfGameInProgress,
    serveStatic({ root: "public" }),
  );

  staticRoutes.get(
    "/victory.html",
    allowExistingPlayer,
    preventVictoryPageAccess,
    serveStatic({ root: "public" }),
  );

  staticRoutes.get(
    "/waiting_room.html",
    allowExistingPlayer,
    redirectIfInRoom,
    redirectIfGameInProgress,
    serveStatic({ root: "public" }),
  );
  staticRoutes.get("*", serveStatic({ root: "public" }));

  return staticRoutes;
};
