export default class Player {
  #carCards;
  #claimedTickets;
  #bogies;
  #claimedRoutes;
  #color;
  constructor() {
    this.#carCards = {};
    this.#claimedTickets = [];
    this.#bogies = 45;
    this.#claimedRoutes = [];
    this.#color = "green";
  }

  addCarCardToHand(carCard) {
    const cardCount = this.#carCards[carCard] || 0;
    this.#carCards[carCard] = cardCount + 1;
  }

  claimTickets(tickets) {
    this.#claimedTickets.push(...tickets);

    return structuredClone(this.#claimedTickets);
  }

  getPlayerHand() {
    return {
      carCards: structuredClone(this.#carCards),
      ticketChoices: structuredClone(this.#claimedTickets),
      bogies: this.#bogies,
    };
  }

  claimRoute(routeId, { colorCard, colorCardCount }) {
    this.#carCards[colorCard] = this.#carCards[colorCard] - colorCardCount;
    this.#claimedRoutes.push(routeId);
  }

  getPlayerColor() {
    return this.#color;
  }

  getClaimedRoutes() {
    return structuredClone(this.#claimedRoutes);
  }
}
