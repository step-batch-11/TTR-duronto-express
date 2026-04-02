import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import TicketDeck from "../../src/models/ticket_deck.js";

describe("Testing TicketDeck ", () => {
  let ticketDeck;
  beforeEach(() => {
    const cards = [
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
    ticketDeck = new TicketDeck(cards);
  });

  it("dealTicketChoices should deal 3 tickets from top of the deck", () => {
    assertEquals(ticketDeck.dealTicketChoices(), [
      { id: "MTL-NOL", src: "Montreal", dest: "New Orleans", points: 13 },
      {
        id: "SSM-OKC",
        src: "Sault St. Marie",
        dest: "Oklahoma City",
        points: 9,
      },
      { id: "STL-NYC", src: "Seattle", dest: "New York", points: 22 },
    ]);
    assertEquals(ticketDeck.getTicketCards(), ["WPG-HTN"]);
  });

  it("discardTickets should discard the player's unselected tickets in bottom of the deck", () => {
    const unselectedTickets = [
      {
        id: "SSM-NVL",
        src: "Sault St. Marie",
        dest: "Nashville",
        points: 8,
      },
      { id: "NYC-ATL", src: "New York", dest: "Atlanta", points: 6 },
    ];

    ticketDeck.discardTickets(unselectedTickets);

    assertEquals(ticketDeck.getTicketCards(), [
      "SSM-NVL",
      "NYC-ATL",
      "WPG-HTN",
      "MTL-NOL",
      "SSM-OKC",
      "STL-NYC",
    ]);
  });
});
