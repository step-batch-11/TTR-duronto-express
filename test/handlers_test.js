import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { createApp } from "../src/app.js";
import { CarCardsDeck } from "../src/train_car_card_deck.js";
import TicketDeck from "../src/ticket_deck.js";
import Game from "../src/game.js";

describe("testing /initial-hand GET", () => {
  let app;
  let game;
  beforeEach(() => {
    const carCards = [
      "red",
      "green",
      "blue",
      "pink",
      "white",
      "yellow",
      "orange",
      "black",
      "wild",
    ];

    const ticketCards = [
      { id: "t1", src: "Helena", dest: "Duluth", points: 12 },
      { id: "t2", src: "Saint Louis", dest: "St Marie", points: 6 },
      { id: "t3", src: "Chicago", dest: "New Orleans", points: 7 },
      { id: "t4", src: "Denver", dest: "El Paso", points: 4 },
      { id: "t5", src: "Winnipeg", dest: "Little Rock", points: 11 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    game = new Game(carCardsDeck, ticketDeck);
    app = createApp(game);
  });

  it("testing /initial-hand GET", async () => {
    const response = await app.request("/initial-hand");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      carCards: {
        blue: 1,
        green: 1,
        pink: 1,
        red: 1,
      },
      ticketChoices: ["t3", "t4", "t5"],
      bogies: 45,
    });
  });

  it("testing /init-faceup GET", async () => {
    game.initializePlayerHand();
    const response = await app.request("/init-faceup");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), [
      "white",
      "yellow",
      "orange",
      "black",
      "wild",
    ]);
  });
});

describe("testing /draw-deck-card GET", () => {
  let app;
  beforeEach(() => {
    const carCards = [
      "red",
      "green",
      "blue",
      "pink",
      "white",
      "yellow",
      "orange",
      "black",
      "wild",
      "blue",
      "white",
      "green",
      "blue",
    ];

    const ticketCards = [
      { id: "t1", src: "Helena", dest: "Duluth", points: 12 },
      { id: "t2", src: "Saint Louis", dest: "St Marie", points: 6 },
      { id: "t3", src: "Chicago", dest: "New Orleans", points: 7 },
      { id: "t4", src: "Denver", dest: "El Paso", points: 4 },
      { id: "t5", src: "Winnipeg", dest: "Little Rock", points: 11 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    const game = new Game(carCardsDeck, ticketDeck);
    game.initializePlayerHand();
    app = createApp(game);
  });

  it("testing /draw-deck-card GET", async () => {
    const response = await app.request("/draw-deck-card");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      "drawnCard": "blue",
      carCards: {
        blue: 2,
        green: 1,
        pink: 1,
        red: 1,
      },
    });
  });

  it("testing /draw-faceup-card POST", async () => {
    const response = await app.request("/draw-faceup-card", {
      method: "post",
      body: JSON.stringify({ id: "1" }),
      "content-type": "application/json",
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      drawnCard: "white",
      carCards: {
        blue: 1,
        green: 1,
        pink: 1,
        red: 1,
        white: 1,
      },
      faceUpCards: [
        "blue",
        "yellow",
        "orange",
        "black",
        "wild",
      ],
    });
  });
});
