import { clearHighlightedCities } from "./event_handlers/tickets_handlers.js";
import { claimTicketChoices } from "./events.js";

const paintRoutes = (color, routes) => {
  const map = document.querySelector("#map");

  for (const routeId of routes) {
    const routeElement = map.querySelector(`#${routeId}`);
    routeElement.setAttribute("data-owner-color", color);
  }
};

export const renderMap = (routeOwnership) => {
  for (const [color, routes] of Object.entries(routeOwnership)) {
    paintRoutes(color, routes);
  }
};

const appendPlayer = ({ name, symbol, carCount }, container, template) => {
  const clone = template.content.cloneNode(true);
  clone.querySelector(".identifier .name").textContent = name;
  clone.querySelector(".identifier .symbol").style.backgroundColor = symbol;

  clone
    .querySelector(".train-car-data img")
    .setAttribute("src", `assets/symbols/${symbol}.png`);
  clone.querySelector(".train-car-data .car-count").textContent = carCount;

  container.append(clone);
};

export const displayPlayers = (players) => {
  const playerTemplate = document.querySelector("#user");
  const container = document.querySelector(".player-details");
  players.forEach((player) => {
    appendPlayer(player, container, playerTemplate);
  });
};

export const displayFaceUpCards = (cards) => {
  const cardTemplate = document.querySelector("#market-card");
  const container = document.querySelector(".faceup-cards");
  container.innerHTML = "";

  cards.forEach((card, index) => {
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
  const handContainer = document.querySelector(".hand-car-cards");

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

export const displayPlayerHand = (
  { carCards, ticketChoices, claimedTickets },
) => {
  console.log(carCards, ticketChoices, claimedTickets);

  displayTicketChoices(ticketChoices, claimedTickets);
  displayCarCards(carCards);
};

export const displayDestTicketDeck = () => {
  // const template = document.querySelector("#dest-ticket");
  // const clone = template.content.cloneNode(true);

  // document.querySelector(".footer").append(clone);
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

const createTicketCard = (ticketId) => {
  const ticketCardTemplate = document.querySelector("#market-card");

  const clone = ticketCardTemplate.content.cloneNode(true);
  clone.querySelector(".card").id = ticketId;
  clone.querySelector(".card").setAttribute("data-ticket-route", ticketId);
  clone
    .querySelector(".card img")
    .setAttribute("src", `./assets/destination-cards-images/${ticketId}.png`);
  clone.onclick = () => {};
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

  return;
};

export const highlightCities = (cardId) => {
  clearHighlightedCities();
  const [from, to] = cardId.split("-");
  document.querySelector(`#${from}`)?.classList.add(
    "highlightCity",
    "stationColor",
  );
  document.querySelector(`#${to}`)?.classList.add(
    "highlightCity",
    "stationColor",
  );
};

export const unhighlightCities = (cardId) => {
  const [from, to] = cardId.split("-");
  document.querySelector(`#${from}`)?.classList.remove(
    "highlightCity",
    "stationColor",
  );
  document.querySelector(`#${to}`)?.classList.remove(
    "highlightCity",
    "stationColor",
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
  clone.querySelector(".img-container").setAttribute("data-color", color);

  handContainer.append(clone);
  return document.querySelector(`.hand-car-cards [data-color="${color}"]`);
};

export const displayLog = (log) => {
  const logContainer = document.querySelector(".log");

  const logElements = logContainer.querySelectorAll("p");
  logElements.forEach((element) => logContainer.removeChild(element));

  log.forEach((logMessage) => {
    const p = document.createElement("p");
    p.textContent = logMessage;
    logContainer.append(p);
  });
};
