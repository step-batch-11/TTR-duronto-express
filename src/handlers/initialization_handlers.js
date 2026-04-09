export const initializePlayerHandHandler = (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");

  const { carCards, claimedTickets } = game.playerHand(sessionId);
  const ticketChoices = game.getDrawnTickets(sessionId);

  return context.json({ carCards, ticketChoices, claimedTickets });
};
