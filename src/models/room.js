export default class Room {
  #roomId;
  #players;
  #maxPlayersCount;
  #isGameStarted;
  #createGameFn;
  #game;

  constructor(roomId, playerCount, createGameFn) {
    this.#roomId = roomId;
    this.#players = [];
    this.#maxPlayersCount = playerCount;
    this.#createGameFn = createGameFn;
    this.#isGameStarted = false;
  }
  isAPlayerPresent(newPlayer) {
    return this.#players.some((player) =>
      newPlayer.sessionId === player.sessionId
    );
  }

  createGame() {
    this.#game = this.#createGameFn(this.#players);
  }

  addPlayer(player) {
    if (this.#players.length >= this.#maxPlayersCount) {
      throw new Error("Room full");
    }

    this.#players.push(player);

    if (this.#maxPlayersCount === this.#players.length) {
      this.#isGameStarted = true;
      this.createGame();
    }
    return this.#isGameStarted;
  }

  isStarted() {
    return this.#isGameStarted;
  }

  get id() {
    return this.#roomId;
  }

  get game() {
    return this.#game;
  }

  get maxPlayers() {
    return this.#maxPlayersCount;
  }

  get players() {
    return this.#players;
  }

  removePlayer(id) {
    this.#maxPlayersCount--;
    this.#players = this.#players.filter((player) => player.sessionId !== id);
  }
}
