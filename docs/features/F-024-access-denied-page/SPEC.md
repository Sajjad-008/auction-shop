# Feature Specification — F-024 Access-denied (403) page and admin route guard

- Status: Review
- Documentation mode: Prospective
- Owner: Project owner
- Related backlog item: F-024
- Related ADRs: ADR-0004 (role model, addendum 2026-11-22)

## 1. Problem and objective
A logged-in user who opens an area reserved for another role sees only a short inline sentence. The product needs a proper access-denied (403) page, and the administrator area needs a guard before the admin panel (F-019) is built.

## 2. Actors and permissions
- **Buyer, seller:** may see the 403 page when they open an area of another role.
- **Administrator (new role in the UI):** may open `/admin/*`.
- **Guest:** is never shown the 403 page; they are redirected to login.

## 3. User journeys
**Primary:** a buyer opens `/seller` or `/admin` → sees the 403 page inside the normal layout → returns to their panel, reports the problem to support, or goes back.
**Alternative:** a guest opens `/admin` → is redirected to `/login` and, after login, returns to the same URL (then sees 403 if the role is wrong).
**Failure:** none; the page has no data dependencies.

## 4. Scope
### In scope
- `Forbidden` component and its use by `RoleGuard` for all role mismatches.
- `admin` added to the UI `Role` type; `panelPath('admin') = '/admin'`; Persian role labels.
- Route `/admin/*` guarded by role `admin`, with a minimal placeholder page.
- Sidebar footer shows the account type label for all roles.
### Out of scope
- Real admin features (F-019), real server-side authorization (F-012).
- Admin sign-up in the UI (never offered).
- Rules about administrators placing bids (decided in F-019).

## 5. Functional requirements
- **FR-AC-001** A logged-in user without the required role shall see the 403 page inside the main layout (sidebar and navbar stay).
- **FR-AC-002** A guest on a guarded route shall be redirected to `/login` with the return path (existing behavior preserved).
- **FR-AC-003** The page shall have exactly one `h1`, a formal Persian explanation naming the required role and the user's current role, and a decorative "403" with a lock icon.
- **FR-AC-004** The page shall offer: return to the user's own panel, "report an access problem" (opens a new support ticket), and "back" only when a previous history entry exists.
- **FR-AC-005** The page shall not display the requested URL or internal route names.
- **FR-AC-006** Every `/admin/*` path shall be guarded by role `admin`; administrators see a placeholder titled "پنل مدیریت" stating that the panel is under development.
- **FR-AC-007** `panelPath('admin')` shall return `/admin`; each role shall have a Persian label.
- **FR-AC-008** The page shall set and restore the document title and skip the decorative animation when reduced motion is preferred.
- **FR-AC-009** The UI shall not offer administrator sign-up.

## 6. Business rules and invariants
- UI guards are a convenience; the server decides (NFR-SEC-001). The simulation layer can be bypassed (ADR-0003).
- 403 is shown only to authenticated users. Existence of the admin area is not secret in this product; a guest only sees the login page.

## 7. UX behavior
Centered card inside the layout, same visual language as the 404 page (large digits with an icon in the middle), light and dark themes, responsive from 360 px. The lock icon shakes once on appearance.

## 8. Data impact
`Role` gains `'admin'`. Stored `accounts` entries may contain `role: 'admin'` (testing only).

## 9. Security and privacy
- No request details are reflected.
- Admin accounts in the browser simulation can be created only by editing `localStorage` manually; this is for testing and has no security value.

## 10. Edge cases
Seller on an admin route; admin on a seller route (sees 403 — administrators do not use the seller panel); no browser history; admin on a buyer-only guest-visible page (`/my-bids`) sees 403; very long URLs (not displayed).

## 11. Acceptance criteria
1. **Given** a guest, **when** they open `/admin`, **then** they are redirected to `/login`.
2. **Given** a buyer, **when** they open `/admin`, **then** the 403 page is shown inside the layout and the admin placeholder is not rendered.
3. **Given** a seller, **when** they open `/admin/anything`, **then** the 403 page is shown.
4. **Given** a buyer, **when** they open `/seller`, **then** the 403 page names "فروشنده" as the required account type and offers a link to `/auctions`.
5. **Given** a seller, **when** they open `/my-bids`, **then** the 403 page offers a link to `/seller`.
6. **Given** an administrator, **when** they open `/admin`, **then** the placeholder page is shown.
7. **Given** any 403 page, **then** the requested URL text is not visible.
8. **Given** `panelPath`, **then** buyer → `/auctions`, seller → `/seller`, admin → `/admin`.
9. **Given** the sidebar, **then** the account-type label matches the user's role.

## 12. Test strategy
Strict TDD (tooling from F-009):
- Unit: `panelPath`, `roleLabels`.
- Component: `Forbidden` (heading, role names, links, no URL leak); `RoleGuard` (guest redirect, matching role, wrong role, `guestOk`).
- Manual: layout, themes, animation, admin placeholder.

## 13. Dependencies and open questions
Depends on F-003 and F-009. Open: whether administrators may use buyer pages (decided in F-019).

## 14. Definition of Ready
- [x] Task-List entry
- [x] SPEC and PLAN
- [x] ADR check: ADR-0004 addendum; no new ADR
- [x] Testable acceptance criteria
