# ADR-0001: Single-page application with React, TypeScript, and Vite

- **Status:** Accepted
- **Date:** 2026-11-21
- **Documentation mode:** Retroactive (decision taken during implementation, recorded afterwards)
- **Decision owners:** Project owner (Sajjad-008)

## Context
The product is highly interactive (live countdowns, forms, filters, dashboards) and the course allows React with TypeScript. The frontend was started before the backend and needed fast iteration.

## Decision
Build the client as a single-page application with React, TypeScript (strict mode), Vite, React Router, and Tailwind CSS (see ADR-0002).

## Alternatives considered
- Vue 3 (used by the instructor's example): rejected because the team already knows React.
- Next.js: rejected; server rendering is not needed and would couple the frontend to a Node runtime.
- Plain JavaScript: rejected; shared domain types (`src/types.ts`) are valuable and will become the API contract.

## Consequences
- Fast development and a typed domain model.
- A SPA cannot return a real HTTP 404 for unknown URLs; the 404 page is rendered client-side (F-010) and static hosting needs an `index.html` fallback.
- SEO is limited for public pages; acceptable for this project.

## References
F-001, `docs/features/BASELINE-frontend-v1/`.
