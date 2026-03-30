export default class TicketDeck {
  #cards;
  constructor(cards) {
    this.#cards = cards;
  }

  dealTicketChoices() {
    return this.#cards.slice(-3);
  }
}
