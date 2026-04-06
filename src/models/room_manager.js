export default class RoomManager {
  #createRoomFn;
  #generateIdFn;
  #createGameFn;
  #rooms;

  constructor(createRoomFn, generateIdFn, createGameFn) {
    this.#createRoomFn = createRoomFn;
    this.#generateIdFn = generateIdFn;
    this.#createGameFn = createGameFn;
    this.#rooms = [];
  }

  createRoom(maxPlayers, player) {
    const roomId = this.#generateIdFn();
    const room = this.#createRoomFn(roomId, maxPlayers, this.#createGameFn);
    room.addPlayer(player);

    this.#rooms.push(room);
    return room;
  }

  getRoom(roomId) {
    const room = this.#rooms.find((room) => room.id === roomId);
    return room;
  }

  joinRoom(roomId, player) {
    const room = this.getRoom(roomId);

    if (room.isAPlayerPresent(player)) {
      throw new Error("Player already present");
    }
    const isGameStarted = room.addPlayer(player);
    return { isGameStarted, room };
  }

  deleteRoom(roomId) {
    this.#rooms = this.#rooms.filter((room) => room.id !== roomId);
  }
}
