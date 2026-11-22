# Software Requirements Specification (SRS)

**Product:** Ojbaha (اوج‌بها) — online auction platform  
**Version:** 1.0 — requirements baseline  
**Date:** 2026-11-21  
**Status:** Proposed. Product decisions in §13 need confirmation. Requirements marked *Done-UI* exist in the frontend only (simulated, ADR-0003); *Planned* ones do not exist yet.

## 1. Introduction

### 1.1 Purpose
Define roles, journeys, functional and non-functional requirements, and rules so that work can be split into features (Task-List), specified (SPEC/PLAN), and built with TDD.

### 1.2 Vision
Let buyers take part in transparent, time-limited auctions, let sellers publish and monitor auctions, and let administrators operate and govern the platform.

### 1.3 Scope
A web application: React SPA + REST API + relational database. Persian, RTL, light/dark themes. Payments and shipping are out of scope (§11).

### 1.4 Terms
- **Auction:** an item offered with a start price, bid step, and end time.
- **Bid:** an immutable offer of an amount by a buyer on an auction.
- **Bid step:** minimum increase over the highest bid.
- **Highest bid / leader:** the bid with the greatest amount; its bidder is the leader.
- **Ended auction:** `server_now ≥ end_at`; its winner is the leader at that moment.
- **Toman:** currency unit; integer amounts.
- **ADR / SPEC / PLAN:** see AGENTS.md.

## 2. User classes

### 2.1 Visitor
Browses auctions, searches, reads FAQ; cannot bid or favorite.

### 2.2 Buyer
Wants to find auctions, understand price and time, bid safely, see whether they lead or were outbid, and win.

### 2.3 Seller
Wants to publish an auction quickly, control price rules, follow bidding, and remove an auction that has no bids.

### 2.4 Administrator *(Planned)*
Wants to keep the platform safe: manage users, remove abusive auctions, answer tickets, tune platform limits, and audit actions.

## 3. Assumptions and constraints
- Frontend: React + TypeScript. Backend and database stack: ADR-0006 (proposed).
- SQLite for development/tests, PostgreSQL for production and concurrency tests. No Docker, no Redis.
- Every feature follows `AGENTS.md` (SPEC → PLAN → ADR check → TDD).
- This is a course project; payments, real e-mail delivery, and legal compliance are not claimed.

## 4. User journeys

### 4.1 Buyer: find and win
1. Visits the landing page or `/auctions`; filters by category, "ending soon", "competitive", or price range; sorts; or searches text within a category.
2. Opens an auction; reads description, price-history chart, bid history, and remaining time.
3. Signs up or logs in (returns to the same auction).
4. Enters an amount ≥ minimum; confirms; sees success or a clear error.
5. Is notified when outbid; may bid again before the end.
6. After the end sees "won" or "lost" in *My bids* and a notification.
Failure paths: amount too low, auction ended meanwhile, already leading, network error, double click (idempotent).

### 4.2 Seller: publish and monitor
1. Registers as seller; lands on the dashboard.
2. Creates an auction (title, category, description, base price, step, duration, image) with a live preview.
3. Watches bids on *My auctions*; may delete only while it has no bids.
4. After the end sees the outcome.
Failure paths: invalid fields, oversized image, deleting an auction that has bids.

### 4.3 Any user: get support
Creates a ticket (category, title, message, up to two images), follows the conversation, closes or reopens it, and receives a notification on each reply.

### 4.4 Administrator: operate *(Planned)*
Reviews open tickets and replies; suspends a user; removes an auction; adjusts platform limits; reviews the audit log.

## 5. Functional requirements

Status values: **Done-UI** (frontend, simulated) · **Planned**.

### 5.1 Identity
| ID | Requirement | Status |
|---|---|---|
| FR-ID-001 | A visitor shall register with name, e-mail, password (≥ 8 chars), repeated password, terms acceptance, and a role (buyer/seller). | Done-UI |
| FR-ID-002 | A user shall log in and out; the session shall survive page reload. | Done-UI |
| FR-ID-003 | After login the user shall return to the page they came from, otherwise to their role's home. | Done-UI |
| FR-ID-004 | The server shall authenticate users, hash passwords, and read the role from the session. | Planned (F-012) |
| FR-ID-005 | The system shall support e-mail verification and password reset. | Planned (decision §13) |
| FR-ID-006 | Routes and API endpoints shall be restricted by role. A guest is redirected to login; a logged-in user with the wrong role sees the access-denied (403) page; the API returns `403`. | UI Planned (F-024); server Planned (F-012) |
| FR-ID-007 | The UI shall never offer administrator sign-up. Administrator accounts are created only on the server. | Planned (F-012, F-019) |

