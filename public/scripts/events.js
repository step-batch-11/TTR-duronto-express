import { apiGet } from "./utils/api_utils.js";
import {
  handleDrawCardFromDeck,
  handleDrawFaceUp,
} from "./event_handlers/draw_deck_card_handler.js";
import {
  handleHighlightCities,
  handleTicketsClaim,
  handleTicketSelection,
  handleTicketSwipe,
  handleUnHighlightCities,
} from "./event_handlers/tickets_handlers.js";
import { handleExitGame } from "./event_handlers/game_handler.js";
import { displayTicketChoices } from "./render.js";
import { showAlert } from "./utils.js";

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");
  deck.addEventListener("click", () => handleDrawCardFromDeck(deck));
};

export const drawFaceUpCard = () => {
  const market = document.querySelector(".faceup-cards");
  market.addEventListener("click", handleDrawFaceUp);
};

export const drawTicketChoice = () => {
  const ticketDeck = document.querySelector(".destination-tickets-deck");

  ticketDeck.addEventListener("click", async () => {
    const ticketChoices = await apiGet("/game/ticket-choices");
    if (ticketChoices.length === 0) {
      showAlert("TICKET DECK IS EMPTY");
      return;
    }
    document.querySelector("#map").classList.add("unfocus");
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

export const exitGame = async () => {
  const exitForm = document.querySelector("#exit-game-form");
  exitForm.addEventListener("submit", await handleExitGame);
};
