# Feature Specification — F-001 … F-008 Frontend Baseline v1

- Status: Approved (as built)
- Documentation mode: **Retroactive baseline** — written after implementation. It describes what exists. It is **not** evidence that the work followed SPEC-first or TDD.
- Owner: Project owner
- Related backlog items: F-001 – F-008
- Related ADRs: 0001, 0002, 0003, 0004, 0008

## 1. Problem and objective
Provide a complete, reviewable user interface and user journeys for an auction platform before the backend exists, so that requirements and design can be validated early.

## 2. Actors and permissions
Visitor, buyer, seller (see SRS §2). Administrator is not part of this baseline. Permissions are enforced in the browser only.

## 3. User journeys
See SRS §4.1–4.3. All journeys work against the simulation layer.

## 4. Scope
### In scope
Everything listed in §5 as implemented.
### Out of scope
Real authentication, server-side rules, persistence beyond one browser, administrator panel, real notifications and support replies, payments.

## 5. Functional requirements and where they live
| Feature | Requirements (SRS) | Main files |
|---|---|---|
| **F-001** foundation | FR-UX-001…004 | `index.css`, `hooks/useTheme.ts`, `components/layout/*`, `components/sidebar/*`, `components/ui/*` |
| **F-002** catalog | FR-DS-001…005 | `pages/Landing.tsx`, `Home.tsx`, `ActiveAuctions.tsx`, `SearchResults.tsx`, `AuctionDetail.tsx`, `components/auction/PriceChart.tsx`, `components/search/SearchBox.tsx`, `utils/search.ts` |
| **F-003** identity UI | FR-ID-001…003, 006 | `pages/Login.tsx`, `Signup.tsx`, `components/auth/RoleGuard.tsx`, `utils/validation.ts`, `utils/paths.ts` |
| **F-004** bidding UI | FR-BY-001…003, 005 | `components/auction/BidForm.tsx`, `pages/MyBids.tsx`, `utils/auction.ts`, `App.tsx` (`placeBid`) |
| **F-005** favorites | FR-BY-004 | `components/auction/FavoriteButton.tsx`, `pages/Favorites.tsx` |
| **F-006** notifications | FR-NT-001, 002 | `components/notifications/*`, `pages/Notifications.tsx`, `data/notifications.ts` |
| **F-007** support | FR-SP-001, 002 | `pages/Support.tsx`, `NewTicket.tsx`, `TicketChat.tsx`, `components/ui/ImagePicker.tsx`, `data/ticketCategories.ts` |
| **F-008** seller panel | FR-SL-001…005 | `pages/seller/*`, `components/seller/SellerAuctionRow.tsx`, `components/ui/MoneyField.tsx`, `utils/image.ts` |

## 6. Business rules and invariants (as implemented in the browser)
BR-001 … BR-010 from the SRS, except that BR-004 (strictly increasing under concurrency) cannot be violated in a single-browser simulation and therefore is **not verified**.

## 7. UX behavior
Loading/empty/error states exist on list and detail pages; forms validate on blur and submit; dropdowns and accordions animate; dark/light themes everywhere; formal Persian text.

## 8. Data impact
`localStorage` keys: `user`, `accounts`, `favorites`, `notifications`, `tickets`, `userAuctions`, `theme`. Images are stored as data URLs (size-limited).

## 9. Security and privacy
None enforced. Role checks, "login", and bid rules can be bypassed from the browser console. Passwords are not verified or stored. This is a known and documented limitation (ADR-0003).

## 10. Edge cases handled
Guest tries to bid or favorite (redirect to login and back); seller opens a bid form (explanatory message); ended auction (disabled actions); auction without bids (chart empty state); deleting an auction with bids (blocked); storage full (warning in console).

## 11. Acceptance criteria (manual, as verified during development)
- **Given** a guest on an auction, **when** they press "log in to bid" and sign in, **then** they return to the same auction.
- **Given** a buyer and a minimum bid of X, **when** they enter less than X, **then** an error with the minimum is shown and no bid is stored.
- **Given** a buyer who leads, **when** they bid again, **then** the app refuses.
- **Given** a seller, **when** they open any auction, **then** no bid form or favorite button is shown.
- **Given** a seller, **when** they delete an auction that has bids, **then** deletion is refused.
- **Given** any page, **when** the theme is toggled, **then** all colors follow the active theme.

## 12. Test strategy
**Gap:** there are no automated tests. F-009 adds tooling and characterization tests, starting with `utils/auction.ts`, `utils/validation.ts`, and `utils/search.ts`.

## 13. Dependencies and open questions
See SRS §13. The backend (F-011 onward) will replace the simulation layer (F-020).

## 14. Definition of Ready
Not applicable (retroactive). Registered in `Task-List.md` as `Done (baseline)`.
