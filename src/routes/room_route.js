import { createRoom, getRoomState, joinRoom } from "../handlers/index.js";
import { allowExistingPlayer } from "../middleware/route_middleware.js";

export const registerRoomRoutes = (app) => {
  app.post("/create-room", allowExistingPlayer, createRoom);
  app.post("/join-room", allowExistingPlayer, joinRoom);
  app.get("/room-state", getRoomState);
};
