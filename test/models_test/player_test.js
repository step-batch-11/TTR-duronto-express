import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import Player from "../../src/models/player.js";

describe("testing player class methods", () => {
  let player;
  beforeEach(() => {
    player = new Player("green");
  });

  it("creating a new instance of player class should assign 45 bogies", () => {
    assertEquals(player.getPlayerHand().bogies, 45);
  });

  it("addCardToHand should add the given card to player Hand", () => {
    player.addCarCardToHand("red");

    assertEquals(player.getPlayerHand().carCards, { red: 1 });
  });

  it("addTicketChoices should add the given ticketChoices to player Hand", () => {
    player.claimTickets(["A-B", "B-C"]);

    assertEquals(player.getPlayerHand().claimedTickets, ["A-B", "B-C"]);
  });

  it("claimRoute should add a claimed Route to the claimedRoutes list and remove the cards used to claim from player hand", () => {
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.claimRoute("STN1-STN2", { colorCardUsed: "red", colorCardCount: 2 });
    assertEquals(player.getClaimedRoutes(), ["STN1-STN2"]);
    assertEquals(player.getPlayerHand().carCards, { "red": 1 });
  });

  it("getPlayerColor should return the players color", () => {
    assertEquals(player.getPlayerColor(), "green");
  });

  it("claimTickets should add the selected cards in th player's hand of destination ticket", () => {
    const selectedTickets = [
      "SSM-NVL",
      "NYC-ATL",
    ];
    assertEquals(player.claimTickets(selectedTickets), ["SSM-NVL", "NYC-ATL"]);
  });
});
