# AGENTS.md — Engineering Rules for AI Agents and Contributors

## 1. Mission and product context

You are contributing to **Ojbaha (اوج‌بها)**, an online auction platform. The system has three primary roles plus anonymous visitors:

1. **Buyer** — browses auctions, places bids, tracks bid status, favorites auctions, receives notifications, contacts support.
2. **Seller** — publishes auctions (title, category, description, base price, bid step, duration, image), monitors and removes own auctions, contacts support.
3. **Platform Administrator** — manages users, moderates auctions, answers support tickets, configures platform limits, and audits privileged actions. *(Planned; not yet implemented.)*
4. **Visitor** — can browse auctions and read public information without an account.

The product is an auction engine, not a catalog. Correctness of bidding rules, time handling, money amounts, authorization, privacy, and auditability is critical.

Your job is to make the smallest correct, maintainable, secure change that satisfies an approved specification. Do not silently expand scope.

Project context: this is a university project (Software Engineering II). The frontend was built before this workflow was adopted (see section 3A). Everything from now on must follow the workflow below.

## 2. Source-of-truth hierarchy

When instructions conflict, use this order:

1. Explicit user instruction for the current task.
2. Approved feature `SPEC.md`.
3. Approved feature `PLAN.md`.
4. Accepted ADRs in `docs/adr/`.
5. `docs/SRS.md` and `docs/ARCHITECTURE.md`.
6. Existing implementation and tests.
7. Your assumptions.

Never treat an assumption as an approved requirement. Record unresolved questions in the feature spec and ask for clarification when the answer changes data integrity, security, user-visible behavior, or scope.

## 3. Mandatory feature intake gate

Before implementing any new feature or material behavior change:

1. Read this file and the relevant architecture, SRS, ADRs, and existing code.
2. Add the feature to `Task-List.md` with a unique ID (`F-###`), status, priority, dependencies, and links.
3. Create `docs/features/<FEATURE-ID>-<short-name>/`.
4. Create both `SPEC.md` and `PLAN.md` there, using `docs/templates/`.
5. In `SPEC.md`, define problem, actors, scope, non-goals, user journey, requirements, business rules, API/UI behavior, data impact, security/privacy, edge cases, and measurable acceptance criteria.
6. In `PLAN.md`, list ordered implementation steps, tests to write first, migration/rollback approach, documentation changes, and completion checks.
7. Identify architectural decisions. If a decision changes system boundaries, data model strategy, consistency, security, deployment, integrations, or a long-lived dependency, create an ADR in `docs/adr/`. If none is needed, state why in the plan.
8. Obtain human approval of SPEC and PLAN when the work changes product behavior, data contracts, security, or architecture.
9. Only then begin implementation.

Do not create empty placeholder specs to bypass this gate. A small bug fix may use a lightweight entry, but any behavior change still requires a test and documented expected behavior.

## 3A. Legacy baseline and retroactive documentation

Features F-001 to F-008 (the React frontend with a client-side simulation layer) were implemented **before** this workflow existed. Therefore:

- Their documentation lives in `docs/features/BASELINE-frontend-v1/` and is explicitly marked **Retroactive**: it describes what was built, not what was planned first.
- Never claim that baseline code was developed with TDD, and never present retroactive documents as prospective ones.
- When you modify baseline code, first add a **characterization test** that pins the current behavior, then change the code (Red → Green → Refactor).
- Retroactive ADRs (0001–0004, 0008) record decisions already taken; their "Documentation mode" field says so.

## 4. Required development method: TDD

Use Red → Green → Refactor for every behavior change:

1. **Red:** write a focused test that expresses the required behavior and fails for the expected reason.
2. **Green:** implement the minimum code needed to pass.
3. **Refactor:** improve structure without changing behavior; keep tests green.
4. Add a regression test for every discovered defect.
5. Run the relevant test suite after each meaningful change.

Do not write implementation first and add superficial tests afterwards. Tests assert observable behavior, not private implementation details.

### Test layers

- **Unit:** pure business rules in `client/src/utils` and backend domain modules (minimum next bid, user bid status, validation, search matching, price-chart scaling).
- **Component:** React components with React Testing Library (forms, guards, empty/error states).
- **Integration:** API endpoints with a real database, repositories, transactions, migrations.
- **Contract:** request/response schemas shared between client and server.
- **End-to-end:** critical journeys (Playwright): browse → sign up → bid → see status; seller creates auction.
- **Security:** authorization boundaries, object-level access, input validation, rate limits.
- **Concurrency:** simultaneous bids on the same auction. These must run against PostgreSQL.

SQLite is acceptable for fast local tests but cannot prove production concurrency. Do not claim bid-concurrency correctness from SQLite results alone.

Test tooling (Vitest, React Testing Library, Playwright, backend test runner) is introduced by task **F-009** and confirmed in ADR-0006.

