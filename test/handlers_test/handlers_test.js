import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";
import TicketDeck from "../../src/models/ticket_deck.js";
import Player from "../../src/models/player.js";
import Game from "../../src/models/game.js";
import { createApp } from "../../src/app.js";

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
      { id: "DVR-ELP", src: "Denver", dest: "El Paso", points: 4 },
      { id: "HLN-LAS", src: "Helena", dest: "Los Angeles", points: 8 },
      { id: "WPG-HTN", src: "Winnipeg", dest: "Houston", points: 12 },
      { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
      {
        id: "SSM-OKC",
        src: "Sault St. Marie",
        dest: "Oklahoma City",
        points: 9,
      },
      { id: "STL-NYC", src: "Seattle", dest: "New York", points: 22 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    const player = new Player();

    game = new Game(carCardsDeck, ticketDeck, player);
    app = createApp(game);
  });

  it("/initial-hand GET should give the player's initial hand with 4 car cards, 3 drawn tickets", async () => {
    const response = await app.request("/initial-hand");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      carCards: {
        black: 1,
        orange: 1,
        wild: 1,
        yellow: 1,
      },
      ticketChoices: ["MTL-NOL", "SSM-OKC", "STL-NYC"],
      claimedTickets: [],
    });
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
      { id: "DVR-ELP", src: "Denver", dest: "El Paso", points: 4 },
      { id: "HLN-LAS", src: "Helena", dest: "Los Angeles", points: 8 },
      { id: "WPG-HTN", src: "Winnipeg", dest: "Houston", points: 12 },
      { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
      {
        id: "SSM-OKC",
        src: "Sault St. Marie",
        dest: "Oklahoma City",
        points: 9,
      },
      { id: "STL-NYC", src: "Seattle", dest: "New York", points: 22 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    const player = new Player();
    const game = new Game(carCardsDeck, ticketDeck, player);

    game.initializePlayerHand();
    app = createApp(game);
  });

  it("testing /draw-deck-card GET", async () => {
    const response = await app.request("/draw-deck-card");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      carCards: {
        blue: 2,
        green: 1,
        pink: 1,
        white: 1,
      },
      drawnCard: "pink",
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
      cardToRefill: "pink",
      carCards: {
        blue: 2,
        green: 1,
        white: 2,
      },
      faceUpCards: ["pink", "yellow", "orange", "black", "wild"],
    });
  });
});

describe("testing /get-ticket-choices GET", () => {
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
      { id: "CHG-SFE", src: "Chicago", dest: "Santa Fe", points: 9 },
      { id: "VCR-SFE", src: "Vancouver", dest: "Santa Fe", points: 13 },
      { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
      {
        id: "SSM-OKC",
        src: "Sault St. Marie",
        dest: "Oklahoma City",
        points: 9,
      },
      { id: "STL-NYC", src: "Seattle", dest: "New York", points: 22 },
      { id: "DVR-ELP", src: "Denver", dest: "El Paso", points: 4 },
      { id: "HLN-LAS", src: "Helena", dest: "Los Angeles", points: 8 },
      { id: "WPG-HTN", src: "Winnipeg", dest: "Houston", points: 12 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    const player = new Player();
    const game = new Game(carCardsDeck, ticketDeck, player);

    game.initializePlayerHand();
    app = createApp(game);
  });

  it("after sending request to /get-ticket-choices it should return ticket cards choices as id", async () => {
    const res = await app.request("/get-ticket-choices");

    assertEquals(await res.status, 200);
    assertEquals(await res.json(), ["MTL-NOL", "SSM-OKC", "STL-NYC"]);
  });
});

describe("testing /claim-tickets POST", () => {
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
      { id: "CHG-SFE", src: "Chicago", dest: "Santa Fe", points: 9 },
      { id: "VCR-SFE", src: "Vancouver", dest: "Santa Fe", points: 13 },
      { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
      {
        id: "SSM-OKC",
        src: "Sault St. Marie",
        dest: "Oklahoma City",
        points: 9,
      },
      { id: "STL-NYC", src: "Seattle", dest: "New York", points: 22 },
      { id: "DVR-ELP", src: "Denver", dest: "El Paso", points: 4 },
      { id: "HLN-LAS", src: "Helena", dest: "Los Angeles", points: 8 },
      { id: "WPG-HTN", src: "Winnipeg", dest: "Houston", points: 12 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    const player = new Player();
    const game = new Game(carCardsDeck, ticketDeck, player);

    game.initializePlayerHand();
    app = createApp(game);
  });

  it("after sending request to /claim-tickets it should return ticket cards of player hands after claiming", async () => {
    await app.request("/get-ticket-choices");
    const selectedTickets = ["HLN-LAS", "DVR-ELP"];
    const res = await app.request("/claim-tickets", {
      method: "post",
      body: JSON.stringify(selectedTickets),
    });

    assertEquals(await res.status, 200);
    assertEquals(await res.json(), [
      "HLN-LAS",
      "DVR-ELP",
    ]);
  });

  it("/car-cards GET should return the car cards in player hand", async () => {
    const res = await app.request("/car-cards");

    assertEquals(await res.status, 200);
    assertEquals(await res.json(), { blue: 2, green: 1, white: 1 });
  });

  // it("/store-log POST should return the last log of the game actions", async () => {
  //   const res = await app.request("/fetch-log", {
  //     method: "post",
  //     body: JSON.stringify({ msg: "draws card from the faceup" }),
  //   });
  //   const log = await res.json();
  //   assertEquals(log, ["draws card from the faceup"]);
  // });
});
