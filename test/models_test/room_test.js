import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import Room from "../../src/models/room.js";

describe("testing Room class", () => {
  let room;
  let mockCreateGame;

  beforeEach(() => {
    mockCreateGame = (players) => {
      return {
        players,
        started: true,
      };
    };

    room = new Room("room-1", 2, mockCreateGame);
  });

  it("should initialize room correctly", () => {
    assertEquals(room.id, "room-1");
    assertEquals(room.players.length, 0);
    assertEquals(room.maxPlayers, 2);
    assertEquals(room.isStarted(), false);
  });

  it("should add a player to the room", () => {
    const started = room.addPlayer({ id: 1 });

    assertEquals(room.players.length, 1);
    assertEquals(started, false);
  });

  it("should start game when max players reached", () => {
    room.addPlayer({ id: 1 });
    const started = room.addPlayer({ id: 2 });

    assertEquals(started, true);
    assertEquals(room.isStarted(), true);
  });

  it("should create game when started", () => {
    room.addPlayer({ id: 1 });
    room.addPlayer({ id: 2 });

    assertEquals(room.isStarted(), true);
  });

  it("should not allow more than max players", () => {
    room.addPlayer({ id: 1 });
    room.addPlayer({ id: 2 });

    assertThrows(
      () => {
        room.addPlayer({ id: 3 });
      },
      Error,
      "Room full",
    );
  });

  it("should not start game before reaching max players", () => {
    room.addPlayer({ id: 1 });

    assertEquals(room.isStarted(), false);
    assertEquals(room.game, undefined);
  });
});
