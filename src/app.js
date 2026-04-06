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
} from "./handlers/auth_handlers.js";
import { gameStateHandler, getGamePhase } from "./handlers/phase_handler.js";

export const createApp = (game, players) => {
  const app = new Hono();

  app.use(logger());
  app.use(etag());
  app.use((context, next) => {
    context.set("game", game);
    context.set("players", players);
    return next();
  });

  app.get("/login.html", doesPlayerNotExist, serveStatic({ root: "/public" }));
  app.post("/login", allowNonExistingPlayer, createUser);

  app.get("/game.html", allowExistingPlayer, serveStatic({ root: "/public" }));

  app.get("/initial-hand", initializePlayerHandHandler);

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
