import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";

const BASE_DECK = [
  "white",
  "orange",
  "blue",
  "green",
  "white",
  "blue",
  "green",
  "orange",
];

const createDeck = (cards = BASE_DECK) => new CarCardsDeck([...cards]);

const createInitializedDeck = (cards = BASE_DECK) => {
  const deck = createDeck(cards);
  deck.initFaceUp();
  return deck;
};

describe("CarCardsDeck", () => {
  describe("constructor", () => {
    it("should store all cards as faceDown cards on initialization", () => {
      const deck = createDeck();

      assertEquals(deck.getFaceDownCards(), BASE_DECK);
    });
  });

  describe("dealInitialCards", () => {
    it("should remove and return the last 4 cards from the deck", () => {
      const deck = createDeck();

      const dealtCards = deck.dealInitialCards();

      assertEquals(dealtCards, [
        "white",
        "blue",
        "green",
        "orange",
      ]);
    });
  });

  describe("initFaceUp", () => {
    it("should move 5 cards from faceDown to faceUp", () => {
      const deck = createDeck();

      deck.initFaceUp();

      assertEquals(deck.getFaceUpCards(), [
        "green",
        "white",
        "blue",
        "green",
        "orange",
      ]);

      assertEquals(deck.getFaceDownCards(), [
        "white",
        "orange",
        "blue",
      ]);
    });

    it("should reinitialize faceUp cards if 3 or more wild cards are present", () => {
      const deck = createDeck([
        "blue",
        "green",
        "orange",
        "white",
        "blue",
        "blue",
        "green",
        "white",
        "white",
        "wild",
        "wild",
        "black",
        "wild",
      ]);

      deck.initFaceUp();

      assertEquals(deck.getFaceUpCards(), [
        "white",
        "blue",
        "blue",
        "green",
        "white",
      ]);

      assertEquals(deck.getFaceDownCards(), [
        "blue",
        "green",
        "orange",
      ]);
    });
  });

  describe("drawCardFromFaceUp", () => {
    it("should remove the selected faceUp card and replace it with a card from the deck", () => {
      const deck = createInitializedDeck();

      const result = deck.drawCardFromFaceUp("2");

      assertEquals(result, {
        drawnCard: "white",
        cardToRefill: "blue",
      });

      assertEquals(deck.getFaceUpCards(), [
        "green",
        "blue",
        "blue",
        "green",
        "orange",
      ]);
    });

    it("should reinitialize faceUp cards if drawing causes 3 or more wild cards", () => {
      const deck = createInitializedDeck([
        "green",
        "orange",
        "green",
        "orange",
        "white",
        "blue",
        "blue",
        "green",
        "white",
        "wild",
        "white",
        "orange",
        "green",
        "wild",
        "wild",
      ]);

      const result = deck.drawCardFromFaceUp("2");

      assertEquals(result, {
        drawnCard: "orange",
        cardToRefill: "wild",
      });

      assertEquals(deck.getFaceUpCards(), [
        "white",
        "blue",
        "blue",
        "green",
        "white",
      ]);
    });
  });

  describe("drawCardFromDeck", () => {
    it("should remove and return the top card from the faceDown deck", () => {
      const deck = createInitializedDeck();

      const drawnCard = deck.drawCardFromDeck();

      assertEquals(drawnCard, "blue");
      assertEquals(deck.getDiscardPile(), []);
    });

    it("should refill faceDown deck from discard pile when it has insufficient cards", () => {
      const deck = createDeck(["white", "orange", "blue"]);

      deck.discardCards(["white", "white", "white"]);

      const drawnCard = deck.drawCardFromDeck();

      assertEquals(drawnCard, "white");

      assertEquals(deck.getFaceDownCards(), [
        "white",
        "orange",
        "blue",
        "white",
        "white",
      ]);
    });
  });
});
