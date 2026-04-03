import { shuffle } from "@std/random/shuffle";

export class CarCardsDeck {
  #faceUp;
  #faceDown;
  #discardPile;

  constructor(deck) {
    this.#faceUp = [];
    this.#faceDown = deck;
    this.#discardPile = [];
  }

  initFaceUp() {
    const faceUpCards = this.#faceDown.splice(-5);

    this.#faceUp = faceUpCards;
    if (this.#totalWildInFaceUp() >= 3) {
      this.#discardPile.push(...this.#faceUp);
      this.initFaceUp();
    }
  }

  dealInitialCards() {
    const faceDownCards = this.#faceDown.splice(-4);

    return faceDownCards;
  }

  #refillFaceUp(id, card) {
    this.#faceUp.splice(id, 0, card);
  }

  #totalWildInFaceUp() {
    return this.#faceUp.filter((card) => card === "wild").length;
  }

  drawCardFromFaceUp(faceUpCardPosition) {
    const cardIndex = parseInt(faceUpCardPosition) - 1;

    const [drawnCard] = this.#faceUp.splice(cardIndex, 1);
    const cardToRefill = this.#faceDown.pop();

    this.#refillFaceUp(cardIndex, cardToRefill);
    if (this.#totalWildInFaceUp() >= 3) {
      this.#discardPile.push(...this.#faceUp);
      this.initFaceUp();
    }
    return { drawnCard, cardToRefill };
  }

  #refillDeck() {
    const shuffledDeck = shuffle(this.#discardPile);
    this.#faceDown.push(...shuffledDeck);
  }

  drawCardFromDeck() {
    if (this.#faceDown.length < 5) {
      this.#refillDeck();
    }
    const drawnCard = this.#faceDown.pop();

    return drawnCard;
  }

  getFaceUpCards() {
    return structuredClone(this.#faceUp);
  }

  getFaceDownCards() {
    return structuredClone(this.#faceDown);
  }

  getDiscardPile() {
    return structuredClone(this.#discardPile);
  }

  discardCards(cards) {
    this.#discardPile.push(...cards);
  }
}
