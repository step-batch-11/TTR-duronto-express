export default class Game {
  #ticketDeck;
  #carCardsDeck;
  #currentPlayer;
  #drawnTickets;
  #phase;
  #log;
  #players;
  #currentPlayerIndex;
  #isFinalRound;
  #lastPlayerId;

  constructor(carCardsDeck, ticketDeck, players) {
    this.#carCardsDeck = carCardsDeck;
    this.#ticketDeck = ticketDeck;
    this.#players = players;
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = this.#players[0];
    this.#drawnTickets = [];
    this.#phase = "STARTED";
    this.#log = [];
    this.#isFinalRound = false;
    this.#lastPlayerId = null;
    this.initializePlayerHand();
  }

  #nextTurn() {
    const playerCount = this.#players.length;
    this.#currentPlayer =
      this.#players[++this.#currentPlayerIndex % playerCount];
    this.#phase = "TURN_STARTED";
  }

  storeLog(move) {
    this.#log.unshift(move);
    return this.getLog();
  }

  getLog() {
    return structuredClone(this.#log);
  }

  initializePlayerHand() {
    if (this.#phase !== "STARTED") return;

    this.#players.forEach((player) => {
      const dealtCards = this.#carCardsDeck.dealInitialCards();
      dealtCards.forEach((card) => player.addCarCardToHand(card));
      this.drawTicketChoice();
    });

    this.#carCardsDeck.initFaceUp();
    this.#phase = "INITIALIZED";
  }

  getGamePhase() {
    return structuredClone(this.#phase);
  }

  getFaceUpCards() {
    return structuredClone(this.#carCardsDeck.getFaceUpCards());
  }

  #isCardDrawFinished(drawnCard) {
    if (drawnCard === "wild" || this.#phase === "CARD_DRAWN") {
      return true;
    }
    this.#phase = "CARD_DRAWN";
    return false;
  }

  drawFaceUpCard(id) {
    const { drawnCard, cardToRefill } = this.#carCardsDeck
      .drawCardFromFaceUp(id);
    if (this.#isCardDrawFinished(drawnCard)) {
      this.#nextTurn();
    }

    this.#currentPlayer.addCarCardToHand(drawnCard);
    return { drawnCard, cardToRefill };
  }

  drawDeckCard() {
    const drawnCard = this.#carCardsDeck.drawCardFromDeck();

    if (this.#isCardDrawFinished()) {
      this.#nextTurn();
    }

    this.#currentPlayer.addCarCardToHand(drawnCard);

    return drawnCard;
  }

  getTicketCards(playerColor) {
    return structuredClone(this.#ticketDeck.getTicketCards());
  }

  getDrawnTickets() {
    return structuredClone(this.#drawnTickets.map(({ id }) => id));
  }

  drawTicketChoice() {
    this.#phase = "DRAW_TICKET_CHOICE";
    const drawnTickets = structuredClone(this.#ticketDeck.dealTicketChoices());
    this.#drawnTickets.push(...drawnTickets);
    return drawnTickets.map(({ id }) => id);
  }

  filterTickets(unclaimed) {
    const tickets = structuredClone(this.#drawnTickets);

    return tickets.filter(({ id }, index) => {
      if (unclaimed.includes(id)) {
        this.#drawnTickets.splice(index, 1);
        return true;
      }
      return false;
    });
  }

  claimTicketCard(claimed, unclaimed, playerColor) {
    const player = this.#findPlayer(playerColor);
    player.claimTickets(claimed);

    const unclaimedTickets = this.filterTickets(unclaimed);

    if (unclaimedTickets.length > 0) {
      this.#ticketDeck.discardTickets(unclaimedTickets);
    }

    this.#nextTurn();

    return claimed;
  }

  #findPlayer(color) {
    return this.#players
      .find((player) => player.getPlayerColor() === color);
  }

  playerHand(color) {
    return this.#findPlayer(color).getPlayerHand();
  }

  claimRoute(routeId, cardsUsed) {
    this.#currentPlayer.claimRoute(routeId, cardsUsed);
    this.#nextTurn();
  }

  getAllClaimedRoutes() {
    const playersClaimedRoutes = {};

    this.#players.forEach((player) => {
      const playerColor = player.getPlayerColor();
      const claimedRoutes = player.getClaimedRoutes();
      playersClaimedRoutes[playerColor] = claimedRoutes;
    });
    return playersClaimedRoutes;
  }

  addToDiscardedPile(cards) {
    this.#carCardsDeck.discardCards(cards);
  }

  getClaimedTickets(color) {
    return this.#findPlayer(color).getClaimedTickets();
  }

  isGameEnded(color) {
    const playerHand = this.#findPlayer(color).getPlayerHand();
    return playerHand.bogies < 3;
  }

  setLastPlayer(lastPlayerId) {
    this.#lastPlayerId = lastPlayerId;
  }

  getLastPlayerId() {
    return this.#lastPlayerId;
  }
}
