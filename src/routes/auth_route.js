import { serveStatic } from "hono/deno";
import { createUser } from "../handlers/index.js";
import {
  allowNonExistingPlayer,
  doesPlayerNotExist,
} from "../middleware/route_middleware.js";

export const registerAuthRoutes = (app) => {
  app.post("/login", allowNonExistingPlayer, createUser);
  app.get("/login.html", doesPlayerNotExist, serveStatic({ root: "/public" }));
};
