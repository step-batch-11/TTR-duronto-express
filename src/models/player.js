export default class Player {
  #carCards;
  #ticketChoices;
  #bogies;
  #claimedRoutes;
  #color;
  constructor() {
    this.#carCards = {};
    this.#ticketChoices = [];
    this.#bogies = 45;
    this.#claimedRoutes = [];
    this.#color = "green";
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

    return this.#ticketChoices;
  }

  getPlayerHand() {
    return {
      carCards: structuredClone(this.#carCards),
      ticketChoices: structuredClone(this.#ticketChoices),
      bogies: this.#bogies,
    };
  }

  addClaimedRoute(routeId) {
    this.#claimedRoutes.push(routeId);
  }

  getPlayerColor() {
    return this.#color;
  }

  getClaimedRoutes() {
    return structuredClone(this.#claimedRoutes);
  }
}
