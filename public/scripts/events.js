import { fetchDeckCards, fetchFaceUpDeck, fetchTicketChoices } from "./api.js";
import {
  displayCarCards,
  displayFaceUpCards,
  displayTicketChoices,
} from "./render.js";

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");

  deck.addEventListener("click", async () => {
    const { drawnCard, carCards } = await fetchDeckCards();
    const deckPosition = deck.querySelector("#deck-img")
      .getBoundingClientRect();
    let handCard = document
      .querySelector(`.hand-car-cards [data-color="${drawnCard}"]`);
    if (!handCard) {
      const handContainer = document.querySelector(".hand-car-cards");
      const carCardTemplate = document.querySelector("#card");
      const clone = carCardTemplate.content.cloneNode(true);
      clone.querySelector(".img-container").setAttribute(
        "data-color",
        drawnCard,
      );
      handContainer.append(clone);
      handCard = document
        .querySelector(`.hand-car-cards [data-color="${drawnCard}"]`);
    }
    console.log(drawnCard, handCard);
    const hand = handCard.getBoundingClientRect();

    const img = document.createElement("img");
    img.setAttribute("src", `/assets/car-cards-images/${drawnCard}.jpg`);
    deck.append(img);

    setTimeout(() => {
      img.style.transform = "scale(1.4)";
    }, 100);

    setTimeout(() => {
      img.style.zIndex = 1;
      img.style.transform = `translate(${
        hand.left - deckPosition.left - deckPosition.height / 2 + 17
      }px, 
    ${
        hand.top - deckPosition.top + deckPosition.height / 2 - 15
      }px) rotate(180deg) rotateZ(90deg)`;
    }, 500);

    setTimeout(() => {
      deck.removeChild(img);
      displayCarCards(carCards);
    }, 1600);
  });
};

export const drawFaceUpCard = () => {
  const market = document.querySelector(".faceup-cards");
  market.addEventListener("click", (event) => {
    const card = event.target.closest(".card");
    if (card !== null) {
      const body = { id: card.id };

      const color = card.getAttribute("data-color");
      let handCard = document
        .querySelector(`.hand-car-cards [data-color="${color}"]`);
      if (!handCard) {
        const handContainer = document.querySelector(".hand-car-cards");
        const carCardTemplate = document.querySelector("#card");
        const clone = carCardTemplate.content.cloneNode(true);
        clone.querySelector(".img-container").setAttribute("data-color", color);
        handContainer.append(clone);
        handCard = document
          .querySelector(`.hand-car-cards [data-color="${color}"]`);
      }
      const hand = handCard.getBoundingClientRect();
      const faceUpCard = card.getBoundingClientRect();
      card.style.zIndex = 1;
      card.style.height = `${faceUpCard.height + 10}px`;

      card.style.transform = `translate(${
        hand.x - faceUpCard.x - faceUpCard.height / 2 + 10
      }px, 
      ${hand.y - faceUpCard.y + faceUpCard.height / 2 - 10}px) rotate(270deg)`;

      setTimeout(async () => {
        market.removeChild(card);
        const { faceUpCards, carCards } = await fetchFaceUpDeck(body);

        displayFaceUpCards(faceUpCards);
        displayCarCards(carCards);
      }, 1000);
    }
  });
};

export const drawTicketChoice = () => {
  const ticketDeck = document.querySelector(".destination-tickets-deck");
  ticketDeck.addEventListener("click", async () => {
    const ticketChoices = await fetchTicketChoices();
    displayTicketChoices(ticketChoices);
    return ticketChoices;
  });
};
