export const getLeaderboardHandler = (context) => {
  const game = context.get("game");
  const leaderboard = game.calculateScore();

  return context.json(leaderboard);
};