### 5.2 Discovery (visitor, buyer)
| ID | Requirement | Status |
|---|---|---|
| FR-DS-001 | A landing page shall present the service, how it works, statistics, FAQ, and calls to action; logged-in users see a "Dashboard" button instead of login/sign-up. | Done-UI |
| FR-DS-002 | The system shall list all auctions and auctions per category. | Done-UI |
| FR-DS-003 | The *Active* page shall offer filters (ending soon, competitive, price range) and a sort control with distinct meanings. | Done-UI |
| FR-DS-004 | Search shall match title and description (multi-word, Persian letter normalization) and may be limited to one category. | Done-UI |
| FR-DS-005 | The detail page shall show image, description, current price, bid count, live countdown (red in the last 5 minutes), price-history chart, and masked bid history. | Done-UI |
| FR-DS-006 | Unknown URLs shall show a 404 page with navigation options (home, auctions, own panel, back). | Done-UI (F-010) |

### 5.3 Buyer
| ID | Requirement | Status |
|---|---|---|
| FR-BY-001 | A buyer shall place a bid ≥ highest bid + step (or ≥ start price when no bids), after a confirmation step. | Done-UI; server Planned (F-014) |
| FR-BY-002 | A buyer who leads shall not raise their own bid. | Done-UI |
| FR-BY-003 | *My bids* shall show each auction with status leading / outbid / won / lost and tabs. | Done-UI |
| FR-BY-004 | A buyer shall favorite and unfavorite auctions and see them on one page. | Done-UI |
| FR-BY-005 | Visitors shall be asked to log in when they try to bid or favorite. | Done-UI |

### 5.4 Seller
| ID | Requirement | Status |
|---|---|---|
| FR-SL-001 | A seller shall create an auction with validated fields and a live card preview. | Done-UI |
| FR-SL-002 | The dashboard shall show totals (all, running, ended, bids) and recent auctions. | Done-UI |
| FR-SL-003 | *My auctions* shall list own auctions with status tabs. | Done-UI |
| FR-SL-004 | A seller shall delete an own auction only if it has no bids. | Done-UI |
| FR-SL-005 | A seller shall not bid. | Done-UI |
| FR-SL-006 | Images shall be uploaded to the server and validated (type, ≤ 1 MB). | Planned (F-015) |
| FR-SL-007 | A seller may edit an auction before its first bid. | Planned (decision §13) |

### 5.5 Administrator *(Planned, F-019)*
| ID | Requirement |
|---|---|
| FR-AD-001 | An administrator shall list, search, suspend, and reactivate users. |
| FR-AD-002 | An administrator shall remove or hide an auction with a recorded reason. |
| FR-AD-003 | An administrator shall reply to and close support tickets. |
| FR-AD-004 | An administrator shall configure platform limits (minimum start price, minimum step, allowed durations, categories). |
| FR-AD-005 | Privileged actions shall be written to an audit log. |
| FR-AD-006 | Every `/admin/*` route shall be reachable only by administrators; other logged-in users see the 403 page (placeholder admin page in F-024, real panel in F-019). |

### 5.6 Support
| ID | Requirement | Status |
|---|---|---|
| FR-SP-001 | A user shall create a ticket with category, title (≥ 5 chars), message (≥ 10 chars), and ≤ 2 images (≤ 1 MB each). | Done-UI |
| FR-SP-002 | A ticket shall have a conversation view, status (open / answered / closed), close and reopen. | Done-UI |
| FR-SP-003 | Replies shall come from administrators. The current automatic reply is a labelled simulation. | Planned (F-018) |

### 5.7 Notifications
| ID | Requirement | Status |
|---|---|---|
| FR-NT-001 | A bell with an unread count and a page with all/unread tabs, mark-as-read, mark-all, and delete. | Done-UI |
| FR-NT-002 | Events: bid accepted, auction published, support reply, login (local). | Done-UI |
| FR-NT-003 | Events produced by the server: outbid, ending soon, auction closed, winner. | Planned (F-017) |

