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
import { getPlayerCarCardsHandler } from "./handlers/claim_route_handlers.js";
import {
  allowExistingPlayer,
  allowNonExistingPlayer,
  createUser,
  doesPlayerNotExist,
  getPlayerDetails,
} from "./handlers/auth_handlers.js";
import { gameStateHandler, getGamePhase } from "./handlers/phase_handler.js";
import { createRoom, getRoomState, joinRoom } from "./handlers/room_handler.js";
import { getCookie } from "hono/cookie";

export const createApp = (roomManager, players, sessionToRoomMap) => {
  const app = new Hono();

  app.use(logger());
  app.use(etag());
  app.use((context, next) => {
    context.set("players", players);
    context.set("roomManager", roomManager);
    context.set("sessionToRoomMap", sessionToRoomMap);
    return next();
  });

  app.use((context, next) => {
    const sessionId = Number(getCookie(context, "sessionId"));
    context.set("sessionId", sessionId);
    return next();
  });

  app.use((context, next) => {
    const sessionId = parseInt(getCookie(context, "sessionId"));
    const sessionToRoomMap = context.get("sessionToRoomMap");

    const room = sessionToRoomMap.get(sessionId);

    if (room && room.game) {
      const game = room.game;
      context.set("game", game);
    }

    return next();
  });

  app.get("/", allowExistingPlayer, serveStatic({ root: "/public" }));

  app.get("/login.html", doesPlayerNotExist, serveStatic({ root: "/public" }));
  app.post("/login", allowNonExistingPlayer, createUser);

  app.post("/create-room", allowExistingPlayer, createRoom);
  app.post("/join-room", allowExistingPlayer, joinRoom);

  app.get("/room-state", getRoomState);

  app.get("/game.html", allowExistingPlayer, serveStatic({ root: "/public" }));

  app.get("/initial-hand", initializePlayerHandHandler);

  app.get("/player-details", getPlayerDetails);
  app.get("/draw-deck-card", drawDeckCardHandler);
  app.get("/car-cards", getPlayerCarCardsHandler);
  app.get("/routes-data", serveStatic({ path: "src/static-data/route.json" }));
  app.get("/get-game-phase", getGamePhase);
  app.get("/get-ticket-choices", drawTicketChoiceHandler);
  app.get("/game-state", gameStateHandler);

  app.get("/finish-game", serveStatic({ path: "./public/victory.html" }));

  app.post("/draw-faceup-card", drawFaceUpCardHandler);
  app.post("/claim-tickets", claimDestinationTickets);
  app.post("/claim-route", claimRouteHandler);

  app.get("*", serveStatic({ root: "public" }));

  return app;
};
