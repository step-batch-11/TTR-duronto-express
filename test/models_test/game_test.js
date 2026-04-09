import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";
import TicketDeck from "../../src/models/ticket_deck.js";
import Player from "../../src/models/player.js";
import Game from "../../src/models/game.js";

describe("testing the game", () => {
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
      "pink",
      "blue",
    ];

    const ticketCards = [
      { id: "DLT-ELP", src: "Duluth", dest: "El Paso", points: 10 },
      { id: "TRT-MIM", src: "Toronto", dest: "Miami", points: 10 },
      { id: "PLD-PHX", src: "Portland", dest: "Phoenix", points: 11 },
      { id: "DLS-NYC", src: "Dallas", dest: "New York", points: 11 },
      { id: "CLC-SLC", src: "Calgary", dest: "Salt Lake City", points: 7 },
      { id: "LAS-NYC", src: "Los Angeles", dest: "New York", points: 21 },
      { id: "DLT-HTN", src: "Duluth", dest: "Houston", points: 8 },
      { id: "SSM-NVL", src: "Sault St. Marie", dest: "Nashville", points: 8 },
      { id: "NYC-ATL", src: "New York", dest: "Atlanta", points: 6 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    const player = new Player("bhanu", 1000, 0);
    game = new Game(carCardsDeck, ticketDeck, [player]);
  });

  it("drawFaceUpCard should add the card from train car card face up to player hand", () => {
    game.drawFaceUpCard("1");
    assertEquals(game.playerHand(1000), {
      carCards: {
        blue: 2,
        black: 1,
        pink: 1,
        wild: 1,
      },
      claimedTickets: [],
      bogies: 45,
    });
  });

  it("draw deckCard should add the card from train car card deck to player hand", () => {
    game.drawDeckCard();
    assertEquals(game.playerHand(1000), {
      carCards: {
        blue: 1,
        green: 1,
        pink: 1,
        wild: 1,
        black: 1,
      },
      claimedTickets: [],
      bogies: 45,
    });
  });

  it("open face up deck of train car card", () => {
    assertEquals(game.getFaceUpCards(), [
      "blue",
      "pink",
      "white",
      "yellow",
      "orange",
    ]);
  });

  it("claimRoute should add the route to player claimed routes and remove the cards used to claim the route", () => {
    assertEquals(game.playerHand(1000).carCards.pink, 1);
    game.claimRoute("STN4-STN5", { colorCardUsed: "pink", colorCardCount: 1 }, {
      routeColor: "transparent",
      routeLength: 3,
    });
    assertEquals(game.getAllClaimedRoutes(), {
      green: [{
        routeId: "STN4-STN5",
        routeData: { routeColor: "transparent", routeLength: 3 },
      }],
    });
    assertEquals(game.playerHand(1000).carCards.pink);
  });

  it("claimTicketCard should add the selected tickets to the player's hand of destination tickets and discard the unselected cards", () => {
    const drawnTickets = game.drawTicketChoice();
    const selectedTickets = ["DLS-NYC"];

    assertEquals(drawnTickets, [
      "DLS-NYC",
      "CLC-SLC",
      "LAS-NYC",
    ]);

    assertEquals(game.claimTicketCard(selectedTickets, 1000), [
      "DLS-NYC",
    ]);

    assertEquals(game.getTicketCards(), [
      "DLT-HTN",
      "SSM-NVL",
      "NYC-ATL",
      "DLT-ELP",
      "TRT-MIM",
      "PLD-PHX",
    ]);
  });
});

