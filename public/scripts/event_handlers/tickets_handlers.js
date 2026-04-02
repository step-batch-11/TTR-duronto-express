import { claimSelectedTickets } from "../api.js";
import {
  displayPlayerHandTickets,
  toggleDisable,
  toggleHidden,
} from "../render.js";

const selectedTickets = new Set();

export const handleTicketsClaim = async () => {
  const ticketChoices = [];
  selectedTickets.forEach((ticket) => ticketChoices.push(ticket));

  const playerHandTickets = await claimSelectedTickets(ticketChoices);
  selectedTickets.clear();

  toggleDisable();
  toggleHidden();

  displayPlayerHandTickets(playerHandTickets);
};

export const highLightCities = (cardId) => {
  const [from, to] = cardId.split("-");
  const fromCity = document.querySelector(`#${from}`);
  const toCity = document.querySelector(`#${to}`);

  fromCity.classList.toggle("highlightCity");
  fromCity.classList.toggle("stationColor");
  toCity.classList.toggle("highlightCity");
  toCity.classList.toggle("stationColor");
};

export const handleTicketSelection = (event) => {
  const selectedCard = event.target.closest(".card");
  if (!selectedCard) {
    return;
  }

  const cardId = selectedCard.id;

  selectedCard.classList.toggle("highlight");
  highLightCities(cardId);
  if (selectedTickets.has(cardId)) {
    selectedTickets.delete(cardId);
    return;
  }

  selectedTickets.add(cardId);
  return;
};
