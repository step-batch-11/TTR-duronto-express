import { getCookie } from "hono/cookie";

export const setContext = (players, roomManager, sessionToRoomMap) => {
  return async (context, next) => {
    const sessionId = Number(getCookie(context, "sessionId"));
    context.set("sessionId", sessionId);

    context.set("players", players);
    context.set("roomManager", roomManager);
    context.set("sessionToRoomMap", sessionToRoomMap);

    const room = sessionToRoomMap.get(sessionId);

    if (room && room.game) {
      context.set("game", room.game);
    }

    await next();
  };
};
