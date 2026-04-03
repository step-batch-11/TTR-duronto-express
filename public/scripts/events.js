import { fetchTicketChoices } from "./api.js";
import {
  handleHighlightCities,
  handleTicketsClaim,
  handleTicketSelection,
  handleTicketSwipe,
  handleUnHighlightCities,
} from "./event_handlers/tickets_handlers.js";
import {
  handleDrawCardFromDeck,
  handleDrawFaceUP,
} from "./event_handlers/draw_deck_card_handler.js";
import { displayTicketChoices } from "./render.js";

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

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");
  deck.addEventListener("click", () => handleDrawCardFromDeck(deck));
};

export const drawFaceUpCard = () => {
  const market = document.querySelector(".faceup-cards");
  market.addEventListener("click", handleDrawFaceUP);
};

export const drawTicketChoice = () => {
  const ticketDeck = document.querySelector(".destination-tickets-deck");

  ticketDeck.addEventListener("click", async () => {
    const ticketChoices = await fetchTicketChoices();
    displayTicketChoices(ticketChoices);

    return ticketChoices;
  });
};

export const selectTicketCard = () => {
  const ticketCards = document.querySelector(".ticket-cards");

  ticketCards.addEventListener("click", handleTicketSelection);

  ticketCards.addEventListener(
    "mouseover",
    (event) => handleHighlightCities(event, "card"),
  );

  ticketCards.addEventListener(
    "mouseout",
    (event) => handleUnHighlightCities(event, "card"),
  );
};

export const claimTicketChoices = () => {
  const submitButton = document.querySelector("#ticket-claim-button");
  submitButton.addEventListener("click", handleTicketsClaim);
};

export const swipeTickets = () => {
  const buttonContainer = document.querySelector(".buttons-container");
  buttonContainer.addEventListener("click", handleTicketSwipe);
};

export const accessTicket = () => {
  const tickets = document.querySelector(".container");
  tickets.addEventListener(
    "mouseover",
    (event) => handleHighlightCities(event, "ticket"),
  );
  tickets.addEventListener(
    "mouseout",
    (event) => handleUnHighlightCities(event, "ticket"),
  );
};
