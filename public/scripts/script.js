import { apiGet, apiGetText } from "./api.js";
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

  displayPlayers(gameState.players, gameState.currentPlayerIdx);

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

const loadMap = async () => {
  const svg = await apiGetText("/assets/map.svg");
  document.querySelector("#map").innerHTML = svg;
};

const loadHand = async () => {
  const playerHand = await apiGet("/initial-hand"); //  fetchInitialPlayerHand();
  initializeGameUI(playerHand);
  displayPlayerHand(playerHand);
};

const main = async () => {
  await loadMap();
  displayDestTicketDeck();
  await loadHand();

  const routesData = await apiGet("/routes-data");
  registerListeners(routesData);

  const poller = new Poller(pollGameState, 500);
  poller.start();
};

globalThis.onload = main;
