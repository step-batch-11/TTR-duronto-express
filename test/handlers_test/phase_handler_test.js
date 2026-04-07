import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import CarCardsDeck from "../../src/models/train_car_card_deck.js";
import TicketDeck from "../../src/models/ticket_deck.js";
import Game from "../../src/models/game.js";
import { createApp } from "../../src/app.js";
import RoomManager from "../../src/models/room_manager.js";
import { createGenerateFn, createRoomFn } from "../../src/utils/factory.js";
import PlayerBase from "../../src/models/player_base.js";
import { createPlayerFn } from "../../src/utils/factory.js";

describe("testing /initial-hand GET", () => {
  let app;
  let playerBase;
  let users;
  beforeEach(() => {
    playerBase = new PlayerBase([
      { sessionId: 1000, username: "haji" },
    ]);

    users = [
      { sessionId: 1000, username: "haji" },
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

  it("when game is just settled up, request of/get-game-phase [GET] should give the game phase as STARTED", async () => {
    const response = await app.request("/get-game-phase", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      gamePhase: "INITIALIZED",
    });
  });

  it("when game is started, request of/get-game-phase [GET] should give the game phase as INITIALIZED", async () => {
    await app.request("/initial-hand", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });
    const response = await app.request("/get-game-phase", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });

    assertEquals(response.status, 200);
    assertEquals(await response.json(), {
      gamePhase: "INITIALIZED",
    });
  });

  it("GET /game-state should give the updated routes ownership after claiming", async () => {
    const body = JSON.stringify({
      routeId: "STN5-STN7",
      cardsUsed: { colorCard: "red", colorCardCount: 2 },
    });
    await app.request("/claim-route", {
      method: "post",
      headers: {
        Cookie: `sessionId=${1000}`,
      },
      body,
    });

    await app.request("/initial-hand", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });

    await app.request("/claim-tickets", {
      method: "post",
      headers: {
        Cookie: `sessionId=${1000}`,
      },
      body: JSON.stringify(["DVR-ELP", "HLN-LAS"]),
    });

    const response = await app.request("/game-state", {
      headers: {
        Cookie: `sessionId=${1000}`,
      },
    });
    const gameState = await response.json();

    assertEquals(response.status, 200);
    assertEquals(gameState.claimedRoutes, { green: ["STN5-STN7"] });
    assertEquals(gameState.faceUp, ["red", "green", "blue", "pink", "white"]);
    assertEquals(gameState.playerHand.claimedTickets, ["DVR-ELP", "HLN-LAS"]);
  });
});
