export const getplayerCarCardsHandler = (context) => {
  const game = context.get("game");
  const { carCards } = game.playerHand();
  return context.json(carCards);
};
