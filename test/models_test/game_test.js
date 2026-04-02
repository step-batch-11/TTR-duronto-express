import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { CarCardsDeck } from "../../src/models/train_car_card_deck.js";
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
    const player = new Player();

    game = new Game(carCardsDeck, ticketDeck, player);
    game.initializePlayerHand();
  });

  it("initPlayer should initialize the player ", () => {
    assertEquals(game.playerHand(), {
      carCards: {
        blue: 1,
        black: 1,
        pink: 1,
        wild: 1,
      },
      ticketChoices: ["DLT-HTN", "SSM-NVL", "NYC-ATL"],
      bogies: 45,
    });
    assertEquals(game.getTicketCards(), [
      "DLT-ELP",
      "TRT-MIM",
      "PLD-PHX",
      "DLS-NYC",
      "CLC-SLC",
      "LAS-NYC",
    ]);
  });

  it("drawFaceUpCard should add the card from train car card face up to player hand", () => {
    game.drawFaceUpCard("1");
    assertEquals(game.playerHand(), {
      carCards: {
        blue: 2,
        black: 1,
        pink: 1,
        wild: 1,
      },
      ticketChoices: ["DLT-HTN", "SSM-NVL", "NYC-ATL"],
      bogies: 45,
    });
  });

  it("draw deckCard should add the card from train car card deck to player hand", () => {
    game.drawDeckCard();
    assertEquals(game.playerHand(), {
      carCards: {
        blue: 1,
        green: 1,
        pink: 1,
        wild: 1,
        black: 1,
      },
      ticketChoices: ["DLT-HTN", "SSM-NVL", "NYC-ATL"],
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

  it("claimRoute should add the route to player claimed routes", () => {
    game.claimRoute("STN4-STN5");

    assertEquals(game.getRouteOwnershipMap(), { green: ["STN4-STN5"] });
  });

  it("claimRoute should add the route to player claimed routes", () => {
    game.claimRoute("STN4-STN5");

    assertEquals(game.getRouteOwnershipMap(), { green: ["STN4-STN5"] });
  });

  it("claimTicketCard should add the selected tickets to the player's hand of destination tickets and discard the unselected cards", () => {
    const drawnTickets = game.drawTicketChoice();
    const selectedTickets = ["DLS-NYC"];

    assertEquals(drawnTickets, [
      "DLS-NYC",
      "CLC-SLC",
      "LAS-NYC",
    ]);

    assertEquals(game.getTicketCards(), [
      "DLT-ELP",
      "TRT-MIM",
      "PLD-PHX",
    ]);

    assertEquals(game.claimTicketCard(selectedTickets), [
      "DLT-HTN",
      "SSM-NVL",
      "NYC-ATL",
      "DLS-NYC",
    ]);

    assertEquals(game.getTicketCards(), [
      "CLC-SLC",
      "LAS-NYC",
      "DLT-ELP",
      "TRT-MIM",
      "PLD-PHX",
    ]);
  });
});
