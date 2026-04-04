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
      claimedTickets: structuredClone(this.#claimedTickets),
      bogies: this.#bogies,
    };
  }

  #removeExhaustedCard(color) {
    if (this.#carCards[color] === 0) delete this.#carCards[color];
  }

  #reconcile(color, count) {
    this.#carCards[color] = this.#carCards[color] - count;
  }

  #removeUsedBogies(count) {
    this.#bogies = this.#bogies - count;
  }

  claimRoute(routeId, { colorCardUsed, colorCardCount, wildCardCount }) {
    this.#reconcile(colorCardUsed, colorCardCount);
    this.#removeExhaustedCard(colorCardUsed);

    if (this.#carCards["wild"]) {
      this.#reconcile("wild", wildCardCount);
      this.#removeExhaustedCard("wild");
    }

    this.#removeUsedBogies(colorCardCount + wildCardCount);
    this.#claimedRoutes.push(routeId);
  }

  getPlayerColor() {
    return this.#color;
  }

  getClaimedRoutes() {
    return structuredClone(this.#claimedRoutes);
  }
}
