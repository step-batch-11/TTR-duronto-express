export const claimRouteHandler = async (context) => {
  const { routeId, cardsUsed } = await context.req.json();

  const game = context.get("game");
  const sessionId = context.get("sessionId");
  game.claimRoute(routeId, cardsUsed);

  const { colorCardUsed, colorCardCount, wildCardCount } = cardsUsed;
  const usedColorCard = Array.from(
    { length: colorCardCount },
    () => colorCardUsed,
  );

  const usedWildCard = Array.from({ length: wildCardCount }, () => "wild");
  game.addToDiscardedPile([...usedColorCard, ...usedWildCard]);
  const { carCards } = game.playerHand(sessionId);

  if (game.isLastPlayerTurn(sessionId)) {
    return context.redirect("/finish-game", 303);
  }

  if (game.isGameEnded(sessionId)) {
    game.setLastPlayer(sessionId);
  }

  return context.json({ routeOwnership: game.getAllClaimedRoutes(), carCards });
};
