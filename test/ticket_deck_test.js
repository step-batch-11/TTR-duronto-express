import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import TicketDeck from "../src/ticket_deck.js";

describe("Testing TicketDeck", () => {
  let ticketDeck;
  beforeEach(() => {
    const cards = [
      { id: "t1", src: "Helena", dest: "Duluth", points: 12 },
      { id: "t2", src: "Saint Louis", dest: "St Marie", points: 6 },
      { id: "t3", src: "Chicago", dest: "New Orleans", points: 7 },
      { id: "t4", src: "Denver", dest: "El Paso", points: 4 },
      { id: "t5", src: "Winnipeg", dest: "Little Rock", points: 11 },
    ];
    ticketDeck = new TicketDeck(cards);
  });

  it("dealTicketChoices should deal 3 tickets from top of deck", () => {
    assertEquals(ticketDeck.dealTicketChoices(), [
      { id: "t3", src: "Chicago", dest: "New Orleans", points: 7 },
      { id: "t4", src: "Denver", dest: "El Paso", points: 4 },
      { id: "t5", src: "Winnipeg", dest: "Little Rock", points: 11 },
    ]);
  });
});
