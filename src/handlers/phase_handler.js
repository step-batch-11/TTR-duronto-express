export const getGamePhase = (context) => {
  const game = context.get("game");
  const gamePhase = game.getGamePhase();

  return context.json({ gamePhase });
};
