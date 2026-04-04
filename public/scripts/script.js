import {
  fetchClaimedTickets,
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
  displayLog,
  displayPlayerHand,
  displayPlayerHandTickets,
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

  const logs = await (await fetch("/fetch-log")).json();
  displayLog(logs);

  const playerHand = await fetchInitialPlayerHand();
  displayDestTicketDeck();
  displayPlayerHand(playerHand);

  const claimedTickets = await fetchClaimedTickets();
  displayPlayerHandTickets(claimedTickets);

  const cardsData = await fetchInitialFaceUp();
  displayFaceUpCards(cardsData);

  const { routeOwnership } = await fetchRouteOwnership();
  renderMap(routeOwnership);

  const routesData = await fetchRoutesData();
  registerListeners(routesData);
};
