import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { CarCardsDeck } from "../../src/models/train_car_card_deck.js";
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

  it("when game is just setted up, request of/get-game-phase [GET] should give the game phase as STARTED", async () => {
    const response = await app.request("/get-game-phase");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      gamePhase: "STARTED",
    });
  });

  it("when game is started, request of/get-game-phase [GET] should give the game phase as INITIALIZED", async () => {
    await app.request("/initial-hand");
    const response = await app.request("/get-game-phase");

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      gamePhase: "INITIALIZED",
    });
  });
});
