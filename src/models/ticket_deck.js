export default class TicketDeck {
  #cards;
  #ticketToPointMap;

  constructor(cards, ticketToPoint) {
    this.#cards = cards;
    this.#ticketToPointMap = ticketToPoint;
  }

  dealTicketChoices() {
    const drawnTickets = this.#cards.splice(-3);

    return drawnTickets;
  }

  discardTickets(tickets) {
    this.#cards.unshift(...tickets);
  }

  getTicketCards() {
    return this.#cards.map(({ id }) => id);
  }

  get pointMap() {
    return this.#ticketToPointMap;
  }
}
