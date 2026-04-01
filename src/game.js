export default class Game {
  #ticketDeck;
  #carCardsDeck;
  #player;
  constructor(carCardsDeck, ticketDeck, player) {
    this.#carCardsDeck = carCardsDeck;
    this.#ticketDeck = ticketDeck;
    this.#player = player;
  }

  initializePlayerHand() {
    const dealtCards = this.#carCardsDeck.dealInitialCards();

    dealtCards.forEach((card) => this.#player.addCarCardToHand(card));
    this.#player.addTicketChoices(this.#ticketDeck.dealTicketChoices());

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
    const drawnTickets = this.#ticketDeck.dealTicketChoices();
    return drawnTickets;
  }

  claimTicketCard(tickets) {
    this.#player.claimTicket(tickets);
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
