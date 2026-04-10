import {
  animateDrawDeckCard,
  animateDrawFaceUpCard,
  animateRefillMarket,
  getHandCardPositions,
  moveFromDeckToHand,
} from "../animations.js";
import { apiGet, apiPost } from "../utils/api_utils.js";
import { displayCarCards, resolveFaceUpCardDraw } from "../render.js";
import { createCarCardImg, showAlert } from "../utils.js";

const resolveDeckCardDraw = (deck, img, carCards, isTurnChanged) => {
  setTimeout(() => {
    deck.removeChild(img);
    displayCarCards(carCards);
    document.querySelector(".market").classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
    document.querySelector("#map").classList.remove("is-disabled");
    if (isTurnChanged) showAlert("Your Turn Completed");
  }, 1600);
};

const disableDestinationDeck = () =>
  document
    .querySelector(".destination-tickets-deck")
    .classList.add("click-disabled");

const disableMap = () =>
  document.querySelector("#map").classList.add("click-disabled");

const disableWild = () => {
  setTimeout(() => {
    const wilds = document.querySelectorAll(
      '.faceup-cards [data-color="wild"]',
    );

    wilds.forEach((wild) => {
      wild.classList.add("is-disabled");
    });
  }, 1500);
};

export const handleDrawFaceUp = async (event) => {
  const cardElement = event.target.closest(".card");
  if (!cardElement) {
    showAlert("choose a valid card");
    return;
  }

  const img = cardElement.querySelector(".card-img");
  animateDrawFaceUpCard(cardElement);
  const res = await apiPost("/game/draw-faceup-card", { id: cardElement.id });
  const { faceUpCards, carCards, cardToRefill, isTurnChanged } = res;

  if (cardToRefill !== undefined) {
    animateRefillMarket(cardToRefill, cardElement, faceUpCards, isTurnChanged);
    resolveFaceUpCardDraw(cardElement, img, carCards);
    disableDestinationDeck();
    disableMap();
    disableWild();
  }
};

export const handleDrawCardFromDeck = async (deck) => {
  const { drawnCard, carCards, isTurnChanged } = await apiGet(
    "/game/draw-deck-card",
  );
  disableMap();

  if (drawnCard !== undefined) {
    const deckPosition = deck
      .querySelector("#deck-img")
      .getBoundingClientRect();
    const hand = getHandCardPositions(drawnCard);

    const img = createCarCardImg(drawnCard);
    deck.append(img);
    animateDrawDeckCard(img, hand, deckPosition, moveFromDeckToHand);
    resolveDeckCardDraw(deck, img, carCards, isTurnChanged);

    disableDestinationDeck();
    disableWild();
  }
};