### 5.8 Platform and UX
| ID | Requirement | Status |
|---|---|---|
| FR-UX-001 | The UI shall support light and dark themes and remember the choice. | Done-UI |
| FR-UX-002 | The UI shall be RTL, Persian, formal in tone, responsive from 360 px upward. | Done-UI |
| FR-UX-003 | Interactive elements shall show hover, active, focus, and disabled states and a pointer cursor. | Done-UI |
| FR-UX-004 | Decorative animation shall respect `prefers-reduced-motion`. | Done-UI |

## 6. Business rules
- **BR-001** Money is integer Toman.
- **BR-002** Minimum next bid = highest bid + step, or the start price when there is no bid.
- **BR-003** Bids are accepted only while `server_now < end_at`.
- **BR-004** Bid amounts in an auction are strictly increasing in commit order.
- **BR-005** The leader cannot bid again; a seller cannot bid.
- **BR-006** Bids cannot be edited or withdrawn.
- **BR-007** The winner is the leader at `end_at`.
- **BR-008** An auction with at least one bid cannot be deleted by its seller.
- **BR-009** Start price ≥ 100,000; 10,000 ≤ step ≤ start price (initial limits; configurable by admin).
- **BR-010** Public bid history masks bidder names.

## 7. Data requirements
Entities: `User` (role), `Auction`, `Bid`, `Favorite`, `Notification`, `Ticket`, `TicketMessage`, `TicketImage`, `AuditLog`, `IdempotencyKey`, `PlatformSetting`. The frontend types in `client/src/types.ts` are the starting point of the API contract. Retention and deletion of personal data must be defined before production.

## 8. External interfaces
- **UI:** React SPA, Persian, RTL.
- **API:** REST under `/api/v1`, JSON, error envelope `{ code, message }`, OpenAPI or shared schema.
- **E-mail:** none yet (adapter planned if FR-ID-005 is approved).
- **Payments / calendars:** none.

## 9. Non-functional requirements
Targets below are goals to validate, not measured results.
- **NFR-SEC-001** Authorization is enforced server-side for every protected operation.
- **NFR-SEC-002** Passwords are hashed; secrets never reach the client bundle or Git.
- **NFR-SEC-003** Login and bid endpoints are rate-limited.
- **NFR-REL-001** Concurrent bids never violate BR-004 (proved on PostgreSQL).
- **NFR-PERF-001** Bid submission p95 < 500 ms with 50 concurrent bidders on one auction (test target).
- **NFR-PERF-002** Auction list responds p95 < 300 ms for 1,000 auctions (test target).
- **NFR-A11Y-001** Keyboard-operable, visible focus, labelled form fields, accessible error messages.
- **NFR-I18N-001** All UI text is formal Persian; numbers use `fa-IR`.
- **NFR-MNT-001** Type check and tests pass in CI; new logic is covered by unit tests.
- **NFR-OPS-001** Backup and restore are exercised before production.

## 10. Acceptance criteria for the first usable release
1. A buyer can register, log in, bid, be outbid, bid again, and see the outcome.
2. Two simultaneous bids with the same amount produce one success and one `409`.
3. A seller can create, see, and (without bids) delete an auction; the wrong role gets 403.
4. Closing an auction runs once and notifies the winner once.
5. Tickets are answered by an administrator.
6. All P0 tasks are Done and the frontend uses no simulated data.

## 11. Out of scope for the first release (unless approved)
Payments and escrow, shipping, reserve price and "buy it now", Dutch/sealed-bid auctions, multi-currency, native mobile apps, automatic bidding agents.

## 12. Traceability
| Requirement group | Tasks |
|---|---|
| FR-ID | F-003 (UI), F-012, F-024 |
| FR-DS | F-002, F-010, F-013 |
| FR-BY | F-004, F-005, F-014, F-016 |
| FR-SL | F-008, F-015 |
| FR-AD | F-019 |
| FR-SP | F-007, F-018 |
| FR-NT | F-006, F-017 |
| FR-UX | F-001 |
| NFR | F-009, F-022 |

## 13. Product decisions requiring confirmation
1. Is payment part of the first release, or does the platform only connect buyer and seller?
2. Is there an auto-extension ("anti-sniping") rule when a bid arrives in the last minutes? (The earlier Figma draft showed one.)
3. Must an administrator approve a seller or an auction before publishing?
4. May one account be both buyer and seller?
5. Are reserve price or "buy it now" needed?
6. What happens after an auction ends (contact, payment, delivery)?
7. Jalali calendar display?
8. Is e-mail verification mandatory?
9. Can an auction be scheduled to start in the future?
10. Where are images stored (server disk or object storage)?
