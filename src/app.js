import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";
import {
  drawDeckCardHandler,
  drawFaceUpCardHandler,
} from "./app_handlers/draw_cards_handlers.js";
import {
  initializeFaceUpDeckHandler,
  initializePlayerHandHandler,
} from "./app_handlers/initialization_handlers.js";

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

  app.post("/draw-faceup-card", drawFaceUpCardHandler);

  app.get("*", serveStatic({ root: "public" }));

  return app;
};
