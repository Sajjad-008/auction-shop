# ADR-0004: Role model (buyer, seller, administrator)

- **Status:** Accepted for the current scope
- **Date:** 2026-11-21
- **Documentation mode:** Retroactive (administrator role is prospective)
- **Decision owners:** Project owner

## Context
The mentor recommended separating panels for buyers and sellers. Sellers publish auctions; buyers bid.

## Decision
Each account has exactly one role chosen at sign-up: `buyer` or `seller`. An `admin` role is added by the platform operator, never by self-registration. Routes are guarded by role in the client (`RoleGuard`) and **must** be guarded by the server once it exists. The role is read from the server session, never from request bodies.

## Alternatives considered
- One account with both capabilities: simpler for users, but complicates rules (a seller bidding on own auction) and panels. Revisit if needed (open decision in SRS §13).
- Permission-based RBAC: unnecessary for three roles.

## Consequences
- A person who wants both roles needs two accounts.
- Server-side tests must prove every protected endpoint rejects the wrong role (F-012).

## References
F-003, F-012, F-019.

## Addendum (2026-11-22)
- The UI role type now includes `admin` (F-024). A logged-in user whose role does not match a guarded route sees the access-denied (403) page; a guest is redirected to login.
- Administrator accounts are never created through the UI. In the browser-only simulation they can be created manually for testing (documented in F-024 PLAN); real creation is server-side (F-012, F-019).
- Rules for administrators placing bids are decided in F-019.
