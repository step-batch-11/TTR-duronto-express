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

export const fetchInitialFaceUp = async () => {
  const res = await fetch("/init-faceup");
  const faceUpCards = await res.json();

  return faceUpCards;
};

export const fetchPlayerHand = async () => {
  return await fetch("/initial-hand").then((resp) => resp.json());
};

export const fetchFaceUpDeck = async (body) => {
  return await fetch("/draw-faceup-card", {
    method: "post",
    body: JSON.stringify(body),
  }).then((resp) => resp.json());
};

export const fetchDeckCards = async () => {
  return await fetch("/draw-deck-card").then((resp) => resp.json());
};
