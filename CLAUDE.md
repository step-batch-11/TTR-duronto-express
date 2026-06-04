# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

TTR-duronto-express is a web-based implementation of the board game "Ticket to
Ride" built with Deno, Hono (web framework), and vanilla JavaScript frontend.
It's a real-time multiplayer game where players claim train routes on a map to
fulfill destination tickets and score points.
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ticket to Ride: Duronto Express — a multiplayer board game server built with **Deno** and **Hono** (web framework). No database; all state is in-memory. Frontend is vanilla JavaScript with no bundler.

## Commands

```bash
deno task dev          # dev server with hot reload
deno task run          # production server
deno task test         # run all tests
deno task test:watch   # tests in watch mode
deno task cvg          # coverage report
deno task cvg:detailed # detailed coverage
deno fmt               # format (excludes public/**/*.{html,css,xml,svg})
deno lint              # lint (enforces no-console rule)
deno task automate     # browser automation tests
deno task install:browser  # install Playwright (Chromium)
```

Run a single test file: `deno test test/models_test/game_test.js`

Server runs on port 8000 by default (`PORT` env var to override).

## Architecture

### High-Level Structure

1. **Frontend** (`/public`) — Vanilla JS SPA with polling-based state sync
2. **HTTP Server** (`/src/app.js`) — Hono-based REST API
3. **Game Logic** (`/src/models`) — Core game state and rules
4. **Handlers** (`/src/handlers`) — Request processing
5. **Routes** (`/src/routes`) — HTTP endpoint definitions
6. **Factories** (`/src/utils`) — Object creation and dependency injection
7. **Static Data** (`/src/static-data`) — Game constants (cards, tickets,
   scoring)

### Core Data Flow

```
Browser (polling)
    ↓
Hono Router → Middleware → Handlers
    ↓
Game Models (Game, Player, Room, RoomManager)
    ↓ (in-memory state)
JSON responses → Browser re-render
```

### Key Models

- **Game** (`/src/models/game.js`) — State machine. Phases: `STARTED` →
  `INITIALIZED` → `DRAW_TICKET_CHOICE` → `TURN_STARTED` → `CARD_DRAWN` →
  (loops). Manages turns, card draws, ticket and route claiming, scoring.

- **Player** (`/src/models/player.js`) — Tracks hand cards (object map), claimed
  tickets/routes, bogies (45 total). Contains graph algorithms for longest path
  calculation and route connectivity. Colors by index: green, yellow, blue,
  purple, red.

- **Room** (`/src/models/room.js`) — Single game session. Initializes game when
  max players join.

- **RoomManager** (`/src/models/room_manager.js`) — Registry of all rooms.
  Creates, joins, and deletes rooms.

- **PlayerBase** (`/src/models/player_base.js`) — Session/login registry,
  separate from in-game Players. Tracks username → sessionId, prevents
  duplicates.

- **CarCardsDeck** (`/src/models/train_car_card_deck.js`) — Face-up (5),
  face-down deck, discard pile. Auto-reinitializes face-up if 3+ wilds visible;
  refills deck from discard when depleted.

- **TicketDeck** (`/src/models/ticket_deck.js`) — Players draw 3 choices, must
  claim ≥1. Unclaimed tickets returned to deck.

### Context & Middleware Flow

**Context** (`/src/utils/context.js`) injects per-request into Hono:
`sessionId`, `players` (PlayerBase), `roomManager`, `sessionToRoomMap`, and
`game` (if player is in an active game).

**Route guards** (`/src/middleware/route_middleware.js`): `allowExistingPlayer`,
`allowNonExistingPlayer`, `requireGameAccess`, `redirectIfGameInProgress`, and
guards for lobby/victory page access.

### Game State API

`GET /game/state` uses Hono's `etag()` middleware for HTTP caching. Response
shape:

```javascript
{
  faceUp, // visible train car cards
    claimedRoutes, // all routes claimed by all players
    playerHand, // current player's cards, tickets, bogies
    isPlayerTurn, // boolean
    isStarted, // all players have claimed initial tickets
    isGameEnded, // boolean
    isFinalRound, // boolean
    color, // current player's color
    players, // all player details
    currentPlayerIdx;
}
```

### Game Turn Cycle

1. Current player draws cards: one face-up + one deck, two face-up (not wild),
   or two from deck
2. Drawing a wild as face-up ends the turn immediately
3. Player may claim one route using cards from hand
4. Claiming a route ends the turn → advances to next player
5. Game ends when any player has < 3 bogies; final round completes, then game
   ends

### Frontend Architecture

- **Event-driven** (`/public/scripts/events.js`) — custom event system for state
  changes
