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
    const drawnCard = this.#carCardsDeck.drawCardFromFaceUp(id);
    this.#player.addCarCardToHand(drawnCard);

    return drawnCard;
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

  playerHand() {
    return this.#player.getPlayerHand();
  }
}
