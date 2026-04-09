import { beforeEach, describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { createApp } from "../../src/app.js";
import PlayerBase from "../../src/models/player_base.js";

describe("auth handler test", () => {
  let app;
  let players;
  beforeEach(() => {
    players = new PlayerBase([]);
    app = createApp({}, players, new Map());
  });

  describe("GET /", () => {
    it("accessing without logging in, no session, should be redirected to login", async () => {
      const response = await app.request("/");
      await response.text();
      assertEquals(response.status, 303);
    });
  });

  describe("GET /login.html", () => {
    it("accessing login without session, should get login.html", async () => {
      const response = await app.request("/login.html");
      await response.text();
      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "text/html; charset=utf-8",
      );
    });

    it("accessing login with sessionId, should get redirected to lobby.html", async () => {
      const sessionId = players.addPlayer("player1");
      const response = await app.request("/login.html", {
        headers: {
          Cookie: `sessionId=${sessionId}`,
        },
      });
      await response.text();
      assertEquals(response.status, 303);
      assertEquals(response.headers.get("location"), "/");
    });

    it("accessing login with invalid session, should get login.html", async () => {
      const response = await app.request("/login.html", {
        headers: {
          Cookie: `sessionId=0`,
        },
      });
      await response.text();
      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "text/html; charset=utf-8",
      );
    });
  });

  describe("POST /login", () => {
    it("sending username for login without cookie, should set cookie and sends back isLoggedIn true", async () => {
      const response = await app.request("/login", {
        method: "post",
        body: JSON.stringify({ username: "user" }),
      });

      const res = await response.json();
      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "application/json",
      );
      assertEquals(
        response.headers.get("set-cookie"),
        "sessionId=1000; Path=/",
      );
      assertEquals(res, { isLoggedIn: true });
    });

    it("sending username for login with valid cookie, should send back isLoggedIn true, without cookies", async () => {
      const sessionId = players.addPlayer("newPlayer");
      const response = await app.request("/login", {
        method: "post",
        body: JSON.stringify({ username: "user" }),
        headers: {
          Cookie: `sessionId=${sessionId}`,
        },
      });

      const res = await response.json();
      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "application/json",
      );
      assertEquals(response.headers.get("set-cookie"), null);
      assertEquals(res, { isLoggedIn: true });
    });

    it("sending same username for login, should send back isLoggedIn false", async () => {
      players.addPlayer("newPlayer");
      const response = await app.request("/login", {
        method: "post",
        body: JSON.stringify({ username: "newPlayer" }),
      });

      const res = await response.json();
      assertEquals(response.status, 200);
      assertEquals(
        response.headers.get("content-type"),
        "application/json",
      );
      assertEquals(response.headers.get("set-cookie"), null);
      assertEquals(res, { isLoggedIn: false, message: "User already exists" });
    });
  });

  describe("GET /game.html", () => {
    it("accessing game.html without cookies", async () => {
      const response = await app.request("/game.html");

      await response.text();
      assertEquals(response.status, 303);
      assertEquals(response.headers.get("location"), "/login.html");
    });

    it("not able to access game.html with valid cookies but it required room", async () => {
      const sessionId = players.addPlayer("newPlayer");
      const response = await app.request("/game.html", {
        headers: {
          Cookie: `sessionId=${sessionId}`,
        },
      });

      await response.text();
      assertEquals(response.status, 302);
      assertEquals(
        response.headers.get("location"),
        "./lobby.html",
      );
    });

    it("accessing game.html with invalid cookies", async () => {
      const response = await app.request("/game.html", {
        headers: {
          Cookie: `sessionId=2`,
        },
      });

      await response.text();
      assertEquals(response.status, 303);
      assertEquals(response.headers.get("location"), "/login.html");
    });
  });
});
