## Context Summary: Issue #49 — notification message for other player's action

### Issue

- **State:** Open
- **Labels:** None
- **Milestone:** None

### What the issue asks for

When it's not a player's turn, they should see a flash notification whenever
another player draws a card (from deck or market), draws new destination
tickets, or claims a route. The message should appear on the non-acting players'
screens to keep them informed of game progress.

### Linked issues

None.

### Images

None.

---

### Codebase findings

| Area                    | Detail                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repo structure          | Deno + Hono backend; vanilla JS frontend with polling every 500ms                                                                                         |
| Relevant backend files  | `src/models/game.js` — `#lastAction` field already exists (`{ actionId: 0, actorId: null, message: "" }`) but is **never written or read** by any handler |
| Relevant backend files  | `src/handlers/draw_cards_handlers.js` — draw deck + face-up handlers                                                                                      |
| Relevant backend files  | `src/handlers/map_handlers.js` — `claimRouteHandler`                                                                                                      |
| Relevant backend files  | `src/handlers/draw_tickets_handlers.js` — `claimDestinationTickets` + `drawTicketChoiceHandler`                                                           |
| Relevant backend files  | `src/handlers/phase_handler.js` — `gameStateHandler` (returns the game state JSON polled every 500ms)                                                     |
| Relevant frontend files | `public/scripts/script.js` — `pollGameState` drives all state updates; uses `If-None-Match` / etag for caching on `/game/state`                           |
| Relevant frontend files | `public/scripts/utils.js` — `showAlert(message)` shows a 2-second dialog; already used for "your turn", "Final round", "TICKET DECK IS EMPTY"             |
| Test framework          | `@std/testing/bdd` (describe/it), `@std/assert`; tests in `test/handlers_test/` and `test/models_test/`                                                   |
| Tech stack              | Deno, Hono, vanilla JS (no bundler, no WebSockets)                                                                                                        |
| Relevant docs           | `docs/` does not exist yet                                                                                                                                |

### Initial observations

- `#lastAction` in `Game` is a stub waiting to be used — the field exists with
  the right shape but has zero methods to read or write it.
- The `gameStateHandler` response (polled every 500ms) is the natural delivery
  channel for `lastAction` — no new endpoint needed.
- The etag on `/game/state` is only set when the game is NOT the current
  player's turn (line `etag = response.headers.get("etag")` is inside the
  `!isPlayerTurn` branch). This means non-acting players cache state between
  turns. Writing `lastAction` will change the response body and bust the etag
  automatically.
- The frontend already has the `showAlert` utility — the only frontend work is:
  read `lastAction` from the polled state and call `showAlert` when `actionId`
  advances.
- Need to ensure the message isn't shown to the _acting_ player themselves, only
  to watchers.