describe("validate draw tain car cards for multi-players", () => {
  let game;
  beforeEach(() => {
    const carCards = [
      "red",
      "green",
      "orange",
      "pink",
      "white",
      "yellow",
      "wild",
      "black",
      "wild",
      "pink",
      "blue",
    ];

    const ticketCards = [
      { id: "DLT-ELP", src: "Duluth", dest: "El Paso", points: 10 },
      { id: "TRT-MIM", src: "Toronto", dest: "Miami", points: 10 },
      { id: "PLD-PHX", src: "Portland", dest: "Phoenix", points: 11 },
      { id: "DLS-NYC", src: "Dallas", dest: "New York", points: 11 },
      { id: "CLC-SLC", src: "Calgary", dest: "Salt Lake City", points: 7 },
      { id: "LAS-NYC", src: "Los Angeles", dest: "New York", points: 21 },
      { id: "DLT-HTN", src: "Duluth", dest: "Houston", points: 8 },
      { id: "SSM-NVL", src: "Sault St. Marie", dest: "Nashville", points: 8 },
      { id: "NYC-ATL", src: "New York", dest: "Atlanta", points: 6 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    const players = ["green"].map((color) => new Player("bhanu", color));
    game = new Game(carCardsDeck, ticketDeck, players);
  });

  it("should allow the user to draw only 2 cards, initial round, drawing from deck and move to next player", async () => {
    assertEquals(game.getGamePhase(), "INITIALIZED");

    game.drawFaceUpCard("1");
    assertEquals(game.getGamePhase(), "CARD_DRAWN");
    game.drawFaceUpCard("2");
    await new Promise((resolve) => setTimeout(resolve, 1600));
    assertEquals(game.playerHand("green"), {
      carCards: {
        blue: 1,
        orange: 1,
        pink: 2,
        black: 1,
        wild: 1,
      },
      claimedTickets: [],
      bogies: 45,
    });
    assertEquals(game.getGamePhase(), "TURN_STARTED");
  });

  it("turn should end if user takes a wild card in the initial round", async () => {
    assertEquals(game.getGamePhase(), "INITIALIZED");

    game.drawFaceUpCard("5");
    await new Promise((resolve) => setTimeout(resolve, 1600));

    assertEquals(game.getGamePhase(), "TURN_STARTED");

    assertEquals(game.playerHand("green"), {
      carCards: {
        blue: 1,
        black: 1,
        pink: 1,
        wild: 2,
      },
      claimedTickets: [],
      bogies: 45,
    });
  });

  it("should calculate the players score", () => {
    game.claimRoute("CLC-VCR", {}, {
      "routeColor": "transparent",
      "routeLength": 3,
    });
    game.claimRoute("STL-VCR", {}, {
      "routeColor": "transparent",
      "routeLength": 1,
    });
    game.claimRoute("CLC-STL", {}, {
      "routeColor": "transparent",
      "routeLength": 4,
    });

    assertEquals(game.calculateScore(), {
      scores: [
        {
          isLongest: true,
          name: "bhanu",
          routeScore: 12,
          ticketScore: 0,
          total: 22,
        },
      ],
      winner: "bhanu",
    });
  });
});

describe("Test the exit player feature", () => {
  let game, players;
  beforeEach(() => {
    const carCards = [
      "red",
      "green",
      "orange",
      "pink",
      "white",
      "yellow",
      "wild",
      "black",
      "wild",
      "pink",
      "blue",
    ];

    const ticketCards = [
      { id: "DLT-ELP", src: "Duluth", dest: "El Paso", points: 10 },
      { id: "TRT-MIM", src: "Toronto", dest: "Miami", points: 10 },
      { id: "PLD-PHX", src: "Portland", dest: "Phoenix", points: 11 },
      { id: "DLS-NYC", src: "Dallas", dest: "New York", points: 11 },
      { id: "CLC-SLC", src: "Calgary", dest: "Salt Lake City", points: 7 },
      { id: "LAS-NYC", src: "Los Angeles", dest: "New York", points: 21 },
      { id: "DLT-HTN", src: "Duluth", dest: "Houston", points: 8 },
      { id: "SSM-NVL", src: "Sault St. Marie", dest: "Nashville", points: 8 },
      { id: "NYC-ATL", src: "New York", dest: "Atlanta", points: 6 },
    ];

    const carCardsDeck = new CarCardsDeck(carCards);
    const ticketDeck = new TicketDeck(ticketCards);
    players = ["green", "red"].map((color) => new Player("bhanu", color));
    game = new Game(carCardsDeck, ticketDeck, players);
    game.initializePlayerHand();
  });

  it("removes the player from the players list and returns the deleted player", async () => {
    assertEquals(game.getGamePhase(), "INITIALIZED");

    const res = game.removeExitedPlayer("green");
    await new Promise((resolve) => setTimeout(resolve, 1600));
    assertEquals(game.getGamePhase(), "INITIALIZED");

    assertEquals(players.length, 1);
  });
});
