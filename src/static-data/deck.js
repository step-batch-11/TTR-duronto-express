import { shuffle } from "@std/random";

export const initDeck = () => {
  const colors = [
    { color: "red", length: 12 },
    { color: "green", length: 12 },
    { color: "blue", length: 12 },
    { color: "pink", length: 12 },
    { color: "white", length: 12 },
    { color: "yellow", length: 12 },
    { color: "orange", length: 12 },
    { color: "black", length: 12 },
    { color: "wild", length: 14 },
  ];
  const deck = colors.flatMap(({ color, length }) =>
    Array.from({ length }, () => color)
  );
  const shuffledDeck = shuffle(deck);

  return shuffledDeck;
};
