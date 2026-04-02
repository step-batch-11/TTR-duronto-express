export default class Game {
  #ticketDeck;
  #carCardsDeck;
  #player;
  #drawnTickets;
  constructor(carCardsDeck, ticketDeck, player) {
    this.#carCardsDeck = carCardsDeck;
    this.#ticketDeck = ticketDeck;
    this.#player = player;
  }

  initializePlayerHand() {
    const dealtCards = this.#carCardsDeck.dealInitialCards();

    dealtCards.forEach((card) => this.#player.addCarCardToHand(card));
    this.#player.claimTickets(
      this.#ticketDeck.dealTicketChoices().map(({ id }) => id),
    );

    this.#carCardsDeck.initFaceUp();
  }

  getFaceUpCards() {
    return structuredClone(this.#carCardsDeck.getFaceUpCards());
  }

  drawFaceUpCard(id) {
    const { drawnCard, drawnCardFromDeck } = this.#carCardsDeck
      .drawCardFromFaceUp(id);
    this.#player.addCarCardToHand(drawnCard);

    return { drawnCard, drawnCardFromDeck };
  }

  drawDeckCard() {
    const drawnCard = this.#carCardsDeck.drawCardFromDeck();
    this.#player.addCarCardToHand(drawnCard);

    return drawnCard;
  }

  getTicketCards() {
    return structuredClone(this.#ticketDeck.getTicketCards());
  }

  drawTicketChoice() {
    this.#drawnTickets = this.#ticketDeck.dealTicketChoices();

    return structuredClone(this.#drawnTickets.map(({ id }) => id));
  }

  claimTicketCard(tickets) {
    const claimedTickets = this.#player.claimTickets(tickets);

    const unclaimedTickets = this.#drawnTickets.filter(({ id }) =>
      !tickets.includes(id)
    );

    if (unclaimedTickets.length > 0) {
      this.#ticketDeck.discardTickets(unclaimedTickets);
    }

    this.#drawnTickets = "";

    return claimedTickets;
  }

  playerHand() {
    return this.#player.getPlayerHand();
  }

  claimRoute(routeId) {
    this.#player.addClaimedRoute(routeId);
  }

  getRouteOwnershipMap() {
    const playerColor = this.#player.getPlayerColor();
    const claimedRoutes = this.#player.getClaimedRoutes();
    const ownershipMap = {};
    ownershipMap[playerColor] = claimedRoutes;
    return ownershipMap;
  }
}
