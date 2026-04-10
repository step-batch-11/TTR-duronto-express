import { beforeEach, describe, it } from "@std/testing/bdd";
import PlayerBase from "../../src/models/player_base.js";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";
import TicketDeck from "../../src/models/ticket_deck.js";
import Game from "../../src/models/game.js";
import RoomManager from "../../src/models/room_manager.js";
import {
  createGenerateFn,
  createPlayerFn,
  createRoomFn,
} from "../../src/utils/factory.js";
import { assertEquals } from "@std/assert/equals";
import { createApp } from "../../src/app.js";

describe("testing /game/initial-hand GET", () => {
  let app;
  let playerBase;
  let users;
  beforeEach(() => {
    playerBase = new PlayerBase([
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "hussain" },
      { sessionId: 1002, username: "bhanu" },
      { sessionId: 1003, username: "honu" },
    ]);

    users = [
      { sessionId: 1000, username: "haji" },
      { sessionId: 1001, username: "bhanu" },
      { sessionId: 1002, username: "haji" },
      { sessionId: 1003, username: "honu" },
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

  it("/room/create POST should able to create a room", async () => {
    const response = await app.request("/room/create", {
      method: "post",
      headers: {
        Cookie: "sessionId=1002",
      },
      body: JSON.stringify({ maxPlayer: 2 }),
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      roomId: 1001,
    });
  });

  it("/room/join POST should able to join existing room", async () => {
    await app.request("/room/create", {
      method: "post",
      headers: {
        Cookie: "sessionId=1002",
      },
      body: JSON.stringify({ maxPlayer: 2 }),
    });

    const response = await app.request("/room/join", {
      method: "post",
      headers: {
        Cookie: "sessionId=1003",
      },
      body: JSON.stringify({ roomId: 1001 }),
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      isValidRoom: true,
      roomId: 1001,
    });
  });

  it("/room/join POST should not able to join non-existing room", async () => {
    await app.request("/room/create", {
      method: "post",
      headers: {
        Cookie: "sessionId=1002",
      },
      body: JSON.stringify({ maxPlayer: 2 }),
    });

    const response = await app.request("/room/join", {
      method: "post",
      headers: {
        Cookie: "sessionId=1003",
      },
      body: JSON.stringify({ roomId: 1002 }),
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      error: "Invalid Room Id",
    });
  });

  it("/room/join POST should not able to join if room is full", async () => {
    await app.request("/room/create", {
      method: "post",
      headers: {
        Cookie: "sessionId=1002",
      },
      body: JSON.stringify({ maxPlayer: 2 }),
    });

    await app.request("/room/join", {
      method: "post",
      headers: {
        Cookie: "sessionId=1003",
      },
      body: JSON.stringify({ roomId: 1001 }),
    });

    const response = await app.request("/room/join", {
      method: "post",
      headers: {
        Cookie: "sessionId=1003",
      },
      body: JSON.stringify({ roomId: 1001 }),
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      error: "Player already present",
    });
  });

  it("/room/state POST should able to create a room", async () => {
    await app.request("/room/create", {
      method: "post",
      headers: {
        Cookie: "sessionId=1002",
      },
      body: JSON.stringify({ maxPlayer: 2 }),
    });

    const res = await app.request("/room/state", {
      headers: {
        Cookie: "sessionId=1002",
      },
    });
    assertEquals(res.status, 200);
    assertEquals(await res.json(), {
      maxPlayers: 2,
      players: [
        {
          sessionId: 1002,
          username: "bhanu",
        },
      ],
      roomId: 1001,
    });
  });
});
