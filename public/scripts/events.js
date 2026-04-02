import {
  fetchDeckCards,
  fetchFaceUpDeck,
  fetchLastLog,
  fetchPlayerHand,
  fetchTicketChoices,
  postClaimRoute,
} from "./api.js";
import {
  handleTicketClick,
  handleTicketsClaim,
  handleTicketSelection,
  handleTicketSwipe,
} from "./event_handlers/tickets_handlers.js";
import {
  displayCarCards,
  displayDestTicketDeck,
  displayFaceUpCards,
  displayTicketChoices,
  highlightCities,
  renderMap,
  unhighlightCities,
} from "./render.js";

const enableBuildActions = () => {
  const template = document.querySelector("#build-route-template");
  const clone = template.content.cloneNode(true);
  console.log(clone);
  document.querySelector(".footer").appendChild(clone);
};

const disableBuildActions = () =>
  document.querySelector(".build-route-container").remove();

const expandPlayerHand = () =>
  document.querySelector(".hand-car-cards").id = "";

const squeezePlayerHand = () => {
  const destContainer = document.querySelector(
    ".destination-tickets-deck-container",
  );
  document.querySelector(".footer").removeChild(destContainer);
  document.querySelector(".hand-car-cards").id = "squeezed-hand";
};

const createImageAtr = (color) => {
  const img = document.createElement("img");
  img.setAttribute("src", `/assets/car-cards-images/${color}.jpg`);

  return img;
};

const showPossibleCardsToBuild = async ({ routeLength, routeColor }) => {
  const handCarCards = await fetchPlayerHand();
  const carCardCountInPlayerHand = handCarCards[routeColor];
  if (carCardCountInPlayerHand >= routeLength) {
    //Extract to its function module
    //Break down the functionalities into its module
    const playerHandCard = document.querySelector(
      `.hand-car-cards #${routeColor}`,
    );
    const countContainer = playerHandCard.querySelector(".card-count");
    countContainer.textContent = parseInt(countContainer.textContent) -
      routeLength;
    const colorCardElement = document.querySelector(
      ".possible-cards #color-card",
    );

    colorCardElement.setAttribute("data-card-color", routeColor);
    const img = createImageAtr(routeColor);

    colorCardElement.querySelector(".card-count").textContent = routeLength;
    const imgContainer = colorCardElement.querySelector(".build-img-container");
    imgContainer.append(img);
    imgContainer.style.border = "1px solid";
  }
};

export const buildRoute = (routeId) => {
  const buildButton = document.querySelector(".build-actions #build");

  buildButton.addEventListener("click", async () => {
    //Move to its own event handler
    const colorCardElement = document.querySelector(
      ".possible-cards #color-card",
    );

    const colorCardUsed = colorCardElement.getAttribute("data-card-color");
    const colorCardCount =
      colorCardElement.querySelector(".card-count").textContent;
    const { routeOwnership } = await postClaimRoute({
      routeId,
      cardsUsed: { colorCardUsed, colorCardCount },
    });
    renderMap(routeOwnership);

    disableBuildActions();
    expandPlayerHand();
    displayDestTicketDeck();
    drawTicketChoice();
  });
};

//Move to its own handler
const claimRoute = async (event, routesData) => {
  const route = event.target.closest(".route");
  console.log("kadsfhio");
  if (route === null) return;

  const routeId = route.getAttribute("id");
  const routeData = routesData[routeId];
  enableBuildActions(routeId);
  squeezePlayerHand();
  await showPossibleCardsToBuild(routeData);
  buildRoute(routeId);
};

export const mapOnClick = (routesData) => {
  const map = document.querySelector("#map");
  map.addEventListener("click", (event) => {
    claimRoute(event, routesData);
  });
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

const moveFromDeckToHand = (img, destination, deck) => {
  img.style.transform = "scale(1)";
  const x = destination.left - deck.left - deck.height / 2 + 17;
  const y = destination.top - deck.top + deck.height / 2 - 20;

  img.style.transform = `translate(${x}px,${y}px) rotate(270deg)`;
};

const animateDrawDeckCard = (img, destination, deckPosition, move) => {
  document.querySelector(".market").classList.add("is-disabled");
  document.querySelector(".footer").classList.add("is-disabled");
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
    document.querySelector(".market").classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
  }, 1600);
};

