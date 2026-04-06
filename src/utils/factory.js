import Game from "../models/game.js";
import Player from "../models/player.js";
import Room from "../models/room.js";
import TicketDeck from "../models/ticket_deck.js";
import CarCardsDeck from "../models/train_car_card_deck.js";
import { initDeck } from "../static-data/deck.js";
import { getTicketCards } from "../static-data/ticket_cards.js";

export const createPlayerFn = (sessionId, index) =>
  new Player(sessionId, index);

export const createGenerateFn = () => {
  let id = 1000;
  return () => id++;
};

export const createGameFn = (players) => {
  // const player = new Player();
  const deck = new CarCardsDeck(initDeck());
  const ticket = new TicketDeck(getTicketCards());
  return new Game(deck, ticket, players,createPlayerFn);
};

export const createRoomFn = (roomId, maxPlayer, createGameFn) =>
  new Room(roomId, maxPlayer, createGameFn);
