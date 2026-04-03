export default class PlayerBase {
  #playerList;
  #sessionCounter;
  constructor(playerBase) {
    this.#playerList = playerBase;
    this.#sessionCounter = 1000;
  }

  isExisting(sessionId) {
    return this.#playerList.some((player) => player.sessionId === +sessionId);
  }

  #isExistingUsername(username) {
    return this.#playerList.some((player) => player.username === username);
  }

  addPlayer(username) {
    if (this.#isExistingUsername(username)) {
      throw new Error("User already exists");
    }

    const player = { username, sessionId: this.#sessionCounter++ };
    this.#playerList.push(player);
    return player.sessionId;
  }

  removePlayer(sessionId) {
    const playerIndex = this.#playerList.findIndex((player) =>
      player.sessionId === sessionId
    );
    return this.#playerList.splice(playerIndex, 1)[0];
  }
}
