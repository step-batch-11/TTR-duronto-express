export const getPlayerCarCardsHandler = (context) => {
  const game = context.get("game");
  const { carCards } = game.playerHand();
  return context.json(carCards);
};
