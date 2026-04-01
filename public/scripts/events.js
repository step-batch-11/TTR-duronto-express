import {
  fetchDeckCards,
  fetchFaceUpDeck,
  fetchTicketChoices,
  postClaimRoute,
} from "./api.js";
import {
  displayCarCards,
  displayFaceUpCards,
  displayTicketChoices,
  renderMap,
} from "./render.js";

const claimRoute = async (event) => {
  const route = event.target.closest(".route");
  if (route === null) {
    return;
  }
  const routeId = route.getAttribute("id");
  const resp = await postClaimRoute({ routeId });

  renderMap(resp.routeOwnership);
};

export const mapOnClick = () => {
  const map = document.querySelector("#map");
  map.addEventListener("click", claimRoute);
};

const addHandCardContainer = (color) => {
  const handContainer = document.querySelector(".hand-car-cards");
  const carCardTemplate = document.querySelector("#card");
  const clone = carCardTemplate.content.cloneNode(true);
  clone.querySelector(".img-container").setAttribute("data-color", color);

  handContainer.append(clone);
  return document.querySelector(`.hand-car-cards [data-color="${color}"]`);
};

const getHandCard = (color) => {
  const handCard = document.querySelector(
    `.hand-car-cards [data-color="${color}"]`,
  );

  if (!handCard) return addHandCardContainer(color);
  return handCard;
};

const createImageAtr = (name) => {
  const img = document.createElement("img");
  img.setAttribute("src", `/assets/car-cards-images/${name}.jpg`);

  return img;
};

const toggleMarket = () => {
  const market = document.querySelector(".market");
  market.classList.toggle("is-disabled");
};

const moveFromDeckToHand = (img, destination, deck) => {
  img.style.transform = "scale(1)";
  const x = destination.left - deck.left - deck.height / 2 + 17;
  const y = destination.top - deck.top + deck.height / 2 - 20;

  img.style.transform = `translate(${x}px,${y}px) rotate(270deg)`;
};

const animateDrawDeckCard = (img, destination, deckPosition, move) => {
  setTimeout(() => {
    img.style.transform = "scale(1.2)";
  }, 1);

  setTimeout(() => {
    move(img, destination, deckPosition);
  }, 500);
};

const resolveDeckCardDraw = (deck, img, carCards) => {
  setTimeout(() => {
    deck.removeChild(img);
    displayCarCards(carCards);
    toggleMarket();
  }, 1600);
};

const getHandCardPositions = (color) => {
  const handCard = getHandCard(color);
  return handCard.getBoundingClientRect();
};

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");

  deck.addEventListener("click", async () => {
    const { drawnCard, carCards } = await fetchDeckCards();
    const deckPosition = deck
      .querySelector("#deck-img")
      .getBoundingClientRect();
    const hand = getHandCardPositions(drawnCard);

    const img = createImageAtr(drawnCard);
    deck.append(img);
    toggleMarket();
    animateDrawDeckCard(img, hand, deckPosition, moveFromDeckToHand);
    resolveDeckCardDraw(deck, img, carCards);
  });
};

const moveFaceUpCard = (card, hand, faceUpCard) => {
  const img = card.querySelector(".card-img");
  const x = hand.x - faceUpCard.x - faceUpCard.height / 2 + 15;
  const y = hand.y - faceUpCard.y + faceUpCard.height / 2 - 20;
  img.style.height = `${faceUpCard.height + 10}px`;
  img.style.transform = `translate(${x}px, ${y}px) rotate(270deg)`;
};

const resolveFaceUpCardDraw = (card, img, carCards) => {
  setTimeout(() => {
    card.removeChild(img);
    displayCarCards(carCards);
    toggleMarket();
  }, 1000);
};

const animateDrawFaceUpCard = (card) => {
  toggleMarket();
  const color = card.getAttribute("data-color");
  const hand = getHandCardPositions(color);
  const faceUpCard = card.getBoundingClientRect();
  moveFaceUpCard(card, hand, faceUpCard);
};

const moveFromDeckToMarket = (img, destination, deck) => {
  img.style.borderRadius = "5px";
  img.style.transform = "scale(1)";
  const y = destination.top - deck.top;
  img.style.transform = `translate(0px,${y}px)`;
};

const resolveRefillMarket = (deck, img, faceUpCards) => {
  setTimeout(() => {
    deck.removeChild(img);
    displayFaceUpCards(faceUpCards);
  }, 1500);
};

const animateRefillMarket = (drawnCardFromDeck, card, faceUpCards) => {
  const deck = document.querySelector(".deck");
  const cardPosition = card.getBoundingClientRect();
  const img = createImageAtr(drawnCardFromDeck);
  deck.append(img);
  const deckPosition = deck.querySelector("#deck-img").getBoundingClientRect();

  animateDrawDeckCard(img, cardPosition, deckPosition, moveFromDeckToMarket);
  resolveRefillMarket(deck, img, faceUpCards);
};

export const drawFaceUpCard = () => {
  const market = document.querySelector(".faceup-cards");

  market.addEventListener("click", async (event) => {
    const card = event.target.closest(".card");
    const img = card.querySelector(".card-img");
    if (card === null) return;
    animateDrawFaceUpCard(card);
    const cardId = { id: card.id };
    const { faceUpCards, carCards, drawnCardFromDeck } = await fetchFaceUpDeck(
      cardId,
    );

    animateRefillMarket(drawnCardFromDeck, card, faceUpCards);
    resolveFaceUpCardDraw(card, img, carCards);
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

const selectedTickets = new Set();

export const selectTicketCard = () => {
  const ticketCards = document.querySelector(".ticket-cards");

  ticketCards.addEventListener("click", (event) => {
    const selectedCard = event.target.closest(".card");
    if (!selectedCard) {
      return;
    }

    const cardId = selectedCard.id;

    if (selectedTickets.has(cardId)) {
      selectedTickets.delete(cardId);
      return;
    }

    selectedTickets.add(cardId);
    return;
  });
};
