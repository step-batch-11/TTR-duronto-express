import Player from "../models/player.js";
import Room from "../models/room.js";

export const createPlayerFn = (name, sessionId, index) =>
  new Player(name, sessionId, index);

export const createGenerateFn = () => {
  let id = 1000;
  return () => id++;
};

export const createRoomFn = (roomId, maxPlayer, createGameFn) =>
  new Room(roomId, maxPlayer, createGameFn);
