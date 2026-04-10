import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";
import TicketDeck from "../../src/models/ticket_deck.js";
import Player from "../../src/models/player.js";
import Game from "../../src/models/game.js";
import { createApp } from "../../src/app.js";
import PlayerBase from "../../src/models/player_base.js";
import RoomManager from "../../src/models/room_manager.js";
import { createGenerateFn, createRoomFn } from "../../src/utils/factory.js";

describe("End game test case for multiplayer game state other actions", () => {
  let carCardsDeck;
  let ticketDeck;
  let mockApp;
  let players;
  let res;
  let body;
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

    players = new PlayerBase([{ sessionId: 1001, username: "haji" }, {
      sessionId: 1002,
      username: "ram",
    }]);

    const createGame = () => {
      const haji = new Player("haji", 1001, 0);
      const ram = new Player("ram", 1002, 1);

      haji.addCarCardToHand("red");
      haji.addCarCardToHand("red");
      haji.addCarCardToHand("red");
      haji.addCarCardToHand("red");
      haji.addCarCardToHand("red");
      haji.playerBogies = 5;

      ram.addCarCardToHand("blue");
      ram.addCarCardToHand("blue");
      ram.addCarCardToHand("blue");
      ram.addCarCardToHand("blue");

      return new Game(carCardsDeck, ticketDeck, [haji, ram]);
    };

    const roomManager = new RoomManager(
      createRoomFn,
      createGenerateFn(),
      createGame,
    );

    const sessionToRoomMap = new Map();

    const room = roomManager.createRoom(2, {
      sessionId: 1001,
      username: "haji",
    });
    sessionToRoomMap.set(1001, room);

    roomManager.joinRoom(1000, { sessionId: 1002, username: "ram" });
    sessionToRoomMap.set(1002, room);

    mockApp = createApp(roomManager, players, sessionToRoomMap);
  });

  it("draw train car cards from deck as a last player", async () => {
    body = {
      routeId: "CLC-VCR",
      cardsUsed: { colorCardUsed: "red", colorCardCount: 3, wildCardCount: 0 },
    };

    res = await mockApp.request("/game/claim-route", {
      method: "post",
      headers: {
        Cookie: "sessionId=1001",
      },
      body: JSON.stringify(body),
    });

    assertEquals(await res.status, 200);

    res = await mockApp.request("/game/draw-deck-card", {
      method: "get",
      headers: {
        Cookie: "sessionId=1002",
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 1600));

    assertEquals(await res.status, 200);

    res = await mockApp.request("/game/draw-deck-card", {
      method: "get",
      headers: {
        Cookie: "sessionId=1001",
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 1600));
    assertEquals(await res.status, 200);
  });
});
