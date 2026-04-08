import { clearHighlightedCities } from "./event_handlers/tickets_handlers.js";
import { claimTicketChoices } from "./events.js";

const validateDoubleRouteClaim = (color, routeId, map, myPawnColor) => {
  const adjacentPathId = routeId.split("-").reverse().join("-");
  const adjacentPath = map.querySelector(`#${adjacentPathId}`);

  if (adjacentPath !== null && color === myPawnColor) {
    adjacentPath.classList.add("click-disabled");
  }
};

const paintRoutes = (color, routes, map, myPawnColor) => {
  for (const { routeId } of routes) {
    const routeElement = map.querySelector(`#${routeId}`);
    routeElement.setAttribute("data-owner-color", color);
    routeElement.classList.add("click-disabled");

    validateDoubleRouteClaim(color, routeId, map, myPawnColor);
  }
};

export const renderMap = (routeOwnership, myPawnColor) => {
  const map = document.querySelector("#map");

  for (const [color, routes] of Object.entries(routeOwnership)) {
    paintRoutes(color, routes, map, myPawnColor);
  }
};

const createPlayer = (
  { name, symbol, carCount, ticketCount },
  template,
  option,
) => {
  const clone = template.content.cloneNode(true);
  const container = clone.querySelector(".user");
  clone.querySelector(".identifier .name").textContent = name;
  if (option.index === option.currentPlayerIdx) {
    container.classList.add(symbol);
  }
  clone.querySelector(".identifier .symbol").style.backgroundColor = symbol;
  clone.querySelector(".train-car-data .car-count").textContent = carCount;
  clone.querySelector(".ticket-data .ticket-count").textContent = ticketCount;

  return clone;
};

export const displayPlayers = (players, currentPlayerIdx) => {
  const playerTemplate = document.querySelector("#user");
  const container = document.querySelector(".player-details");
  const playerElements = players.map((player, index) =>
    createPlayer(player, playerTemplate, {
      index,
      currentPlayerIdx,
    })
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

const createButton = (id, className, name, contents) => {
  const button = document.createElement("button");
  button.id = id;
  button.classList.add(className);
  button.setAttribute("name", name);
  button.innerHTML = contents;
  return button;
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
    imageElement.src = `assets/destination-cards-images/${id}.webp`;

    ticketDiv.append(imageElement);
    ticketDiv.setAttribute("data-ticket-route", id);
    ticketDiv.setAttribute("data-ticket-id", index);
    const button = document.querySelector(".left-button");

    if (index === 0) {
      if (!button) {
        const leftButton = createButton(
          "ticket-swipe-button-left",
          "left-button",
          "left",
          "&lt;",
        );
        const rightButton = createButton(
          "ticket-swipe-button-right",
          "right-button",
          "right",
          "&gt;",
        );
        playerHandTicketButtons.prepend(leftButton);
        playerHandTicketButtons.append(rightButton);
      }
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
    .setAttribute("src", `./assets/destination-cards-images/${ticketId}.webp`);
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

  document.querySelector("#map").classList.add("unfocus");
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

const createPulseEffect = (element) => {
  const div = document.createElement("div");
  div.classList.add("effect");
  div.style.position = "absolute";
  div.style.top = parseInt(element.top) - 12 + "px";
  div.style.left = parseInt(element.left) + "px";

  document.querySelector("body").appendChild(div);
};

const drawLineSrcToDest = (src, dest) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const line = document.createElementNS(svgNS, "line");
  const svg = document.querySelector("#map svg").getBoundingClientRect();

  line.setAttribute("x1", src.x - svg.x + 15);
  line.setAttribute("y1", src.y);
  line.setAttribute("x2", dest.x - svg.x + 15);
  line.setAttribute("y2", dest.y);
  line.setAttribute("stroke", "orange");
  line.setAttribute("stroke-width", "15");
  line.classList.add("line");

  document.querySelector("#map svg").appendChild(line);
};

const getShimmeringEffect = (src, dest) => {
  const srcDimentions = src.querySelector("use").getBoundingClientRect();
  const destDimentions = dest.querySelector("use").getBoundingClientRect();

  drawLineSrcToDest(srcDimentions, destDimentions);
  createPulseEffect(srcDimentions);
  createPulseEffect(destDimentions);
};

export const highlightCities = (cardId) => {
  clearHighlightedCities();

  const [src, dest] = cardId.split("-");
  const srcStation = document.querySelector(`#${src}`);
  const destStation = document.querySelector(`#${dest}`);
  getShimmeringEffect(srcStation, destStation);

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
  document.querySelectorAll(".line").forEach((ele) => ele.remove());
  document.querySelectorAll(".effect").forEach((ele) => ele.remove());
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

    document.querySelector(".market").classList.remove("is-disabled");
    document.querySelector("#map").classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
  }, 1001);
};

export const createImageAtr = (color) => {
  const img = document.createElement("img");
  img.setAttribute("src", `/assets/car-cards-images/${color}.jpg`);

  return img;
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

export const disableInteractions = () => {
  document.querySelector("#map").classList.add("disableInteractions");
  document.querySelector(".faceup-cards").classList.add("disableInteractions");
  document.querySelector(".deck").classList.add("disableInteractions");
  document.querySelector(".destination-tickets-deck-container")
    .classList.add("disableInteractions");
};

export const enableInteractions = () => {
  document.querySelector("#map").classList.remove("disableInteractions");
  document.querySelector(".faceup-cards").classList.remove(
    "disableInteractions",
  );
  document.querySelector(".deck").classList.remove("disableInteractions");
  document.querySelector(".destination-tickets-deck-container")?.classList
    .remove("disableInteractions");
};

export const enableClick = () => {
  document.querySelector("#map").classList.remove("click-disabled");
  document.querySelector(".destination-tickets-deck")?.classList
    .remove("click-disabled");
};

const showSinglePlayerScore = (scores, row) => {
  const scoreColumnTemplate = document.querySelector("#row-data-template");

  for (const entity in scores) {
    const clone = scoreColumnTemplate.content.cloneNode(true);
    const scoreColumn = clone.querySelector(".row-data");

    scoreColumn.textContent = scores[entity];

    row.append(scoreColumn);
  }
};

export const createLeaderboard = (scores) => {
  const table = document.querySelector("#victory-table-body");
  const rowTemplate = document.querySelector("#row-template");

  for (const player of scores) {
    const clone = rowTemplate.content.cloneNode(true);
    const row = clone.querySelector(".row");

    showSinglePlayerScore(player, row);

    table.append(row);
  }
};

export const displayWinner = (winner) => {
  const body = document.querySelector("body");
  const winnerTemplate = document.querySelector("#winner-template");
  const clone = winnerTemplate.content.cloneNode(true);
  const winnerSection = clone.querySelector(".winner");

  const winnerNameSection = winnerSection.querySelector("#winner-name");
  winnerNameSection.textContent = winner;

  body.prepend(winnerSection);
};
