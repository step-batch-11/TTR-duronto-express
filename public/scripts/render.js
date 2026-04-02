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
    clone.querySelector(".img-container").setAttribute("data-color", color);
    const imageElement = clone.querySelector(".card-img");
    imageElement.setAttribute("src", `assets/car-cards-images/${color}.jpg`);

    countContainer.textContent = count;
    return clone;
  });

  handContainer.append(...cardsInHand);
};

export const displayPlayerHandTickets = (ticketChoices) => {
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
    ticketDiv.setAttribute("data-ticket-id", index);
    if (ticketChoices.length - 1 === index) {
      ticketDiv.classList.add("top");
    }
    container.append(ticketDiv);
  });
};

export const displayPlayerHand = ({ carCards, ticketChoices }) => {
  displayPlayerHandTickets(ticketChoices);
  displayCarCards(carCards);
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
  clone.querySelector(".card").setAttribute("data-ticket-id", ticketId);
  clone
    .querySelector(".card img")
    .setAttribute("src", `./assets/destination-cards-images/${ticketId}.png`);
  clone.onclick = () => {};
  return clone;
};

const createSubmitButton = () => {
  const buttonTemplate = document.querySelector("#btn");

  const clone = buttonTemplate.content.cloneNode(true);
  clone.querySelector(".button").id = "ticket-submit-button";
  clone.querySelector(".button").innerText = "Submit";

  return clone;
};

export const displayTicketChoices = (tickets) => {
  const ticketCardContainer = document.querySelector(".ticket-cards");
  ticketCardContainer.innerHTML = "";

  toggleHidden();
  toggleDisable();

  tickets.forEach((id) => {
    const card = createTicketCard(id);
    ticketCardContainer.append(card);
  });

  const buttons = createSubmitButton();
  ticketCardContainer.append(buttons);
  claimTicketChoices();
};
