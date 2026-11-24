# ADR-0006: Backend technology stack

- **Status:** Proposed — recommended choice below; accept after the instructor (and the backend teammate, if any) confirm
- **Date:** 2026-11-24 (first written 2026-11-21)
- **Documentation mode:** Prospective
- **Decision owners:** Project owner, backend developer

## Context
The frontend is React + TypeScript. The instructor's example used Vue + FastAPI + SQLite/PostgreSQL and accepted the languages of this project. The backend has not been started. The course baseline is: SQLite for development and tests, PostgreSQL for production, no Docker, no Redis. The bid compare-and-set update (ADR-0007) should be easy to read and review as SQL.

## Decision (proposed)
- **Runtime and language:** Node.js (the same version already required by the client) with TypeScript in strict mode; one language across the stack.
- **HTTP:** Express, with a small application factory (`createApp`) so tests can call the app without opening a port.
- **Validation:** `zod` at every boundary.
- **Data access:** **Kysely**, a typed SQL query builder. According to its documentation it works with PostgreSQL and SQLite, with built-in migrations (`up`/`down` functions run by a `Migrator`). Drivers: `better-sqlite3` for SQLite and `pg` for PostgreSQL. Kysely has no command-line tool, so the project provides its own `migrate` script.
- **Tests:** Vitest (already used by the client) and Supertest-style HTTP tests; in-memory SQLite for fast tests, PostgreSQL (`TEST_DATABASE_URL`) for concurrency and migration tests.
- **Security libraries:** `helmet`, `cors` (single allowed origin), a rate limiter, and a maintained password-hashing library (Argon2id or bcrypt).
- No Docker, no Redis. PostgreSQL is installed as a local service.

## Alternatives considered
- Other data layers (Drizzle, Prisma, Knex): not chosen because the project wants a thin, typed SQL layer where the central bid statement stays visible; this can be revisited if migrations or typing become painful.
- Python + FastAPI: matches the instructor's example but splits the codebase across two languages for a team fluent in TypeScript.
- SQLite only: simplest, but it cannot prove production concurrency (AGENTS.md §4).
- PostgreSQL in development as well: removes the dialect gap, at the cost of a local PostgreSQL for every developer (see fallback below).

## Consequences
- One language and shared domain types between client and server.
- Migrations must be portable: no database-specific column types unless the migration branches by dialect.
- `better-sqlite3` is a native module. If it cannot be installed on a developer's Node version or machine, the fallback is to use the local PostgreSQL service in development too; this ADR would then be amended (the code already selects the driver by configuration).
- If the instructor or teammate chooses another stack, this ADR is superseded and `AGENTS.md` §6 is updated.
- `docs/backend-tasks.md` (written earlier) said SQLite only; it is superseded by this ADR, the SRS (§14), and the Task-List.
