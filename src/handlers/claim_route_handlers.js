export const getPlayerCarCardsHandler = (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");

  const { carCards } = game.playerHand(sessionId);
  return context.json(carCards);
};

export const getPlayerBogieCount = (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");
  const count = game.getBogieCount(sessionId);

  return context.json(count);
};
