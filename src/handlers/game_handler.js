export const exitGameHandler = (context) => {
  const id = context.get("sessionId");
  const game = context.get("game");
  const toMap = context.get("sessionToRoomMap");
  const room = toMap.get(id);

  game.removeExitedPlayer(id);
  room.removePlayer(id);
  toMap.delete(id);

  if (room.players.length < 2) {
    game.setGameEndFlag();
  }

  return context.json({ id });
};
