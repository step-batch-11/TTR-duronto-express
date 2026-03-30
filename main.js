import { createApp } from "./src/app.js";
import { CarCardsDeck } from "./src/train_car_card_deck.js";

const main = () => {
  const deck = initDeck();
  const trainCardDeck = new CarCardsDeck(deck);
  const app = createApp(trainCardDeck);
  const port = Deno.env.get("PORT") || 8000;
  Deno.serve({ port }, app.fetch);
};

main();
