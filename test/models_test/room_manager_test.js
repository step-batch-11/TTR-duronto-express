import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import RoomManager from "../../src/models/room_manager.js";
import { createRoomFn } from "../../src/utils/factory.js";

describe("testing RoomManager class", () => {
  let manager;
  let mockGenerateId;
  let mockCreateGame;

  beforeEach(() => {
    mockGenerateId = () => "room-1";

    mockCreateGame = () => ({ started: true });

    manager = new RoomManager(
      createRoomFn,
      mockGenerateId,
      mockCreateGame,
    );
  });

  it("should create a room and add initial player", () => {
    const room = manager.createRoom(2, { id: 1 });

    assertEquals(room.id, "room-1");
  });

  it("should store created room", () => {
    manager.createRoom(2, { id: 1 });

    const room = manager.getRoom("room-1");

    assertEquals(room.id, "room-1");
  });

  it("getRoom should return undefined for invalid id", () => {
    const room = manager.getRoom("invalid");

    assertEquals(room, undefined);
  });

  it("should allow player to join room", () => {
    manager.createRoom(2, { sessionId: 1 });

    const { room } = manager.joinRoom("room-1", { sessionId: 2 });

    assertEquals(room.isStarted(), true);
  });

  it("should return isGameStarted = false if room not full", () => {
    manager.createRoom(3, { sessionId: 1 });

    const { room } = manager.joinRoom("room-1", { sessionId: 2 });

    assertEquals(room.isStarted(), false);
  });

  it("should throw error when joining non-existing room", () => {
    assertThrows(() => {
      manager.joinRoom("invalid", { sessionId: 1 });
    });
  });

  it("should throw error when joining existing player in room", () => {
    manager.createRoom(1, { sessionId: 1 });
    assertThrows(() => {
      manager.joinRoom("room-1", { sessionId: 1 });
    });
  });

  it("should delete room correctly", () => {
    manager.createRoom(2, { sessionId: 1 });

    manager.deleteRoom("room-1");

    const room = manager.getRoom("room-1");

    assertEquals(room, undefined);
  });
});
