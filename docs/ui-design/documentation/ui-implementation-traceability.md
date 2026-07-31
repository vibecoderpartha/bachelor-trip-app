# UI implementation traceability

This is the design-to-roadmap traceability matrix for the 462-screen, 86-component package. The Accepted implementation roadmap is authoritative for every IR and Wave assignment.

## Traceability status

| Check | Result |
|---|---|
| Primary IR owners drawn from IR-001 through IR-022 | 462 of 462 valid |
| Waves drawn from W1 through W7 | 462 of 462 roadmap-consistent |
| Screens with `Requires roadmap mapping` | 0 |
| Active invented `IR-W` owner | 0 |
| Active `W8` or `W9` owner | 0 |
| R-01 — IR ownership and wave assignment | Closed |
| R-02 — measured accessibility verification | Specified; implementation verification required |

Each screen has one primary `irOwner`, one primary `wave`, and `relatedIrItems` only for genuinely cross-cutting security, lifecycle, parity, migration, or governance requirements. W1 and W7 have no primary design screen because evidence foundation and separately authorised release are not UI-owned implementation surfaces; their design-relevant requirements remain represented through related references and review evidence.

## Family mapping model

| Screen family | Screen count | Primary IR item(s) | Wave(s) | Related IR items | Security review | Status |
|---|---:|---|---|---|---|---|
| SHL | 2 | IR-004, IR-011 | W2, W4 | IR-007, IR-010, IR-021 | Yes | Mapped |
| AUTH | 11 | IR-004 | W2 | IR-005, IR-007 | Yes | Mapped |
| ONB | 10 | IR-003, IR-005, IR-006, IR-011 | W3, W4 | IR-004, IR-007, IR-008 | Yes | Mapped |
| GRP | 18 | IR-005, IR-011 | W3, W4 | IR-002, IR-007, IR-008, IR-010 | Yes | Mapped |
| INV | 18 | IR-005 | W3 | IR-004, IR-007, IR-008 | Yes | Mapped |
| MBR | 15 | IR-005 | W3 | IR-007, IR-008 | Yes | Mapped |
| CLM | 13 | IR-006 | W3 | IR-003, IR-005, IR-007, IR-008 | Yes | Mapped |
| PERM | 20 | IR-004–IR-007, IR-009, IR-012–IR-015 | W2–W4 | Feature-owner plus deny-by-default references | Yes | Mapped |
| FIN | 47 | IR-014 | W4 | IR-008, IR-011, IR-021 | Yes | Mapped |
| DOC | 83 | IR-009, IR-012, IR-013, IR-016 | W3–W5 | IR-007, IR-008, IR-011, IR-021 | Yes | Mapped |
| CFG | 80 | IR-014–IR-016 | W4–W5 | IR-003, IR-007, IR-008, IR-011, IR-012 | Yes | Mapped |
| RT | 55 | IR-010 | W3 | IR-007, IR-011 | Yes | Mapped |
| MIG | 90 | IR-006, IR-016–IR-018, IR-021–IR-022 | W3, W5, W6 | IR-002, IR-004, IR-005, IR-007, IR-009, IR-013–IR-016, IR-020 | Yes | Mapped |

Migration operational plates retain migration, recovery, readiness, verification, or governance ownership; they are not reclassified as ordinary product implementation solely because they mention a feature.

## UI-01 through UI-14

| UI requirement | Accepted roadmap owner | Wave | Design evidence | Result |
|---|---|---|---|---|
| UI-01 application shell | IR-011 | W4 | SHL-01, GRP-01…GRP-06 | Mapped |
| UI-02 Participant hero without impersonation | IR-011 | W4 | SHL-01, ONB-10, Group-scoped shell references | Mapped |
| UI-03 primary-section switching | IR-011 | W4 | SHL-01, GRP-01…GRP-06 | Mapped |
| UI-04 itinerary filtering | IR-012 | W4 | DOC-11…DOC-18 and event/audience contracts | Mapped |
| UI-05 timeline status | IR-012 | W4 | Current-state event and responsive contracts | Mapped |
| UI-06 expandable notes and Maps | IR-012 | W4 | Current-state Trip contracts | Mapped |
| UI-07 dual-timezone display | IR-012 | W4 | CFG-28…CFG-37, CFG-69 | Mapped |
| UI-08 crew and countdown interaction | IR-012 | W4 | Current-state Trip contracts and configuration effects | Mapped |
| UI-09 manual and scan-derived creation | IR-013 | W4 | DOC-01…DOC-39 | Mapped |
| UI-10 shared finance and realtime | IR-014 | W4 | FIN-01…FIN-47, RT-22…RT-28 | Mapped |
| UI-11 payer and equal-split interaction | IR-014 | W4 | FIN-11, FIN-13, FIN-16, CMP-24 | Mapped |
| UI-12 accounting and settle-up presentation | IR-014 | W4 | FIN-29…FIN-42, CFG-38…CFG-48 | Mapped |
| UI-13 bidirectional FX and content | IR-015 | W4 | CFG-49…CFG-55, CFG-75…CFG-77 | Mapped |
| UI-14 personal Todo interaction | IR-012 | W4 | Todo and realtime contracts in screen contracts | Mapped |

## Preserved cross-cutting references

- Architecture: one Group is one Trip tenant; Auth and session identity remain authoritative; Owner and Member are the only roles; claiming never derives authority from a name, emoji, PIN, or Invitation possession.
- Security: deny-by-default RLS, trusted-operation atomicity, private documents, and current-authorised realtime remain related requirements rather than visual claims of implementation completion.
- Finance: IR-014 preserves normalized payer/share history, exact arithmetic, configured accounting currency, and no live-FX ledger authority.
- Documents: IR-013 owns scan/reconciliation UI, while IR-009 remains the primary owner for direct private-viewer and access states.
- Migration: IR-016–IR-018 own transformations, recovery, and readiness screens; IR-019–IR-020 remain separately authorised release/operations gates rather than claimed UI work.

## Accessibility review status

R-02 remains **Specified; implementation verification required**. The design retains its accessibility requirements; it does not claim measured contrast, keyboard traversal/focus restoration, reduced-motion behaviour, or screen-reader announcements from static exports.
