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
  displayDestTicketDeck,
  displayFaceUpCards,
  displayPlayerHand,
  displayPlayerHandTickets,
  displayPlayers,
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

let etag = "";

const pollCallBack = async () => {
  const playerData = await fetchPlayerDetails();
  displayPlayers(playerData);

  const response = await fetch("/game-state", {
    headers: {
      "If-None-Match": etag,
    },
  });

  if (response.status === 304) {
    return;
  }
  const gameState = await response.json();

  displayPlayerHandTickets(gameState.claimedTickets);
  displayFaceUpCards(gameState.faceUp);
  renderMap(gameState.claimedRoutes);
  etag = response.headers.get("etag");
};

globalThis.onload = async () => {
  await fetchMap();
  const playerHand = await fetchInitialPlayerHand();
  displayDestTicketDeck();
  initializeGameUI(playerHand);
  displayPlayerHand(playerHand);

  const logs = await (await fetch("/fetch-log")).json();
  displayLog(logs);

  const routesData = await fetchRoutesData();
  registerListeners(routesData);

  const poller = new Poller(pollCallBack, 2000);
  poller.start();
};
