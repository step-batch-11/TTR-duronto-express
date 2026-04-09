export const drawTicketChoiceHandler = (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");
  const drawnCards = game.drawTicketChoice(sessionId);

  return context.json(drawnCards);
};

export const claimDestinationTickets = async (context) => {
  const game = context.get("game");
  const sessionId = context.get("sessionId");
  const tickets = await context.req.json();

  const playerHandTickets = game.claimTicketCard(tickets, sessionId);

  if (game.isLastPlayerTurn(sessionId)) {
    game.setGameEndFlag();
  }

  return context.json(playerHandTickets);
};
