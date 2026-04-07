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

describe("testing map handlers", () => {
  let carCardsDeck;
  let ticketDeck;
  let mockApp, players;

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
    players = new PlayerBase([{ sessionId: 1000, username: "haji" }, {
      sessionId: 1001,
      username: "hussain",
    }]);

    const createGame = () => {
      const player = new Player("bhanu", 1000, 0);
      player.addCarCardToHand("red");
      player.addCarCardToHand("red");
      player.addCarCardToHand("red");
      return new Game(carCardsDeck, ticketDeck, [player]);
    };

    const roomManager = new RoomManager(
      createRoomFn,
      createGenerateFn(),
      createGame,
    );
    const sessionToRoomMap = new Map();

    const room = roomManager.createRoom(2, {
      sessionId: 1000,
      username: "haji",
    });
    sessionToRoomMap.set(1000, room);

    roomManager.joinRoom(1000, { sessionId: 1001, username: "hussain" });
    sessionToRoomMap.set(1001, room);

    mockApp = createApp(roomManager, players, sessionToRoomMap);

    const body = JSON.stringify({
      routeId: "STN1-STN2",
      cardsUsed: { colorCardUsed: "red", colorCardCount: 2, wildCardCount: 0 },
    });

    const response = await mockApp.request("/claim-route", {
      method: "post",
      headers: {
        Cookie: `sessionId=${1000}`,
      },
      body,
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      carCards: {
        black: 1,
        orange: 1,
        red: 1,
        wild: 1,
        yellow: 1,
      },
      routeOwnership: { green: ["STN1-STN2"] },
    });
  });

  it("after sending request to /claim-route if last turn is going on it should end the game if last player played the turn", async () => {
    let res;

    players = new PlayerBase([{ sessionId: 1000, username: "haji" }, {
      sessionId: 1001,
      username: "hussain",
    }]);

    const createGame = () => {
      const player = new Player("bhanu", 1000, 0);
      player.addCarCardToHand("red");
      player.addCarCardToHand("red");
      player.addCarCardToHand("red");
      player.addCarCardToHand("red");
      player.addCarCardToHand("red");
      return new Game(carCardsDeck, ticketDeck, [player]);
    };

    const roomManager = new RoomManager(
      createRoomFn,
      createGenerateFn(),
      createGame,
    );
    const sessionToRoomMap = new Map();

    const room = roomManager.createRoom(2, {
      sessionId: 1000,
      username: "haji",
    });
    sessionToRoomMap.set(1000, room);

    roomManager.joinRoom(1000, { sessionId: 1001, username: "hussain" });
    sessionToRoomMap.set(1001, room);

    mockApp = createApp(roomManager, players, sessionToRoomMap);

    res = await mockApp.request("/claim-route", {
      method: "post",
      headers: {
        Cookie: `sessionId=${1000}`,
      },
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

    res = await mockApp.request("/claim-route", {
      method: "post",
      headers: {
        Cookie: `sessionId=${1000}`,
      },
      body: JSON.stringify({
        routeId: "DLT-CHG",
        cardsUsed: {
          colorCardUsed: "red",
          colorCardCount: 3,
          wildCardCount: 0,
        },
      }),
    });

    assertEquals(await res.status, 200);
  });
});

describe("End game test case for multiplayer game state", () => {
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

  it("Game end state test case for multiplayer turn based game handling", async () => {
    body = {
      routeId: "CLC-VCR",
      cardsUsed: { colorCardUsed: "red", colorCardCount: 3, wildCardCount: 0 },
    };

    res = await mockApp.request("/claim-route", {
      method: "post",
      headers: {
        Cookie: "sessionId=1001",
      },
      body: JSON.stringify(body),
    });

    assertEquals(await res.status, 200);

    body = {
      routeId: "VCR-STL",
      cardsUsed: { colorCardUsed: "blue", colorCardCount: 1, wildCardCount: 0 },
    };

    res = await mockApp.request("/claim-route", {
      method: "post",
      headers: {
        Cookie: "sessionId=1002",
      },
      body: JSON.stringify(body),
    });

    assertEquals(await res.status, 200);

    body = {
      routeId: "STL-PLD",
      cardsUsed: { colorCardUsed: "red", colorCardCount: 1, wildCardCount: 0 },
    };

    res = await mockApp.request("/claim-route", {
      method: "post",
      headers: {
        Cookie: "sessionId=1001",
      },
      body: JSON.stringify(body),
    });

    assertEquals(await res.status, 303);
  });
});
