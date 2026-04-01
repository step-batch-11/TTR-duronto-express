import {
  fetchInitialFaceUp,
  fetchPlayerDetails,
  fetchPlayerHand,
  fetchRouteOwnership,
} from "./api.js";
import {
  claimTicketCard,
  drawDeckCard,
  drawFaceUpCard,
  drawTicketChoice,
  mapOnClick,
} from "./events.js";
import {
  displayFaceUpCards,
  displayPlayerHand,
  displayPlayers,
  renderMap,
} from "./render.js";

const registerListeners = () => {
  drawTicketChoice();
  claimTicketCard();
  drawDeckCard();
  drawFaceUpCard();
  mapOnClick();
};

globalThis.onload = async () => {
  const playerData = fetchPlayerDetails();
  displayPlayers(playerData);
  const playerHand = await fetchPlayerHand();
  displayPlayerHand(playerHand);
  const cardsData = await fetchInitialFaceUp();
  displayFaceUpCards(cardsData);
  const { routeOwnership } = await fetchRouteOwnership();
  renderMap(routeOwnership);
  registerListeners();
};
