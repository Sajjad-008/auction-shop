# Feature Specification — F-009 Test foundation and characterization tests

- Status: Review
- Documentation mode: Prospective
- Owner: Project owner
- Related backlog item: F-009
- Related ADRs: ADR-0009 (frontend test stack)

## 1. Problem and objective
The frontend has no automated tests, so TDD (AGENTS.md §4) is impossible and baseline behavior can change unnoticed. This feature adds the test tooling and pins the current behavior of the pure business-rule modules with characterization tests.

## 2. Actors and permissions
Developers and AI agents working on this repository. No end-user behavior changes.

## 3. User journeys
**Developer:** installs dependencies → runs `npm test` → sees all tests pass → changes a rule by mistake → sees a failing test.
**Failure path:** a test fails → the command exits with a non-zero status.

## 4. Scope
### In scope
- Vitest, jsdom, React Testing Library, jest-dom, user-event.
- Scripts `test` (single run) and `test:watch`.
- `src/test/setup.ts` (matchers, cleanup, `matchMedia` stub) and `src/test/fixtures.ts` (deterministic auction fixtures, fixed clock).
- Characterization tests for `utils/auction.ts`, `utils/validation.ts`, `utils/search.ts`.
### Out of scope
- Playwright / E2E (deferred to F-020).
- Coverage thresholds, CI pipeline.
- Component tests for existing pages (added when each component is next changed).

## 5. Functional requirements
- **FR-TT-001** `npm test` shall run every test once and exit non-zero on any failure.
- **FR-TT-002** `npm run test:watch` shall run the tests in watch mode.
- **FR-TT-003** Tests shall run in a jsdom environment with jest-dom matchers and automatic cleanup.
- **FR-TT-004** Test files shall be type-checked by `npm run typecheck`.
- **FR-TT-005** `utils/auction.ts` tests shall cover: current price, minimum next bid, ended boundary, Toman formatting, digit normalization, relative time, my-status (leading, outbid, won, lost, none), best own bid.
- **FR-TT-006** `utils/validation.ts` tests shall cover valid and invalid input for every validator.
- **FR-TT-007** `utils/search.ts` tests shall cover Persian/Arabic normalization, empty query, multi-word matching, and matching in title and description.
- **FR-TT-008** Time-dependent tests shall use a fixed system time (fake timers) and never depend on the real clock.
- **FR-TT-009** Tests shall assert behavior, not the exact wording of Persian UI messages (wording may change).

## 6. Business rules covered
BR-002 (minimum next bid), BR-003 boundary (`end_at` is exclusive: an auction whose end time equals "now" is ended), BR-007 (winner), BR-010 is not covered (UI only).

## 7. UX/API behavior
None.

## 8. Data impact
None. Dev dependencies only.

## 9. Security and privacy
Dev dependencies are installed from the npm registry; check names before installing and review `package-lock.json` changes in the Pull Request.

## 10. Edge cases
Date boundaries; tests running in any time zone; Persian digits and the thousands separator; Arabic variants of Persian letters; `matchMedia` missing in jsdom.

## 11. Acceptance criteria
1. **Given** a clean clone and `npm install`, **when** `npm test` runs, **then** all tests pass.
2. **Given** `getMinNextBid` is temporarily changed to ignore the bid step, **when** `npm test` runs, **then** at least one test fails (mutation sanity check; the change is then reverted).
3. **Given** `npm run typecheck`, **then** it passes with the test files included.
4. **Given** the tests run at a different local time zone, **then** results are identical (fixed UTC instants only).
5. **Given** the production build, **then** its output is unchanged (no test code in the bundle).

## 12. Test strategy
These are **characterization tests**: they describe what the code does today and are expected to pass immediately. Their value is proven by the mutation sanity check (criterion 2). Genuine Red → Green starts with F-024.

## 13. Dependencies and open questions
Depends on F-001. Blocks F-010 automated tests and F-024. No open questions.

## 14. Definition of Ready
- [x] Task-List entry
- [x] SPEC and PLAN
- [x] ADR-0009 written
- [x] Testable acceptance criteria
