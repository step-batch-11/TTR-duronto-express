import { fetchDeckCards, fetchFaceUpDeck } from "./api.js";
import { displayCarCards, displayFaceUpCards } from "./script.js";

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");

  deck.addEventListener("click", async () => {
    const { carCards } = await fetchDeckCards();

    displayCarCards(carCards);
  });
};

export const drawFaceUpCard = () => {
  const deck = document.querySelector(".faceup-cards");
  deck.addEventListener("click", async (event) => {
    const card = event.target.closest(".card");
    const body = { id: card.id };
    const { faceUpCards, carCards } = await fetchFaceUpDeck(body);

    displayFaceUpCards(faceUpCards);
    displayCarCards(carCards);
  });
};