- **Polling** (`/public/scripts/poller.js`) — periodic API calls (no WebSockets)
- **Handlers** (`/public/scripts/event_handlers/`) — game action handlers
- **Rendering** (`/public/scripts/render.js`) — DOM updates
- Pages: `login.html`, `lobby.html`, `waiting_room.html`, `game.html`,
  `victory.html` (middleware-gated)

## Testing

Uses `@std/testing/bdd` (describe/it) and `@std/assert`. Test structure mirrors
source under `/test/models_test/` and `/test/handlers_test/`.

## Key Conventions

- All models use JS private fields (`#`) for encapsulation
- Models return `structuredClone()` copies from getters to prevent mutation
- Route IDs: `"CITY1-CITY2"` string; cards: color strings (`"red"`, `"wild"`);
  bogies: numeric
- Errors propagate to Hono → 500; auth/state validation handled by middleware
  redirects
- Factories (`/src/utils/factory.js`, `/src/utils/create_game_factory.js`)
  enable test mocking via dependency injection

## Git Workflow

- Commit format: `[#ISSUE] | description | author(s)`
- Git hooks in `/setup/hooks/` (pre-commit, prepare-commit-msg); install via
  `setup.sh`
- CI on push/PR to main: format check → lint → tests
deno task dev              # Dev server with --watch
deno task run              # Production run (PORT env var, default 8000)
deno task test             # Run all tests
deno task test:watch       # Watch mode
deno task cvg              # Run tests with coverage
deno task cvg:detailed     # Detailed coverage report
deno fmt                   # Format code
deno lint                  # Lint (no-console rule is enforced)
deno task automate         # E2E tests via Playwright
```

Run a single test file:
```bash
deno test -A test/models_test/game_test.js
deno test -A test/handlers_test/auth_handlers_test.js
```

CI runs format check, lint, and full test suite on push/PR to main.

## Architecture

### Request lifecycle

`main.js` creates shared singletons — `PlayerBase`, `RoomManager`, `sessionToRoomMap` — and passes them into the Hono app factory in `src/app.js`. Every request gets these injected via Hono middleware in `src/utils/context.js` as `c.var.players`, `c.var.roomManager`, `c.var.sessionToRoomMap`, and `c.var.game`.

### Layer responsibilities

| Layer | Path | Role |
|-------|------|------|
| Models | `src/models/` | Pure game logic, no HTTP concerns |
| Handlers | `src/handlers/` | Read from `c.var.*`, call model methods, return JSON/redirects |
| Routes | `src/routes/` | Mount handlers behind middleware |
| Middleware | `src/middleware/route_middleware.js` | Session validation, phase/room guards, page redirects |
| Utils | `src/utils/` | Context injection, factory functions |
| Static data | `src/static-data/` | Card deck, ticket cards, route JSON |

### Core models

- **Game** — state machine with phases `STARTED → INITIALIZED → TURN_STARTED → (final round)`; owns turn logic, scoring, card/ticket management
- **Room** — holds players (up to max), creates `Game` when full
- **RoomManager** — creates/looks up rooms by ID
- **Player** — holds car cards, claimed routes, bogies (starts at 45)
- **PlayerBase** — global session registry; session IDs start at 1000
- **TrainCarCardDeck** — face-up (5 cards) and face-down piles; redeals face-up if 3+ wilds
- **TicketDeck** — deals destination ticket choices (3 at a time)

### Game flow

1. Players log in → session cookie issued
2. Host creates room, others join by room ID
3. `/game/initial-hand` deals starting cards and tickets (phase → `INITIALIZED`)
4. Each turn: draw cards (deck or face-up) OR claim a route OR take tickets
5. Final round triggers when a player's bogies drop below threshold; game ends after all players complete that round
6. `/game/leaderboard` returns scores (route points + completed ticket points − incomplete ticket penalties)

### Frontend

Static files served from `public/`. Pages: `login → lobby → host/join → waiting_room → game → victory`. Client scripts poll `/game/state` (ETag-based) and `/room/state` for updates — there is no WebSocket.

## Testing patterns

Handler tests use Hono's `testClient` / direct `fetch` against a constructed app instance; they pass fake `PlayerBase`/`RoomManager` objects rather than hitting a real server. Model tests are pure unit tests.

## Key constraints

- **No TypeScript** — project is plain JavaScript (Deno's `compilerOptions` only adds DOM/Deno type libs for IDE support)
- **`no-console` lint rule** — avoid `console.log` in source files; CI will fail
- **Git hooks** — `setup.sh` installs pre-commit hooks that run `deno fmt` and `deno lint`; run `./setup.sh` after cloning
- **In-memory only** — server restart wipes all rooms and sessions
