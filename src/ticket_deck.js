export default class TicketDeck {
  #cards;
  constructor(cards) {
    this.#cards = cards;
  }

  dealTicketChoices() {
    const drawnTickets = this.#cards.slice(-3).map(({ id }) => id);
    this.#cards = this.#cards.slice(0, -3);

    return drawnTickets;
  }
}
