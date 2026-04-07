export const initializePlayerHandHandler = (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");

  const { carCards, claimedTickets } = game.playerHand(sessionId);
  const ticketChoices = game.getDrawnTickets(sessionId);

  return context.json({ carCards, ticketChoices, claimedTickets });
};

export const initializeFaceUpDeckHandler = (context) => {
  const game = context.get("game");

  const faceUpCards = game.getFaceUpCards();

  return context.json(faceUpCards);
};
