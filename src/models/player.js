export default class Player {
  #carCards;
  #claimedTickets;
  #bogies;
  #claimedRoutes;
  #colors;
  #color;
  #playerId;
  #name;

  constructor(name, id, index) {
    this.colors = ["green", "yellow", "blue", "purple", "red"];
    this.#carCards = {};
    this.#name = name;
    this.#claimedTickets = [];
    this.#bogies = 45;
    this.#claimedRoutes = [];
    this.#color = this.colors[index];
    this.#playerId = id;
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

    if (this.#carCards["wild"] > 0) {
      this.#reconcile("wild", wildCardCount);
      this.#removeExhaustedCard("wild");
    }

    const clrCardCount = colorCardCount || 0;
    const wCardCount = wildCardCount || 0;

    this.#removeUsedBogies(clrCardCount + wCardCount);
    this.#claimedRoutes.push(routeId);
  }

  getPlayerId() {
    return this.#playerId;
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

  get name() {
    return this.#name;
  }

  get color() {
    return this.#color;
  }

  get bogiesCount() {
    return this.#bogies;
  }

  get ticketCount() {
    return this.#claimedTickets.length;
  }
}
