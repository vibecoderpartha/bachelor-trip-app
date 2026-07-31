# IR-001 Combined Evidence Correction Findings — 2026-07-31

## Status

- IR item: IR-001 — Evidence Foundation
- Correction status: In progress; no finding is resolved until the required
  local regression and full independent re-review complete.
- IR-001 status: In progress
- GATE-007 through GATE-010: unchanged
- IR-002: Not authorised

## F-IR001-VER-001 — browser failure evidence portability

- Raw Playwright `error-context.md` retained a developer-specific absolute
  filesystem path.
- The affected evidence was not portable or suitable for an allow-listed
  retained browser evidence set.
- This blocked GATE-010 and IR-001 verification.
- The bounded correction is limited to excluding raw Playwright diagnostics,
  retaining a safe summary and screenshot, and enforcing cross-platform path
  safety and manifest/upload allow-lists.

## F-IR001-VER-002 — database evidence sequence integrity

- Database evidence used one mutable session-local result representation.
- The normal, controlled-failure, and recovery commands overwrote the same
  result location.
- Manifest acceptance therefore depended on the most recently executed mode.
- A valid normal recovery result was rejected after the required normal →
  controlled-failure → normal sequence.
- Evidence generation was not sequence-safe, blocking completion of the
  correction regression and affecting GATE-007, GATE-008, and GATE-010
  evidence integrity.
- This is an IR-001 evidence-infrastructure defect, not a product schema or
  RLS capability failure. The correction is limited to evidence identity,
  sanitised retention, sequencing, manifest inputs, and regression coverage.

No status or gate promotion is authorised by this record.

## Correction result — 2026-07-31

Both bounded corrections are implemented in
`43d839b4e546188b1e60e56ff0515ff8826b6cfa` and passed their required local
regression. They remain pending the complete independent IR-001 re-review;
this result does not resolve the original verification decision, promote a
gate, or authorise IR-002.
