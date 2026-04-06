export const getGamePhase = (context) => {
  const game = context.get("game");
  const gamePhase = game.getGamePhase();

  return context.json({ gamePhase });
};

export const gameStateHandler = (context) => {
  const game = context.get("game");
  const faceUp = game.getFaceUpCards();
  const claimedRoutes = game.getRouteClaims();
  const claimedTickets = game.getClaimedTickets();
  return context.json({
    faceUp,
    claimedRoutes,
    claimedTickets,
  });
};
