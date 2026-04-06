export default class Game {
  #ticketDeck;
  #carCardsDeck;
  #currentPlayer;
  #drawnTickets;
  #phase;
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
    this.#drawnTickets = {};
    this.#phase = "STARTED";
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

  initializePlayerHand() {
    if (this.#phase !== "STARTED") return;

    this.#players.forEach((player) => {
      const dealtCards = this.#carCardsDeck.dealInitialCards();
      dealtCards.forEach((card) => player.addCarCardToHand(card));
      this.drawTicketChoice(player.getPlayerId());
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

  getTicketCards() {
    return structuredClone(this.#ticketDeck.getTicketCards());
  }

  getDrawnTickets(id) {
    return structuredClone(this.#drawnTickets[id].map(({ id }) => id));
  }

  drawTicketChoice(id) {
    this.#phase = "DRAW_TICKET_CHOICE";
    const drawnTickets = structuredClone(this.#ticketDeck.dealTicketChoices());
    this.#drawnTickets[id] = drawnTickets;
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

  claimTicketCard(tickets, id) {
    const claimedTickets = this.#findPlayer(id).claimTickets(tickets);

    const unclaimedTickets = this.#drawnTickets[id].filter(({ id }) =>
      !tickets.includes(id)
    );

    if (unclaimedTickets.length > 0) {
      this.#ticketDeck.discardTickets(unclaimedTickets);
    }

    this.#nextTurn();

    return claimedTickets;
  }

  #findPlayer(id) {
    return this.#players
      .find((player) => player.getPlayerId() === id);
  }

  playerHand(id) {
    console.log(id);
    return this.#findPlayer(id).getPlayerHand();
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

  getClaimedTickets(id) {
    return this.#findPlayer(id).getClaimedTickets();
  }

  isGameEnded() {
    const playerHand = this.#currentPlayer.getPlayerHand();
    return playerHand.bogies < 3;
  }

  setLastPlayer(lastPlayerId) {
    this.#lastPlayerId = lastPlayerId;
  }

  getLastPlayerId() {
    return this.#lastPlayerId;
  }
}
