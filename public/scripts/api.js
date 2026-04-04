export const fetchMap = () => {
  const mapContainer = document.querySelector("#map");
  return fetch("/assets/map.svg")
    .then((res) => res.text())
    .then((data) => {
      const parser = new DOMParser();
      const map = parser.parseFromString(data, "image/svg+xml").documentElement;
      mapContainer.appendChild(map);
    });
};

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

export const fetchInitialPlayerHand = () => get("/initial-hand");

export const fetchFaceUpDeck = (body) => post("/draw-faceup-card", body);

export const fetchDeckCards = () => get("/draw-deck-card");

export const fetchTicketChoices = () => get("/get-ticket-choices");

export const claimSelectedTickets = (tickets) =>
  post("/claim-tickets", tickets);

export const postClaimRoute = async (body) => {
  const response = await fetch("/claim-route", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (response.redirected) {
    globalThis.location.href = response.url;
    return;
  }

  return await response.json();
};

export const fetchRouteOwnership = () => get("/map-ownership");

export const fetchPlayerHand = () => get("/car-cards");

export const fetchLog = (body) => post("/fetch-log", body);

export const fetchRoutesData = () => get("/routes-data");

export const fetchPhase = () => get("/get-game-phase");

export const fetchClaimedTickets = () => get("/claimed-tickets");
