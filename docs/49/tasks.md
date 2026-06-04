# Tasks: notification message for other player's action (#49)

## Task 1: Add `updateLastAction`, `getLastAction`, and `getPlayerName` to `Game`

**Description** Wire up the `#lastAction` stub that already exists in `Game`.
Add three methods: `updateLastAction(actorId, message)` increments `actionId`
and stores actor/message; `getLastAction()` returns a `structuredClone`;
`getPlayerName(id)` resolves a player's display name from their id.

**Acceptance Criteria**

- [ ] `updateLastAction(id, msg)` increments `actionId` by 1, sets
      `actorId = id`, `message = msg`
- [ ] `getLastAction()` returns a deep clone — mutations to the result don't
      affect internal state
- [ ] `getPlayerName(id)` returns the player's name string
- [ ] All existing `game_test.js` tests still pass

**Files Likely Affected**

- `src/models/game.js` — add three methods

**Test Requirements**

- Unit: `updateLastAction` increments `actionId` on each call; `getLastAction`
  reflects the latest values; multiple calls produce sequential ids;
  `getPlayerName` returns the correct name
- Edge: `getLastAction` on a fresh game returns
  `{ actionId: 0, actorId: null, message: "" }`

**Dependencies**

- None

**Estimated Complexity:** S

---

## Task 2: Call `updateLastAction` in all four action handlers

**Description** After each state-mutating action, call
`game.updateLastAction(sessionId, message)` before returning the response.
Messages use the player's name (via `game.getPlayerName(sessionId)`):

- `drawDeckCardHandler` → `"<name> drew a card from the deck"`
- `drawFaceUpCardHandler` → `"<name> drew a <drawnCard> card from the market"`
- `claimDestinationTickets` → `"<name> drew destination tickets"`
- `claimRouteHandler` → `"<name> claimed <srcCity> - <destCity>"` (city names
  from request body; fall back to `routeId` if absent)

**Acceptance Criteria**

- [ ] After each of the four actions, `game.getLastAction().message` reflects
      the correct named message
- [ ] `actionId` increments on each action call
- [ ] `claimRouteHandler` reads `srcCity`/`destCity` from the request body and
      uses them in the message
- [ ] Fallback to `routeId` if `srcCity`/`destCity` are missing
- [ ] Existing handler tests still pass

**Files Likely Affected**

- `src/handlers/draw_cards_handlers.js`
- `src/handlers/map_handlers.js`
- `src/handlers/draw_tickets_handlers.js`

**Test Requirements**

- Unit: for each handler, assert `game.getLastAction()` has the expected message
  and an incremented `actionId` after the call
- Edge: missing `srcCity`/`destCity` in claim-route body → falls back to routeId

**Dependencies**

- Depends on Task 1

**Estimated Complexity:** S

---

## Task 3: Expose `lastAction` in `gameStateHandler` response

**Description** Add `lastAction: game.getLastAction()` to the JSON returned by
`gameStateHandler` in `phase_handler.js`. This is the polling endpoint
(`GET /game/state`) the frontend calls every 500ms.

**Acceptance Criteria**

- [ ] `GET /game/state` response includes
      `lastAction: { actionId, actorId, message }`
- [ ] On a fresh game (no actions yet), `lastAction.actionId === 0`
- [ ] After an action is taken, the next poll returns the updated `lastAction`
- [ ] Existing `phase_handler_test.js` / `handlers_test.js` tests still pass

**Files Likely Affected**

- `src/handlers/phase_handler.js`

**Test Requirements**

- Integration: mock a game with a known `lastAction` state; assert the handler
  response includes it
- Edge: fresh game returns `actionId: 0`

**Dependencies**

- Depends on Task 1

**Estimated Complexity:** S

---

## Task 4: Send `srcCity` and `destCity` in the claim-route POST body

**Description** In `claim_route.js`, when sending `POST /game/claim-route`,
include `srcCity` and `destCity` derived from the SVG `tspan` elements:
`document.querySelector(`#${code} tspan`)?.textContent` (verified pattern; `CLC`
→ `"CALGARY"`). Split `routeId` on `"-"` to get the two city codes.

**Acceptance Criteria**

- [ ] The claim-route POST body includes `srcCity` and `destCity` as readable
      city name strings (e.g. `"CALGARY"`, `"VANCOUVER"`)
- [ ] If a `tspan` is not found for a code, the code itself is sent as a
      fallback
- [ ] No visual or functional regression in the route-claiming flow

**Files Likely Affected**

- `public/scripts/claim_route.js`

**Test Requirements**

- Manual / browser: claim a route and inspect the network request body to
  confirm `srcCity`/`destCity` are present
- Edge: SVG element missing `tspan` → falls back to city code string

**Dependencies**

- None (can proceed in parallel with Tasks 1–3)

**Estimated Complexity:** S

---

## Task 5: Show `showAlert` in `pollGameState` when a new action is detected

**Description** In `script.js`, track `let lastSeenActionId = 0` at module
level. On each non-304 poll response, if
`lastAction.actionId > lastSeenActionId && !gameState.isPlayerTurn`, call
`showAlert(lastAction.message)` and advance `lastSeenActionId`. The
`!isPlayerTurn` guard ensures the acting player never sees their own action
alerted.

**Acceptance Criteria**

- [ ] Non-acting players see a 2-second flash alert with the correct message
      when another player acts
- [ ] The alert does not fire for the acting player themselves
- [ ] The same alert does not fire twice for the same action (on repeated polls
      before the next action)
- [ ] 304 (no-change) responses do not trigger an alert
- [ ] `lastSeenActionId` starts at 0 and advances correctly across turns

**Files Likely Affected**

- `public/scripts/script.js`

**Test Requirements**

- Manual / browser: two-player session — observe alerts appear on the non-acting
  screen for each of the four action types
- Edge: rapid polls before a new action — no duplicate alerts

**Dependencies**

- Depends on Task 3 (needs `lastAction` in poll response)
- Depends on Task 4 (needs `srcCity`/`destCity` for route claim messages to be
  readable)

**Estimated Complexity:** S
