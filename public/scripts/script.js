import {
  fetchInitialFaceUp,
  fetchInitialPlayerHand,
  fetchMap,
  fetchPlayerDetails,
  fetchRouteOwnership,
  fetchRoutesData,
} from "./api.js";
import { mapOnClick } from "./claim_route.js";
import {
  accessTicket,
  drawDeckCard,
  drawFaceUpCard,
  drawTicketChoice,
  selectTicketCard,
  swipeTickets,
} from "./events.js";
import {
  displayDestTicketDeck,
  displayFaceUpCards,
  displayPlayerHand,
  displayPlayers,
  renderMap,
} from "./render.js";

const registerListeners = (routesData) => {
  selectTicketCard();
  drawTicketChoice();
  swipeTickets();
  drawDeckCard();
  drawFaceUpCard();
  accessTicket();
  mapOnClick(routesData);
};

globalThis.onload = async () => {
  await fetchMap();

  const playerData = fetchPlayerDetails();
  displayPlayers(playerData);
  displayDestTicketDeck();

  const playerHand = await fetchInitialPlayerHand();
  displayPlayerHand(playerHand);

  const cardsData = await fetchInitialFaceUp();
  displayFaceUpCards(cardsData);

  const { routeOwnership } = await fetchRouteOwnership();
  renderMap(routeOwnership);

  const routesData = fetchRoutesData();

  registerListeners(routesData);
};
