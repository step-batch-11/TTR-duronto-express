import { Hono } from "hono";
import {
  createRoom,
  getRoomState,
  joinRoom,
  resetGame,
} from "../handlers/index.js";
import { allowExistingPlayer } from "../middleware/route_middleware.js";

export const createRoomRoutes = () => {
  const app = new Hono();

  app.use("/*", allowExistingPlayer);
  app.post("/create", createRoom);
  app.post("/join", joinRoom);
  app.get("/state", getRoomState);
  app.get("/reset", resetGame);

  return app;
};
