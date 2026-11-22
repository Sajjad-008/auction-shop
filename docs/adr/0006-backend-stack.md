# ADR-0006: Backend technology stack

- **Status:** Proposed — confirm with the instructor and the backend developer before F-011
- **Date:** 2026-11-21
- **Documentation mode:** Prospective
- **Decision owners:** Project owner, backend developer

## Context
The frontend is React + TypeScript. The instructor's example used Vue + FastAPI + SQLite/PostgreSQL, and the instructor accepted the languages of this project. The backend stack was not yet fixed.

## Decision (proposed)
- Runtime: Node.js with TypeScript (strict), Express.
- Validation: `zod` at every boundary. Shared types with the client where practical.
- Database: **SQLite** for local development and fast tests; **PostgreSQL** for production and for concurrency/migration tests.
- Data access and migrations: one query builder or ORM with versioned migrations that supports both databases (candidates: Drizzle, Kysely, Prisma). The final choice is recorded here before F-011 starts.
- Tests: Vitest for unit/integration; Supertest-style HTTP tests; Playwright for E2E.
- No Docker, no Redis. PostgreSQL is installed as a local service for tests.

## Alternatives considered
- Python + FastAPI: matches the instructor's example, but splits the codebase across two languages for a team fluent in TypeScript.
- SQLite only: simplest, but cannot validate production concurrency (see AGENTS.md §4).

## Consequences
- A single language across the stack; shared domain types.
- If the instructor or teammate chooses another stack, this ADR is superseded and `AGENTS.md` §6 is updated.
- `docs/backend-tasks.md` (written earlier) said SQLite only; it is superseded by this ADR and the Task-List.
