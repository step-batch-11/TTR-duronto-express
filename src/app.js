import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/deno";

export const createApp = (trainCardDeck) => {
  const app = new Hono();

  app.use(logger());

  app.use((context) => {
    context.set("trainCardDeck", trainCardDeck);
  });
  app.get("*", serveStatic({ root: "public" }));

  return app;
};
