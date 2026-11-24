# Implementation Plan — F-011 Backend foundation

- Status: Draft
- Documentation mode: Prospective
- Related SPEC: `SPEC.md`
- Related ADRs: ADR-0005, ADR-0006, ADR-0008

## 1. Implementation approach
Create `server/` as an independent npm package (ESM, TypeScript strict). Keep an application factory (`createApp`) separate from the code that opens a port. Every item below is written test-first.

Proposed layout:
```
server/
  package.json  tsconfig.json  .env.example
  src/
    server.ts          opens the port, handles shutdown
    app.ts             createApp(deps)
    config.ts          environment schema
    errors.ts          AppError, error envelope
    middleware/        requestId, notFound, errorHandler
    modules/health/    health router
    db/                connection (Kysely), migrate.ts, migrations/
    test/              setup, helpers
```

## 2. Ordered tasks
1. **Package setup.** Create the package, TypeScript config, scripts (`dev`, `build`, `start`, `typecheck`, `test`, `test:pg`, `migrate`, `migrate:down`). Install runtime packages (express, zod, kysely, better-sqlite3, pg, helmet, cors) and development packages (typescript, tsx, vitest, supertest, and the `@types/*` packages). Check names before installing.
2. **Configuration.** Red: `config.test.ts` (valid input, missing variable, bad number, secrets not printed). Green: `config.ts`.
3. **Error envelope and 404/500/400.** Red: tests for `NOT_FOUND`, `INTERNAL_ERROR`, `INVALID_JSON`. Green: `errors.ts` and middleware.
4. **Request ID.** Red: generated ID, reused valid ID, rejected invalid ID. Green: middleware; include the ID in error bodies and logs.
5. **Security headers and CORS.** Red: allowed origin gets headers, other origin does not. Green: `helmet` and `cors`.
6. **Database module.** Red: SQLite in-memory connection answers a trivial query; unknown `DB_DRIVER` is rejected. Green: `db/connection.ts` (the only place that imports drivers).
7. **Health endpoint.** Red: `200 ok` with database up; `503 degraded` when the database check fails (injected failing database). Green: health module.
8. **Migrations.** Red: runner applies a temporary migration once, second run does nothing, rollback undoes the last one. Green: `db/migrate.ts`, naming convention `YYYYMMDD_NNN_name`, migrations "frozen in time" (never import application code).
9. **PostgreSQL smoke test.** Install PostgreSQL locally as a service, create a test database, set `TEST_DATABASE_URL`, and run the same migration test on PostgreSQL (`npm run test:pg`).
10. **Documentation.** `.env.example`, `.gitignore` (`.env`, `*.sqlite`, `dist`), server section in the root `README.md`, `Task-List.md` (F-011 → Done), ARCHITECTURE notes if the layout changed.

## 3. Database and migration plan
No business tables. The migration mechanism is validated with temporary migrations in tests. The first real migration arrives with F-012 (users).

## 4. API and frontend plan
Only `GET /api/v1/health`. The frontend is untouched.

## 5. Test plan
Unit: configuration. Integration: HTTP behavior through `createApp()`; database and migrations on SQLite; the same migration test on PostgreSQL when configured. Manual: start the real server and open the health URL.

## 6. Observability and operations
Structured JSON logs with the request ID. Health endpoint as the operational probe.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| `better-sqlite3` fails to install on Windows | Use PostgreSQL in development too and amend ADR-0006 |
| Local PostgreSQL setup takes time | Task 9 is last; earlier tasks only need SQLite |
| Over-building the foundation | Scope list in SPEC §4 is the limit; no business tables |
| Different Node versions between client and server | Use the same version; record it in the README |

## 8. Rollout and rollback
Branch `feature/backend-foundation`, Pull Request to `dev`. The package is isolated; rollback is a revert.

## 9. Completion checklist
- [ ] Acceptance criteria pass.
- [ ] Tests were written first and are committed first (Red) where practical.
- [ ] `npm run typecheck` and `npm test` pass in `server/`.
- [ ] PostgreSQL smoke test passes or is explicitly recorded as pending.
- [ ] Docs and Task-List updated.

## 10. Deviations
None expected.
