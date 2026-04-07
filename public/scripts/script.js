import {
  fetchInitialPlayerHand,
  fetchMap,
  fetchPlayerDetails,
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
  disableInteractions,
  displayDestTicketDeck,
  displayFaceUpCards,
  displayPlayerHand,
  displayPlayerHandTickets,
  displayPlayers,
  enableInteractions,
  initializeGameUI,
  renderMap,
} from "./render.js";

import { Poller } from "./poller.js";

const registerListeners = (routesData) => {
  selectTicketCard();
  drawTicketChoice();
  swipeTickets();
  drawDeckCard();
  drawFaceUpCard();
  accessTicket();
  mapOnClick(routesData);
};

const renderGameState = (gameState) => {
  renderMap(gameState.claimedRoutes);
  displayFaceUpCards(gameState.faceUp);
  disableInteractions();
  displayPlayerHandTickets(gameState.playerHand.claimedTickets);
};

let etag = "";
let initial = true;

const pollGameState = async () => {
  const playerData = await fetchPlayerDetails();
  displayPlayers(playerData);

  const response = await fetch("/game-state", {
    headers: {
      "If-None-Match": etag,
    },
  });

  if (response.status === 304) return;

  const gameState = await response.json();

  if (!gameState.isStarted) {
    disableInteractions();
    return;
  }

  if (gameState.isPlayerTurn) {
    enableInteractions();
    if (initial) {
      renderGameState(gameState);
    }
    initial = false;
    return;
  }

  renderGameState(gameState);
  initial = true;
  etag = response.headers.get("etag");
};

globalThis.onload = async () => {
  await fetchMap();
  displayDestTicketDeck();

  const playerHand = await fetchInitialPlayerHand();
  initializeGameUI(playerHand);
  displayPlayerHand(playerHand);

  const routesData = await fetchRoutesData();
  registerListeners(routesData);

  const poller = new Poller(pollGameState, 2000);
  poller.start();
};
