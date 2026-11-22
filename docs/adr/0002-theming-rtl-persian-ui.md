# ADR-0002: Design tokens, light/dark theme, RTL, and formal Persian UI

- **Status:** Accepted
- **Date:** 2026-11-21
- **Documentation mode:** Retroactive
- **Decision owners:** Project owner

## Context
The audience is Persian-speaking. Design started in Figma with a defined palette and required both light and dark themes. Mentor feedback required a formal tone.

## Decision
- Colors are CSS variables in `index.css`, exposed as Tailwind theme colors (`bg-surface`, `text-muted`, `border-line`, …). Dark mode toggles a `dark` class on `<html>`; the choice is stored in `localStorage`.
- The document is RTL (`dir="rtl"`, `lang="fa"`), font Vazirmatn. Chart plots may force LTR locally.
- All user-facing text is formal Persian («شما»), numbers use `fa-IR`.
- The brand name is **اوج‌بها**.

## Alternatives considered
- `dark:` utility classes everywhere: rejected; it duplicates every color decision.
- A UI kit (MUI, shadcn): rejected to keep full control of the Figma design.

## Consequences
- Components never hard-code colors; new colors need a token in both themes.
- Text changes are code changes (no i18n framework). If a second language is needed, an i18n ADR is required.

## References
F-001, AGENTS.md §8.
