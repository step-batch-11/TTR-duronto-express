import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";
import TicketDeck from "../../src/models/ticket_deck.js";
import Player from "../../src/models/player.js";
import Game from "../../src/models/game.js";
import { createApp } from "../../src/app.js";

describe("testing map handlers", () => {
  let carCardsDeck;
  let ticketDeck;
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

    carCardsDeck = new CarCardsDeck(carCards);
    ticketDeck = new TicketDeck(ticketCards);
  });

  it("POST /claim-route should add the route to player claimed routes and should return car cards in player hand", async () => {
    const player = new Player();
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    const game = new Game(carCardsDeck, ticketDeck, player);

    const mockApp = createApp(game);
    const body = JSON.stringify({
      routeId: "STN1-STN2",
      cardsUsed: { colorCardUsed: "red", colorCardCount: 2, wildCardCount: 0 },
    });

    const response = await mockApp.request("/claim-route", {
      method: "post",
      body,
    });
    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      carCards: {
        red: 1,
      },
      routeOwnership: { green: ["STN1-STN2"] },
    });
  });

  it("after sending request to /claim-route if last turn is going on it should end the game if last player played the turn", async () => {
    let res;
    const player = new Player();
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    const game = new Game(carCardsDeck, ticketDeck, player);

    player.playerBogies = 5;
    const app = createApp(game);

    res = await app.request("/claim-route", {
      method: "post",
      body: JSON.stringify({
        routeId: "SLC-DVR",
        cardsUsed: {
          colorCardUsed: "red",
          colorCardCount: 3,
          wildCardCount: 0,
        },
      }),
    });

    assertEquals(await res.status, 200);

    res = await app.request("/claim-route", {
      method: "post",
      body: JSON.stringify({
        routeId: "DLT-CHG",
        cardsUsed: {
          colorCardUsed: "red",
          colorCardCount: 3,
          wildCardCount: 0,
        },
      }),
    });

    assertEquals(await res.status, 303);
  });
});
