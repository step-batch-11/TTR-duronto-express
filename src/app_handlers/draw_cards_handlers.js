export const drawDeckCardHandler = (context) => {
  const game = context.get("game");
  const drawnCard = game.drawDeckCard();
  const { carCards } = game.playerHand();

  return context.json({ drawnCard, carCards });
};

export const drawFaceUpCardHandler = async (context) => {
  const { id } = await context.req.json();
  const game = context.get("game");

  const drawnCard = game.drawFaceUpCard(id);
  const { carCards } = game.playerHand();
  const faceUpCards = game.getFaceUpCards();

  return context.json({ drawnCard, carCards, faceUpCards });
};
