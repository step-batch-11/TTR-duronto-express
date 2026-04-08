import { fetchInitialPlayerHand, fetchMap, fetchRoutesData } from "./api.js";
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
  enableClick,
  enableInteractions,
  initializeGameUI,
  renderMap,
} from "./render.js";

import { Poller } from "./poller.js";
import { showAlert } from "./utils.js";

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
  disableInteractions();
  renderMap(gameState.claimedRoutes, gameState.color);
  displayFaceUpCards(gameState.faceUp);
  displayPlayerHandTickets(gameState.playerHand.claimedTickets);
  displayPlayers(gameState.players, gameState.currentPlayerIdx);
};

let etag = "";
let initial = true;
let isAlerted = false;

const pollGameState = async () => {
  const response = await fetch("/game-state", {
    headers: {
      "If-None-Match": etag,
    },
  });

  if (response.status === 304) return;
  const gameState = await response.json();

  if (gameState.isGameEnded === true) {
    globalThis.window.location = "/finish-game";
  }

  if (gameState.isFinalRound === true && isAlerted === false) {
    showAlert("Final round");
    isAlerted = true;
  }

  if (!gameState.isStarted) {
    disableInteractions();
    return;
  }

  if (gameState.isPlayerTurn) {
    enableInteractions();

    if (initial) {
      enableClick();
      showAlert("your turn");
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

  const poller = new Poller(pollGameState, 500);
  poller.start();
};
