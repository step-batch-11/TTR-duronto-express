import { fetchDeckCards, fetchFaceUpDeck, fetchTicketChoices } from "./api.js";
import { displayCarCards, displayFaceUpCards } from "./render.js";

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");

  deck.addEventListener("click", async () => {
    const { carCards } = await fetchDeckCards();

    displayCarCards(carCards);
  });
};

export const drawFaceUpCard = () => {
  const market = document.querySelector(".faceup-cards");
  market.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (card !== null) {
      const body = { id: card.id };

      const color = card.getAttribute("data-color");
      const handCard = document
        .querySelector(`.hand-car-cards [data-color="${color}"]`);
      const hand = handCard.getBoundingClientRect();
      const faceUpCard = card.getBoundingClientRect();

      card.style.transform = `translate(${
        hand.x - faceUpCard.x - faceUpCard.height / 2 + 10
      }px, 
      ${hand.y - faceUpCard.y + faceUpCard.height / 2 - 10}px) rotate(270deg)`;

      setTimeout(async () => {
        market.removeChild(card);
        const { faceUpCards, carCards } = await fetchFaceUpDeck(body);

        displayFaceUpCards(faceUpCards);
        displayCarCards(carCards);
      }, 900);
    }
  });
};

export const drawTicketChoice = () => {
  const ticketDeck = document.querySelector(".destination-tickets-deck");
  ticketDeck.addEventListener("click", async () => {
    const ticketChoices = await fetchTicketChoices();
    return ticketChoices;
  });
};
