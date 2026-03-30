export default class Game {
  #ticketDeck;
  #carCardsDeck;
  constructor(carCardsDeck, ticketDeck) {
    this.#carCardsDeck = carCardsDeck;
    this.#ticketDeck = ticketDeck;
    this.player = { carCards: [], ticketChoices: [], boggies: 45 };
  }

  initializePlayerHand() {
    this.player.carCards.push(...this.#carCardsDeck.dealCards());
    this.player.ticketChoices.push(...this.#ticketDeck.dealTicketChoices());
  }

  playerHand() {
    return this.player;
  }
}
