export default class RoomManager {
  constructor(createRoomFn, generateFn) {
    this.#createRoomFn = createRoomFn;
    this.#generateFn = generateFn;
    this.#rooms = [];
  }

  createRoom() {
    const roomId = this.#generateFn();
    const room = this.#createRoom(roomId);
    this.#rooms.push(room);
    return room;
  }

  #getRoom(roomId) {
    const room = this.#rooms.filter((id) => id === roomId);
    return room;
  }

  joinRoom(roomId, player) {
    const room = this.#getRoom(roomId);
    if (room.isAPlayerPresent(player)) {
      throw new Error("Player already present");
    }
    room.addPlayer(player);
  }

  deleteRoom(roomId) {
    this.#rooms.filter((id) => id !== roomId);
  }
}
