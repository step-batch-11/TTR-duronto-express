export class CarCardsDeck {
  constructor(deck) {
    this.faceUp = [];
    this.faceDown = deck;
    this.discardPile = [];
  }

  initFaceUp() {
    const faceUpCards = this.faceDown.slice(0, 5);

    this.faceDown = this.faceDown.slice(5);
    this.faceUp = faceUpCards;
  }

  dealCards() {
    const faceDownCards = this.faceDown.slice(0, 4);

    this.faceDown = this.faceDown.slice(4);

    return faceDownCards;
  }

  #refillFaceUp(id, card) {
    this.faceUp.splice(id, 0, card);
  }

  drawCardFromFaceUp(id) {
    const [drawnCard] = this.faceUp.splice(+id, 1);
    const drawnCardFromDeck = this.faceDown.shift();
    this.#refillFaceUp(+id, drawnCardFromDeck);
    return drawnCard;
  }
}
