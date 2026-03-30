import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";

export const createApp = (game) => {
  const app = new Hono();

  app.use(logger());

  app.use((context, next) => {
    context.set("game", game);
    return next();
  });

  app.get("/initial-hand", (context) => {
    const game = context.get("game");
    game.initializePlayerHand();
    return context.json(game.playerHand());
  });

  app.get("/draw-deck-card", (context) => {
    const game = context.get("game");
    const drawnCard = game.drawDeckCard();

    return context.json({ drawnCard });
  });
  app.get("*", serveStatic({ root: "public" }));

  return app;
};
