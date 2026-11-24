# Feature Specification — F-011 Backend foundation

- Status: Review
- Documentation mode: Prospective
- Owner: Project owner
- Related backlog item: F-011
- Related ADRs: ADR-0005 (modular monolith), ADR-0006 (stack, proposed), ADR-0008 (money and time)

## 1. Problem and objective
There is no server. Every later backend feature needs the same base: a running API skeleton, validated configuration, a uniform error format, request tracing, a health endpoint, database access for SQLite and PostgreSQL, and a migration mechanism. This feature builds that base and nothing else.

## 2. Actors and permissions
Developers and AI agents. Operators (health endpoint). No end-user feature is added.

## 3. User journeys
**Developer:** clones the repository → installs → copies `.env.example` to `.env` → runs the migrations → starts the API → opens `/api/v1/health` and sees "ok" → runs the tests.
**Failure paths:** a required variable is missing (the process stops with a clear message); the database is unreachable (health reports it); an unknown URL is requested (JSON 404).

## 4. Scope
### In scope
- A `server/` package (TypeScript, strict) next to `client/`.
- Application factory, server entry point, graceful start and stop.
- Configuration from environment variables, validated with a schema.
- Request ID middleware, error envelope, JSON 404, invalid-JSON handling.
- Security headers and CORS for one configured origin.
- `GET /api/v1/health` with a database check.
- Database module: Kysely with `DB_DRIVER=sqlite|postgres`.
- Migration runner (`migrate`, `migrate:down`) and the project's migration conventions.
- Test setup: unit and integration tests; PostgreSQL tests that are skipped without `TEST_DATABASE_URL`.
- `.env.example`, `.gitignore` entries, and server instructions in the root `README.md`.
### Out of scope
- Authentication, business tables, and business endpoints (F-012 onward).
- CI pipeline (F-022), Docker, Redis.
- Image uploads (F-015).

## 5. Functional requirements
- **FR-BE-001** `npm run dev` shall start the API with automatic reload on the configured port; `npm start` shall run the compiled output.
- **FR-BE-002** Configuration shall be read from the environment and validated at startup. An invalid or missing required value shall stop the process with a message that names the variable and never prints secret values.
- **FR-BE-003** `GET /api/v1/health` shall return `200 { "status": "ok", "db": "up", "time": <UTC ISO> }` when the database answers, and `503 { "status": "degraded", "db": "down", "time": … }` otherwise. It shall not expose versions, paths, or stack traces.
- **FR-BE-004** Every response shall include `X-Request-Id`. A valid incoming `X-Request-Id` shall be reused; otherwise one shall be generated. Error bodies shall include `requestId`.
- **FR-BE-005** Unknown routes shall return `404 { "code": "NOT_FOUND", "message": …, "requestId": … }`. Unhandled errors shall return `500 { "code": "INTERNAL_ERROR", … }` without a stack trace.
- **FR-BE-006** A request body that is not valid JSON shall return `400 { "code": "INVALID_JSON", … }`.
- **FR-BE-007** CORS shall allow only `CLIENT_ORIGIN`, with credentials. Other origins shall receive no CORS headers.
- **FR-BE-008** Only one module shall create the database connection, selected by `DB_DRIVER`. No other module shall import a database driver.
- **FR-BE-009** `npm run migrate` shall apply pending migrations and be safe to run twice; `npm run migrate:down` shall roll back the latest migration (development only).
- **FR-BE-010** `npm test` shall run the unit and integration tests on in-memory SQLite. `npm run test:pg` shall run PostgreSQL tests when `TEST_DATABASE_URL` is set and say clearly that it skipped them otherwise.
- **FR-BE-011** `.env.example` shall document every variable; `.env` shall be ignored by Git.
- **FR-BE-012** Error messages shown to users shall be Persian and formal; error `code` values are stable English identifiers.

## 6. Business rules and invariants
- Time is UTC ISO 8601; the server clock is authoritative (ADR-0008).
- Secrets never appear in logs, responses, or Git.

## 7. UX/API behavior
Only operational endpoints. Error envelope: `{ "code": string, "message": string, "requestId": string }`.

## 8. Data impact
No business tables. The migration mechanism creates its own bookkeeping tables.

## 9. Security and privacy
Security headers on every response; one allowed CORS origin; no stack traces; request bodies are size-limited; logs are structured and contain no personal data or secrets.

## 10. Edge cases
Port already in use; invalid `DB_DRIVER`; SQLite file path not writable; PostgreSQL unreachable at startup (the process still starts; health reports `down`); two concurrent `migrate` runs; oversized body; invalid `X-Request-Id`.

## 11. Acceptance criteria
1. **Given** a clean clone, **when** the developer follows the README, **then** the API starts and `/api/v1/health` returns `200` with `"db": "up"`.
2. **Given** `PORT` is not a number, **when** the process starts, **then** it exits with a message naming `PORT`.
3. **Given** an unknown path, **then** the response is `404` with code `NOT_FOUND` and a `requestId`.
4. **Given** a request with a valid `X-Request-Id`, **then** the same ID is returned in the header.
5. **Given** malformed JSON, **then** the response is `400 INVALID_JSON`.
6. **Given** a request from another origin, **then** the response has no CORS allow headers.
7. **Given** the database is unreachable, **then** health returns `503` with `"db": "down"`.
8. **Given** `npm run migrate` twice, **then** the second run changes nothing and exits successfully.
9. **Given** `TEST_DATABASE_URL` is unset, **when** `npm run test:pg` runs, **then** it reports that the PostgreSQL tests were skipped.

## 12. Test strategy
TDD with Vitest and Supertest-style requests against `createApp()` without a network port. Configuration tests are pure unit tests. Migration tests use temporary migrations on in-memory SQLite and, when available, on PostgreSQL.

## 13. Dependencies and open questions
Requires ADR-0006 accepted. Open: whether `better-sqlite3` installs cleanly on the developer's machine (fallback in ADR-0006).

## 14. Definition of Ready
- [x] Task-List entry
- [x] SPEC and PLAN
- [ ] ADR-0006 accepted (blocking)
- [x] Testable acceptance criteria
