import { createApp } from "./src/app.js";
import PlayerBase from "./src/models/player_base.js";
import RoomManager from "./src/models/room_manager.js";
import { createGameFn } from "./src/utils/create_game_factory.js";
import { createGenerateFn, createRoomFn } from "./src/utils/factory.js";

const main = () => {
  const players = new PlayerBase([]);
  const sessionToRoomMap = new Map();
  const roomManager = new RoomManager(
    createRoomFn,
    createGenerateFn(),
    createGameFn,
  );
  const app = createApp(roomManager, players, sessionToRoomMap);
  const port = Deno.env.get("PORT") || 8000;
  Deno.serve({ port }, app.fetch);
};

main();
