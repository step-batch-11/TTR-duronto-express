import { getCookie, setCookie } from "hono/cookie";

export const allowExistingPlayer = async (context, next) => {
  const players = context.get("players");
  const sessionId = getCookie(context, "sessionId");

  if (players.isExisting(sessionId)) {
    await next();
  }
  return context.redirect("/login.html", 303);
};

export const doesPlayerNotExist = async (context, next) => {
  const players = context.get("players");
  const sessionId = getCookie(context, "sessionId");

  if (!players.isExisting(sessionId)) {
    await next();
  }
  return context.redirect("/index.html", 303);
};

export const allowNonExistingPlayer = async (context, next) => {
  const players = context.get("players");
  const sessionId = getCookie(context, "sessionId");

  if (players.isExisting(sessionId)) {
    return context.json({ isLoggedIn: true });
  }
  await next();
};

export const createUser = async (context) => {
  const { username } = await context.req.json();

  try {
    const players = context.get("players");
    const sessionId = players.addPlayer(username);
    setCookie(context, "sessionId", sessionId);

    return context.json({ isLoggedIn: true });
  } catch (error) {
    return context.json({ isLoggedIn: false, message: error.message });
  }
};

export const getPlayerDetails = (context) => {
  const game = context.get("game");
  const players = game.getPlayerDetails();
  return context.json(players);
};
