import { createUser } from "../handlers/index.js";
import { allowNonExistingPlayer } from "../middleware/route_middleware.js";
import { Hono } from "hono";

export const createAuthRoutes = () => {
  const auth = new Hono();
  auth.post("/login", allowNonExistingPlayer, createUser);
  return auth;
};
