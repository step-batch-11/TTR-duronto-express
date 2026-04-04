import { createApp } from "./src/app.js";
import Game from "./src/models/game.js";
import Player from "./src/models/player.js";
import { initDeck } from "./src/static-data/deck.js";
import { getTicketCards } from "./src/static-data/ticket_cards.js";
import TicketDeck from "./src/models/ticket_deck.js";
import CarCardsDeck from "./src/models/train_car_card_deck.js";
import PlayerBase from "./src/models/player_base.js";

const main = () => {
  const players = new PlayerBase([]);
  const deck = initDeck();
  const carCardsDeck = new CarCardsDeck(deck);
  const ticketDeck = new TicketDeck(getTicketCards());
  const player = new Player();
  const game = new Game(carCardsDeck, ticketDeck, player);
  const app = createApp(game, players);
  const port = Deno.env.get("PORT") || 8000;
  Deno.serve({ port }, app.fetch);
};

main();
