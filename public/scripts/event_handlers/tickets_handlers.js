import { claimSelectedTickets } from "../api.js";
import {
  displayPlayerHandTickets,
  toggleDisable,
  toggleHidden,
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

export const getHighlightedCities = () => {
  console.log(selectedTickets);
  return new Set(_.map([...selectedTickets], (t) => t.split("-")));
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