const getHandCardPositions = (color) => {
  const handCard = getHandCard(color);
  return handCard.getBoundingClientRect();
};

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");

  deck.addEventListener("click", async () => {
    //Move to its own handler
    const { drawnCard, carCards } = await fetchDeckCards();
    const deckPosition = deck
      .querySelector("#deck-img")
      .getBoundingClientRect();
    const hand = getHandCardPositions(drawnCard);

    const img = createImageAtr(drawnCard);
    deck.append(img);

    const body = { msg: `card drawn from the deck` };
    const { lastLog } = await fetchLastLog(body);
    displayLog(lastLog);
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

    const market = document.querySelector(".market");
    market.classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
  }, 1001);
};

const animateDrawFaceUpCard = (card) => {
  const market = document.querySelector(".market");
  market.classList.add("is-disabled");
  document.querySelector(".footer").classList.add("is-disabled");

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
    document.querySelector(".market").classList.remove("is-disabled");
    document.querySelector(".footer").classList.remove("is-disabled");
  }, 1500);
};

const animateRefillMarket = (drawnCardFromDeck, card, faceUpCards) => {
  const deck = document.querySelector(".deck");
  const cardPosition = card.getBoundingClientRect();
  const img = createImageAtr(drawnCardFromDeck);
  deck.append(img);
  img.classList.add("is-disabled");
  const deckPosition = deck.querySelector("#deck-img").getBoundingClientRect();

  animateDrawDeckCard(img, cardPosition, deckPosition, moveFromDeckToMarket);
  resolveRefillMarket(deck, img, faceUpCards);
};

export const drawFaceUpCard = () => {
  const market = document.querySelector(".faceup-cards");

  market.addEventListener("click", async (event) => {
    //Move to its own handler
    const card = event.target.closest(".card");
    const img = card.querySelector(".card-img");
    if (card === null) return;
    animateDrawFaceUpCard(card);
    const cardId = { id: card.id };
    const { faceUpCards, carCards, drawnCardFromDeck } = await fetchFaceUpDeck(
      cardId,
    );

    const body = { msg: `card drawn from the faceUp` };
    const { lastLog } = await fetchLastLog(body);
    displayLog(lastLog);

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

export const selectTicketCard = () => {
  const ticketCards = document.querySelector(".ticket-cards");
  ticketCards.addEventListener("click", handleTicketSelection);
  ticketCards.addEventListener("mouseover", (event) => {
    //Move to its own handler
    const selectedCard = event.target.closest(".card");
    if (!selectedCard) {
      return;
    }
    const ticketRoute = selectedCard.dataset.ticketRoute;
    highlightCities(ticketRoute);
  });

  ticketCards.addEventListener("mouseout", (event) => {
    const selectedCard = event.target.closest(".card");
    if (!selectedCard) {
      return;
    }
    const ticketRoute = selectedCard.dataset.ticketRoute;
    unhighlightCities(ticketRoute);
  });
};

export const claimTicketChoices = () => {
  const submitButton = document.querySelector("#ticket-submit-button");
  submitButton.addEventListener("click", handleTicketsClaim);
};

export const swipeTickets = () => {
  const buttonContainer = document.querySelector(".buttons-container");
  buttonContainer.addEventListener("click", handleTicketSwipe);
};

export const accessTicket = () => {
  const tickets = document.querySelector(".container");

  tickets.addEventListener("mouseover", handleTicketClick);
  tickets.addEventListener("mouseout", (event) => {
    //Move to its own handler
    const ticket = event.target.closest(".ticket");
    if (!ticket) {
      return;
    }
    const ticketRoute = ticket.dataset.ticketRoute;
    unhighlightCities(ticketRoute);
  });
};
