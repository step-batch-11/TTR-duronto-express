export default class Game {
  #ticketDeck;
  #carCardsDeck;
  constructor(carCardsDeck, ticketDeck) {
    this.#carCardsDeck = carCardsDeck;
    this.#ticketDeck = ticketDeck;
    this.player = { carCards: {}, ticketChoices: [], bogies: 45 };
  }

  #addCardToPlayerHand(cards) {
    return cards.reduce((updatedDeck, color) => {
      updatedDeck[color] = (updatedDeck[color] || 0) + 1;
      return updatedDeck;
    }, {});
  }

  initializePlayerHand() {
    const dealtCards = this.#carCardsDeck.dealInitialCards();
    this.player.carCards = this.#addCardToPlayerHand(dealtCards);
    this.player.ticketChoices.push(
      ...this.#ticketDeck.dealTicketChoices(),
    );

    this.#carCardsDeck.initFaceUp();
  }

  drawFaceUpCard(id) {
    const drawnCard = this.#carCardsDeck.drawCardFromFaceUp(id);

    this.player.carCards[drawnCard] = (this.player.carCards[drawnCard] || 0) +
      1;

    return drawnCard;
  }

  drawDeckCard() {
    const drawnCard = this.#carCardsDeck.drawCardFromDeck();
    this.player.carCards[drawnCard] = (this.player.carCards[drawnCard] || 0) +
      1;

    return drawnCard;
  }

  playerHand() {
    return this.player;
  }
}
