export default class Player {
  #carCards;
  #ticketChoices;
  #bogies;

  constructor() {
    this.#carCards = {};
    this.#ticketChoices = [];
    this.#bogies = 45;
  }

  addCarCardToHand(carCard) {
    const cardCount = this.#carCards[carCard] || 0;
    this.#carCards[carCard] = cardCount + 1;
  }

  addTicketChoices(ticketChoices) {
    this.#ticketChoices.push(...ticketChoices);
  }

  claimTicket(tickets) {
    this.#ticketChoices.push(...tickets);
  }

  getPlayerHand() {
    return {
      carCards: structuredClone(this.#carCards),
      ticketChoices: structuredClone(this.#ticketChoices),
      bogies: structuredClone(this.#bogies),
    };
  }
}
