export default class Room {
  #roomId;
  #players;
  #maxPlayersCount;

  constructor(roomId, playerCount, createGameFn) {
    this.#roomId = roomId;
    this.#players = [];
    this.#maxPlayersCount = playerCount;
    this.#createGame = createGameFn;
  }

  isAPlayerPresent(newPlayer) {
    return this.#players.some((player) =>
      newPlayer.sessionId === player.sessionId
    );
  }

  addPlayer(player) {
    this.#players.push(player);
    if (this.#maxPlayersCount === this.#players.length) {
      this.#startGame();
    }
  }
}
