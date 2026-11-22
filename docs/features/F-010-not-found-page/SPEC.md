# Feature Specification — F-010 Custom 404 page

- Status: Review (scope change 2026-11-22)
- Documentation mode: Prospective (written before implementation)
- Owner: Project owner
- Related backlog item: F-010
- Related ADRs: none required (see PLAN §1); relates to ADR-0001 (SPA limitation)

## 1. Problem and objective
When a user opens a URL that matches no route, the application needs a clear explanation and a quick way back, consistent with the product design.

## 2. Actors and permissions
Visitor, buyer, seller, administrator. The page is public and adapts its actions to the logged-in role.

## 3. User journeys
**Primary:** a user follows a wrong URL → sees the 404 page → presses "Home", "Auctions", their panel, or "Back".
**Alternative:** the user toggles the theme or presses the browser back button.

## 4. Scope
### In scope
- A page rendered for every URL not matched by a defined route.
- Navigation actions, theme toggle, decorative animation.
### Out of scope
- A real HTTP 404 status code (a SPA cannot send one; production hosting needs an `index.html` fallback).
- In-page "not found" messages for valid route patterns with missing data (for example `/auction/999`); they stay inside the main layout.
- The access-denied page (see F-024).

## 5. Functional requirements
- **FR-NF-001** The app shall render the 404 page for any path that matches no defined route.
- **FR-NF-002** The page shall have one `h1` and a formal Persian explanation.
- ~~FR-NF-003~~ *Withdrawn 2026-11-22:* showing the requested path.
- **FR-NF-004** The page shall offer: home page, auction list, and — only when logged in — the user's panel (`panelPath(role)`).
- **FR-NF-005** The page shall offer "Back" only when the browser has a previous history entry.
- ~~FR-NF-006~~ *Withdrawn 2026-11-22:* search box on the page.
- **FR-NF-007** The page shall include the theme toggle and work in light and dark themes.
- **FR-NF-008** The page shall set the document title and restore the previous title when it is left.
- **FR-NF-009** Decorative animation shall be skipped when the user prefers reduced motion; the page shall be understandable without it.

## 6. Business rules and invariants
- Routing priority: every defined route wins; the 404 page is the lowest-priority catch-all.
- The page never links to a route the user's role may not use.

## 7. UX/API behavior
No API. Layout: logo, large "404" with a gavel, heading, explanation, action buttons. Mobile-first, centered, no horizontal scrolling at 360 px.

## 8. Data impact
None.

## 9. Security and privacy
The page does not display or log the requested URL.

## 10. Edge cases
Query strings and hashes (ignored); logged-in seller vs. buyer vs. administrator; no browser history; reduced-motion preference.

## 11. Acceptance criteria
1. **Given** a visitor, **when** they open `/does-not-exist`, **then** the 404 page appears with links to home and auctions and no panel link.
2. **Given** a logged-in seller, **then** the page shows a link to `/seller`; **given** a buyer, a link to `/auctions`; **given** an administrator, a link to `/admin`.
3. **Given** the page, **then** it shows no requested path and no search box.
4. **Given** no previous history, **then** the "Back" button is not shown; **given** a previous entry, **then** it is shown.
5. **Given** reduced motion enabled, **then** the gavel does not move.
6. **Given** a valid route pattern (`/auction/999`), **then** the existing in-page message is shown, not the 404 page.
7. **Given** the dark theme, **then** all text is readable.

## 12. Test strategy
- After F-009: component tests (React Testing Library, memory router) for criteria 1–4.
- Manual: criteria 5–7 and visual check in both themes.

## 13. Dependencies and open questions
Depends on F-001; automated tests depend on F-009. No open questions.

## 14. Change history
| Date | Change | Reason |
|---|---|---|
| 2026-11-21 | Initial specification | — |
| 2026-11-22 | Withdrew FR-NF-003 and FR-NF-006 | Product owner decided the page should only offer navigation options |

## 15. Definition of Ready
- [x] Task-List entry (F-010)
- [x] SPEC and PLAN written and updated for the scope change
- [x] Acceptance criteria testable
- [x] ADR review: none needed
