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
export const registerGameRoutes = (app) => {
  app.get("/initial-hand", initializePlayerHandHandler);
  app.get("/draw-deck-card", drawDeckCardHandler);
  app.get("/car-cards", getPlayerCarCardsHandler);
  app.get("/get-game-phase", getGamePhase);
  app.get("/get-ticket-choices", drawTicketChoiceHandler);
  app.get("/game-state", etag(), gameStateHandler);
  app.get("/get-leaderboard", getLeaderboardHandler);
  app.get("/bogies-count", getPlayerBogieCount);
  app.post("/draw-faceup-card", drawFaceUpCardHandler);
  app.post("/claim-tickets", claimDestinationTickets);
  app.post("/claim-route", claimRouteHandler);
};
