# Task List

This file is the project-wide intake and delivery control. Every feature must be registered here before implementation. A task is not Ready until its `SPEC.md` and `PLAN.md` exist and are reviewed (see `AGENTS.md`, section 3).

## Status definitions

- `Proposed` — captured, not yet specified.
- `Specifying` — SPEC/PLAN are being prepared.
- `Review` — awaiting product/architecture approval.
- `Ready` — approved and eligible for implementation.
- `In Progress` — implementation underway using TDD.
- `Blocked` — waiting for a dependency or decision.
- `In Review` — implementation complete, awaiting verification.
- `Done` — Definition of Done satisfied.
- `Done (baseline)` — implemented **before** the workflow existed; documented retroactively; characterization tests still required (F-009).
- `Deferred` — intentionally postponed, with rationale.

## Priority definitions

- `P0` — release blocker, security, or core data integrity.
- `P1` — required for the first usable release.
- `P2` — valuable; can follow the first release.
- `P3` — optional enhancement.

## Feature intake checklist

For every new feature:
- [ ] Assign a unique ID (`F-###`).
- [ ] Add the task below with priority, dependencies, status, and links.
- [ ] Create `docs/features/F-###-short-name/SPEC.md` and `PLAN.md` from `docs/templates/`.
- [ ] Describe the journey for each affected role (buyer / seller / admin).
- [ ] Add testable acceptance criteria and edge cases.
- [ ] Identify data, API, authorization, privacy, and operational impact.
- [ ] Create required ADR(s), or document why none is needed.
- [ ] Review and approve before implementation.
- [ ] Implement Red → Green → Refactor.
- [ ] Update this list and the feature PLAN at completion.

## A. Frontend baseline (retroactive)

All baseline features are documented together in `docs/features/BASELINE-frontend-v1/` (SPEC and PLAN are marked **Retroactive**). They run on a client-side simulation layer (ADR-0003) and have **no automated tests yet**.

| ID | Feature | Priority | Status | Dependencies | Specification | Plan |
|---|---|---:|---|---|---|---|
| F-001 | Frontend foundation: Vite, React, TypeScript, Tailwind, router, theming (light/dark), RTL, Persian formal UI | P0 | Done (baseline) | — | `docs/features/BASELINE-frontend-v1/SPEC.md` §F-001 | `…/PLAN.md` |
| F-002 | Public catalog: landing page, auction list, active auctions with filters and sorting, search with category, auction detail, countdown, price-history chart | P1 | Done (baseline) | F-001 | `…/SPEC.md` §F-002 | `…/PLAN.md` |
| F-003 | Identity UI and roles (buyer/seller): sign up, login, role guard — **simulated, no real authentication** | P0 | Done (baseline) | F-001 | `…/SPEC.md` §F-003 | `…/PLAN.md` |
| F-004 | Bidding UI: bid form, minimum-increment rule, confirmation step, "My bids" statuses — **rules enforced only in the browser** | P0 | Done (baseline) | F-002, F-003 | `…/SPEC.md` §F-004 | `…/PLAN.md` |
| F-005 | Favorites | P2 | Done (baseline) | F-003 | `…/SPEC.md` §F-005 | `…/PLAN.md` |
| F-006 | Notifications: bell, unread count, notifications page — **local only** | P1 | Done (baseline) | F-003 | `…/SPEC.md` §F-006 | `…/PLAN.md` |
| F-007 | Support tickets: list, new ticket with images, chat, close/reopen — **auto-replies are simulated** | P1 | Done (baseline) | F-003 | `…/SPEC.md` §F-007 | `…/PLAN.md` |
| F-008 | Seller panel: dashboard, my auctions, create (with live preview), delete without bids | P1 | Done (baseline) | F-003 | `…/SPEC.md` §F-008 | `…/PLAN.md` |

## B. New work (follows the full workflow)

