import { Hono } from "hono";
import { exitGameHandler } from "../handlers/game_handler.js";
import {
  claimDestinationTickets,
  claimRouteHandler,
  drawDeckCardHandler,
  drawFaceUpCardHandler,
  drawTicketChoiceHandler,
  gameStateHandler,
  getGamePhase,
  getLeaderboardHandler,
  getPlayerBogieCount,
  getPlayerCarCardsHandler,
  initializePlayerHandHandler,
} from "../handlers/index.js";
import { etag } from "hono/etag";
import { validate } from "../middleware/validate.js";
import {
  claimRouteSchema,
  drawFaceUpSchema,
} from "../validators/game_validators.js";

export const createGameRoutes = () => {
  const game = new Hono();

  game.get("/initial-hand", initializePlayerHandHandler);
  game.get("/car-cards", getPlayerCarCardsHandler);
  game.get("/draw-deck-card", drawDeckCardHandler);
  game.get("/phase", getGamePhase);
  game.get("/ticket-choices", drawTicketChoiceHandler);
  game.get("/state", etag(), gameStateHandler);
  game.get("/leaderboard", getLeaderboardHandler);
  game.get("/bogies-count", getPlayerBogieCount);
  game.post(
    "/draw-faceup-card",
    validate(drawFaceUpSchema),
    drawFaceUpCardHandler,
  );
  game.post("/claim-tickets", claimDestinationTickets);
  game.post("/claim-route", validate(claimRouteSchema), claimRouteHandler);
  game.post("/exit", exitGameHandler);

  return game;
};
