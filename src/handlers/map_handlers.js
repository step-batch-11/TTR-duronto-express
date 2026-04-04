export const claimRouteHandler = async (context) => {
  const { routeId, cardsUsed } = await context.req.json();

  const game = context.get("game");
  game.claimRoute(routeId, cardsUsed);

  const { colorCardUsed, colorCardCount, wildCardCount } = cardsUsed;
  const usedColorCard = Array.from(
    { length: colorCardCount },
    () => colorCardUsed,
  );
  const usedWildCard = Array.from({ length: wildCardCount }, () => "wild");
  game.addToDiscardedPile([...usedColorCard, ...usedWildCard]);

  const { carCards } = game.playerHand();

  return context.json({ routeOwnership: game.getRouteClaims(), carCards });
};

export const routeOwnershipHandler = (context) => {
  const game = context.get("game");
  return context.json({ routeOwnership: game.getRouteClaims() });
};
