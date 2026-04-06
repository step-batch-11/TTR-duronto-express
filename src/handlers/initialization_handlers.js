export const initializePlayerHandHandler = (context) => {
  const game = context.get("game");
  game.initializePlayerHand();

  const { carCards, claimedTickets } = game.playerHand();
  const ticketChoices = game.getDrawnTickets();
  return context.json({ carCards, ticketChoices, claimedTickets });
};

export const initializeFaceUpDeckHandler = (context) => {
  const game = context.get("game");
  const faceUpCards = game.getFaceUpCards();

  return context.json(faceUpCards);
};
