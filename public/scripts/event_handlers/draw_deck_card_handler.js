import { fetchFaceUpDeck, fetchLog } from "../api.js";
import { animateDrawDeckCard, getHandCardPositions } from "../animations.js";
import { fetchDeckCards } from "../api.js";
import {
  createImageAtr,
  displayCarCards,
  displayLog,
  resolveFaceUpCardDraw,
} from "../render.js";
import {
  animateDrawFaceUpCard,
  animateRefillMarket,
  moveFromDeckToHand,
} from "../animations.js";

const resolveDeckCardDraw = (deck, img, carCards) => {
  setTimeout(() => {
    deck.removeChild(img);
    displayCarCards(carCards);
    document.querySelector(".market").classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
  }, 1600);
};

const disableDestinationDeck = () =>
  document
    .querySelector(".destination-tickets-deck")
    .classList.add("is-disabled");

const disableMap = () =>
  document
    .querySelector("#map")
    .classList.add("is-disabled");

const disableWild = () => {
  setTimeout(() => {
    const wilds = document
      .querySelectorAll('.faceup-cards [data-color="wild"]');

    wilds.forEach((wild) => {
      wild.classList.add("is-disabled");
    });
  }, 1500);
};

export const handleDrawFaceUP = async (event) => {
  disableDestinationDeck();
  disableMap();

  const card = event.target.closest(".card");
  if (card === null) return;
  const img = card.querySelector(".card-img");
  animateDrawFaceUpCard(card);
  const cardId = { id: card.id };
  const { faceUpCards, carCards, cardToRefill } = await fetchFaceUpDeck(
    cardId,
  );

  const body = { msg: `Cards drawn from face-up` };
  const log = await fetchLog(body);
  displayLog(log);

  animateRefillMarket(cardToRefill, card, faceUpCards);
  resolveFaceUpCardDraw(card, img, carCards);
  disableWild();
};

export const handleDrawCardFromDeck = async (deck) => {
  disableDestinationDeck();
  disableMap();

  const { drawnCard, carCards } = await fetchDeckCards();
  const deckPosition = deck
    .querySelector("#deck-img")
    .getBoundingClientRect();
  const hand = getHandCardPositions(drawnCard);

  const img = createImageAtr(drawnCard);
  deck.append(img);
  animateDrawDeckCard(img, hand, deckPosition, moveFromDeckToHand);

  const body = { msg: `Cards drown from deck` };
  const log = await fetchLog(body);
  displayLog(log);

  resolveDeckCardDraw(deck, img, carCards);
};
