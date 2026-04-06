import { animateTicketClaim } from "../animations.js";
import { claimSelectedTickets, fetchPhase } from "../api.js";

import {
  displayPlayerHandTickets,
  highlightCities,
  toggleDisable,
  toggleHidden,
  unhighlightCities,
  updateActiveTicket,
} from "../render.js";

const selectedTickets = new Set();

const claimedTicketsMap = {
  "INITIALIZED": 2,
  "DRAWTICKETCHOICE": 1,
};

export const clearHighlightedCities = () => {
  const highlighted = document.querySelectorAll(".highlightCity");

  highlighted.forEach((el) => {
    el.classList.remove("highlightCity");
    el.classList.remove("stationColor");
  });
};

export const handleTicketsClaim = async (_event) => {
  const ticketChoices = [];
  selectedTickets.forEach((ticket) => ticketChoices.push(ticket));

  const playerHandTickets = await claimSelectedTickets(ticketChoices);

  clearHighlightedCities();
  toggleDisable();

  setTimeout(() => {
    toggleHidden();
    displayPlayerHandTickets(playerHandTickets);

    const swipeButtons = document.querySelector(".buttons-container");
    swipeButtons.classList.remove("is-disabled");
  }, 1500);

  ticketChoices.forEach(animateTicketClaim);

  selectedTickets.clear();
};

const validateTicketClaim = async () => {
  const button = document.querySelector("#ticket-claim-button");
  const { gamePhase } = await fetchPhase();

  if (selectedTickets.size >= claimedTicketsMap[gamePhase]) {
    button.classList.remove("disabled-submit");
    return;
  }
  button.classList.add("disabled-submit");
};

export const handleTicketSelection = async (event) => {
  const selectedCard = event.target.closest(".card");
  if (!selectedCard) {
    return;
  }

  const cardId = selectedCard.id;

  selectedCard.classList.toggle("highlight");

  if (selectedTickets.has(cardId)) {
    selectedTickets.delete(cardId);
    unhighlightCities(cardId);
    await validateTicketClaim();
    return;
  }

  selectedTickets.add(cardId);
  highlightCities(cardId);

  await validateTicketClaim();
};

const SWIPE_DIRECTION = {
  "right": 1,
  "left": -1,
};

export const handleTicketSwipe = (event) => {
  const tickets = document.querySelectorAll(".ticket");
  const currentTicket = document.querySelector(".top");
  const ticketRoute = currentTicket.dataset.ticketRoute;
  unhighlightCities(ticketRoute);
  const offset = SWIPE_DIRECTION[event.target.name];

  return updateActiveTicket(tickets, currentTicket, offset);
};

export const handleHighlightCities = (event, container) => {
  const ticket = event.target.closest(`.${container}`);
  if (!ticket) {
    return;
  }
  const ticketRoute = ticket.dataset.ticketRoute;
  highlightCities(ticketRoute);
};

export const handleUnHighlightCities = (event, container) => {
  const ticket = event.target.closest(`.${container}`);
  if (!ticket) {
    return;
  }
  const ticketRoute = ticket.dataset.ticketRoute;
  unhighlightCities(ticketRoute);
};
