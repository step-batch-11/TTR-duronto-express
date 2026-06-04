# Plan: notification message for other player's action (#49)

## Objective

Non-acting players receive a 2-second flash notification via the existing
`showAlert` dialog whenever another player draws a card (from deck or market),
claims destination tickets, or claims a route — with named, descriptive messages
like "Alice drew a card from the deck" or "Alice claimed Calgary - Vancouver".

## Scope

### In Scope

- `Game`: add `updateLastAction(actorId, message)` and `getLastAction()`
  methods; `#lastAction` stub already exists
- All four action handlers call `updateLastAction` with player-named messages
- `gameStateHandler` includes `lastAction` in its response
- Frontend `pollGameState` detects a new `actionId` and calls `showAlert` for
  non-acting players only
- Claim-route POST body extended with `srcCity` / `destCity` (read from SVG
  `tspan`) so the backend can produce a readable route message

### Out of Scope

- Notification history / activity log UI
- Notifying the acting player of their own action
- WebSocket / SSE (stays polling-based)
- Alert styling / duration changes

## Approach

**Backend — `Game` model:** Add `updateLastAction(actorId, message)` (increments
`actionId`, stores `actorId` and `message`) and `getLastAction()` (returns
`structuredClone` of `#lastAction`). Also add `getPlayerName(id)` (one-liner
wrapping the existing `#findPlayer` lookup) so handlers can resolve a name from
`sessionId`.

**Backend — handlers:** Each handler calls
`game.updateLastAction(sessionId, message)` after state mutation, before
returning:

- `drawDeckCardHandler` → `"<name> drew a card from the deck"`
- `drawFaceUpCardHandler` → `"<name> drew a <color> card from the market"`
- `claimDestinationTickets` → `"<name> drew destination tickets"` (only this,
  not the earlier draw-choices step)
- `claimRouteHandler` → `"<name> claimed <srcCity> - <destCity>"` (city names
  come from request body)

**Backend — `gameStateHandler`:** Add `lastAction: game.getLastAction()` to the
JSON response.

**Frontend — `claim_route.js`:** When sending the `POST /game/claim-route`
request, include `srcCity` and `destCity` by reading
`document.querySelector(`#${src} tspan`)?.textContent` (already used pattern;
`src`/`dest` come from splitting `routeId` on `"-"`).

**Frontend — `script.js` / `pollGameState`:** Track `let lastSeenActionId = 0`
at module level. On each non-304 response: if
`lastAction.actionId > lastSeenActionId && !gameState.isPlayerTurn`, call
`showAlert(lastAction.message)` and set
`lastSeenActionId = lastAction.actionId`.

## Affected Areas

| Area                   | Files                                   | Change Type                                                           |
| ---------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| Game model             | `src/models/game.js`                    | Modify — add `updateLastAction`, `getLastAction`, `getPlayerName`     |
| Draw card handlers     | `src/handlers/draw_cards_handlers.js`   | Modify — call `updateLastAction`                                      |
| Claim route handler    | `src/handlers/map_handlers.js`          | Modify — read `srcCity`/`destCity` from body, call `updateLastAction` |
| Ticket handlers        | `src/handlers/draw_tickets_handlers.js` | Modify — call `updateLastAction` on claim only                        |
| Game state handler     | `src/handlers/phase_handler.js`         | Modify — include `lastAction` in response                             |
| Claim route (frontend) | `public/scripts/claim_route.js`         | Modify — add `srcCity`/`destCity` to POST body                        |
| Poll loop (frontend)   | `public/scripts/script.js`              | Modify — detect `actionId` change, call `showAlert`                   |

## Assumptions

1. [ASSUMPTION] City names for the route message come from
   `document.querySelector(`#${code} tspan`)?.textContent` in the SVG (verified:
   `#CLC tspan` → `"CALGARY"`).
2. [ASSUMPTION] The alert is suppressed for the acting player via
   `!isPlayerTurn` — correct because `isPlayerTurn` is `true` for the actor at
   the moment they take the action, and `false` for all other players.
3. [ASSUMPTION] `drawFaceUpCardHandler` uses `drawnCard` (already in scope) for
   the color in the message.

## Open Questions (resolved)

| # | Question             | Decision                                          |
| - | -------------------- | ------------------------------------------------- |
| 1 | Message style        | Named: `"Alice drew a card from the market"`      |
| 2 | Ticket draw vs claim | Only final claim triggers notification            |
| 3 | Route city names     | Read from SVG `tspan` elements; sent in POST body |

## Status: Completed

Implemented in 5 tasks. All tests passing. Final commit: 3dc6efd.

## Risks & Mitigations

| Risk                                         | Mitigation                                                          |
| -------------------------------------------- | ------------------------------------------------------------------- |
| Alert fires for own action                   | Gated on `!isPlayerTurn`                                            |
| Duplicate alert on repeated polls            | `lastSeenActionId` advances only when `actionId` strictly increases |
| `srcCity`/`destCity` missing from old client | Handled gracefully — backend falls back to `routeId` if not present |
