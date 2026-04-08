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
  const playerHand = game.playerHand(sessionId);
  const isStarted = game.hasTicketsClaimed();
  const isPlayerTurn = game.isTurn(sessionId);
  const isGameEnded = game.getGameEndFlag();
  const isFinalRound = game.getFinalRoundStatus();
  const color = game.getPlayerColor(sessionId);
  const players = game.getAllPlayerDetails();
  const currentPlayerIdx = game.currentPlayerIdx;

  return context.json({
    faceUp,
    claimedRoutes,
    playerHand,
    isPlayerTurn,
    isStarted,
    isGameEnded,
    isFinalRound,
    color,
    players,
    currentPlayerIdx,
  });
};
