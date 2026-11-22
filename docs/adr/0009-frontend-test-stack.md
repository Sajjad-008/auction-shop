# ADR-0009: Frontend test stack

- **Status:** Proposed (accepted when F-009 is merged)
- **Date:** 2026-11-22
- **Documentation mode:** Prospective
- **Decision owners:** Project owner

## Context
AGENTS.md requires TDD, but the repository has no test runner. The frontend uses Vite and React with TypeScript. The test runner should reuse the Vite configuration.

## Decision
- **Vitest** as the runner (reads `vite.config.ts`), with the **jsdom** environment.
- **React Testing Library** (`@testing-library/react`, `@testing-library/dom`) for component tests, **`@testing-library/jest-dom`** matchers, and **`@testing-library/user-event`** for interactions.
- Globals are **off**: tests import `describe`, `it`, `expect`, and `vi` from `vitest`. Cleanup is registered explicitly in `src/test/setup.ts`.
- Test files live next to the code (`*.test.ts`, `*.test.tsx`) and are type-checked by `npm run typecheck`.
- Time-dependent tests use fake timers with a fixed date; browser APIs missing in jsdom (`matchMedia`) are stubbed in the setup file.
- **Playwright** (end-to-end) is deferred until real user journeys exist against the API (F-020).

## Alternatives considered
- Jest: needs a separate transform/config for TypeScript and Vite-specific code.
- Cypress/Playwright component testing: heavier and unnecessary for current needs.

## Consequences
- Only development dependencies are added; the production bundle does not change.
- Rule tests are fast and run on every change.
- jsdom is not a real browser: layout, CSS, and animation behavior are verified manually or by later E2E tests.
