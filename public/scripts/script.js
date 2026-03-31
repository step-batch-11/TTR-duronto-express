import {
  fetchFaceUpCards,
  fetchPlayerDetails,
  fetchPlayerHand,
} from "./api.js";
import { drawDeckCard, drawFaceUpCard } from "./events.js";

const appendPlayer = ({ name, symbol, carCount }, container, template) => {
  const clone = template.content.cloneNode(true);
  clone.querySelector(".identifier .name").textContent = name;
  clone.querySelector(".identifier .symbol").style.backgroundColor = symbol;

  clone.querySelector(".train-car-data img")
    .setAttribute("src", `assets/symbols/${symbol}.png`);
  clone.querySelector(".train-car-data .car-count").textContent = carCount;

  container.append(clone);
};

const displayPlayers = (players) => {
  const playerTemplate = document.querySelector("#user");
  const container = document.querySelector(".player-details");
  players.forEach((player) => {
    appendPlayer(player, container, playerTemplate);
  });
};

const fetchFaceUpCards = async () => {
  const res = await fetch("/init-faceup");
  const faceUpCards = await res.json();
  console.log(faceUpCards);

  return faceUpCards;
};

const displayFaceUpCards = (cards) => {
  const cardTemplate = document.querySelector("#face-up-cards");
  const container = document.querySelector(".faceup-cards");
  container.innerHTML = "";

  cards.forEach((card, index) => {
    const clone = cardTemplate.content.cloneNode(true);
    clone.querySelector(".card").id = index + 1;
    clone
      .querySelector(".card img")
      .setAttribute("src", `./assets/car-cards-images/${card}.jpg`);
    container.append(clone);
  });
};

export const displayPlayerHand = ({ carCards }) => {
  const carCardTemplate = document.querySelector("#card");
  const handContainer = document.querySelector(".hand-car-cards");

  handContainer.innerHTML = "";
  const cardsInHand = Object.entries(carCards).map(([color, count]) => {
    const clone = carCardTemplate.content.cloneNode(true);
    const countContainer = clone.querySelector(".card-count");
    const imageElement = clone.querySelector(".card-img");
    imageElement.setAttribute("src", `assets/car-cards-images/${color}.jpg`);

    countContainer.textContent = count;
    return clone;
  });

  handContainer.append(...cardsInHand);
};

const drawDeckCard = () => {
  const deck = document.querySelector(".deck");
  deck.addEventListener("click", async () => {
    const res = await fetch("/draw-deck-card");
    const { carCards } = await res.json();

    displayPlayerHand({ carCards });
  });
};

const drawFaceUpCard = () => {
  const deck = document.querySelector(".faceup-cards");
  deck.addEventListener("click", async (event) => {
    const card = event.target.closest(".card");
    const body = { id: card.id };
    const res = await fetch("/draw-faceup-card", {
      method: "post",
      body: JSON.stringify(body),
    });

    const { faceUpCards, carCards } = await res.json();
    console.log(faceUpCards);

    displayFaceUpCards(faceUpCards);
    displayPlayerHand({ carCards });
  });
};

globalThis.onload = async () => {
  const playerData = fetchPlayerDetails();
  displayPlayers(playerData);
  const cardsData = await fetchFaceUpCards();
  displayFaceUpCards(cardsData);
  const playerHand = await fetchPlayerHand();
  displayPlayerHand(playerHand);
  drawDeckCard();
  drawFaceUpCard();
};
