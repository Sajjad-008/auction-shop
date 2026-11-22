# Implementation Plan — F-010 Custom 404 page

- Status: In Progress
- Documentation mode: Prospective
- Related SPEC: `SPEC.md`
- Related ADRs: none needed (no change to boundaries, data, consistency, security, deployment, or dependencies; anime.js is already a dependency)

## 1. Implementation approach
A new page component `pages/NotFound.tsx` rendered by a catch-all route (`path="*"`) placed at the top level of `App.tsx`, outside `Layout` (the sidebar is irrelevant for lost users). It reuses `SearchBox`, `panelPath`, and the existing theme props.

## 2. Ordered tasks
1. **Create the component.**
   - Files: `client/src/pages/NotFound.tsx`.
   - Test first (Red): *deferred — no test tooling yet (see Deviations)*.
   - Green: render heading, path, actions, search box, theme toggle.
   - Refactor: extract nothing; the component is small.
2. **Register the catch-all route.**
   - Files: `client/src/App.tsx` (import + `<Route path="*" …>` as the last child of `<Routes>`).
3. **Manual verification** of acceptance criteria 1–8.
4. **After F-009:** add `NotFound.test.tsx` covering criteria 1–5 and 7, using a memory router and a fake user.

## 3. Database and migration plan
None.

## 4. API and frontend plan
No API. Frontend only. Production hosting must serve `index.html` for unknown paths, otherwise direct visits return the host's 404.

## 5. Test plan
Manual now; automated component tests after F-009. E2E: not needed.

## 6. Observability and operations
None.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Catch-all hides a misspelled internal link | The path is shown on the page; add tests for known routes in F-009 |
| Decorative animation harms accessibility | Skipped for reduced motion; page works without it |
| Long path breaks layout | Truncate to 120 characters and use `break-all` |

## 8. Rollout and rollback
Merge to `dev` through a Pull Request (`feature/not-found-page`). Rollback: revert the PR.

## 9. Completion checklist
- [ ] Acceptance criteria pass.
- [ ] TDD tests added (after F-009; recorded as deviation).
- [ ] `npm run typecheck` passes.
- [ ] Light and dark themes checked at 360 px and desktop widths.
- [ ] Docs and Task-List updated (`F-010` → Done).

## 10. Deviations
- **Tests are written after the implementation** because the repository has no test tooling yet. This is a recorded deviation from AGENTS.md §4. It is closed by F-009 and the follow-up test in task 4.
