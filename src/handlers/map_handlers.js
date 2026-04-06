export const claimRouteHandler = async (context) => {
  const { routeId, cardsUsed } = await context.req.json();
  const game = context.get("game");
  game.claimRoute(routeId, cardsUsed);

  return context.json({ routeOwnership: game.getAllClaimedRoutes() });
};

export const routeOwnershipHandler = (context) => {
  const game = context.get("game");
  return context.json({ routeOwnership: game.getAllClaimedRoutes() });
};
