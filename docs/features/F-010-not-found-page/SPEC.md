# Feature Specification — F-010 Custom 404 page

- Status: Review
- Documentation mode: Prospective (written before implementation)
- Owner: Project owner
- Related backlog item: F-010
- Related ADRs: none required (see PLAN §1); relates to ADR-0001 (SPA limitation)

## 1. Problem and objective
When a user opens a URL that matches no route, the application currently shows a blank area or an unrelated page. The user needs a clear explanation and a quick way back, consistent with the product design.

## 2. Actors and permissions
Visitor, buyer, seller (and later administrator). The page is public. It must adapt its actions to the logged-in role. It must not reveal whether a protected area exists.

## 3. User journeys
**Primary:** a user types or follows a wrong URL → sees the 404 page → presses "Home", "Auctions", their dashboard, or "Back", or searches.
**Alternative:** a user presses the browser back button; or toggles the theme.
**Failure:** a URL contains characters that cannot be decoded; the page still renders and shows the raw text.

## 4. Scope
### In scope
- A page rendered for every URL not matched by a defined route.
- Actions, search box, theme toggle, decorative animation.
### Out of scope
- A real HTTP 404 status code (a SPA cannot send one; production hosting needs an `index.html` fallback).
- Changing the in-page "not found" messages for valid patterns with missing data (for example `/auction/999`); those stay inside the main layout.

## 5. Functional requirements
- **FR-NF-001** The app shall render the 404 page for any path that matches no defined route.
- **FR-NF-002** The page shall have one `h1` and a formal Persian explanation.
- **FR-NF-003** The page shall display the requested path (decoded when possible, at most 120 characters) as plain text.
- **FR-NF-004** The page shall offer: home page, auction list, and — only when logged in — the user's role dashboard (`/seller` for sellers, `/auctions` for buyers).
- **FR-NF-005** The page shall offer a "Back" action only when the browser has a previous history entry.
- **FR-NF-006** The page shall include the site search box.
- **FR-NF-007** The page shall include the theme toggle and work in light and dark themes.
- **FR-NF-008** The page shall set the document title and restore the previous title when it is left.
- **FR-NF-009** Decorative animation shall be skipped when the user prefers reduced motion; the page shall be fully understandable without it.

## 6. Business rules and invariants
- Routing priority: all defined routes win; the 404 page is the lowest-priority catch-all.
- The page never links to a route the user's role may not use.

## 7. UX/API behavior
No API. Layout: logo, large "404" with a gavel, heading, explanation, requested path, search box, action buttons. Mobile-first, centered, no horizontal scrolling at 360 px.

## 8. Data impact
None.

## 9. Security and privacy
- The requested path is rendered as React text (escaped); it is never inserted as HTML.
- No path is sent to any server or logged.

## 10. Edge cases
Very long or non-UTF-8 paths; query strings and hashes; logged-in seller vs. buyer; no browser history (new tab); theme persisted from before; reduced-motion preference.

## 11. Acceptance criteria
1. **Given** a visitor, **when** they open `/does-not-exist`, **then** the 404 page appears with the path shown and no dashboard button.
2. **Given** a logged-in seller, **when** they open `/seller/xyz`, **then** the page shows a button to `/seller`.
3. **Given** a logged-in buyer, **when** they open `/nothing`, **then** the dashboard button goes to `/auctions`.
4. **Given** the 404 page, **when** the user types in the search box and submits, **then** the search results page opens.
5. **Given** a path longer than 120 characters, **then** only the first 120 are displayed.
6. **Given** reduced-motion enabled, **then** the gavel does not move.
7. **Given** a valid route pattern (`/auction/999`), **then** the existing in-page message is shown, not the 404 page.
8. **Given** the dark theme, **then** all text on the page meets readable contrast.

## 12. Test strategy
- Now (no test tooling yet): manual checks of criteria 1–8 and `npm run typecheck`.
- After F-009: component tests with React Testing Library and a memory router for criteria 1–5 and 7.

## 13. Dependencies and open questions
Depends on F-001. Automated tests depend on F-009. No open product questions.

## 14. Definition of Ready
- [x] Task-List entry (F-010)
- [x] SPEC and PLAN written
- [x] Acceptance criteria testable
- [x] ADR review: none needed (small UI feature, no boundary or data change)
