export default class TicketDeck {
  #cards;
  constructor(cards) {
    this.#cards = cards;
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
}
