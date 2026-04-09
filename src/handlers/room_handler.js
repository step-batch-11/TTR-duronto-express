import { getCookie } from "hono/cookie";

export const createRoom = async (context) => {
  const { maxPlayer } = await context.req.json();

  const roomManager = context.get("roomManager");
  const sessionToRoomMap = context.get("sessionToRoomMap");
  const sessionId = parseInt(getCookie(context, "sessionId"));
  const player = context.get("players").getPlayer(sessionId);

  const room = roomManager.createRoom(+maxPlayer, player);

  sessionToRoomMap.set(sessionId, room);

  return context.json({ roomId: room.id });
};

export const joinRoom = async (context) => {
  const { roomId } = await context.req.json();
  const roomManager = context.get("roomManager");
  const sessionToRoomMap = context.get("sessionToRoomMap");

  const sessionId = parseInt(getCookie(context, "sessionId"));
  const player = context.get("players").getPlayer(sessionId);

  if (roomManager.getRoom(+roomId)) {
    try {
      const { room } = roomManager.joinRoom(+roomId, player);
      sessionToRoomMap.set(sessionId, room);

      return context.json({ roomId: room.id, isValidRoom: true });
    } catch (e) {
      return context.json({ error: e.message });
    }
  }

  return context.json({ error: `Invalid Room Id` });
};

export const getRoomState = (context) => {
  const sessionId = parseInt(getCookie(context, "sessionId"));
  const sessionToRoomMap = context.get("sessionToRoomMap");

  const room = sessionToRoomMap.get(sessionId);

  return context.json({
    roomId: room.id,
    maxPlayers: room.maxPlayers,
    players: room.players,
  });
};