## 5. Architecture principles

- Single-page React frontend + REST API + **modular monolith** backend (ADR-0005).
- Keep business rules out of UI components and HTTP handlers. Frontend: `utils/`. Backend: domain/use-case layers.
- Separate API (HTTP), application (use cases), domain (rules), and infrastructure (database, email, storage).
- Depend on interfaces at module boundaries; isolate email, payment, and storage behind adapters.
- Prefer boring, proven technology. Avoid microservices, event sourcing, CQRS, and distributed locks.
- No Docker and no Redis in the current scope (course constraint). Do not introduce either without an ADR.
- Persist instants in UTC; format for display only at the edge (ADR-0008).

## 6. Backend rules

(Stack per ADR-0006: Node.js, TypeScript strict mode, Express. Update this section if the ADR changes.)

- Routers handle HTTP concerns only: parsing, authentication context, response mapping, status codes.
- Use cases live in application services; invariants live in domain code.
- Validate every external input with a schema (e.g., `zod`) at the boundary. Never expose database rows directly; map to response DTOs.
- Use explicit, request-scoped transactions. Never rely on schema auto-sync in production; every schema change needs a migration.
- Do not perform network calls while holding a transaction or lock.
- Use stable error codes and one error envelope: `{ "code": "...", "message": "..." }`. User-facing messages are Persian and formal.
- Check ownership and role on **every** protected operation, server-side.
- Paginate any unbounded collection.
- Use idempotency keys for bid creation and other retry-sensitive commands.
- Never log passwords, tokens, or unnecessary personal data.

## 7. Auction, bidding, time, and money correctness rules

Bidding correctness is a critical invariant:

- Money is an **integer number of Toman**. Never use floating point for money.
- The minimum next bid is `highest_bid + bid_step`, or `start_price` when there is no bid. A bid below it is rejected.
- Bid amounts for one auction are **strictly increasing** in server commit order. Two concurrent bids with the same minimum amount must result in exactly one success and one `409` conflict.
- A bid is accepted only while `server_now < end_at` (half-open interval `[start, end)`). Client clocks are never trusted.
- The current highest bidder cannot raise their own bid. Sellers cannot bid. A seller can never bid on their own auction.
- Bids are immutable and cannot be withdrawn. Keep them for history and audit.
- The winner is the highest bid when the auction ends; ties are impossible by the strictly-increasing rule.
- A seller may delete an auction only when it has no bids.
- Prices shown by the UI are advisory. The bid command must revalidate inside the authoritative transaction (ADR-0007).
- Public bid history shows masked bidder names; the full identity is visible only to the bidder, the seller where policy allows, and administrators.
- Store timestamps in UTC ISO 8601. Do not store display strings.
- Persist a snapshot of material terms (title, start price, step) needed to interpret history if the auction is later edited.

## 8. Frontend rules

- React with TypeScript in strict mode; function components and hooks only.
- Keep `pages/`, `components/<area>/`, `hooks/`, `data/`, and `utils/` separate. Place a new component in the matching area folder (`auction`, `layout`, `sidebar`, `notifications`, `search`, `auth`, `support`, `seller`, `landing`, `ui`).
- Shared types live in `src/types.ts`. Pages read shared state through `useAppContext()`.
- Colors come only from the CSS-variable tokens in `index.css` (Tailwind theme names such as `bg-surface`, `text-muted`). Do not hard-code hex colors in components. Every screen must work in light and dark themes.
- The app is RTL. Use logical properties (`start`/`end`, `ps`/`pe`) where possible; chart plots may force `dir="ltr"` explicitly.
- All UI text is **Persian, formal register** (address the user with «شما»). Numbers are formatted with `fa-IR`. Code, identifiers, and documentation are in English.
- Provide loading, empty, success, error, and retry states. Ensure keyboard access, semantic HTML, visible focus, labels, and accessible errors.
- Respect `prefers-reduced-motion`. Animations must be decorative only.
- Authorization in the UI is a convenience. The backend is authoritative.
- Avoid giant components and duplicated rules; move logic to `utils/` and test it.

## 9. API and compatibility

- Prefix the public API with `/api/v1`.
- Use explicit request/response schemas, consistent naming, status codes, pagination, and error shapes.
- No breaking API change without a documented migration plan.
- Use UTC ISO 8601 for timestamps and integer Toman for money in payloads.

## 10. Security and privacy baseline

- Least privilege and deny by default. Enforce roles and resource ownership in use cases.
- Hash passwords with a modern algorithm (Argon2id or bcrypt with a safe cost) via a maintained library.
- Use `HttpOnly`, `Secure`, `SameSite` cookies for sessions where feasible; define CSRF/XSS mitigations in an ADR.
- Rate-limit login, registration, and bid endpoints.
- Validate uploads by type, size (≤ 1 MB per image), and content; use random file names; never serve user files from a path that can execute code.
- Keep secrets out of source control and the frontend bundle. `.env` is never committed.
- Keep audit records for privileged actions and auction state changes.
- Render user-provided text as text, never as HTML.
- Do not claim legal compliance without a documented legal review.

