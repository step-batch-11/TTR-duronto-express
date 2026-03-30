import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { CarCardsDeck } from "../src/train_car_card_deck.js";

describe("train car card deck", () => {
  it("initialize", () => {
    const deck = [
      "white",
      "orange",
      "blue",
      "green",
      "white",
      "blue",
      "green",
      "orange",
    ];
    const trainCardDeck = new CarCardsDeck(deck);

    assertEquals(trainCardDeck.faceDown, deck);
  });

  it("deal 4 cards initially ", () => {
    const deck = [
      "white",
      "orange",
      "blue",
      "green",
      "white",
      "blue",
      "green",
      "orange",
    ];
    const trainCardDeck = new CarCardsDeck(deck);

    assertEquals(trainCardDeck.dealCards(), [
      "white",
      "orange",
      "blue",
      "green",
    ]);
    assertEquals(trainCardDeck.faceDown, ["white", "blue", "green", "orange"]);
  });

  it("open face up cards deck", () => {
    const deck = [
      "white",
      "orange",
      "blue",
      "green",
      "white",
      "blue",
      "green",
      "orange",
    ];

    const trainCardDeck = new CarCardsDeck(deck);
    trainCardDeck.initFaceUp();

    assertEquals(trainCardDeck.faceUp, [
      "white",
      "orange",
      "blue",
      "green",
      "white",
    ]);
    assertEquals(trainCardDeck.faceDown, ["blue", "green", "orange"]);
  });

  it("draw one card from faceup", () => {
    const deck = [
      "white",
      "orange",
      "blue",
      "green",
      "white",
      "blue",
      "green",
      "orange",
    ];

    const trainCardDeck = new CarCardsDeck(deck);
    trainCardDeck.initFaceUp();
    assertEquals(trainCardDeck.faceUp, [
      "white",
      "orange",
      "blue",
      "green",
      "white",
    ]);
    assertEquals(trainCardDeck.faceDown, ["blue", "green", "orange"]);
    assertEquals(trainCardDeck.drawCardFromFaceUp("1"), "orange");
    assertEquals(trainCardDeck.faceDown, ["green", "orange"]);
    assertEquals(trainCardDeck.faceUp, [
      "white",
      "blue",
      "blue",
      "green",
      "white",
    ]);
  });
});
