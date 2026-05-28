import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";
import TicketDeck from "../../src/models/ticket_deck.js";
import Game from "../../src/models/game.js";
import { createApp } from "../../src/app.js";
import RoomManager from "../../src/models/room_manager.js";
import {
  createGenerateFn,
  createPlayerFn,
  createRoomFn,
} from "../../src/utils/factory.js";
import PlayerBase from "../../src/models/player_base.js";

describe("testing /game/initial-hand GET", () => {
  let app;
  let playerBase;
  let users;
  beforeEach(() => {
    playerBase = new PlayerBase([
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ]);

    users = [
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ];

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

    const createGame = () => {
      const players = users.map(({ sessionId, username }, index) =>
        createPlayerFn(username, sessionId, index)
      );

      const carCardsDeck = new CarCardsDeck(carCards);
      const ticketDeck = new TicketDeck(ticketCards);
      return new Game(carCardsDeck, ticketDeck, players);
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

    app = createApp(roomManager, playerBase, sessionToRoomMap);
  });

  it("/game/initial-hand GET should give the player's initial hand with 4 car cards, 3 drawn tickets", async () => {
    const response = await app.request("/game/initial-hand", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });

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

describe("testing /game/draw-deck-card GET", () => {
  let app;
  let playerBase;
  let users;
  beforeEach(() => {
    playerBase = new PlayerBase([
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ]);

    users = [
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ];

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
    const createGame = () => {
      const players = users.map(({ sessionId, username }, index) =>
        createPlayerFn(username, sessionId, index)
      );

      const carCardsDeck = new CarCardsDeck(carCards);
      const ticketDeck = new TicketDeck(ticketCards);
      return new Game(carCardsDeck, ticketDeck, players);
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

    app = createApp(roomManager, playerBase, sessionToRoomMap);
  });

  it("testing /game/draw-deck-card GET", async () => {
    const response = await app.request("/game/draw-deck-card", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      carCards: {
        black: 1,
        orange: 1,
        white: 1,
        wild: 1,
        yellow: 1,
      },
      drawnCard: "white",
      isTurnChanged: false,
    });
  });

  it("testing /game/draw-faceup-card POST", async () => {
    const response = await app.request("/game/draw-faceup-card", {
      method: "post",
      headers: {
        Cookie: `sessionId=${1000}`,
      },
      body: JSON.stringify({ id: "1" }),
      "content-type": "application/json",
    });
    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      drawnCard: "yellow",
      cardToRefill: "white",
      carCards: {
        yellow: 2,
        orange: 1,
        black: 1,
        wild: 1,
      },
      faceUpCards: ["white", "orange", "black", "wild", "red"],
      isTurnChanged: false,
    });
  });
});

describe("testing /game/ticket-choices GET", () => {
  let app;
  let playerBase;
  let users;
  beforeEach(() => {
    playerBase = new PlayerBase([
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ]);

    users = [
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ];

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
      { id: "WPG-HTN", src: "Winnipeg", dest: "Houston", points: 12 },
      { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
    ];
    const createGame = () => {
      const players = users.map(({ sessionId, username }, index) =>
        createPlayerFn(username, sessionId, index)
      );

      const carCardsDeck = new CarCardsDeck(carCards);
      const ticketDeck = new TicketDeck(ticketCards);
      return new Game(carCardsDeck, ticketDeck, players);
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

    app = createApp(roomManager, playerBase, sessionToRoomMap);
  });

  it("after sending request to /game/ticket-choices it should return ticket cards choices as id", async () => {
    const res = await app.request("/game/ticket-choices", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });

    assertEquals(await res.status, 200);
    assertEquals(await res.json(), ["VCR-SFE", "MTL-NOL", "SSM-OKC"]);
  });
});

describe("testing /game/claim-tickets POST", () => {
  let app;
  let playerBase;
  let users;
  beforeEach(() => {
    playerBase = new PlayerBase([
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ]);

    users = [
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ];

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
      { id: "WPG-HTN", src: "Winnipeg", dest: "Houston", points: 12 },
      { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
    ];
    const createGame = () => {
      const players = users.map(({ sessionId, username }, index) =>
        createPlayerFn(username, sessionId, index)
      );

      const carCardsDeck = new CarCardsDeck(carCards);
      const ticketDeck = new TicketDeck(ticketCards);
      return new Game(carCardsDeck, ticketDeck, players);
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

    app = createApp(roomManager, playerBase, sessionToRoomMap);
  });

  it("after sending request to /game/claim-tickets it should return ticket cards of player hands after claiming", async () => {
    await app.request("/game/ticket-choices", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });
    const selectedTickets = ["HLN-LAS", "DVR-ELP"];
    const res = await app.request("/game/claim-tickets", {
      method: "post",
      headers: {
        Cookie: `sessionId=${1000}`,
      },
      body: JSON.stringify(selectedTickets),
    });

    assertEquals(await res.status, 200);
    assertEquals(await res.json(), [
      "HLN-LAS",
      "DVR-ELP",
    ]);
  });

  it("/game/car-cards GET should return the car cards in player hand", async () => {
    const res = await app.request("/game/car-cards", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });

    assertEquals(await res.status, 200);
    assertEquals(await res.json(), { blue: 2, green: 1, white: 1 });
  });
});

describe("lastAction is set after draw and claim-tickets actions", () => {
  let app;
  let playerBase;
  let room;

  beforeEach(() => {
    playerBase = new PlayerBase([
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ]);

    const users = [
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
    ];

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

    const createGame = () => {
      const players = users.map(({ sessionId, username }, index) =>
        createPlayerFn(username, sessionId, index)
      );
      return new Game(
        new CarCardsDeck(carCards),
        new TicketDeck(ticketCards),
        players,
      );
    };

    const roomManager = new RoomManager(
      createRoomFn,
      createGenerateFn(),
      createGame,
    );
    const sessionToRoomMap = new Map();

    room = roomManager.createRoom(2, { sessionId: 1000, username: "haji" });
    sessionToRoomMap.set(1000, room);
    roomManager.joinRoom(1000, { sessionId: 1001, username: "hussain" });
    sessionToRoomMap.set(1001, room);

    app = createApp(roomManager, playerBase, sessionToRoomMap);
  });

  it("draw-deck-card sets lastAction with player name and deck message", async () => {
    await app.request("/game/draw-deck-card", {
      headers: { Cookie: "sessionId=1000" },
    });

    const lastAction = room.game.getLastAction();
    assertEquals(lastAction.actionId, 1);
    assertEquals(lastAction.actorId, 1000);
    assertEquals(lastAction.message, "haji drew a card from the deck");
  });

  it("draw-faceup-card sets lastAction with player name, card color, and market message", async () => {
    await app.request("/game/draw-faceup-card", {
      method: "post",
      headers: { Cookie: "sessionId=1000" },
      body: JSON.stringify({ id: "1" }),
    });

    const lastAction = room.game.getLastAction();
    assertEquals(lastAction.actionId, 1);
    assertEquals(lastAction.actorId, 1000);
    assertEquals(lastAction.message, "haji drew a yellow card from the market");
  });

  it("claim-tickets sets lastAction with player name and destination tickets message", async () => {
    await app.request("/game/ticket-choices", {
      headers: { Cookie: "sessionId=1000" },
    });

    await app.request("/game/claim-tickets", {
      method: "post",
      headers: { Cookie: "sessionId=1000" },
      body: JSON.stringify(["MTL-NOL"]),
    });

    const lastAction = room.game.getLastAction();
    assertEquals(lastAction.actorId, 1000);
    assertEquals(lastAction.message, "haji drew destination tickets");
  });
});
