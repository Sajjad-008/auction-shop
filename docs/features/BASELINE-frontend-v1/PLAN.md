# Implementation Plan — F-001 … F-008 Frontend Baseline v1

- Status: Done (baseline)
- Documentation mode: **Retroactive baseline**
- Related SPEC: `SPEC.md`
- Related ADRs: 0001, 0002, 0003, 0004, 0008

## 1. Implementation approach (what was done)
The UI was designed in Figma (palette, components, screens), then built with Vite, React, TypeScript, and Tailwind. Shared state lives in `App.tsx` behind `AppContext`; pages are thin. Work was delivered in small branches merged into `dev` through Pull Requests (`feature/…`, `fix/…`, `refactor/…`, `chore/…`).

## 2. Order in which it was built
1. Project setup, theme tokens, RTL, font.
2. Auction card, countdown, list, sidebar and navbar, category filtering.
3. Router and auction detail with bid form.
4. My bids, login/sign-up with validation, return-to-page after login.
5. Favorites, active-auctions filters and sort, animated dropdown.
6. Search with category, notifications, support tickets.
7. TypeScript migration, landing page, seller panel with roles.
8. Component folder restructuring, price chart, hero pulse, rename to Ojbaha, formal tone.

## 3. Database and migration plan
None (browser storage only).

## 4. API and frontend plan
No API. See SPEC §5 for the file map.

## 5. Test plan
Not executed during development. Verification was manual in Chrome (light/dark, desktop/mobile widths). **Follow-up:** F-009.

## 6. Observability and operations
None.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Baseline behavior changes by accident during refactors | Characterization tests (F-009) before touching the code |
| Browser-only rules mistaken for security | ADR-0003, labels in docs/UI, removal in F-020 |
| Large components | Extract rules to `utils/` when tests are added |

## 8. Rollout and rollback
Already merged into `dev`. Rollback = revert the Pull Request.

## 9. Completion checklist (honest status)
- [x] Acceptance criteria verified manually.
- [ ] TDD tests added — **not done**, see Deviations.
- [x] Type check passes (`npm run typecheck`).
- [ ] Security/privacy review — not applicable until the backend exists.
- [x] Docs and Task-List updated (this retroactive set).

## 10. Deviations
- Implementation preceded SPEC/PLAN and ADRs; documents are retroactive.
- No automated tests exist. Closed by F-009 (tooling + characterization tests).
- Business rules run only in the browser. Closed by F-014 and F-020.
