# Implementation Plan — F-009 Test foundation

- Status: In Progress
- Documentation mode: Prospective
- Related SPEC: `SPEC.md`
- Related ADRs: ADR-0009

## 1. Implementation approach
Add Vitest to the existing Vite project, keep globals off, and write fixtures plus characterization tests next to the code under test.

## 2. Ordered tasks
1. Install dev dependencies: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`.
2. Import `defineConfig` from `vitest/config` in `vite.config.ts` and add the `test` block (jsdom, setup file, restore mocks).
3. Add `src/test/setup.ts` (jest-dom matchers, cleanup after each test, `matchMedia` stub that reports "reduced motion" so decorative animation never runs in tests).
4. Add `src/test/fixtures.ts` (fixed `NOW`, `makeAuction`, `makeBid`).
5. Add scripts `test` and `test:watch` to `package.json`.
6. Write the characterization tests: `utils/auction.test.ts`, `utils/validation.test.ts`, `utils/search.test.ts`.
7. Mutation sanity check: break `getMinNextBid` (remove `+ a.bidStep`), confirm failure, restore the file with Git.
8. Run `npm test`, `npm run typecheck`, `npm run build`.
9. Update `Task-List.md` (F-009 → Done) and commit.

## 3. Database and migration plan
None.

## 4. API and frontend plan
No behavior change.

## 5. Test plan
The tests themselves; plus the mutation check (task 7).

## 6. Observability and operations
None.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Version mismatch between Vitest and Vite 8 | Install the latest `vitest`; if npm reports a peer-dependency conflict, report it and pin a compatible version in this plan |
| jsdom lacks `matchMedia` | Stub in `setup.ts` |
| Tests depend on locale formatting (ICU) | Assert on structure, not exact separators |
| Flaky time-based tests | Fake timers with a fixed date |

## 8. Rollout and rollback
Branch `feature/test-foundation`, Pull Request to `dev`. Rollback: revert the PR.

## 9. Completion checklist
- [ ] `npm test` passes.
- [ ] Mutation sanity check performed and reverted.
- [ ] `npm run typecheck` and `npm run build` pass.
- [ ] Docs and Task-List updated.

## 10. Deviations
- The tests are written after the code they cover (characterization tests), which is unavoidable for baseline code. Documented in AGENTS.md §3A.
