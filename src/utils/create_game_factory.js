import Game from "../models/game.js";
import TicketDeck from "../models/ticket_deck.js";
import CarCardsDeck from "../models/train_car_card_deck.js";
import { initDeck } from "../static-data/deck.js";
import { getTicketCards } from "../static-data/ticket_cards.js";
import { createPlayerFn } from "./factory.js";

export const createGameFn = (users) => {
  const players = users.map(({ sessionId, username }, index) =>
    createPlayerFn(username, sessionId, index)
  );

  const deck = new CarCardsDeck(initDeck());
  const ticket = new TicketDeck(getTicketCards());
  return new Game(deck, ticket, players);
};
