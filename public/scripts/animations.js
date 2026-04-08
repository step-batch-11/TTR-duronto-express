import { addHandCardContainer, displayFaceUpCards } from "./render.js";
import { createCarCardImg, showAlert } from "./utils.js";

export const moveFromDeckToHand = (img, destination, deck) => {
  img.style.transform = "scale(1)";
  const x = destination.left - deck.left - deck.height / 2 + 17;
  const y = destination.top - deck.top + deck.height / 2 - 20;

  img.style.transform = `translate(${x}px,${y}px) rotate(270deg)`;
};

const moveFromDeckToMarket = (img, destination, deck) => {
  img.style.borderRadius = "5px";
  img.style.transform = "scale(1)";
  const y = destination.top - deck.top;
  img.style.transform = `translate(0px,${y}px)`;
};

const moveFaceUpCard = (card, hand, faceUpCard) => {
  const img = card.querySelector(".card-img");
  const x = hand.x - faceUpCard.x - faceUpCard.height / 2 + 15;
  const y = hand.y - faceUpCard.y + faceUpCard.height / 2 - 20;
  img.style.height = `${faceUpCard.height + 10}px`;
  img.style.transform = `translate(${x}px, ${y}px) rotate(270deg)`;
};

const resolveRefillMarket = (deck, img, faceUpCards, isTurnChanged) => {
  setTimeout(() => {
    deck.removeChild(img);
    displayFaceUpCards(faceUpCards);
    document.querySelector(".market").classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
    if (isTurnChanged) showAlert("your turn completed!");
  }, 1500);
};

const getHandCard = (color) => {
  const handCard = document.querySelector(
    `.hand-car-cards [data-color="${color}"]`,
  );

  if (!handCard) return addHandCardContainer(color);
  return handCard;
};

export const getHandCardPositions = (color) => {
  const handCard = getHandCard(color);
  return handCard.getBoundingClientRect();
};

export const animateDrawFaceUpCard = (card) => {
  const market = document.querySelector(".market");
  market.classList.add("is-disabled");
  document.querySelector(".footer").classList.add("is-disabled");

  const color = card.getAttribute("data-color");
  const hand = getHandCardPositions(color);
  const faceUpCard = card.getBoundingClientRect();

  moveFaceUpCard(card, hand, faceUpCard);
};

export const animateDrawDeckCard = (img, destination, deckPosition, move) => {
  document.querySelector(".market").classList.add("is-disabled");
  document.querySelector(".footer").classList.add("is-disabled");
  setTimeout(() => {
    img.style.transform = "scale(1.2)";
  }, 1);

  setTimeout(() => {
    move(img, destination, deckPosition);
  }, 500);
};

export const animateRefillMarket = (
  drawnCardFromDeck,
  card,
  faceUpCards,
  isTurnChanged,
) => {
  const deck = document.querySelector(".deck");
  const cardPosition = card.getBoundingClientRect();
  const img = createCarCardImg(drawnCardFromDeck);
  deck.append(img);
  img.classList.add("is-disabled");
  const deckPosition = deck.querySelector("#deck-img").getBoundingClientRect();

  animateDrawDeckCard(img, cardPosition, deckPosition, moveFromDeckToMarket);
  resolveRefillMarket(deck, img, faceUpCards, isTurnChanged);
};

export const animateTicketClaim = (ticketChoice) => {
  const handTicketContainer = document.querySelector(
    ".hand-destination-tickets .container",
  );

  const img = document.querySelector(`[data-ticket-route=${ticketChoice}]`);

  const handTicketSize = handTicketContainer.getBoundingClientRect();
  const imgSize = img.getBoundingClientRect();

  const x = handTicketSize.x - imgSize.x;
  const y = handTicketSize.y - imgSize.y;

  img.style.transform = `translate(${x}px, ${y}px)`;
};
