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
import { drawTicketChoiceHandler } from "./handlers/draw_tickets_handlers.js";
import {
  claimRouteHandler,
  routeOwnershipHandler,
} from "./handlers/map_handlers.js";

export const createApp = (game) => {
  const app = new Hono();

  app.use(logger());

  app.use((context, next) => {
    context.set("game", game);
    return next();
  });

  app.get("/init-faceup", initializeFaceUpDeckHandler);
  app.get("/initial-hand", initializePlayerHandHandler);
  app.get("/draw-deck-card", drawDeckCardHandler);
  app.get("/get-ticket-choices", drawTicketChoiceHandler);
  app.post("/draw-faceup-card", drawFaceUpCardHandler);
  app.post("/claim-route", claimRouteHandler);
  app.get("/map-ownership", routeOwnershipHandler);

  app.get("*", serveStatic({ root: "public" }));

  return app;
};
