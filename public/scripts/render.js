import { clearHighlightedCities } from "./event_handlers/tickets_handlers.js";
import { claimTicketChoices } from "./events.js";
import { cloneTemplate } from "./utils/web_utils.js";

const validateDoubleRouteClaim = (
  color,
  routeId,
  map,
  myPawnColor,
  playerCount,
) => {
  const adjacentPathId = routeId.split("-").reverse().join("-");
  const adjacentPath = map.querySelector(`#${adjacentPathId}`);

  if (adjacentPath !== null && (color === myPawnColor || playerCount <= 3)) {
    adjacentPath.classList.add("click-disabled");
  }
};

const paintRoutes = (color, routes, map, myPawnColor, playerCount) => {
  for (const { routeId } of routes) {
    const routeElement = map.querySelector(`#${routeId}`);
    routeElement.setAttribute("data-owner-color", color);
    routeElement.classList.add("click-disabled");

    validateDoubleRouteClaim(color, routeId, map, myPawnColor, playerCount);
  }
};

export const renderMap = (routeOwnership, myPawnColor) => {
  const map = document.querySelector("#map");
  const players = Object.entries(routeOwnership);

  for (const [color, routes] of players) {
    paintRoutes(color, routes, map, myPawnColor, players.length);
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
    container.classList.add("highlight-player");
  }

  const rootStyles = globalThis.getComputedStyle(document.documentElement);
  const playerColor = rootStyles.getPropertyValue(`--${symbol}-player`);

  clone.querySelector(".symbol").style.backgroundColor = playerColor;
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

const createButton = (id, className, buttonType, name) => {
  const button = document.createElement("ion-icon");
  button.id = id;
  button.classList.add(className);
  button.setAttribute("name", buttonType);
  button.setAttribute("data-name", name);
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
          "caret-back-outline",
          "left",
        );
        const rightButton = createButton(
          "ticket-swipe-button-right",
          "right-button",
          "caret-forward-outline",
          "right",
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
  const clone = cloneTemplate("#dest-ticket");

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
  const ticketCardEle = cloneTemplate("#market-card");
  const ticketId = typeof ticket === "object" ? ticket.id : ticket;
  ticketCardEle.querySelector(".card").id = ticketId;
  ticketCardEle.querySelector(".card").setAttribute(
    "data-ticket-route",
    ticketId,
  );
  ticketCardEle
    .querySelector(".card img")
    .setAttribute("src", `./assets/destination-cards-images/${ticketId}.webp`);
  return ticketCardEle;
};

const createClaimButton = () => {
  const btnEle = cloneTemplate("#btn");
  const button = btnEle.querySelector(".claim-button");
  button.id = "ticket-claim-button";
  button.innerText = "Claim";

  button.classList.add("disabled-submit");

  return btnEle;
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

const calculateDimentionsOfPath = (src, dest, svgRect) => {
  const x1 = src.x - svgRect.x + 12;
  const y1 = src.y;
  const x2 = dest.x - svgRect.x + 12;
  const y2 = dest.y;
  return `M ${x1} ${y1} L ${x2} ${y2}`;
};

const makeSvgPath = (cls, svgRect, src, dest) => {
  const svgNS = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(svgNS, "path");
  const d = calculateDimentionsOfPath(src, dest, svgRect);
  path.classList.add("line");
  path.setAttribute("d", d);
  path.classList.add(cls);

  return path;
};

const drawLineSrcToDest = (src, dest) => {
  const svgRect = document.querySelector("#map svg").getBoundingClientRect();

  const innerStroke = makeSvgPath("inner-stroke", svgRect, src, dest);
  const outerStroke = makeSvgPath("outer-stroke", svgRect, src, dest);
  document.querySelector("#map svg").appendChild(outerStroke);
  document.querySelector("#map svg").appendChild(innerStroke);
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
  document.querySelector("#map").classList.add("unfocus");
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
  document.querySelector("#map").classList.remove("unfocus");
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

export const addHandCardContainer = (color) => {
  const handContainer = document.querySelector(".hand-car-cards");
  const carCardEle = cloneTemplate("#card");
  carCardEle.querySelector(".hand-car-card").id = color;
  carCardEle.querySelector(".img-container").setAttribute("data-color", color);

  handContainer.append(carCardEle);
  return document.querySelector(`.hand-car-cards [data-color="${color}"]`);
};

export const disableInteractions = () => {
  document.querySelector("#map").classList.add("disable-interactions");
  document.querySelector(".faceup-cards").classList.add("disable-interactions");
  document.querySelector(".deck").classList.add("disable-interactions");
  document.querySelector(".destination-tickets-deck-container")
    .classList.add("disable-interactions");
};

export const enableInteractions = () => {
  document.querySelector("#map").classList.remove("disable-interactions");
  document.querySelector(".faceup-cards").classList.remove(
    "disable-interactions",
  );
  document.querySelector(".deck").classList.remove("disable-interactions");
  document.querySelector(".destination-tickets-deck-container")?.classList
    .remove("disable-interactions");
};

export const enableClick = () => {
  document.querySelector("#map").classList.remove("click-disabled");
  document.querySelector(".destination-tickets-deck")?.classList
    .remove("click-disabled");
};

const showSinglePlayerScore = (scores, row) => {
  const rankingTableColumns = [
    "name",
    "routeScore",
    "ticketScore",
    "isLongest",
    "total",
  ];
  const scoreColumnTemplate = document.querySelector("#row-data-template");

  rankingTableColumns.forEach((entity) => {
    const clone = scoreColumnTemplate.content.cloneNode(true);
    const scoreColumn = clone.querySelector(".row-data");

    if (entity === "isLongest") {
      const data = scores[entity] ? "10" : "-";

      scoreColumn.textContent = data;
      row.append(scoreColumn);
      return;
    }

    const data = scores[entity];

    scoreColumn.textContent = data;
    row.append(scoreColumn);
  });
};

export const createLeaderboard = (scores) => {
  const table = document.querySelector("#victory-table-body");
  const rowTemplate = document.querySelector("#row-template");

  for (const playerScore of scores) {
    const clone = rowTemplate.content.cloneNode(true);
    const row = clone.querySelector(".row");

    showSinglePlayerScore(playerScore, row);
    table.append(row);
  }
};

export const displayWinner = (winner) => {
  const body = document.querySelector("body");
  const winnerEle = cloneTemplate("#winner-template");
  const winnerSection = winnerEle.querySelector(".winner");

  const winnerNameSection = winnerSection.querySelector("#winner-name");
  winnerNameSection.textContent = winner;

  body.prepend(winnerSection);
};
