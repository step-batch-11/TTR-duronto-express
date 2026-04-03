import { fetchPlayerHand, postClaimRoute } from "./api.js";
import { addHandCardContainer, drawTicketChoice } from "./events.js";
import { displayDestTicketDeck, renderMap } from "./render.js";
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
  const carCardCountInPlayerHand = handCarCards[routeColor];
  const playerHandCard = document.querySelector(
    `.hand-car-cards #${routeColor}`,
  );
  const countContainer = playerHandCard.querySelector(".card-count");

  if (carCardCountInPlayerHand >= routeLength) {
    countContainer.textContent = parseInt(countContainer.textContent) -
      routeLength;
    appendCarCardImgInCart(routeColor, routeLength);
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

const addToCart = () => {
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

const removeFromCart = () => {
  const possibleCardContainer = document.querySelector(".possible-cards");

  possibleCardContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".build-img-container");
    if (card === null) return;

    const countContainer = card.parentElement.querySelector(".card-count");
    if (countContainer.textContent === "1") {
      removeCardImgFromCart(card, countContainer);
      return;
    }

    countContainer.textContent = parseInt(countContainer.textContent) - 1;
    moveCardToPlayerHand(card);
  });
};

export const buildRoute = (routeId) => {
  const buildButton = document.querySelector(".build-actions #build");

  buildButton.addEventListener("click", async () => {
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

const isBuildPossible = ({ routeLength, routeColor }, handCarCards) => {
  const wildCardCount = handCarCards["wild"];
  delete handCarCards.wild;
  if (routeColor === "transparent") {
    return Object.entries(handCarCards).some(([_, count]) =>
      count + wildCardCount >= routeLength
    );
  }

  return (handCarCards[routeColor] + wildCardCount) >= routeLength;
};

const claimRoute = async (event, routesData) => {
  const route = event.target.closest(".route");
  if (route === null) return;

  const handCarCards = await fetchPlayerHand();
  const routeId = route.getAttribute("id");
  const routeData = routesData[routeId];
  if (!isBuildPossible(routeData, handCarCards)) return;

  enableBuildActions(routeId);
  squeezePlayerHand();
  await showPossibleCardsToBuild(routeData, handCarCards);
  addToCart();
  removeFromCart();
  buildRoute(routeId);
};

export const mapOnClick = (routesData) => {
  const map = document.querySelector("#map");
  map.addEventListener("click", (event) => {
    claimRoute(event, routesData);
  });
};
