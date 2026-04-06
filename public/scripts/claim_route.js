import { fetchPlayerHand, postClaimRoute } from "./api.js";
import { drawTicketChoice } from "./events.js";
import {
  addHandCardContainer,
  displayCarCards,
  displayDestTicketDeck,
  displayLog,
  renderMap,
} from "./render.js";
import { createCarCardImg } from "./utils.js";

const enableBuildActions = () => {
  const template = document.querySelector("#build-route-template");
  const clone = template.content.cloneNode(true);
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

const getCardCountOnCart = (type) => {
  const container = document.querySelector(`#${type}-card .card-count`);
  return container.textContent || 0;
};

const calculateTotalCardsInCart = () => {
  const colorCardCount = getCardCountOnCart("color");
  const wildCardCount = getCardCountOnCart("wild");

  return parseInt(colorCardCount) + parseInt(wildCardCount);
};

const enableBuildButton = () => {
  const buildBtn = document.querySelector(".build-actions #build");
  buildBtn.classList.remove("click-disabled");
};

const disableBuildButton = () => {
  const buildBtn = document.querySelector(".build-actions #build");
  buildBtn.classList.add("click-disabled");
};

const addCardImageInCart = (colorCardElement, color) => {
  colorCardElement.setAttribute("data-card-color", color);
  const img = createCarCardImg(color);
  const imgContainer = colorCardElement.querySelector(".build-img-container");
  imgContainer.append(img);
  imgContainer.classList.remove("card-placeholder");
};

const appendCarCardInCart = (color, count) => {
  const cardType = color === "wild" ? "wild" : "color";

  const colorCardElement = document.querySelector(
    `.possible-cards #${cardType}-card`,
  );

  const cartCountContainer = colorCardElement.querySelector(".card-count");
  cartCountContainer.textContent =
    parseInt(cartCountContainer.textContent || 0) + count;

  if (colorCardElement.dataset.cardColor) return;
  addCardImageInCart(colorCardElement, color);
};

const removeExhaustedCards = () => {
  const handCarCards = document.querySelectorAll(
    ".hand-car-cards .hand-car-card",
  );

  handCarCards.forEach((card) => {
    const countContainer = card.querySelector(".card-count");
    if (countContainer.textContent === "0") card.remove();
  });
};

const showPossibleCardToBuild = (countContainer, routeColor, cardCount) => {
  countContainer.textContent = parseInt(countContainer.textContent) -
    cardCount;
  appendCarCardInCart(routeColor, cardCount);
  disableCardsExcept(routeColor);
  removeExhaustedCards();
};

const showPossibleCombinationToBuild = (routeData, colorCardCount) => {
  const { routeLength, routeColor } = routeData;
  appendCarCardInCart(routeColor, colorCardCount);

  const wildCountContainer = document.querySelector(
    `.hand-car-cards #wild .card-count`,
  );

  const wildCardsRequired = routeLength - colorCardCount;
  showPossibleCardToBuild(wildCountContainer, "wild", wildCardsRequired);
};

const showPossibleCardsToBuild = (routeData, handCarCards) => {
  const { routeLength, routeColor } = routeData;
  if (routeColor === "transparent") return;

  disableCardsExcept(routeColor, "is-disabled");
  const colorCardCount = handCarCards[routeColor] || 0;
  const countContainer = document.querySelector(
    `.hand-car-cards #${routeColor} .card-count`,
  );
  if (countContainer === null) return;

  enableBuildButton();
  if (colorCardCount >= routeLength) {
    showPossibleCardToBuild(countContainer, routeColor, routeLength);
    return;
  }

  countContainer.textContent = 0;
  showPossibleCombinationToBuild(routeData, colorCardCount);
};

const disableCardsExcept = (color, cls = "click-disabled") => {
  const container = document.querySelector(".hand-car-cards");

  [...container.children].forEach((card) => {
    if (card.id !== color && card.id !== "wild") {
      card.classList.add(cls);
    }
  });
};

const enableCards = () => {
  const container = document.querySelector(".hand-car-cards");

  Object.values(container.children).forEach((card) => {
    card.classList.remove("click-disabled");
  });
};

const toggleBuildButton = (routeLength) => {
  const totalCardsInCart = calculateTotalCardsInCart();
  totalCardsInCart === routeLength ? enableBuildButton() : disableBuildButton();
};

const handleCartOnAddingCard = (routeLength, color) => {
  appendCarCardInCart(color, 1);
  toggleBuildButton(routeLength);
};

const handleCardCountOnAddingCardInCart = (card, cardsContainer) => {
  const countContainer = card.parentElement.querySelector(".card-count");

  if (countContainer.textContent === "1") {
    cardsContainer.removeChild(card.parentElement);
  }

  countContainer.textContent = parseInt(countContainer.textContent) - 1;
};

const addToCart = ({ routeLength }) => {
  const cardsContainer = document.querySelector(".hand-car-cards");

  cardsContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".img-container");
    if (card === null) return;

    const colorCardChosen = card.dataset.color;

    if (colorCardChosen !== "wild") {
      disableCardsExcept(colorCardChosen);
    }

    handleCardCountOnAddingCardInCart(card, cardsContainer);
    handleCartOnAddingCard(routeLength, colorCardChosen);
  });
};

