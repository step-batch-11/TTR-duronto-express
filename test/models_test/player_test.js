import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import Player from "../../src/models/player.js";
import pointMap from "../../src/static-data/ticketPoints.json" with {
  type: "json",
};
describe("testing player class methods", () => {
  let player;
  beforeEach(() => {
    player = new Player("bhanu", 1000, 0);
  });

  it("creating a new instance of player class should assign 45 bogies", () => {
    assertEquals(player.bogiesCount, 45);
    assertEquals(player.name, "bhanu");
    assertEquals(player.color, "green");
    assertEquals(player.ticketCount, 0);
  });

  it("addCardToHand should add the given card to player Hand", () => {
    player.addCarCardToHand("red");

    assertEquals(player.getPlayerHand(1000).carCards, { red: 1 });
  });

  it("addTicketChoices should add the given ticketChoices to player Hand", () => {
    player.claimTickets(["A-B", "B-C"]);

    assertEquals(player.getPlayerHand(1000).claimedTickets, ["A-B", "B-C"]);
  });

  it("claimRoute should add a claimed Route to the claimedRoutes list and remove the cards used to claim from player hand", () => {
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");

    player.claimRoute("STN1-STN2", {
      routeColor: "transparent",
      routeLength: 3,
    }, { colorCardUsed: "red", colorCardCount: 2 });

    assertEquals(player.getClaimedRoutes(), [{
      routeId: "STN1-STN2",
      routeData: { routeColor: "transparent", routeLength: 3 },
    }]);

    assertEquals(player.getPlayerHand(1000).carCards, { "red": 1 });
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

  it("calculate score of a player with incomplete ticket", () => {
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");

    player.claimRoute("SSM-MTL", {
      routeColor: "transparent",
      routeLength: 5,
    }, { colorCardUsed: "red", colorCardCount: 5 });

    assertEquals(player.getClaimedRoutes(), [{
      routeId: "SSM-MTL",
      routeData: { routeColor: "transparent", routeLength: 5 },
    }]);

    const selectedTickets = ["SSM-NVL"];

    assertEquals(player.claimTickets(selectedTickets), ["SSM-NVL"]);

    assertEquals(player.calculateScore(pointMap, [1, 2, 4, 7, 10, 15]), {
      name: "bhanu",
      routeScore: 10,
      ticketScore: -8,
      total: 2,
    });
  });

  it("calculate score of a player with complete ticket", () => {
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");
    player.addCarCardToHand("red");

    player.claimRoute("DVR-SFE", {
      "routeColor": "transparent",
      "routeLength": 2,
    }, { colorCardUsed: "red", colorCardCount: 2 });

    assertEquals(player.getClaimedRoutes(), [{
      routeId: "DVR-SFE",
      routeData: { routeColor: "transparent", routeLength: 2 },
    }]);

    player.claimRoute("SFE-ELP", {
      "routeColor": "transparent",
      "routeLength": 2,
    }, { colorCardUsed: "red", colorCardCount: 2 });

    assertEquals(player.getClaimedRoutes(), [{
      routeId: "DVR-SFE",
      routeData: { routeColor: "transparent", routeLength: 2 },
    }, {
      routeId: "SFE-ELP",
      routeData: { routeColor: "transparent", routeLength: 2 },
    }]);

    const selectedTickets = ["DVR-ELP"];

    assertEquals(player.claimTickets(selectedTickets), ["DVR-ELP"]);
    assertEquals(player.calculateScore(pointMap, [1, 2, 4, 7, 10, 15]), {
      name: "bhanu",
      routeScore: 4,
      ticketScore: 4,
      total: 8,
    });
  });
});

describe("test longest route", () => {
  it("should find the longest route for circular path", () => {
    const player = new Player("bhanu", 1000, 0);

    player.claimRoute("A-B", { routeLength: 2 }, {});
    player.claimRoute("B-C", { routeLength: 4 }, {});
    player.claimRoute("C-F", { routeLength: 5 }, {});
    player.claimRoute("F-E", { routeLength: 2 }, {});
    player.claimRoute("E-C", { routeLength: 2 }, {});
    player.claimRoute("C-D", { routeLength: 6 }, {});
    player.claimRoute("E-G", { routeLength: 3 }, {});
    const longestRoute = player.findLongest();
    assertEquals(longestRoute, 21);
  });

  it("should find the longest route among three forests", () => {
    const player = new Player("bhanu", 1000, 0);

    player.claimRoute("A-B", { routeLength: 3 }, {});
    player.claimRoute("A-C", { routeLength: 2 }, {});
    player.claimRoute("A-D", { routeLength: 1 }, {});
    player.claimRoute("E-G", { routeLength: 7 }, {});
    player.claimRoute("G-F", { routeLength: 6 }, {});
    player.claimRoute("F-E", { routeLength: 1 }, {});
    player.claimRoute("I-H", { routeLength: 5 }, {});
    player.claimRoute("I-J", { routeLength: 6 }, {});
    player.claimRoute("J-H", { routeLength: 4 }, {});
    player.claimRoute("J-k", { routeLength: 1 }, {});
    const longestRoute = player.findLongest();
    assertEquals(longestRoute, 16);
  });
});
