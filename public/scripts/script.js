import {
  fetchInitialFaceUp,
  fetchMap,
  fetchPlayerDetails,
  fetchPlayerHand,
  fetchRouteOwnership,
} from "./api.js";
import {
  drawDeckCard,
  drawFaceUpCard,
  drawTicketChoice,
  mapOnClick,
  selectTicketCard,
} from "./events.js";
import {
  displayFaceUpCards,
  displayPlayerHand,
  displayPlayers,
  renderMap,
} from "./render.js";

const registerListeners = () => {
  selectTicketCard();
  drawTicketChoice();
  drawDeckCard();
  drawFaceUpCard();
  mapOnClick();
};

globalThis.onload = async () => {
  await fetchMap();
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
