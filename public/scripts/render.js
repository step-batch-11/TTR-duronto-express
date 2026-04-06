import { clearHighlightedCities } from "./event_handlers/tickets_handlers.js";
import { claimTicketChoices } from "./events.js";

const validateDoubleRouteClaim = (_color, routeId, map) => {
  const adjacentPathId = routeId.split("-").reverse().join("-");
  const adjacentPath = map.querySelector(`#${adjacentPathId}`);

  if (adjacentPath !== null) adjacentPath.classList.add("click-disabled");
};

const paintRoutes = (color, routes, map) => {
  for (const routeId of routes) {
    const routeElement = map.querySelector(`#${routeId}`);
    routeElement.setAttribute("data-owner-color", color);
    routeElement.classList.add("click-disabled");

    validateDoubleRouteClaim(color, routeId, map);
  }
};

export const renderMap = (routeOwnership) => {
  const map = document.querySelector("#map");

  for (const [color, routes] of Object.entries(routeOwnership)) {
    paintRoutes(color, routes, map);
  }
};

const createPlayer = ({ name, symbol, carCount }, template) => {
  const clone = template.content.cloneNode(true);
  clone.querySelector(".identifier .name").textContent = name;
  clone.querySelector(".identifier .symbol").style.backgroundColor = symbol;

  clone
    .querySelector(".train-car-data img")
    .setAttribute("src", `assets/symbols/${symbol}.png`);
  clone.querySelector(".train-car-data .car-count").textContent = carCount;

  return clone;
};

export const displayPlayers = (players) => {
  const playerTemplate = document.querySelector("#user");
  const container = document.querySelector(".player-details");
  const playerElements = players.map((player) =>
    createPlayer(player, playerTemplate)
  );
  container.replaceChildren(...playerElements);
};

export const displayFaceUpCards = (cards) => {
  const cardTemplate = document.querySelector("#market-card");
  const container = document.querySelector(".faceup-cards");
  container.innerHTML = "";

  cards.filter((card) => card !== null).forEach((card, index) => {
    const clone = cardTemplate.content.cloneNode(true);
    clone.querySelector(".card").id = index + 1;
    clone.querySelector(".card").setAttribute("data-color", card);
    clone
      .querySelector(".card img")
      .setAttribute("src", `./assets/car-cards-images/${card}.jpg`);
    container.append(clone);
  });
};

export const displayCarCards = (carCards) => {
  const carCardTemplate = document.querySelector("#card");

  const container = document.querySelector(".hand-car-cards");
  if (container !== null) container.remove();

  const handContainer = document.createElement("div");
  handContainer.classList.add("hand-car-cards");
  document.querySelector(".footer").children[1].before(handContainer);
  handContainer.innerHTML = "";

  const cardsInHand = Object.entries(carCards).map(([color, count]) => {
    const clone = carCardTemplate.content.cloneNode(true);
    const countContainer = clone.querySelector(".card-count");
    clone.querySelector(".hand-car-card").id = color;
    clone.querySelector(".img-container").setAttribute("data-color", color);
    const imageElement = clone.querySelector(".card-img");
    imageElement.setAttribute("src", `assets/car-cards-images/${color}.jpg`);

    countContainer.textContent = count;
    return clone;
  });

  handContainer.append(...cardsInHand);
};

export const displayPlayerHandTickets = (ticketChoices) => {
  const playerHandTicketButtons = document.querySelector(".buttons-container");
  playerHandTicketButtons.classList.remove("hidden");
  const container = document.querySelector(
    ".hand-destination-tickets > .container",
  );

  container.innerHTML = "";

  ticketChoices.forEach((id, index) => {
    const ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");

    const imageElement = document.createElement("img");
    imageElement.src = `assets/destination-cards-images/${id}.png`;

    ticketDiv.append(imageElement);
    ticketDiv.setAttribute("data-ticket-route", id);
    ticketDiv.setAttribute("data-ticket-id", index);

    if (index === 0) {
      ticketDiv.classList.add("top");
      const ticketCounter = document.querySelector(".ticket-counter");
      ticketCounter.textContent = `${index + 1}/${ticketChoices.length}`;
    }
    container.append(ticketDiv);
  });
};

const isNewGame = (tickets) => tickets.length === 0;

export const initializeGameUI = ({ claimedTickets }) => {
  if (isNewGame(claimedTickets)) {
    displayLog(`Game Started`);

    const swipeButtons = document.querySelector(".buttons-container");
    swipeButtons.classList.add("is-disabled");
  }
};

