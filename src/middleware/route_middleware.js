import { getCookie } from "hono/cookie";

export const requireGameAccess = (context, next) => {
  const sessionToRoomMap = context.get("sessionToRoomMap");
  const game = context.get("game");
  const sessionId = context.get("sessionId");
  if (sessionToRoomMap.has(sessionId) && game) {
    return next();
  }
  return context.redirect("./lobby.html");
};

export const redirectIfGameInProgress = (context, next) => {
  const sessionToRoomMap = context.get("sessionToRoomMap");
  const sessionId = context.get("sessionId");
  const game = context.get("game");
  if (sessionToRoomMap.has(sessionId) && game) {
    return context.redirect("./game.html");
  }
  return next();
};

export const redirectIfInRoom = (context, next) => {
  const sessionToRoomMap = context.get("sessionToRoomMap");
  const sessionId = context.get("sessionId");
  if (!sessionToRoomMap.has(sessionId)) {
    return context.redirect("./lobby.html");
  }
  return next();
};

export const allowExistingPlayer = async (context, next) => {
  const players = context.get("players");
  const sessionId = getCookie(context, "sessionId");

  if (players.isExisting(sessionId)) {
    return await next();
  }

  return context.redirect("/login.html", 303);
};

export const doesPlayerNotExist = async (context, next) => {
  const players = context.get("players");
  const sessionId = getCookie(context, "sessionId");

  if (!players.isExisting(sessionId)) {
    return await next();
  }
  return context.redirect("/", 303);
};

export const allowNonExistingPlayer = async (context, next) => {
  const players = context.get("players");
  const sessionId = getCookie(context, "sessionId");

  if (players.isExisting(sessionId)) {
    return context.json({ isLoggedIn: true });
  }
  return await next();
};
