export const initializePlayerHandHandler = (context) => {
  const game = context.get("game");
  game.initializePlayerHand();

  const { carCards, claimedTickets } = game.playerHand();
  const ticketChoices = game.getDrawnTickets();
  console.log({ carCards, ticketChoices, claimedTickets });

  return context.json({ carCards, ticketChoices, claimedTickets });
};

export const initializeFaceUpDeckHandler = (context) => {
  const game = context.get("game");
  const faceUpCards = game.getFaceUpCards();

  return context.json(faceUpCards);
};

export const storeRecentMove = async (context) => {
  const { msg } = await context.req.json();
  const game = context.get("game");
  const { lastLog } = game.storeLog(msg);

  return context.json({ lastLog });
};
