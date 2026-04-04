export default class Game {
  #ticketDeck;
  #carCardsDeck;
  #player;
  #drawnTickets;
  #phase;
  #log;
  #isFinalRound;
  #lastPlayerId;

  constructor(carCardsDeck, ticketDeck, player) {
    this.#carCardsDeck = carCardsDeck;
    this.#ticketDeck = ticketDeck;
    this.#player = player;
    this.#drawnTickets = [];
    this.#phase = "STARTED";
    this.#log = [];
    this.#isFinalRound = false;
    this.#lastPlayerId = null;
  }

  storeLog(move) {
    this.#log.unshift(move);
    return structuredClone(this.#log);
  }

  getLog() {
    return structuredClone(this.#log);
  }

  initializePlayerHand() {
    if (this.#phase === "INITIALIZED") {
      return;
    }
    const dealtCards = this.#carCardsDeck.dealInitialCards();

    dealtCards.forEach((card) => this.#player.addCarCardToHand(card));
    this.#drawnTickets = this.#ticketDeck.dealTicketChoices().map(({ id }) =>
      id
    );

    this.#carCardsDeck.initFaceUp();
    this.#phase = "INITIALIZED";
  }

  getGamePhase() {
    return structuredClone(this.#phase);
  }

  getFaceUpCards() {
    return structuredClone(this.#carCardsDeck.getFaceUpCards());
  }

  drawFaceUpCard(id) {
    const { drawnCard, cardToRefill } = this.#carCardsDeck
      .drawCardFromFaceUp(id);
    this.#player.addCarCardToHand(drawnCard);

    return { drawnCard, cardToRefill };
  }

  drawDeckCard() {
    const drawnCard = this.#carCardsDeck.drawCardFromDeck();
    this.#player.addCarCardToHand(drawnCard);

    return drawnCard;
  }

  getTicketCards() {
    return structuredClone(this.#ticketDeck.getTicketCards());
  }

  getDrawnTickets() {
    return structuredClone(this.#drawnTickets);
  }

  drawTicketChoice() {
    this.#phase = "DRAWTICKETCHOICE";
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

    this.#drawnTickets = [];

    return claimedTickets;
  }

  playerHand() {
    return this.#player.getPlayerHand();
  }

  claimRoute(routeId, cardsUsed) {
    return this.#player.claimRoute(routeId, cardsUsed);
  }

  getRouteClaims() {
    const playerColor = this.#player.getPlayerColor();
    const claimedRoutes = this.#player.getClaimedRoutes();
    const playerClaimedRoutes = {};
    playerClaimedRoutes[playerColor] = claimedRoutes;
    return playerClaimedRoutes;
  }

  //Claim the route
  isGameEnded() {
    const playerHand = this.#player.getPlayerHand();
    return playerHand.bogies < 3;
  }

  setLastPlayer(lastPlayerId) {
    this.#lastPlayerId = lastPlayerId;
  }

  getLastPlayerId() {
    return structuredClone(this.#lastPlayerId);
  }
}
