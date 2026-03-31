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

export const fetchFaceUpCards = async () => {
  const res = await fetch("/init-faceup");
  const faceUpCards = await res.json();

  return faceUpCards;
};

export const fetchPlayerHand = async () => {
  return await fetch("/initial-hand").then((resp) => resp.json());
};
