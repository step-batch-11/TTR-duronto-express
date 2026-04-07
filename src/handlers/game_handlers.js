export const getCalculatedScore = (context) => {
  const game = context.get("game");
  const results = game.calculateScore();

  return context.json(results);
};
