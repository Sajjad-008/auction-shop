# ADR-0007: Bid placement and concurrency strategy

- **Status:** Proposed — must be accepted, with passing concurrency tests, before F-014 implementation
- **Date:** 2026-11-21
- **Documentation mode:** Prospective
- **Decision owners:** Project owner, backend developer

## Context
Many buyers may bid on the same auction within milliseconds of each other, especially near the end. A "read the highest bid, then insert" sequence in application code lets two bidders both pass the check.

## Decision (proposed)
Place a bid in **one transaction** using a conditional update (compare-and-set) on the auction row:

1. `UPDATE auctions SET highest_bid = :amount, highest_bidder_id = :user, bid_count = bid_count + 1 WHERE id = :id AND end_at > :now AND :amount >= COALESCE(highest_bid + bid_step, start_price) AND highest_bidder_id IS NOT :user` (use the portable equivalent of "is distinct from").
2. If zero rows were updated, roll back and map to `409` with the reason (ended, too low, already highest) and the current minimum.
3. Otherwise insert the bid row in the same transaction and commit.
4. Add a unique index on `(auction_id, amount)` as defense in depth.
5. Require an `Idempotency-Key` header; a repeated key returns the original result without a new bid.
6. Create notifications only after commit.

On PostgreSQL (READ COMMITTED) a competing update waits for the row lock and re-evaluates the condition against the updated row; on SQLite writes are serialized.

## Alternatives considered
- `SELECT … FOR UPDATE` then insert: also correct but PostgreSQL-specific and needs more round trips.
- Optimistic version column with retries: correct but adds retry logic for little benefit.
- In-process mutex: fails with more than one server process.

## Consequences
- The invariant lives in the database, not in the UI or in handler code.
- Authoritative proof is a PostgreSQL concurrency test (N parallel requests, exactly one success). SQLite tests cover portable logic only.
- The server clock is the time authority.

## References
F-014, AGENTS.md §7, ARCHITECTURE §9.
