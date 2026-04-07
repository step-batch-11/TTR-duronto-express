import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals, assertThrows } from "@std/assert";
import PlayerBase from "../../src/models/player_base.js";

describe("Testing Player base method", () => {
  let players;
  beforeEach(() => {
    players = new PlayerBase([]);
  });

  describe("isExisting", () => {
    it("existing player", () => {
      const sessionId = players.addPlayer("player1");
      assertEquals(players.isExisting(sessionId), true);
    });

    it("non existing player", () => {
      assertEquals(players.isExisting(1), false);
    });
  });

  describe("addPlayer", () => {
    it("adds new player, gets sessionId", () => {
      assertEquals(players.addPlayer("user2"), 1000);
    });

    it("get player by sessionId", () => {
      assertEquals(players.addPlayer("user2"), 1000);
      assertEquals(players.getPlayer(1000), {
        sessionId: 1000,
        username: "user2",
      });
    });

    it("checking if sessionId increments", () => {
      assertEquals(players.addPlayer("user2"), 1000);
      assertEquals(players.addPlayer("user3"), 1001);
    });

    it("creating same user, throws error", () => {
      assertEquals(players.addPlayer("user2"), 1000);
      assertThrows(() => {
        players.addPlayer("user2");
      });
    });
  });

  describe("removePlayer", () => {
    it("removes existing player", () => {
      const sessionId = players.addPlayer("newPlayer");
      assertEquals(players.removePlayer(sessionId), {
        sessionId,
        username: "newPlayer",
      });
    });

    it("removes non existing player", () => {
      assertEquals(players.removePlayer(1000), undefined);
    });
  });
});
