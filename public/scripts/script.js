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
  displayLog,
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

  const logs = await (await fetch("/fetch-log")).json();
  displayLog(logs);

  const playerHand = await fetchInitialPlayerHand();
  displayPlayerHand(playerHand);

  const cardsData = await fetchInitialFaceUp();
  displayFaceUpCards(cardsData);

  const { routeOwnership } = await fetchRouteOwnership();
  renderMap(routeOwnership);

  const routesData = fetchRoutesData();

  registerListeners(routesData);
};

// response(game state) {
//   map,
//     faceUp,
//     playerData,
//     claimedTickets,
//     playerHand,
// }

// const poll = async () => {
//   const response = await fetch('/gameState');
//   displayFaceUpCards(response.faceUp);
//   displayPlayerHand(response.playerHand);
//   displayClaimedTickets(response.claimedTickets);
//   displayPlayers(response.playerData);
//   setTimeout(poll, 3000);
// }

// globalThis.onload = async () => {
//   renderMap(response.map);
//   displayDestTicketDeck();
//   registerListeners(routesData);
//   await poll();
// }
