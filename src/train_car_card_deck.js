export class CarCardsDeck {
  constructor(deck) {
    this.faceUp = [];
    this.faceDown = deck;
    this.discardPile = [];
  }

  initFaceUp() {
    const faceUpCards = this.faceDown.slice(0, 5);
    console.log(faceUpCards);

    this.faceDown = this.faceDown.slice(5);
    this.faceUp = faceUpCards;
  }

  dealInitialCards() {
    const faceDownCards = this.faceDown.slice(0, 4);

    this.faceDown = this.faceDown.slice(4);

    return faceDownCards;
  }

  drawCardFromFaceUp(id) {
    const cardIndex = parseInt(id) - 1;

    const [drawnCard] = this.faceUp.splice(cardIndex, 1);
    console.log(this.faceUp);

    return drawnCard;
  }

  drawCardFromDeck() {
    const drawnCard = this.faceDown.shift();

    return drawnCard;
  }
}
