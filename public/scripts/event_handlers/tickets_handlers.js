import { claimSelectedTickets } from "../api.js";
import {
  displayPlayerHandTickets,
  highlightCities,
  toggleDisable,
  toggleHidden,
  unhighlightCities,
  updateActiveTicket,
} from "../render.js";

const selectedTickets = new Set();

const clearHighlightedCities = () => {
  const highlighted = document.querySelectorAll(".highlightCity");

  highlighted.forEach((el) => {
    el.classList.remove("highlightCity");
    el.classList.remove("stationColor");
  });
};

export const handleTicketsClaim = async () => {
  const ticketChoices = [];
  selectedTickets.forEach((ticket) => ticketChoices.push(ticket));

  const playerHandTickets = await claimSelectedTickets(ticketChoices);
  selectedTickets.clear();

  clearHighlightedCities();
  toggleDisable();
  toggleHidden();

  displayPlayerHandTickets(playerHandTickets);
};

export const handleTicketSelection = (event) => {
  const selectedCard = event.target.closest(".card");
  if (!selectedCard) {
    return;
  }

  const cardId = selectedCard.id;

  selectedCard.classList.toggle("highlight");

  if (selectedTickets.has(cardId)) {
    selectedTickets.delete(cardId);
    unhighlightCities(cardId);
    return;
  }

  selectedTickets.add(cardId);
  highlightCities(cardId);
  return;
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

export const handleTicketClick = (event) => {
  const ticket = event.target.closest(".ticket");
  const ticketRoute = ticket.dataset.ticketRoute;
  highlightCities(ticketRoute);
};
