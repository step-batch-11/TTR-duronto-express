# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

TTR-duronto-express is a web-based implementation of the board game "Ticket to
Ride" built with Deno, Hono (web framework), and vanilla JavaScript frontend.
It's a real-time multiplayer game where players claim train routes on a map to
fulfill destination tickets and score points.

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
