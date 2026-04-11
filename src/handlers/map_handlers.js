export const claimRouteHandler = (context) => {
  const { routeId, cardsUsed, routeData } = context.get("validatedBody");

  const game = context.get("game");
  const sessionId = context.get("sessionId");
  game.claimRoute(routeId, cardsUsed, routeData);

  const { colorCardUsed, colorCardCount, wildCardCount } = cardsUsed;
  const usedColorCard = Array.from(
    { length: colorCardCount },
    () => colorCardUsed,
  );

  const usedWildCard = Array.from({ length: wildCardCount }, () => "wild");
  game.addToDiscardedPile([...usedColorCard, ...usedWildCard]);
  const { carCards } = game.playerHand(sessionId);

  if (game.isLastPlayerTurn(sessionId)) {
    game.setGameEndFlag();
  }

  if (game.isGameEnded(sessionId)) {
    game.setLastPlayer(sessionId);
  }

  return context.json({ routeOwnership: game.getAllClaimedRoutes(), carCards });
};
