import { fetchFaceUpDeck, fetchLastLog } from "../api.js";
import { animateDrawDeckCard, getHandCardPositions } from "../animations.js";
import { fetchDeckCards } from "../api.js";
import {
  createImageAtr,
  displayCarCards,
  displayLog,
  resolveFaceUpCardDraw,
} from "../render.js";
import { animateDrawFaceUpCard, animateRefillMarket } from "../animations.js";

const moveFromDeckToHand = (img, destination, deck) => {
  img.style.transform = "scale(1)";
  const x = destination.left - deck.left - deck.height / 2 + 17;
  const y = destination.top - deck.top + deck.height / 2 - 20;

  img.style.transform = `translate(${x}px,${y}px) rotate(270deg)`;
};

const resolveDeckCardDraw = (deck, img, carCards) => {
  setTimeout(() => {
    deck.removeChild(img);
    displayCarCards(carCards);
    document.querySelector(".market").classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
  }, 1600);
};

export const handleDrawFaceUP = async (event) => {
  const card = event.target.closest(".card");
  const img = card.querySelector(".card-img");
  if (card === null) return;
  animateDrawFaceUpCard(card);
  const cardId = { id: card.id };
  const { faceUpCards, carCards, cardToRefill } = await fetchFaceUpDeck(
    cardId,
  );

  const body = { msg: `Cards drown from face-up` };
  const { lastLog } = await fetchLastLog(body);
  displayLog(lastLog);
  animateRefillMarket(cardToRefill, card, faceUpCards);
  resolveFaceUpCardDraw(card, img, carCards);
};

export const handleDrawCardFromDeck = async (deck) => {
  const { drawnCard, carCards } = await fetchDeckCards();
  const deckPosition = deck
    .querySelector("#deck-img")
    .getBoundingClientRect();
  const hand = getHandCardPositions(drawnCard);

  const img = createImageAtr(drawnCard);
  deck.append(img);
  animateDrawDeckCard(img, hand, deckPosition, moveFromDeckToHand);
  const body = { msg: `Cards drown from deck` };
  const { lastLog } = await fetchLastLog(body);
  displayLog(lastLog);
  resolveDeckCardDraw(deck, img, carCards);
};
