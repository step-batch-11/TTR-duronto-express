export const fetchPlayerDetails = () => {
  return [
    {
      name: "a",
      symbol: "green",
      carCount: 45,
    },
    {
      name: "b",
      symbol: "red",
      carCount: 45,
    },
    {
      name: "v",
      symbol: "blue",
      carCount: 45,
    },
  ];
};

const get = (endpoint) => fetch(endpoint).then((resp) => resp.json());

const post = (endpoint, body) =>
  fetch(endpoint, {
    method: "post",
    body: JSON.stringify(body),
  }).then((resp) => resp.json());

export const fetchInitialFaceUp = () => get("/init-faceup");

export const fetchPlayerHand = () => get("/initial-hand");

export const fetchFaceUpDeck = (body) => post("/draw-faceup-card", body);

export const fetchDeckCards = () => get("/draw-deck-card");

export const fetchTicketChoices = () => get("/get-ticket-choices");

export const postClaimRoute = (body) => post("/claim-route", body);

export const fetchRouteOwnership = () => get("/map-ownership");
