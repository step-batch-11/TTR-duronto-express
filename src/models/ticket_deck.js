export default class TicketDeck {
  #cards;
  #staticCards;
  constructor(cards) {
    this.#cards = cards;
    this.#staticCards = cards;
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
