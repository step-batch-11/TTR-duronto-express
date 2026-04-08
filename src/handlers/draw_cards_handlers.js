export const drawDeckCardHandler = (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");

  const drawnCard = game.drawDeckCard();
  const { carCards } = game.playerHand(sessionId);

  if (game.isLastPlayerTurn(sessionId)) {
    game.setGameEndFlag();
  }

  return context.json({ drawnCard, carCards });
};

export const drawFaceUpCardHandler = async (context) => {
  const { id } = await context.req.json();
  const game = context.get("game");
  const sessionId = context.get("sessionId");

  const { drawnCard, cardToRefill } = game.drawFaceUpCard(id);
  const { carCards } = game.playerHand(sessionId);
  const faceUpCards = game.getFaceUpCards();

  if (game.isLastPlayerTurn(sessionId)) {
    game.setGameEndFlag();
  }

  return context.json({ drawnCard, cardToRefill, carCards, faceUpCards });
};
