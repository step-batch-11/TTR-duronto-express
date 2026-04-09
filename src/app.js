import { Hono } from "hono";
import { logger } from "hono/logger";
import { etag } from "hono/etag";
import { serveStatic } from "hono/deno";
import {
  initializePlayerHandHandler,
} from "./handlers/initialization_handlers.js";
import {
  drawDeckCardHandler,
  drawFaceUpCardHandler,
} from "./handlers/draw_cards_handlers.js";
import {
  claimDestinationTickets,
  drawTicketChoiceHandler,
} from "./handlers/draw_tickets_handlers.js";
import { claimRouteHandler } from "./handlers/map_handlers.js";
import {
  getPlayerBogieCount,
  getPlayerCarCardsHandler,
} from "./handlers/claim_route_handlers.js";
import {
  allowExistingPlayer,
  allowNonExistingPlayer,
  createUser,
  doesPlayerNotExist,
} from "./handlers/auth_handlers.js";
import { gameStateHandler, getGamePhase } from "./handlers/phase_handler.js";
import { createRoom, getRoomState, joinRoom } from "./handlers/room_handler.js";
import { setContext } from "./utils/context.js";
import { getLeaderboardHandler } from "./handlers/score_handlers.js";

export const createApp = (roomManager, players, sessionToRoomMap) => {
  const app = new Hono();

  app.use(logger());
  app.use(etag());
  app.use(setContext(players, roomManager, sessionToRoomMap));
  app.get(
    "/",
    allowExistingPlayer,
    serveStatic({ path: "/public/lobby.html" }),
  );

  app.post("/login", allowNonExistingPlayer, createUser);
  app.get("/login.html", doesPlayerNotExist, serveStatic({ root: "/public" }));

  app.post("/create-room", allowExistingPlayer, createRoom);
  app.post("/join-room", allowExistingPlayer, joinRoom);

  app.get("/room-state", getRoomState);
  app.get("/game.html", allowExistingPlayer, serveStatic({ root: "/public" }));
  app.get("/initial-hand", initializePlayerHandHandler);
  app.get("/draw-deck-card", drawDeckCardHandler);
  app.get("/car-cards", getPlayerCarCardsHandler);
  app.get("/routes-data", serveStatic({ path: "src/static-data/route.json" }));
  app.get("/get-game-phase", getGamePhase);
  app.get("/get-ticket-choices", drawTicketChoiceHandler);
  app.get("/game-state", gameStateHandler);
  app.get("/get-leaderboard", getLeaderboardHandler);
  app.get("/bogies-count", getPlayerBogieCount);

  app.get("/finish-game", serveStatic({ path: "./public/victory.html" }));

  app.post("/draw-faceup-card", drawFaceUpCardHandler);
  app.post("/claim-tickets", claimDestinationTickets);
  app.post("/claim-route", claimRouteHandler);

  app.get("/lobby.html", allowExistingPlayer, serveStatic({ root: "public" }));
  app.get("/host.html", allowExistingPlayer, serveStatic({ root: "public" }));
  app.get("/join.html", allowExistingPlayer, serveStatic({ root: "public" }));
  app.get(
    "/victory.html",
    allowExistingPlayer,
    serveStatic({ root: "public" }),
  );
  app.get(
    "/waiting_room.html",
    allowExistingPlayer,
    serveStatic({ root: "public" }),
  );
  app.get("*", serveStatic({ root: "public" }));

  return app;
};
