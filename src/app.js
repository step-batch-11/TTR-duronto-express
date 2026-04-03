import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import {
  initializeFaceUpDeckHandler,
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
import {
  claimRouteHandler,
  routeOwnershipHandler,
} from "./handlers/map_handlers.js";
import { getplayerCarCardsHandler } from "./handlers/claim_route_handlers.js";
import {
  allowNonExistingPlayer,
  createUser,
  doesPlayerExist,
  doesPlayerNotExist,
} from "./handlers/auth_handlers.js";
import { getGamePhase } from "./handlers/phase_handler.js";

export const createApp = (game, players) => {
  const app = new Hono();

  app.use(logger());
  app.use((context, next) => {
    context.set("game", game);
    context.set("players", players);
    return next();
  });

  app.get("/", doesPlayerExist, serveStatic({ root: "game.html" }));
  app.get("/login.html", doesPlayerNotExist, serveStatic({ root: "/public" }));
  app.post("/login", allowNonExistingPlayer, createUser);

  app.get("/init-faceup", initializeFaceUpDeckHandler);
  app.get("/initial-hand", initializePlayerHandHandler);
  app.get("/draw-deck-card", drawDeckCardHandler);
  app.get("/car-cards", getplayerCarCardsHandler);
  app.get("/get-game-phase", getGamePhase);
  app.get("/get-ticket-choices", drawTicketChoiceHandler);
  app.post("/draw-faceup-card", drawFaceUpCardHandler);
  app.post("/claim-tickets", claimDestinationTickets);
  app.post("/claim-route", claimRouteHandler);
  app.get("/map-ownership", routeOwnershipHandler);

  app.get("*", serveStatic({ root: "public" }));

  return app;
};
