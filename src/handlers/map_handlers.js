export const claimRouteHandler = async (context) => {
  const { routeId } = await context.req.json();
  const game = context.get("game");
  game.claimRoute(routeId);

  return context.json({ routeOwnership: game.getRouteClaims() });
};

export const routeOwnershipHandler = (context) => {
  const game = context.get("game");
  return context.json({ routeOwnership: game.getRouteClaims() });
};
