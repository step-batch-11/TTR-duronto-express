import { createApp } from "./src/app.js";
import Game from "./src/game.js";
import { initDeck } from "./src/static-data/deck.js";
import { getTicketCards } from "./src/static-data/ticket_cards.js";
import TicketDeck from "./src/ticket_deck.js";
import { CarCardsDeck } from "./src/train_car_card_deck.js";

const main = () => {
  const deck = initDeck();
  const carCardsDeck = new CarCardsDeck(deck);
  const ticketDeck = new TicketDeck(getTicketCards());

  const game = new Game(carCardsDeck, ticketDeck);

  const app = createApp(game);
  const port = Deno.env.get("PORT") || 8000;
  Deno.serve({ port }, app.fetch);
};

main();
