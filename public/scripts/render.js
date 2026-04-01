import { claimTicketChoices } from "./events.js";

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

const displayPlayerHandTickets = (ticketChoices) => {
  const ticketsContainer = document.querySelector(
    ".hand-destination-tickets > .container",
  );

  const ticketContainers = ticketsContainer.children;

  Object.values(ticketContainers).forEach((ticketElement, index) => {
    const imageElement = document.createElement("img");
    imageElement.setAttribute(
      "src",
      `assets/destination-cards-images/${ticketChoices[index]}.png`,
    );

    ticketElement.append(imageElement);
  });
};

export const displayPlayerHand = ({ carCards, ticketChoices }) => {
  displayPlayerHandTickets(ticketChoices);
  displayCarCards(carCards);
};

const toggleHidden = () => {
  const carCardContainer = document.querySelector(".faceup-cards");
  const carCardsDeck = document.querySelector(".deck");
  const ticketCardContainer = document.querySelector(".ticket-cards");

  carCardContainer.classList.toggle("hidden");
  carCardsDeck.classList.toggle("hidden");
  ticketCardContainer.classList.toggle("hidden");
};

const toggleDisable = () => {
  const ticketDeck = document.querySelector(".destination-tickets-deck");

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

  return clone;
};

const createTicketSubmitButton = () => {
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

  tickets.forEach((ticketId) => {
    const card = createTicketCard(ticketId);
    ticketCardContainer.append(card);
  });

  const button = createTicketSubmitButton();
  ticketCardContainer.append(button);
  claimTicketChoices();
};