| ID | Feature / Workstream | Priority | Status | Dependencies | Specification | Plan |
|---|---|---:|---|---|---|---|
| F-009 | Test foundation: Vitest, React Testing Library, jest-dom; characterization tests for `utils/auction`, `utils/validation`, `utils/search` (Playwright is deferred to F-020) | P0 | Done | F-001 | `docs/features/F-009-test-foundation/SPEC.md` | `docs/features/F-009-test-foundation/PLAN.md` |
| F-010 | Custom 404 page for unknown routes (navigation options only) | P1 | Done | F-001, F-009 | `docs/features/F-010-not-found-page/SPEC.md` | `docs/features/F-010-not-found-page/PLAN.md` |
| F-011 | Backend foundation: `server/` package, configuration, error envelope, request IDs, health endpoint, database access, migrations (CI is deferred to F-022) | P0 | Review | ADR-0006 | `docs/features/F-011-backend-foundation/SPEC.md` | `docs/features/F-011-backend-foundation/PLAN.md` |
| F-012 | Identity and RBAC: registration, login, sessions, password hashing, roles from the server | P0 | Proposed | F-011 | `docs/features/F-012-identity-rbac/SPEC.md` | `…/PLAN.md` |
| F-013 | Auction catalog API: list, filter, search, detail, bid history (masked names) | P1 | Proposed | F-011 | `docs/features/F-013-catalog-api/SPEC.md` | `…/PLAN.md` |
| F-014 | Bidding core: transactional bid placement, idempotency, concurrency tests on PostgreSQL | P0 | Proposed | F-012, F-013, ADR-0007 | `docs/features/F-014-bidding-core/SPEC.md` | `…/PLAN.md` |
| F-015 | Seller auction management API and image upload | P1 | Proposed | F-012, F-013 | `docs/features/F-015-seller-api/SPEC.md` | `…/PLAN.md` |
| F-016 | Favorites and "My bids" APIs | P1 | Proposed | F-012, F-014 | `docs/features/F-016-favorites-mybids-api/SPEC.md` | `…/PLAN.md` |
| F-017 | Server-side notifications and scheduled events (outbid, ending soon, auction closed, winner) | P1 | Proposed | F-014 | `docs/features/F-017-notifications-api/SPEC.md` | `…/PLAN.md` |
| F-018 | Support tickets API with administrator replies | P1 | Proposed | F-012 | `docs/features/F-018-support-api/SPEC.md` | `…/PLAN.md` |
| F-019 | Platform administration: users, moderation, platform limits, audit log | P1 | Proposed | F-012, F-018 | `docs/features/F-019-admin/SPEC.md` | `…/PLAN.md` |
| F-020 | Frontend ↔ API integration: replace the simulation layer, remove fake data and fake support replies | P0 | Proposed | F-012–F-018 | `docs/features/F-020-api-integration/SPEC.md` | `…/PLAN.md` |
| F-021 | Live price updates (polling first, then Server-Sent Events) | P2 | Proposed | F-014, F-020 | `docs/features/F-021-live-updates/SPEC.md` | `…/PLAN.md` |
| F-022 | Production readiness: security review, backups, PostgreSQL migration validation, runbook | P0 | Proposed | F-011–F-020 | `docs/features/F-022-production-readiness/SPEC.md` | `…/PLAN.md` |
| F-023 | Payments / escrow | P3 | Deferred | F-014 | — | — |
| F-024 | Access-denied (403) page, `admin` role in the UI model, and `/admin/*` route guard with a placeholder page | P1 | Done | F-003, F-009 | `docs/features/F-024-access-denied-page/SPEC.md` | `docs/features/F-024-access-denied-page/PLAN.md` |

SPEC/PLAN folders for F-012–F-022 do not exist yet. Create each one **before** starting that task.

## Current sprint

| Order | Task | Next action |
|---:|---|---|
| 1 | ADR-0006 | Confirm the backend stack (recommended: Node.js, TypeScript, Express, Kysely) and mark the ADR Accepted. |
| 2 | F-011 | Review SPEC/PLAN, then implement with TDD (tests first). |
| 3 | F-012 | Write SPEC and PLAN while F-011 is being built. |

## Change log

| Date | Change |
|---|---|
| 2026-11-21 | Workflow adopted. Baseline frontend registered retroactively (F-001–F-008). Backlog F-009–F-023 created. |
| 2026-11-22 | F-009 and F-024 specified; F-010 scope simplified; ADR-0009 (frontend test stack) added; ADR-0004 addendum; SRS requirements FR-ID-006/007, FR-AD-006 updated. |
| 2026-11-24 | F-009, F-010, F-024 marked Done. SRS v1.1 (backend requirements, recommended defaults). F-011 specified. ADR-0006 detailed. |
