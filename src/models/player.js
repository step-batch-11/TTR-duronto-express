export default class Player {
  #carCards;
  #claimedTickets;
  #bogies;
  #claimedRoutes;
  #color;
  #playerId;
  constructor(color) {
    this.#carCards = {};
    this.#claimedTickets = [];
    this.#bogies = 45;
    this.#claimedRoutes = [];
    this.#color = color;
    this.#playerId = 1;
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
    const cards = Object.entries(this.#carCards);
    const handCards = Object.fromEntries(
      cards.filter(([color]) => color !== "undefined"),
    );
    return {
      carCards: handCards,
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
    if (colorCardUsed !== null) {
      this.#reconcile(colorCardUsed, colorCardCount);
      this.#removeExhaustedCard(colorCardUsed);
    }

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

  set playerBogies(bogies) { // for testing the game end condition
    this.#bogies = bogies;
  }

  getClaimedTickets() {
    return structuredClone(this.#claimedTickets);
  }
}
