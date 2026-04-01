export const drawTicketChoiceHandler = (context) => {
  const game = context.get("game");
  const drawnCards = game.drawTicketChoice();

  return context.json(drawnCards);
};

export const claimDestinationTickets = async (context) => {
  const game = context.get("game");
  const tickets = await context.req.json();

  const playerHandTickets = game.claimTicketCard(tickets);

  return context.json(playerHandTickets);
};
