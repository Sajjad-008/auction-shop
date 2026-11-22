# Implementation Plan — F-024 Access-denied (403) page

- Status: In Progress
- Documentation mode: Prospective
- Related SPEC: `SPEC.md`
- Related ADRs: ADR-0004 (addendum), ADR-0009

## 1. Implementation approach
Extend the role model, add a reusable `Forbidden` component, and make `RoleGuard` render it for every role mismatch. Add the admin route with a minimal placeholder. Work in strict Red → Green → Refactor; commit the failing tests first.

## 2. Ordered tasks
1. **Role model** — Red: `utils/paths.test.ts` (admin path, labels). Green: extend `Role`, `panelPath`, add `roleLabels` in `utils/paths.ts`.
2. **Forbidden component** — Red: `components/auth/Forbidden.test.tsx`. Green: implement `components/auth/Forbidden.tsx`.
3. **RoleGuard** — Red: `components/auth/RoleGuard.test.tsx` (guest, match, mismatch, `guestOk`). Green: render `Forbidden` on mismatch; remove the inline message.
4. **Admin area** — add `pages/admin/AdminHome.tsx`, the `/admin/*` route in `App.tsx` (guarded), the title in `Layout.tsx`.
5. **Sidebar label** — use `roleLabels` for the account-type text.
6. Refactor: remove duplicated labels; keep `typecheck` green.
7. Manual verification of acceptance criteria 1–9 (including the admin test account snippet below).
8. Update `Task-List.md` (F-024 → Done), SRS statuses.

## 3. Database and migration plan
None.

## 4. API and frontend plan
Frontend only. Files: `types.ts`, `utils/paths.ts`, `components/auth/Forbidden.tsx`, `components/auth/RoleGuard.tsx`, `pages/admin/AdminHome.tsx`, `App.tsx`, `components/layout/Layout.tsx`, `components/sidebar/Sidebar.tsx`.

**Admin test account (browser console, testing only):**
```js
const a = JSON.parse(localStorage.getItem('accounts') || '{}')
a['admin@example.com'] = { name: 'مدیر سامانه', role: 'admin' }
localStorage.setItem('accounts', JSON.stringify(a))
```
Then reload and log in with `admin@example.com` and any password.

## 5. Test plan
Unit and component tests listed in SPEC §12; manual check of themes, 360 px width, and the one-time animation.

## 6. Observability and operations
None.

## 7. Risks and mitigations
| Risk | Mitigation |
|---|---|
| Adding `admin` to `Role` breaks exhaustive records elsewhere | `npm run typecheck` shows every place; fix each |
| UI guard mistaken for security | SPEC §6, ADR-0003, F-012 |
| animejs import in jsdom | Reduced-motion stub skips animation; report import errors |

## 8. Rollout and rollback
Branch `feature/access-denied-page`; Pull Request to `dev`. Rollback: revert the PR.

## 9. Completion checklist
- [ ] Failing tests committed first, then implementation.
- [ ] Acceptance criteria pass; `npm test`, `npm run typecheck`, `npm run build` pass.
- [ ] Light and dark themes checked at 360 px and desktop widths.
- [ ] Docs and Task-List updated.

## 10. Deviations
None expected.
