# Delivery Roadmap

This roadmap sequences the work from the current state (a complete frontend running on a simulation layer) to a production-ready first release. It is a recommendation, not permission to skip SPEC/PLAN approval.

## Phase 0 — Process and test foundation

**Tasks:** F-009, F-010 (plus adoption of this documentation set)  
**Outcome:** TDD becomes possible; baseline behavior is pinned by tests.

- Vitest + React Testing Library; characterization tests for `utils/auction.ts`, `utils/validation.ts`, `utils/search.ts`.
- One Playwright smoke test.
- 404 page.

**Exit gate:** `npm test` and `npm run typecheck` pass from a clean clone.

## Phase 1 — Backend foundation

**Tasks:** F-011  
**Outcome:** a running API skeleton with quality gates.

- Server project, configuration, error envelope, request IDs, `/api/v1/health`.
- Migrations, SQLite for development, PostgreSQL for integration tests.
- ADR-0006 (stack) accepted.

**Exit gate:** a clean clone runs the API, migrations, and tests with documented commands.

## Phase 2 — Identity and access control

**Tasks:** F-012  
**Outcome:** real accounts and server-enforced roles.

- Registration with role, login/logout, hashed passwords, sessions.
- Authorization middleware; object-level ownership checks.

**Exit gate:** tests prove a buyer cannot reach seller routes and a seller cannot modify another seller's auction.

## Phase 3 — Catalog and seller management

**Tasks:** F-013, F-015  
**Outcome:** auctions are stored and served by the API.

- List, filter, search, detail with masked bid history.
- Seller create/list/delete, image upload (type and size validated).

**Exit gate:** seed data matches the frontend sample data; deleting an auction with bids is rejected.

## Phase 4 — Bidding core

**Tasks:** F-014 (requires ADR-0007 accepted)  
**Outcome:** safe, concurrent bidding.

- Compare-and-set bid placement in one transaction, idempotency keys.
- Concurrency tests on PostgreSQL.

**Exit gate:** N parallel bids with the same minimum amount produce exactly one success; retries never duplicate a bid.

## Phase 5 — Buyer engagement and support

**Tasks:** F-016, F-017, F-018  
**Outcome:** favorites, "My bids", notifications, and tickets are real.

- Scheduler for ending-soon and auction-closed events (idempotent).
- Ticket replies come from administrators, not a simulation.

**Exit gate:** closing an auction twice does not create duplicate winner notifications.

## Phase 6 — Administration and integration

**Tasks:** F-019, F-020  
**Outcome:** a usable end-to-end product.

- Administrator panel and audit log.
- The frontend talks to the API; the simulation layer is deleted.

**Exit gate:** Playwright journeys pass for buyer, seller, and administrator.

## Phase 7 — Real-time and optional features

**Tasks:** F-021, F-023 (if approved)  
**Outcome:** live price updates; payments only after an explicit decision.

## Phase 8 — Production readiness

**Tasks:** F-022  
**Outcome:** deployable and supportable service.

- Security review and dependency audit, backup and restore exercise, PostgreSQL migration validation, runbook.

**Release gate:** all P0 tasks Done, no open critical security or data-integrity issue, restore test successful, and the open decisions in `docs/SRS.md` §13 resolved.
