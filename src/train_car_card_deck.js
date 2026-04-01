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
    const faceUpCards = this.#faceDown.slice(-5);

    this.#faceDown = this.#faceDown.slice(0, -5);
    this.#faceUp = faceUpCards;
    if (this.#totalWildInFaceUp() >= 3) {
      this.initFaceUp();
    }
  }

  dealInitialCards() {
    const faceDownCards = this.#faceDown.slice(-4);

    this.#faceDown = this.#faceDown.slice(0, -4);

    return faceDownCards;
  }

  #refillFaceUp(id, card) {
    this.#faceUp.splice(id, 0, card);
  }

  #totalWildInFaceUp() {
    return this.#faceUp.filter((card) => card === "wild").length;
  }

  drawCardFromFaceUp(id) {
    const cardIndex = parseInt(id) - 1;

    const [drawnCard] = this.#faceUp.splice(cardIndex, 1);
    const drawnCardFromDeck = this.#faceDown.pop();

    this.#refillFaceUp(cardIndex, drawnCardFromDeck);
    if (this.#totalWildInFaceUp() >= 3) {
      this.initFaceUp();
    }

    return { drawnCard, drawnCardFromDeck };
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
