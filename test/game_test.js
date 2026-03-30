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
    game.initializePlayerHand();
  });

  it("initPlayer should initialize the player ", () => {
    assertEquals(game.playerHand(), {
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

  it("drawFaceUpCard should add the card from train car card face up", () => {
    game.drawFaceUpCard("1");
    assertEquals(game.playerHand(), {
      carCards: {
        blue: 1,
        green: 1,
        pink: 1,
        red: 1,
        white: 1,
      },
      ticketChoices: ["t3", "t4", "t5"],
      bogies: 45,
    });
  });
});
