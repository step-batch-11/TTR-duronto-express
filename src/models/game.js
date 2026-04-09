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
  #gameEndFlag;
  #routeToScoreMap;

  constructor(carCardsDeck, ticketDeck, players) {
    this.#routeToScoreMap = [1, 2, 4, 7, 10, 15];
    this.#carCardsDeck = carCardsDeck;
    this.#ticketDeck = ticketDeck;
    this.#players = players;
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = this.#players[0];
    this.#drawnTickets = {};
    this.#phase = "STARTED";
    this.#gameEndFlag = false;
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
      setTimeout(() => this.#nextTurn(), 1500);
      return { drawnCard, cardToRefill, isTurnChanged: true };
    }

    return { drawnCard, cardToRefill, isTurnChanged: false };
  }

  drawDeckCard() {
    const drawnCard = this.#carCardsDeck.drawCardFromDeck();

    this.#currentPlayer.addCarCardToHand(drawnCard);

    if (this.#isCardDrawFinished()) {
      setTimeout(() => this.#nextTurn(), 1500);
      return { drawnCard, isTurnChanged: true };
    }

    return { drawnCard, isTurnChanged: false };
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
      this.#drawnTickets[id] = [];
    }

    if (this.hasTicketsClaimed()) {
      this.#nextTurn();
    }

    return claimedTickets;
  }

  #findPlayer(id) {
    return this.#players
      .find((player) => player.getPlayerId() === id);
  }

  playerHand(id) {
    return this.#findPlayer(id).getPlayerHand();
  }

  getBogieCount(id) {
    return this.#findPlayer(id).bogiesCount;
  }

  claimRoute(routeId, cardsUsed, routeData) {
    this.#currentPlayer.claimRoute(routeId, routeData, cardsUsed);
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

    return playerHand.bogies < 3 && this.#lastPlayerId === null;
  }

  setLastPlayer(playerId) {
    this.#isFinalRound = true;
    this.#lastPlayerId = parseInt(playerId);
  }

  getFinalRoundStatus() {
    return this.#isFinalRound;
  }

  isLastPlayerTurn(playerId) {
    return this.#lastPlayerId ===
      this.#findPlayer(parseInt(playerId)).getPlayerId();
  }

  get currentPlayerIdx() {
    const playerCount = this.#players.length;
    return this.#currentPlayerIndex % playerCount;
  }

  setGameEndFlag() {
    this.#gameEndFlag = true;
  }

  getGameEndFlag() {
    return this.#gameEndFlag;
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

  calculateScore() {
    const pointMap = this.#ticketDeck.pointMap;
    const scores = this.#players.map((player) =>
      player.calculateScore(pointMap, this.#routeToScoreMap)
    );
    const winner = scores.sort((a, b) => b.total - a.total)[0].name;
    return { winner, scores };
  }

  getPlayerColor(id) {
    return this.#findPlayer(id).color;
  }
}
