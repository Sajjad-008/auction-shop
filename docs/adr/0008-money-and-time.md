# ADR-0008: Money and time representation

- **Status:** Accepted
- **Date:** 2026-11-21
- **Documentation mode:** Retroactive (client already follows it)
- **Decision owners:** Project owner

## Context
Prices are in Toman and countdowns drive the product. Floating-point money and local-time strings cause subtle bugs.

## Decision
- Money is an integer number of Toman in storage and APIs. Formatting (`fa-IR`, "تومان") happens only in the UI.
- Instants are UTC ISO 8601 strings in storage and APIs. The server clock decides whether an auction is open.
- Auction duration is chosen from fixed presets (10 minutes, 1, 6 hours, 1, 3, 7 days); `end_at` is computed on the server at creation.
- Calendar display (Gregorian relative times today, possibly Jalali later) is a presentation concern and does not change stored values.

## Alternatives considered
- Decimal strings or minor units: unnecessary; Toman has no minor unit in practice.
- Trusting the client clock: rejected; users can change it.

## Consequences
- Amount limits must stay under the safe integer range (the UI caps input at 12 digits).
- Tests use an injectable clock.
