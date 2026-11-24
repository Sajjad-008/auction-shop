# Software Requirements Specification (SRS)

**Product:** Ojbaha (اوج‌بها) — online auction platform  
**Version:** 1.1  
**Date:** 2026-11-24  
**Status:** Proposed. Product decisions in §13 need confirmation. Requirements marked *Done-UI* exist in the frontend only (simulated, ADR-0003); *Planned* ones do not exist yet.

## Document history
| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-21 | Requirements baseline written from the existing frontend and the product plan. |
| 1.1 | 2026-11-24 | Statuses synchronized after F-009, F-010, F-024. Added §14 (backend requirements) and §15 (implementation status). §13 now lists a recommended default for each open decision so backend work can start. |

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
| FR-ID-006 | Routes and API endpoints shall be restricted by role. A guest is redirected to login; a logged-in user with the wrong role sees the access-denied (403) page; the API returns `403`. | Done-UI (F-024); server Planned (F-012) |
| FR-ID-007 | The UI shall never offer administrator sign-up. Administrator accounts are created only on the server. | Done-UI (F-024); server Planned (F-012, F-019) |

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
| FR-AD-006 | Every `/admin/*` route shall be reachable only by administrators; other logged-in users see the 403 page (placeholder admin page Done in F-024, real panel in F-019). |

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

Work does not have to wait for these answers. The **recommended default** is what the team builds unless the instructor or product owner decides otherwise. Changing a default later costs the task named in the last column.

| # | Decision | Recommended default | Affects |
|---|---|---|---|
| 1 | Is payment part of the first release? | No. The platform shows the outcome only; no money moves (F-023 stays Deferred). | F-014, F-023 |
| 2 | Auto-extension ("anti-sniping") near the end? | No. The end time is fixed. Revisit after the bidding core is stable. | F-014 |
| 3 | Must an administrator approve a seller or an auction before publishing? | No. Administrators can remove an auction afterwards (FR-AD-002). | F-015, F-019 |
| 4 | May one account be both buyer and seller? | No (ADR-0004). A person uses two accounts. | F-012 |
| 5 | Reserve price or "buy it now"? | Not in the first release. | F-014, F-015 |
| 6 | What happens after an auction ends? | Winner and seller get notifications; arranging delivery and payment happens outside the platform. | F-017 |
| 7 | Jalali calendar display? | Deferred; relative times are shown. | F-020 |
| 8 | Is e-mail verification mandatory? | No in the first release; password reset deferred (no mail provider). | F-012 |
| 9 | Can an auction be scheduled to start in the future? | No. It starts when created. | F-015 |
| 10 | Where are images stored? | Server local disk behind a storage adapter (object storage can replace it later). | F-015 |
| 11 | Which backend stack? | Node.js + TypeScript + Express + Kysely (ADR-0006, proposed). | F-011 |

## 14. Backend requirements (derived)

Server-side requirements that make the planned functional requirements real. IDs use the prefix `BE-`. Every requirement is **Planned** and implemented with the workflow in `AGENTS.md` (SPEC and PLAN first, tests first).

### 14.1 Platform
| ID | Requirement | Task |
|---|---|---|
| BE-SYS-001 | The API shall live under `/api/v1`, use JSON and UTF-8. | F-011 |
| BE-SYS-002 | `GET /api/v1/health` shall report service and database status without exposing internals. | F-011 |
| BE-SYS-003 | Configuration shall come from environment variables validated at startup; invalid configuration stops the process with a clear message. | F-011 |
| BE-SYS-004 | Every error shall use one envelope `{ code, message, requestId }`; messages are Persian and formal; unexpected errors shall never leak stack traces. | F-011 |
| BE-SYS-005 | Every response shall carry a request ID (`X-Request-Id`); logs shall be structured and shall never contain passwords or tokens. | F-011 |
| BE-SYS-006 | The schema shall change only through versioned migrations that run on SQLite and PostgreSQL; a seed script shall reproduce the frontend sample data. | F-011, F-013 |
| BE-SYS-007 | CORS shall allow only the configured frontend origin. | F-011 |

### 14.2 Identity and access
| ID | Requirement | Task |
|---|---|---|
| BE-ID-001 | Registration shall accept only roles `buyer` and `seller`; an `admin` role in the request shall be rejected. | F-012 |
| BE-ID-002 | E-mail shall be unique, compared case-insensitively. | F-012 |
| BE-ID-003 | Passwords shall be stored as salted hashes (Argon2id or bcrypt) and never returned. | F-012 |
| BE-ID-004 | Login failures shall use one message for unknown e-mail and wrong password. | F-012 |
| BE-ID-005 | Sessions shall use an `HttpOnly`, `SameSite` cookie (`Secure` in production); logout shall invalidate it. | F-012 |
| BE-ID-006 | Login and registration shall be rate-limited. | F-012 |
| BE-ID-007 | Administrators shall be created only by a seed or command-line script, never through the API. | F-012, F-019 |
| BE-ID-008 | Every protected endpoint shall check authentication, role, and (where relevant) ownership; wrong role returns `403`, a missing resource `404`. | F-012 |

