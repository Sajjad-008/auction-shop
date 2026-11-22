# Implementation Plan — F-010 Custom 404 page

- Status: In Progress
- Documentation mode: Prospective
- Related SPEC: `SPEC.md`
- Related ADRs: none needed (no change to boundaries, data, consistency, security, deployment, or dependencies; anime.js is already a dependency)

## 1. Implementation approach
A page component `pages/NotFound.tsx` rendered by a catch-all route (`path="*"`) at the top level of `App.tsx`, outside `Layout`. It reuses `panelPath` and the existing theme props.

## 2. Ordered tasks
1. ~~Create the component and route~~ — done and merged (first version).
2. **Scope change (2026-11-22):** remove the requested-path block and the search box from the page (see SPEC §14).
3. **Add automated tests** (tooling from F-009): `pages/NotFound.test.tsx` for acceptance criteria 1–4 (Red is not applicable for the already merged behavior; for the removal, write the "no search box / no requested path" assertions first, watch them fail against the old component, then simplify the component).
4. Manual verification of criteria 5–7.

## 3. Database and migration plan
None.

## 4. API and frontend plan
Frontend only. Production hosting must serve `index.html` for unknown paths.

## 5. Test plan
Component tests (task 3) and manual checks.

## 6. Observability and operations
None.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Catch-all hides a misspelled internal link | Tests for known routes can be added with F-020 |
| Decorative animation harms accessibility | Skipped for reduced motion |

## 8. Rollout and rollback
Branch `fix/not-found-simplify`, Pull Request to `dev`. Rollback: revert the PR.

## 9. Completion checklist
- [ ] Acceptance criteria pass.
- [ ] Automated tests added and passing.
- [ ] `npm run typecheck` passes; themes checked at 360 px and desktop.
- [ ] Task-List updated (F-010 → Done).

## 10. Deviations
- The first version was implemented before any test tooling existed. This deviation from AGENTS.md §4 is closed by task 3.
