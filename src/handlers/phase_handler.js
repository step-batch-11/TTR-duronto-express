export const getGamePhase = (context) => {
  const game = context.get("game");
  const gamePhase = game.getGamePhase();

  return context.json({ gamePhase });
};

export const gameStateHandler = (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");
  const faceUp = game.getFaceUpCards();
  const claimedRoutes = game.getAllClaimedRoutes();
  const claimedTickets = game.getClaimedTickets(sessionId);
  const playerHand = game.playerHand(sessionId);
  return context.json({
    faceUp,
    claimedRoutes,
    claimedTickets,
    playerHand,
  });
};
