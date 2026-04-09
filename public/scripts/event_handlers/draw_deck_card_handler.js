import { fetchFaceUpDeck } from "../api.js";
import { animateDrawDeckCard, getHandCardPositions } from "../animations.js";
import { fetchDeckCards } from "../api.js";
import { displayCarCards, resolveFaceUpCardDraw } from "../render.js";
import {
  animateDrawFaceUpCard,
  animateRefillMarket,
  moveFromDeckToHand,
} from "../animations.js";
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
  document
    .querySelector("#map")
    .classList.add("click-disabled");

const disableWild = () => {
  setTimeout(() => {
    const wilds = document
      .querySelectorAll('.faceup-cards [data-color="wild"]');

    wilds.forEach((wild) => {
      wild.classList.add("is-disabled");
    });
  }, 1500);
};

export const handleDrawFaceUp = async (event) => {
  const card = event.target.closest(".card");
  if (card === null) {
    showAlert("choose a valid card");
    return;
  }

  const img = card.querySelector(".card-img");
  animateDrawFaceUpCard(card);
  const cardId = { id: card.id };
  const { faceUpCards, carCards, cardToRefill, isTurnChanged } =
    await fetchFaceUpDeck(
      cardId,
    );

  if (cardToRefill !== undefined) {
    animateRefillMarket(cardToRefill, card, faceUpCards, isTurnChanged);
    resolveFaceUpCardDraw(card, img, carCards);
    disableDestinationDeck();
    disableMap();
    disableWild();
  }
};

export const handleDrawCardFromDeck = async (deck) => {
  const { drawnCard, carCards, isTurnChanged } = await fetchDeckCards();
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
