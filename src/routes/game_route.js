import { Hono } from "hono";
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
  game.post("/draw-faceup-card", drawFaceUpCardHandler);
  game.post("/claim-tickets", claimDestinationTickets);
  game.post("/claim-route", claimRouteHandler);

  return game;
};
