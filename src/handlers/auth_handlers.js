import { setCookie } from "hono/cookie";
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
