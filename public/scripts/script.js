import {
  fetchInitialFaceUp,
  fetchPlayerDetails,
  fetchPlayerHand,
} from "./api.js";
import { drawDeckCard, drawFaceUpCard, drawTicketChoice } from "./events.js";
import {
  displayFaceUpCards,
  displayPlayerHand,
  displayPlayers,
} from "./render.js";

const registerListeners = () => {
  drawTicketChoice();
  drawDeckCard();
  drawFaceUpCard();
};

globalThis.onload = async () => {
  const playerData = fetchPlayerDetails();
  displayPlayers(playerData);
  const playerHand = await fetchPlayerHand();
  displayPlayerHand(playerHand);
  const cardsData = await fetchInitialFaceUp();
  displayFaceUpCards(cardsData);
  registerListeners();
};
