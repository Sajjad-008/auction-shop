# ADR-0005: Modular monolith backend

- **Status:** Accepted
- **Date:** 2026-11-21
- **Documentation mode:** Prospective
- **Decision owners:** Project owner

## Context
Bidding needs strongly consistent transactions across auctions and bids. The team is small and operations must stay simple. Docker and Redis are out of scope.

## Decision
One deployable backend with explicit modules (`identity`, `auctions`, `bidding`, `favorites`, `notifications`, `support`, `admin`) and one primary relational database. No microservices.

## Alternatives considered
- Microservices: rejected; distributed transactions would complicate the core invariant.
- Backend-as-a-service: rejected; the course requires an implemented backend.

## Consequences
- Simple deployment and debugging; transactions span modules where needed.
- Modules must not read each other's tables directly; use module interfaces.
- Extracting a service later requires a new ADR with measured need.