export const displayPlayerHand = (
  { carCards, ticketChoices, claimedTickets },
) => {
  displayCarCards(carCards);
  displayTicketChoices(ticketChoices, claimedTickets);
};

export const displayDestTicketDeck = () => {
  const template = document.querySelector("#dest-ticket");
  const clone = template.content.cloneNode(true);

  document.querySelector(".footer").append(clone);
};

export const toggleHidden = () => {
  const carCardContainer = document.querySelector(".faceup-cards");
  const carCardsDeck = document.querySelector(".deck");
  const ticketCardContainer = document.querySelector(".ticket-cards");

  carCardContainer.classList.toggle("hidden");
  carCardsDeck.classList.toggle("hidden");
  ticketCardContainer.classList.toggle("hidden");
};

export const toggleDisable = () => {
  const ticketDeck = document.querySelector(".destination-tickets-deck");
  const routes = document.querySelectorAll(".route");

  routes.forEach((route) => route.classList.toggle("is-disabled"));
  ticketDeck.classList.toggle("is-disabled");
};

const createTicketCard = (ticket) => {
  const ticketCardTemplate = document.querySelector("#market-card");

  const clone = ticketCardTemplate.content.cloneNode(true);
  const ticketId = typeof ticket === "object" ? ticket.id : ticket;
  clone.querySelector(".card").id = ticketId;
  clone.querySelector(".card").setAttribute("data-ticket-route", ticketId);
  clone
    .querySelector(".card img")
    .setAttribute("src", `./assets/destination-cards-images/${ticketId}.png`);
  return clone;
};

const createClaimButton = () => {
  const buttonTemplate = document.querySelector("#btn");

  const clone = buttonTemplate.content.cloneNode(true);
  const button = clone.querySelector(".claim-button");
  button.id = "ticket-claim-button";
  button.innerText = "Claim";

  button.classList.add("disabled-submit");

  return clone;
};

export const displayTicketChoices = (tickets, claimedTickets) => {
  if (tickets.length === 0) {
    displayPlayerHandTickets(claimedTickets);
    return;
  }

  const ticketCardContainer = document.querySelector(".ticket-cards");
  ticketCardContainer.innerHTML = "";

  toggleHidden();
  toggleDisable();

  tickets.forEach((id) => {
    const card = createTicketCard(id);
    ticketCardContainer.append(card);
  });

  const buttons = createClaimButton();
  ticketCardContainer.append(buttons);

  claimTicketChoices();
};

export const updateActiveTicket = (tickets, currentTicket, offset) => {
  const currentTicketId = parseInt(currentTicket.dataset.ticketId);
  const nextId = (tickets.length + currentTicketId + offset) %
    tickets.length;

  const ticketCounter = document.querySelector(".ticket-counter");
  ticketCounter.textContent = `${nextId + 1}/${tickets.length}`;

  const nextTicket = document.querySelector(`[data-ticket-id="${nextId}"]`);
  nextTicket.classList.add("top");
  currentTicket.classList.remove("top");
};

export const highlightCities = (cardId) => {
  clearHighlightedCities();

  const [src, dest] = cardId.split("-");

  const srcStation = document.querySelector(`#${src}`);
  const destStation = document.querySelector(`#${dest}`);

  srcStation?.classList.add(
    "highlightCity",
    "stationColor",
  );
  destStation?.classList.add(
    "highlightCity",
    "stationColor",
  );
};

export const unhighlightCities = (cardId) => {
  const [from, to] = cardId.split("-");
  document.querySelector(`#${from}`)?.classList.remove(
    "highlightCity",
  );

  document.querySelector(`#${to}`)?.classList.remove(
    "highlightCity",
  );
};

export const resolveFaceUpCardDraw = (card, img, carCards) => {
  setTimeout(() => {
    card.removeChild(img);
    displayCarCards(carCards);

    const market = document.querySelector(".market");
    market.classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
  }, 1001);
};

export const addHandCardContainer = (color) => {
  const handContainer = document.querySelector(".hand-car-cards");
  const carCardTemplate = document.querySelector("#card");
  const clone = carCardTemplate.content.cloneNode(true);
  clone.querySelector(".hand-car-card").id = color;
  clone.querySelector(".img-container").setAttribute("data-color", color);

  handContainer.append(clone);
  return document.querySelector(`.hand-car-cards [data-color="${color}"]`);
};

export const displayLog = (log) => {
  const logContainer = document.querySelector(".log-div");
  const logHolderElement = document.createElement("p");
  logHolderElement.setAttribute("class", "log");
  logHolderElement.textContent = log;
  logContainer.replaceChildren(logHolderElement);
};
