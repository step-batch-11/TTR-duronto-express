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

  isTurn(id) {
    return this.#currentPlayer.getPlayerId() === id;
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

    this.#currentPlayer.addCarCardToHand(drawnCard);

    if (this.#isCardDrawFinished(drawnCard)) {
      this.#nextTurn();
    }

    return { drawnCard, cardToRefill };
  }

  drawDeckCard() {
    const drawnCard = this.#carCardsDeck.drawCardFromDeck();

    this.#currentPlayer.addCarCardToHand(drawnCard);

    if (this.#isCardDrawFinished()) {
      this.#nextTurn();
    }

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

  hasTicketsClaimed() {
    return this.#players.every((player) => player.getClaimedTickets().length);
  }

  claimTicketCard(tickets, id) {
    const claimedTickets = this.#findPlayer(id).claimTickets(tickets);

    const unclaimedTickets = this.#drawnTickets[id].filter(({ id }) =>
      !tickets.includes(id)
    );

    if (unclaimedTickets.length > 0) {
      this.#ticketDeck.discardTickets(unclaimedTickets);
    }

    if (this.hasTicketsClaimed()) {
      this.#nextTurn();
    }

    this.#drawnTickets[id] = [];

    return claimedTickets;
  }

  #findPlayer(id) {
    return this.#players
      .find((player) => player.getPlayerId() === id);
  }

  playerHand(id) {
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

  isGameEnded(playerId) {
    const playerHand = this.playerHand(parseInt(playerId));
    return playerHand.bogies < 3;
  }

  setLastPlayer(playerId) {
    this.#lastPlayerId = parseInt(playerId);
  }

  isLastPlayerTurn(playerId) {
    return this.#lastPlayerId ===
      this.#findPlayer(parseInt(playerId)).getPlayerId();
  }

  getAllPlayerDetails() {
    return this.#players.map((player) => {
      return {
        name: player.name,
        symbol: player.color,
        carCount: player.bogiesCount,
        ticketCount: player.ticketCount,
      };
    });
  }
  
}
