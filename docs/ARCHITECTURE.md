# Software Architecture Document (SAD)

**Product:** Ojbaha (اوج‌بها)  
**Version:** 1.0 — current state and target design  
**Date:** 2026-11-21

## 1. Purpose and scope
Describe the frontend as built, the backend as designed, and the rules that keep bidding correct. Decisions are recorded in `docs/adr/`.

## 2. Architecture drivers
1. Correct, concurrent bidding (BR-004).
2. Server-enforced authorization for buyer, seller, and administrator.
3. Simple operations (no Docker, no Redis) and a small team.
4. Persian RTL UI with light/dark themes.
5. Testability: TDD for new work; characterization tests for baseline code.

## 3. Technology baseline
| Area | Current (as built) | Target |
|---|---|---|
| Frontend | React, TypeScript (strict), Vite, Tailwind CSS 4, React Router, lucide-react, anime.js (decorative) | same |
| State | React state in `App.tsx` + `localStorage` (ADR-0003) | API client; server is the source of truth |
| Backend | none | Node.js, TypeScript, Express (ADR-0006, proposed) |
| Database | `localStorage` (browser) | SQLite (dev/tests), PostgreSQL (production, concurrency tests) |
| Migrations | none | versioned migrations for both databases |
| Tests | none yet | Vitest, React Testing Library, Playwright; PostgreSQL concurrency tests |

## 4. Architectural style

### 4.1 Frontend (as built)
```
client/src/
  main.tsx, App.tsx, index.css, types.ts
  components/  layout | sidebar | auction | notifications | search | auth | support | seller | landing | ui
  pages/       Landing, Home, ActiveAuctions, AuctionDetail, MyBids, Favorites, Notifications,
               SearchResults, Support, NewTicket, TicketChat, Login, Signup, NotFound*, seller/*
  hooks/       useAppContext, useTheme
  data/        sample data (replaced by the API in F-020)
  utils/       auction rules, search, validation, paths, image, ticket, notification types
```
(*NotFound is added by F-010.)

`Layout` renders the sidebar and navbar around routed pages and passes shared state through `Outlet` context. Pages call `useAppContext()`; they never touch `localStorage`.

### 4.2 Backend (target): modular monolith
Layers inside each module: **routes** (HTTP only) → **application** (use cases, transactions) → **domain** (rules, pure functions) → **infrastructure** (repositories, storage, mail adapters).

```
server/src/
  app.ts, config.ts, errors.ts
  modules/
    identity/  auctions/  bidding/  favorites/  notifications/  support/  admin/
  infra/       db/ (migrations, repositories)  storage/  mail/  scheduler/
```
Modules talk through their public interfaces, not through each other's tables.

## 5. Context and main components
```
Browser (React SPA)
   │  JSON over HTTPS, cookie session
   ▼
Express API  /api/v1
   ├─ identity   (sessions, roles)
   ├─ auctions   (catalog, seller management)
   ├─ bidding    (transactional bid placement)
   ├─ favorites, notifications, support, admin
   ├─ scheduler  (auction closing, ending-soon events)
   └─ db: SQLite (dev) / PostgreSQL (prod)
        └─ uploads on local disk (adapter)
```

## 6. Domain model
- **User** `id, name, email (unique), password_hash, role, status, created_at`
- **Auction** `id, seller_id, category_key, title, description, image_path, start_price, bid_step, end_at, highest_bid, highest_bidder_id, bid_count, created_at`
- **Bid** `id, auction_id, user_id, amount, created_at` (immutable; unique `(auction_id, amount)`)
- **Favorite** `user_id, auction_id`
- **Notification** `id, user_id, type, title, text, link, read, created_at`
- **Ticket** `number, user_id, category, title, status, created_at, updated_at`; **TicketMessage**, **TicketImage**
- **AuditLog** `id, actor_id, action, target, created_at`; **IdempotencyKey** `key, user_id, response, created_at`

Categories are a fixed list (`electronics`, `collectibles`, `decor`, `art`, `cars`) until the administrator needs to edit them.

## 7. Identity and authorization
- Roles: `buyer`, `seller`, `admin` (ADR-0004).
- Sessions: `HttpOnly`, `Secure`, `SameSite` cookie; CSRF protection for state-changing requests (to be recorded in an ADR in F-012).
- Authorization middleware checks role; use cases check ownership (seller owns the auction, user owns the ticket).

## 8. Time and money
Integer Toman; UTC ISO 8601; the server clock decides if an auction is open (ADR-0008). Tests inject a fake clock.

## 9. Bid transaction and concurrency (ADR-0007, proposed)
1. Validate the request (schema, role, idempotency key).
2. In one transaction, run a conditional update on the auction row: not ended, amount ≥ minimum, bidder is not the current leader.
3. Zero rows updated → rollback → `409` with a stable code and the current minimum.
4. Insert the bid; commit.
5. After commit: create notifications (outbid for the previous leader) and publish live updates.

Proof: a PostgreSQL integration test fires N parallel requests with the same minimum amount and asserts exactly one success.

## 10. Auction lifecycle
```
(created) ──► RUNNING ──(end_at reached)──► ENDED
     │            │
     │            └─ bids accepted while now < end_at
     └─ deleted (seller, no bids) / removed (admin)
```
State is derived from `end_at` and removal flags; no stored "ended" flag is needed, but a scheduler job records the closing event once (idempotent) to notify the winner.

## 11. Database strategy
SQLite for development and fast tests; PostgreSQL for production and for anything involving concurrency or migrations. Portable types; PostgreSQL-specific features only behind migrations/repositories and documented. Never use SQLite in production.

## 12. API design
- Base path `/api/v1`; JSON; error envelope `{ code, message }` with Persian formal messages.
- Endpoint inventory: see `docs/backend-tasks.md`; the Task-List is the authority on order and scope.
- Pagination for lists; `Idempotency-Key` for bids.

## 13. Frontend architecture notes
- Shared state goes through `AppContext`; replacing its implementation (F-020) is the single integration point.
- Pure rules live in `utils/` and are the first targets for tests (F-009).
- Charts are hand-written SVG; the time axis runs left to right.

## 14. Notifications and background work
A small in-process scheduler (interval-based) closes auctions and emits "ending soon" events. Jobs must be idempotent. If reliability demands it later, introduce an outbox table (not a queue server).

## 15. Security, privacy, and compliance
See AGENTS.md §10. Highlights: hashed passwords, rate limits, upload validation, text rendered as text, masked public bidder names, audit log. No compliance claims without legal review.

## 16. Non-functional targets
See SRS §9.

## 17. Deployment view
Development: Vite dev server + Node server + SQLite file. Production (course demo): one Node process, PostgreSQL service, static frontend build served with an `index.html` fallback. No Docker or Redis.

## 18. Architecture risks
| Risk | Mitigation |
|---|---|
| Rules duplicated in browser and server drift apart | Share rule definitions and test both against the same cases |
| Simulation layer mistaken for security | Label it in docs and UI; remove in F-020 |
| Concurrency bug found late | ADR-0007 + PostgreSQL tests before F-014 is Done |
| No tests on baseline code | F-009 first |
| Stack not confirmed | ADR-0006 confirmation before F-011 |

## 19. ADR governance
Create an ADR for any change to boundaries, data strategy, consistency, security, deployment, integrations, or a long-lived dependency. Statuses: Proposed, Accepted, Rejected, Superseded. Never edit an accepted ADR to change the decision; supersede it.

## 20. Open decisions
ADR-0006 (stack confirmation), ADR-0007 (acceptance), and the product decisions in SRS §13.
