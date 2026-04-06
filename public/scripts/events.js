import { fetchPlayerHand, fetchTicketChoices, postClaimRoute } from "./api.js";
import {
  handleHighlightCities,
  handleTicketsClaim,
  handleTicketSelection,
  handleTicketSwipe,
  handleUnHighlightCities,
} from "./event_handlers/tickets_handlers.js";
import {
  handleDrawCardFromDeck,
  handleDrawFaceUp,
} from "./event_handlers/draw_deck_card_handler.js";
import {
  displayDestTicketDeck,
  displayTicketChoices,
  renderMap,
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

const showPossibleCardsToBuild = async ({ routeLength, routeColor }) => {
  const handCarCards = await fetchPlayerHand();
  const carCardCountInPlayerHand = handCarCards[routeColor];
  if (carCardCountInPlayerHand >= routeLength) {
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

const claimRoute = async (event, routesData) => {
  const route = event.target.closest(".route");
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

export const drawDeckCard = () => {
  const deck = document.querySelector(".deck");
  deck.addEventListener("click", () => handleDrawCardFromDeck(deck));
};

export const drawFaceUpCard = () => {
  const market = document.querySelector(".faceup-cards");
  market.addEventListener("click", handleDrawFaceUp);
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

  ticketCards.addEventListener(
    "mouseover",
    (event) => handleHighlightCities(event, "card"),
  );

  ticketCards.addEventListener(
    "mouseout",
    (event) => handleUnHighlightCities(event, "card"),
  );
};

export const claimTicketChoices = () => {
  const submitButton = document.querySelector("#ticket-claim-button");
  submitButton.addEventListener("click", handleTicketsClaim);
};

export const swipeTickets = () => {
  const buttonContainer = document.querySelector(".buttons-container");
  buttonContainer.addEventListener("click", handleTicketSwipe);
};

export const accessTicket = () => {
  const tickets = document.querySelector(".container");
  tickets.addEventListener(
    "mouseover",
    (event) => handleHighlightCities(event, "ticket"),
  );
  tickets.addEventListener(
    "mouseout",
    (event) => handleUnHighlightCities(event, "ticket"),
  );
};