## 11. Database and migrations

- SQLite: local development and fast tests that do not depend on PostgreSQL behavior.
- PostgreSQL: production and the authoritative database for concurrency, locking, and migration validation.
- Use portable SQL types where possible; isolate PostgreSQL-specific features behind migrations/repositories and document them.
- Migrations are deterministic, reviewed, and reversible where practical. Test them on PostgreSQL.
- Never use SQLite in production.

## 12. External integrations and side effects

- Email, SMS, payment, and storage providers sit behind adapter interfaces.
- Send notifications and call external systems only **after** the database transaction commits (outbox pattern when reliability matters).
- Scheduled work (auction end, winner determination, ending-soon reminders) must be idempotent: running it twice must not duplicate results.
- Retry transient failures with bounded backoff; route exhausted failures to a reviewable state.

## 13. Observability and operations

- Structured logs with a request ID. Expose `/api/v1/health` without leaking internals.
- Track bid conflicts, API latency, error rates, and scheduler lag.
- Provide backup/restore and a short runbook before production use.
- Do not add monitoring infrastructure without a concrete need.

## 14. Code quality

- Follow the repository formatter, linter, and type-checker (`npm run typecheck` must pass).
- Prefer small functions with one responsibility and clear names.
- Avoid broad `catch`; translate known errors at boundaries.
- Never weaken or skip a failing test to get a green build.
- Do not add a dependency without stating why and checking maintenance and licence. Update the relevant ADR when material.
- Remove dead code and unused dependencies you introduce.
- No `TODO` comments as a substitute for required work; create a tracked task instead.

## 15. Required workflow for every task

Before editing:
- Inspect repository structure, relevant modules, tests, and docs.
- Read the linked SPEC, PLAN, and ADRs.
- Confirm the task is approved and not blocked.
- State assumptions and the files you expect to change.

During work:
- Follow TDD. Keep changes scoped.
- Update tests, schemas, migrations, docs, and examples together.
- Never fabricate command output or claim tests ran if they did not.

Before completion:
- Run formatter, linter, type check, focused tests, then the relevant full suite.
- Run PostgreSQL integration/concurrency tests when persistence or bidding is touched.
- Review migration upgrade and rollback.
- Check authorization and privacy implications.
- Update `Task-List.md`, the feature `PLAN.md`, and relevant docs.
- Report exactly what changed, which commands were actually run, results, limitations, and follow-ups.

## 16. Definition of Ready (DoR)

A feature is Ready only when:
- It has a Task-List entry and unique ID.
- `SPEC.md` and `PLAN.md` exist and are reviewed.
- Journeys and acceptance criteria are testable.
- Dependencies and non-goals are explicit.
- Data/API/security implications are identified.
- Required ADRs exist, or the plan says why none is needed.
- The test strategy is defined, including PostgreSQL tests when relevant.

## 17. Definition of Done (DoD)

A feature is Done only when:
- All acceptance criteria pass.
- TDD evidence exists in the test suite (or an explicit, recorded deviation).
- Relevant unit, component, integration, and E2E tests pass.
- PostgreSQL-specific tests pass where applicable.
- Authorization, validation, error, and edge cases are covered.
- Migrations and rollback notes are complete.
- API documentation and user-facing behavior are updated, in light and dark themes.
- No known critical security or data-integrity defect remains.
- `Task-List.md` and `PLAN.md` are updated.
- An honest completion report is provided.

## 18. Agent communication protocol

For each task, report:
1. Task ID and linked specification.
2. Understanding of expected behavior.
3. Assumptions and unresolved questions.
4. Planned files/modules and tests.
5. Implementation summary.
6. Tests and commands actually executed, with results.
7. Migration/operational impact.
8. Remaining risks or follow-up tasks.

If asked to implement a feature without its SPEC/PLAN, stop at the intake gate and create or request approval for those documents. Do not bypass this rule because a change looks small.

## 19. Git workflow

- `main`: stable. `dev`: integration branch. All work happens on short-lived branches: `feature/…`, `fix/…`, `chore/…`, `refactor/…`, `docs/…`.
- One Task ID per Pull Request; the PR description links the SPEC/PLAN and lists the tests run.
- Merge into `dev` through a Pull Request; never commit directly to `main`.
- Commit messages are English, imperative, and reference the Task ID when one exists (for example `F-010: add not-found page`).
- Never commit `.env`, build output, or `node_modules`.

## 20. Recording deviations

If a rule here cannot be followed (for example, tests are impossible because tooling does not exist yet), do not hide it. Record the deviation in the feature `PLAN.md` under "Deviations", say why, and create a Task-List entry to close the gap.
