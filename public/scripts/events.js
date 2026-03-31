import { displayCarCards, displayFaceUpCards } from "./script.js";

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");
  deck.addEventListener("click", async () => {
    const res = await fetch("/draw-deck-card");
    const { carCards } = await res.json();

    displayCarCards(carCards);
  });
};

export const drawFaceUpCard = () => {
  const deck = document.querySelector(".faceup-cards");
  deck.addEventListener("click", async (event) => {
    const card = event.target.closest(".card");
    const body = { id: card.id };
    const res = await fetch("/draw-faceup-card", {
      method: "post",
      body: JSON.stringify(body),
    });

    const { faceUpCards, carCards } = await res.json();
    console.log(carCards);

    displayFaceUpCards(faceUpCards);
    displayCarCards(carCards);
  });
};