### 14.3 Catalog
| ID | Requirement | Task |
|---|---|---|
| BE-AUC-001 | The list endpoint shall support category, text query, status (running/ended), price range, sorting (end time, price, bid count), and pagination. | F-013 |
| BE-AUC-002 | Text search shall normalize Persian/Arabic letter variants like the frontend does. | F-013 |
| BE-AUC-003 | The detail endpoint shall return current price, bid count, minimum next bid, and bid history with masked bidder names. | F-013 |
| BE-AUC-004 | "Ended" shall be computed on the server from the server clock. | F-013 |

### 14.4 Bidding
| ID | Requirement | Task |
|---|---|---|
| BE-BID-001 | Placing a bid shall run in one transaction with a compare-and-set update (ADR-0007). | F-014 |
| BE-BID-002 | Rejections shall use stable codes: `AUCTION_NOT_FOUND`, `AUCTION_ENDED`, `BID_TOO_LOW`, `ALREADY_HIGHEST`, `ROLE_NOT_ALLOWED`; `BID_TOO_LOW` shall include the current minimum. | F-014 |
| BE-BID-003 | An `Idempotency-Key` header shall make retries return the original result without a second bid. | F-014 |
| BE-BID-004 | Bids are immutable; `(auction_id, amount)` shall be unique. | F-014 |
| BE-BID-005 | N parallel bids with the same minimum amount shall produce exactly one success (PostgreSQL test). | F-014 |
| BE-BID-006 | Bid placement shall be rate-limited per user. | F-014 |

### 14.5 Seller management
| ID | Requirement | Task |
|---|---|---|
| BE-SEL-001 | Creation shall validate title, description, base price, step, duration preset and apply BR-009; `end_at` is computed by the server. | F-015 |
| BE-SEL-002 | Image upload shall accept JPEG, PNG, WebP up to 1 MB, check the content type, and store under a random name. | F-015 |
| BE-SEL-003 | A seller shall list only own auctions and delete only own auctions without bids (`AUCTION_HAS_BIDS` otherwise). | F-015 |

### 14.6 Buyer engagement
| ID | Requirement | Task |
|---|---|---|
| BE-FAV-001 | A buyer shall add, remove, and list favorites; duplicates are ignored. | F-016 |
| BE-MYB-001 | "My bids" shall return the status (leading, outbid, won, lost) computed on the server. | F-016 |

### 14.7 Notifications and background work
| ID | Requirement | Task |
|---|---|---|
| BE-NOT-001 | The API shall list, count unread, mark read (one/all), and delete notifications of the current user only. | F-017 |
| BE-NOT-002 | Events: bid accepted, outbid (previous leader), ending soon, auction closed (winner and seller). | F-017 |
| BE-NOT-003 | Notifications shall be created after the transaction commits. | F-017 |
| BE-JOB-001 | A scheduler shall close ended auctions exactly once; running it twice shall not duplicate results. | F-017 |

### 14.8 Support
| ID | Requirement | Task |
|---|---|---|
| BE-SUP-001 | Users shall create tickets (category, title, message, ≤ 2 images) and see only their own. | F-018 |
| BE-SUP-002 | Users shall add messages and close or reopen their tickets. | F-018 |
| BE-SUP-003 | Administrators shall reply to any ticket; the reply creates a notification. | F-018 |

### 14.9 Administration
| ID | Requirement | Task |
|---|---|---|
| BE-ADM-001 | Administrators shall list, search, suspend, and reactivate users; suspended users cannot log in. | F-019 |
| BE-ADM-002 | Administrators shall remove an auction with a recorded reason. | F-019 |
| BE-ADM-003 | Every privileged action shall be written to an audit log with actor, action, target, and time. | F-019 |
| BE-ADM-004 | Platform limits (BR-009) shall be configurable by administrators. | F-019 |

### 14.10 Quality
| ID | Requirement | Task |
|---|---|---|
| BE-QA-001 | Every module shall have unit and integration tests; rules are tested before they are implemented. | all |
| BE-QA-002 | Concurrency and migration tests shall run on PostgreSQL. | F-014, F-022 |
| BE-QA-003 | Request and response shapes shall match the shared types or a published schema. | F-020 |

## 15. Implementation status (2026-11-24)

| Area | Frontend (simulated) | Server | Automated tests |
|---|---|---|---|
| Identity and roles | Done-UI (sign up, login, role guard, 403 page, admin placeholder) | none | guards and role helpers |
| Catalog and search | Done-UI | none | rules, search, validation |
| Bidding and "My bids" | Done-UI | none | rules (minimum bid, status) |
| Favorites | Done-UI | none | none |
| Notifications | Done-UI | none | none |
| Support tickets | Done-UI (auto-replies are simulated) | none | none |
| Seller panel | Done-UI | none | none |
| Administration | placeholder page only | none | guard only |
| Error pages (404, 403) | Done-UI | not applicable | component tests |

The next work is the backend (F-011 onward). The frontend stays on its simulation layer until F-020.
