export default class Player {
  #carCards;
  #claimedTickets;
  #bogies;
  #claimedRoutes;
  #color;
  #playerId;
  constructor() {
    this.#carCards = {};
    this.#claimedTickets = [];
    this.#bogies = 45;
    this.#claimedRoutes = [];
    this.#color = "green";
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
    return {
      carCards: structuredClone(this.#carCards),
      claimedTickets: structuredClone(this.#claimedTickets),
      bogies: this.#bogies,
    };
  }

  claimRoute(routeId, { colorCardUsed, colorCardCount }) {
    this.#carCards[colorCardUsed] = this.#carCards[colorCardUsed] -
      colorCardCount;
    this.#claimedRoutes.push(routeId);

    return structuredClone(this.#playerId);
  }

  getPlayerColor() {
    return this.#color;
  }

  getClaimedRoutes() {
    return structuredClone(this.#claimedRoutes);
  }

  set playerBogies(bogies) {
    this.#bogies = bogies;
  }
}
