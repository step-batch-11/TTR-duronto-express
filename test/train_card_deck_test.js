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

    assertEquals(trainCardDeck.getFaceDownCards(), deck);
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

    assertEquals(trainCardDeck.dealInitialCards(), [
      "white",
      "blue",
      "green",
      "orange",
    ]);
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

    assertEquals(trainCardDeck.getFaceUpCards(), [
      "green",
      "white",
      "blue",
      "green",
      "orange",
    ]);
    assertEquals(trainCardDeck.getFaceDownCards(), ["white", "orange", "blue"]);
  });

  it("draw one card from faceup with index 1", () => {
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
    assertEquals(trainCardDeck.getFaceUpCards(), [
      "green",
      "white",
      "blue",
      "green",
      "orange",
    ]);
    assertEquals(trainCardDeck.getFaceDownCards(), ["white", "orange", "blue"]);
    assertEquals(trainCardDeck.drawCardFromFaceUp("2"), {
      drawnCard: "white",
      drawnCardFromDeck: "blue",
    });
    assertEquals(trainCardDeck.getFaceUpCards(), [
      "green",
      "blue",
      "blue",
      "green",
      "orange",
    ]);
  });

  it("reopen faceup card when there are more than or equal to 3 wild cards ", () => {
    const deck = [
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
    ];

    const trainCardDeck = new CarCardsDeck(deck);
    trainCardDeck.initFaceUp();

    assertEquals(trainCardDeck.getFaceUpCards(), [
      "white",
      "blue",
      "blue",
      "green",
      "white",
    ]);
    assertEquals(trainCardDeck.getFaceDownCards(), ["blue", "green", "orange"]);
  });

  it("draw one card from faceup [check: the faceup wild >= 3]", () => {
    const deck = [
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
    ];

    const trainCardDeck = new CarCardsDeck(deck);
    trainCardDeck.initFaceUp();
    assertEquals(trainCardDeck.getFaceUpCards(), [
      "white",
      "orange",
      "green",
      "wild",
      "wild",
    ]);
    assertEquals(trainCardDeck.getFaceDownCards(), [
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
    ]);
    assertEquals(trainCardDeck.drawCardFromFaceUp("2"), {
      drawnCard: "orange",
      drawnCardFromDeck: "wild",
    });
    assertEquals(trainCardDeck.getFaceUpCards(), [
      "white",
      "blue",
      "blue",
      "green",
      "white",
    ]);
  });

  it("draw one card from deck", () => {
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
    assertEquals(trainCardDeck.getFaceUpCards(), [
      "green",
      "white",
      "blue",
      "green",
      "orange",
    ]);
    assertEquals(trainCardDeck.getFaceDownCards(), ["white", "orange", "blue"]);
    assertEquals(trainCardDeck.drawCardFromDeck(), "blue");
  });
});
