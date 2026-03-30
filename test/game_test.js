import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import Game from "../src/game.js";
import TicketDeck from "../src/ticket_deck.js";
import { CarCardsDeck } from "../src/train_car_card_deck.js";

describe("testing handlers", () => {
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
  });

  it("initPlayer should initialize the player ", () => {
    game.initializePlayerHand();

    assertEquals(game.playerHand(), {
      carCards: ["red", "green", "blue", "pink"],
      ticketChoices: [
        { id: "t3", src: "Chicago", dest: "New Orleans", points: 7 },
        { id: "t4", src: "Denver", dest: "El Paso", points: 4 },
        { id: "t5", src: "Winnipeg", dest: "Little Rock", points: 11 },
      ],
      boggies: 45,
    });
  });
});
