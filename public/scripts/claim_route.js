import { fetchLog, fetchPlayerHand, postClaimRoute } from "./api.js";
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

const calculateTotalCardsInCart = () => {
  const colorCardCount =
    document.querySelector("#color-card .card-count").textContent;
  const wildCardCount =
    document.querySelector("#wild-card .card-count").textContent || 0;

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

const appendCarCardImgInCart = (color, count) => {
  const cardType = color === "wild" ? "wild" : "color";
  const colorCardElement = document.querySelector(
    `.possible-cards #${cardType}-card`,
  );

  const cartCountContainer = colorCardElement.querySelector(".card-count");
  cartCountContainer.textContent =
    parseInt(cartCountContainer.textContent || 0) + count;
  if (colorCardElement.dataset.cardColor) return;

  colorCardElement.setAttribute("data-card-color", color);
  const img = createCarCardImg(color);
  const imgContainer = colorCardElement.querySelector(".build-img-container");
  imgContainer.append(img);
  imgContainer.classList.remove("card-placeholder");
};

const showPossibleCardsToBuild = (
  { routeLength, routeColor },
  handCarCards,
) => {
  if (routeColor === "transparent") return;
  const carCardCountInPlayerHand = handCarCards[routeColor];
  const playerHandCard = document.querySelector(
    `.hand-car-cards #${routeColor}`,
  );
  const countContainer = playerHandCard.querySelector(".card-count");
  enableBuildButton();
  if (carCardCountInPlayerHand >= routeLength) {
    countContainer.textContent = parseInt(countContainer.textContent) -
      routeLength;
    appendCarCardImgInCart(routeColor, routeLength);
    disableCardsExcept(routeColor);
    return;
  }

  if (carCardCountInPlayerHand > 0) {
    countContainer.textContent = 0;
    appendCarCardImgInCart(routeColor, carCardCountInPlayerHand);

    const wildCountContainer = document.querySelector(
      `.hand-car-cards #wild .card-count`,
    );
    const wildCardsRequired = routeLength - carCardCountInPlayerHand;
    wildCountContainer.textContent = wildCountContainer.textContent -
      wildCardsRequired;
    appendCarCardImgInCart("wild", wildCardsRequired);
  }

  disableCardsExcept(routeColor);
};

const disableCardsExcept = (color) => {
  const container = document.querySelector(".hand-car-cards");
  Object.entries(container.children).forEach(([_, card]) => {
    if (card.id !== color && card.id !== "wild") {
      card.classList.add("click-disabled");
    }
  });
};

const enableCards = () => {
  const container = document.querySelector(".hand-car-cards");
  Object.entries(container.children).forEach(([_, card]) => {
    card.classList.remove("click-disabled");
  });
};

const addToCart = ({ routeLength }) => {
  const cardsContainer = document.querySelector(".hand-car-cards");

  cardsContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".img-container");
    if (card === null) return;

    const container = document.querySelector(".possible-cards #color-card");
    const colorCardChosen = container.dataset.cardColor || card.dataset.color;
    if (colorCardChosen !== "wild") {
      disableCardsExcept(colorCardChosen, cardsContainer);
    }

    const countContainer = card.parentElement.querySelector(".card-count");
    if (countContainer.textContent === "1") {
      cardsContainer.removeChild(card.parentElement);
    }

    countContainer.textContent = parseInt(countContainer.textContent) - 1;
    const color = card.parentElement.id;
    appendCarCardImgInCart(color, 1);
    const totalCardsInCart = calculateTotalCardsInCart();

    if (totalCardsInCart >= routeLength) enableBuildButton();
  });
};

const moveCardToPlayerHand = (card) => {
  const color = card.parentElement.dataset.cardColor;
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

const removeCardImgFromCart = (card, countContainer) => {
  card.innerHTML = "";
  card.classList.add("card-placeholder");
  countContainer.textContent = "";
  moveCardToPlayerHand(card);
  const cardType = card.parentElement.dataset.cardColor;
  card.parentElement.removeAttribute("data-card-color");
  if (cardType !== "wild") enableCards();
};

const removeFromCart = ({ routeLength }) => {
  const possibleCardContainer = document.querySelector(".possible-cards");

  possibleCardContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".build-img-container");

    if (card === null || !card.innerHTML.trim()) return;

    const countContainer = card.parentElement.querySelector(".card-count");
    if (countContainer.textContent === "1") {
      removeCardImgFromCart(card, countContainer);
      return;
    }

    countContainer.textContent = parseInt(countContainer.textContent) - 1;
    moveCardToPlayerHand(card);

    if (calculateTotalCardsInCart() < routeLength) disableBuildButton();
  });
};

const resolveBuild = (handCarCards) => {
  disableBuildActions();
  expandPlayerHand();
  displayDestTicketDeck();
  drawTicketChoice();
  document.querySelector(".hand-car-cards").remove();
  displayCarCards(handCarCards);
};

const buildRoute = async (routeId) => {
  const colorCardElement = document.querySelector(
    ".possible-cards #color-card",
  );
  const wildCardCount = parseInt(
    document.querySelector(
      ".possible-cards #wild-card .card-count",
    ).textContent || 0,
  );

  const colorCardUsed = colorCardElement.getAttribute("data-card-color");
  const colorCardCount = parseInt(
    colorCardElement.querySelector(".card-count").textContent || 0,
  );
  const { routeOwnership, carCards } = await postClaimRoute({
    routeId,
    cardsUsed: { colorCardUsed, colorCardCount, wildCardCount },
  });
  renderMap(routeOwnership);
  resolveBuild(carCards);

  const body = { msg: `Route claimed successfully` };
  const log = await fetchLog(body);
  displayLog(log);
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
    return Object.entries(handCarCards).some(([_, count]) =>
      count + wildCardCount >= routeLength
    );
  }

  return (handCarCards[routeColor] + wildCardCount) >= routeLength;
};

const claimRoute = async (event, routesData, map) => {
  const route = event.target.closest(".route");
  if (route === null) return;

  const handCarCards = await fetchPlayerHand();
  const routeId = route.getAttribute("id");
  const routeData = routesData[routeId];
  if (!isBuildPossible(routeData, structuredClone(handCarCards))) return;

  map.classList.add("click-disabled");
  enableBuildActions(routeId);
  squeezePlayerHand();
  await showPossibleCardsToBuild(routeData, handCarCards);
  addToCart(routeData);
  removeFromCart(routeData);
  buildActionsOnClick(routeId, handCarCards);
};

export const mapOnClick = (routesData) => {
  const map = document.querySelector("#map");
  map.addEventListener("click", (event) => {
    claimRoute(event, routesData, map);
  });
};
