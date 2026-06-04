# Backend Code Analysis Report

## Executive Summary

The server has **no turn enforcement** — any authenticated player can trigger any game action at any time. Combined with several null-dereference and missing-validation paths, the game state can be corrupted or the server crashed by ordinary usage patterns (not just adversarial input).

---

## Critical — Server Crash or Corrupt State

### 1. No Turn Validation on Any Game Endpoint
**Files:** `src/handlers/draw_cards_handlers.js`, `src/handlers/map_handlers.js`, `src/handlers/draw_tickets_handlers.js`

None of the game action handlers check `game.isTurn(sessionId)` before acting.
- `drawDeckCardHandler` and `drawFaceUpCardHandler` call `game.drawDeckCard()` / `game.drawFaceUpCard(id)` which operate on `#currentPlayer`, not the requesting player. Any player can draw cards on another player's behalf, silently advancing the turn.
- `claimRouteHandler` calls `game.claimRoute()` which always deducts from `#currentPlayer` — a non-current player triggering this claims a route for whoever's turn it is.

**Fix:** Add `if (!game.isTurn(sessionId)) return context.json({ error: "Not your turn" }, 403);` at the top of all game action handlers.

---

### 2. Wild Card Deduction Does Not Validate Quantity
**File:** `src/models/player.js:67`

```js
if (this.#carCards["wild"] > 0) {        // checks existence, not sufficiency
  this.#reconcile("wild", wildCardCount); // could subtract more than owned
```

If a player has 2 wilds but the request claims `wildCardCount: 5`, the reconcile writes `-3` wilds. No server-side validation exists; the client controls `cardsUsed`.

**Fix:** Change condition to `>= wildCardCount`. Also add server-side card sufficiency check before calling `claimRoute`.

---

### 3. `drawFaceUpCard` Accepts Arbitrary Out-of-Range Index
**File:** `src/models/train_car_card_deck.js:38-44`

```js
drawCardFromFaceUp(faceUpCardPosition) {
  const cardIndex = parseInt(faceUpCardPosition) - 1;  // no range check
  const [drawnCard] = this.#faceUp.splice(cardIndex, 1);
```

A client sending `id: 999` or `id: -1` causes `splice` to operate on invalid indices. The face-up array ends up with `undefined` entries and `cardToRefill` propagates as `undefined` into the player's hand — a string `"undefined"` key gets added (visible in `player.js:36` which explicitly filters it out as a known workaround).

**Fix:** Validate `cardIndex >= 0 && cardIndex < 5` before operating.

---

### 4. Deck Exhaustion Returns `undefined` Silently
**File:** `src/models/train_car_card_deck.js:58-64`

```js
drawCardFromDeck() {
  if (this.#faceDown.length < 5) {
    this.#refillDeck();              // if discard is also empty, faceDown stays empty
  }
  const drawnCard = this.#faceDown.pop(); // returns undefined
  return drawnCard;
}
```

When both `#faceDown` and `#discardPile` are empty, `pop()` returns `undefined`. This propagates into the player's hand (`addCarCardToHand(undefined)` sets `#carCards["undefined"] = 1`). The `getPlayerHand()` method already filters `"undefined"` keys — confirming this has been observed but not fixed at source.

**Fix:** After `#refillDeck()`, check `if (this.#faceDown.length === 0) throw new Error("Deck exhausted")` and handle it in the handler.

---

### 5. `removePlayerFromPlayers` Crashes When Last Player Exits
**File:** `src/models/game.js:260`

```js
this.#currentPlayerIndex = this.#currentPlayerIndex % this.#players.length;
// After splice, if this.#players.length === 0:  N % 0 = NaN
this.#currentPlayer = this.#players[NaN]; // undefined
```

If the final player in a game exits, `this.#currentPlayer` becomes `undefined`. The next request to any endpoint that calls `isTurn()`, `playerHand()`, or `#nextTurn()` will crash with `TypeError: Cannot read properties of undefined`.

**Fix:** After `splice`, guard: `if (this.#players.length === 0) { this.#currentPlayer = null; return; }`.

---

### 6. `#findPlayer` Returns `undefined` Without a Guard
**File:** `src/models/game.js:134`

```js
#findPlayer(id) {
  return this.#players.find(p => p.getPlayerId() === id); // undefined if not found
}
```

Called by `playerHand`, `getBogieCount`, `getClaimedTickets`, `isLastPlayerTurn`, `getPlayerColor` — none check the return value. An invalid or expired `sessionId` (e.g., after reconnect or cookie replay) will crash any of these with `TypeError`.

**Fix:** Throw inside `#findPlayer`: `if (!player) throw new Error(\`Player ${id} not found\`);`

---

## High — Logic Errors

### 7. `claimTicketCard` Triggers `#nextTurn` Mid-Game Incorrectly
**File:** `src/models/game.js:127`