const moveCardToPlayerHand = (color) => {
  const handCarCardContainer = document.querySelector(`#${color}`);

  if (handCarCardContainer) {
    const carCount = handCarCardContainer.querySelector(".card-count");
    carCount.textContent = parseInt(carCount.textContent) + 1;
    return;
  }

  const container = addHandCardContainer(color);
  container.querySelector("img")
    .setAttribute("src", `/assets/car-cards-images/${color}.jpg`);

  const carCount = container.parentElement.querySelector(".card-count");
  carCount.textContent = 1;
};

const removeCardImgFromCart = (card) => {
  card.innerHTML = "";
  card.classList.add("card-placeholder");
  const cardType = card.parentElement.dataset.cardColor;
  card.parentElement.removeAttribute("data-card-color");

  if (cardType !== "wild") enableCards();
};

const removeFromCart = ({ routeLength }) => {
  const possibleCardContainer = document.querySelector(".possible-cards");

  possibleCardContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".build-img-container");
    if (card === null || !card.innerHTML.trim()) return;

    const color = card.parentElement.dataset.cardColor;
    const countContainer = card.parentElement.querySelector(".card-count");
    countContainer.textContent = parseInt(countContainer.textContent) - 1;

    if (countContainer.textContent === "0") {
      countContainer.textContent = "";
      removeCardImgFromCart(card);
    }

    moveCardToPlayerHand(color);
    toggleBuildButton(routeLength);
  });
};

const resolveBuild = (handCarCards) => {
  disableBuildActions();
  expandPlayerHand();
  displayDestTicketDeck();
  drawTicketChoice();
  displayCarCards(handCarCards);
};

const getColorCardDetailsToBuild = () => {
  const colorCardElement = document.querySelector("#color-card");
  const colorCardUsed = colorCardElement.getAttribute("data-card-color");
  const colorCardCount = parseInt(getCardCountOnCart("color"));

  return { colorCardCount, colorCardUsed };
};

const buildRoute = async (routeId) => {
  const { colorCardCount, colorCardUsed } = getColorCardDetailsToBuild();
  const wildCardCount = parseInt(getCardCountOnCart("wild"));

  const cardsUsed = { colorCardUsed, colorCardCount, wildCardCount };
  const res = await postClaimRoute({ routeId, cardsUsed });

  const { routeOwnership, carCards } = res;
  renderMap(routeOwnership);
  resolveBuild(carCards);
  displayLog(`Route claimed successfully`);
};

const cancelBuild = (_, handCarCards) => {
  const map = document.querySelector("#map");
  map.classList.remove("click-disabled");

  resolveBuild(handCarCards);
};

const BUILD_ACTIONS = { "build": buildRoute, "cancel": cancelBuild };

const buildActionsOnClick = (routeId, handCarCards) => {
  const buildButton = document.querySelector(".build-actions");

  buildButton.addEventListener("click", async (event) => {
    const action = event.target.id;
    if (action === null) return;

    await BUILD_ACTIONS[action](routeId, handCarCards);
  });
};

const isBuildPossible = ({ routeLength, routeColor }, handCarCards) => {
  const wildCardCount = handCarCards["wild"] || 0;
  delete handCarCards.wild;

  if (routeColor === "transparent") {
    return Object.values(handCarCards).some((count) =>
      count + wildCardCount >= routeLength
    );
  }

  return ((handCarCards[routeColor] || 0) + wildCardCount) >= routeLength;
};

const initializeListnersForClaim = (handCarCards, routeData, routeId) => {
  addToCart(routeData);
  removeFromCart(routeData);
  buildActionsOnClick(routeId, handCarCards);
};

const claimRoute = async (event, routesData, map) => {
  const route = event.target.closest(".route");
  if (route === null) return;

  const handCarCards = await fetchPlayerHand();
  const routeId = route.getAttribute("id");
  const routeData = routesData[routeId];

  if (!isBuildPossible(routeData, structuredClone(handCarCards))) return;

  map.classList.add("click-disabled");
  enableBuildActions();
  squeezePlayerHand();
  await showPossibleCardsToBuild(routeData, handCarCards);
  initializeListnersForClaim(handCarCards, routeData, routeId);
};

export const mapOnClick = (routesData) => {
  const map = document.querySelector("#map");
  map.addEventListener("click", (event) => {
    claimRoute(event, routesData, map);
  });
};
