export const drawTicketChoiceHandler = (context) => {
  const game = context.get("game");
  const drawnCards = game.drawTicketChoice();

  return context.json(drawnCards);
};