```js
if (this.hasTicketsClaimed() && this.#phase !== "INITIALIZED") {
  this.#nextTurn();
}
```

`hasTicketsClaimed()` returns true if every player has ≥1 ticket — which is true for the rest of the game after setup. This means **every ticket claim during mid-game play advances the turn a second time**: once when a player draws tickets (`phase = "DRAW_TICKET_CHOICE"`) and again here. The player who draws and claims tickets in a single action will skip the next player's turn.

**Fix:** Track whether the current turn action was a ticket draw, and only call `#nextTurn` when resolving that specific action type.

---

### 8. `exitGameHandler` References `room.game` After State Changes
**File:** `src/handlers/game_handler.js:7-12`

```js
game.removeExitedPlayer(id); // modifies game state
room.removePlayer(id);       // modifies room state
toMap.delete(id);

if (room.players.length < 2) {
  room.game.setGameEndFlag(); // room.game could be null if room has no active game
}
```

`room.game` is only set when the room is full. If the exit happens before the game fully starts, `room.game` is null → crash. Also, `room.players.length` and the game's internal player list are maintained separately — they can diverge if one succeeds and the other fails mid-exit.

---

### 9. `isGameEnded` Condition Is Wrong
**File:** `src/models/game.js:171`

```js
isGameEnded(playerId) {
  return playerHand.bogies < 3 && this.#lastPlayerId === null;
}
```

The intent is: "trigger final round when a player's bogies drop low." But `#lastPlayerId === null` means this only fires before a last player is set. Once `setLastPlayer` is called once (correctly), subsequent low-bogie players never trigger anything. The final-round trigger should compare `#isFinalRound`, not `#lastPlayerId === null`.

---

### 10. `initFaceUp` Recursive With No Depth Limit
**File:** `src/models/train_car_card_deck.js:14-22`

```js
initFaceUp() {
  const faceUpCards = this.#faceDown.splice(-5);
  this.#faceUp = faceUpCards;
  if (this.#totalWildInFaceUp() >= 3) {
    this.#discardPile.push(...this.#faceUp);
    this.initFaceUp(); // recursive — no base case for near-empty deck
  }
}
```

As the deck depletes late-game, `splice(-5)` returns fewer than 5 cards. If those happen to be ≥3 wilds, it recurses. When the deck runs out mid-recursion, `#faceUp` is set to `[]` and the next `splice(-5)` returns `[]` forever — stack overflow.

**Fix:** Convert to iteration with an early exit when `#faceDown.length === 0`.

---

## Medium — Missing Validation

### 11. No Username Validation
**File:** `src/handlers/auth_handlers.js:3`

`username` is accepted with no length check, type check, or null guard. `players.addPlayer(undefined)` or `players.addPlayer("")` will create players with falsy names, breaking display and any name-based lookups.

---

### 12. `cardsUsed` Values Trusted From Client
**File:** `src/handlers/map_handlers.js:2`

`routeId`, `cardsUsed`, and `routeData` come directly from the request body with no server-side validation. A client can send `routeLength: 99` to produce `routeToScoreMap[98]` = `undefined`, making that player's score `NaN` and silently corrupting the leaderboard.

---

### 13. `getDrawnTickets` Crashes on Missing Key
**File:** `src/models/game.js:101`

```js
getDrawnTickets(id) {
  return structuredClone(this.#drawnTickets[id].map(...));
}
```

If `id` was never given ticket choices (e.g., a handler calls this before `drawTicketChoice`), `this.#drawnTickets[id]` is `undefined` → `.map(...)` crashes.

---

## Quick Fixes (One-Liners)

| Location | Fix |
|---|---|
| `game.js:134` | Throw in `#findPlayer` if not found |
| `train_car_card_deck.js:38` | Guard `cardIndex >= 0 && cardIndex < 5` |
| `train_car_card_deck.js:63` | Check deck length after refill, throw if still 0 |
| `player.js:67` | Change `> 0` to `>= wildCardCount` |
| `auth_handlers.js:3` | Add `if (!username || typeof username !== "string" || username.trim().length === 0)` |
| `game.js:260` | Guard `if (this.#players.length === 0) return` after splice |

---

## Risk Summary

| Finding | Severity | Likely to Hit? |
|---|---|---|
| No turn enforcement | Critical | Yes — multi-tab or concurrent clients |
| Wild card over-deduction | Critical | Yes — client can send any count |
| Out-of-range face-up index | Critical | Yes — any malformed request |
| Deck exhaustion → undefined hand | High | Late-game with many draws |
| Last-player-exit crash | High | Any player leaving an active game |
| `#findPlayer` unchecked | High | Cookie replay / session mismatch |
| Mid-game ticket double-advance | High | Every ticket draw during play |
| `initFaceUp` infinite recursion | Medium | Very late game edge case |
| `isGameEnded` wrong condition | Medium | Final round logic unreliable |
