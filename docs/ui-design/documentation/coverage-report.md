# Coverage report

Cumulative accepted design package: 462 screens, 86 components, 24 boards, and 8 of 8 batches. UI/UX Design Lock is Complete and the Full UI/UX Design Freeze is Complete; application implementation is not started and not authorised.

## Flow coverage

| Flow | Scope | Screens | Evidence |
|---|---|---:|---|
| A | Authentication | 11 | Board 08 |
| B/C | Onboarding, Group creation and switching | 28 | Boards 09, 10 |
| D | Invitations | 18 | Board 11 |
| E | Members and ownership | 15 | Board 12 |
| F | Participant claiming | 13 | Board 13 |
| G | Permission and access | 20 | Board 14 |
| H | Finance and settlement | 47 | Board 15 |
| I | Documents and scanning | 83 | Board 16 |
| M | Group configuration | 80 | Board 17 |
| N | Realtime and connection | 55 | Board 18 |
| P | Migration and recovery | 90 | Board 20 |
| — | Shell reference | 2 | Board 04 |

## Inventory and export integrity

| Check | Result |
|---|---|
| Screen IDs unique | Pass — 462 |
| Component IDs unique | Pass — 86 |
| Clean screen exports | Pass — 462 |
| Annotated screen exports | Pass — 462 |
| Component exports | Pass — 86 |
| Orphan exports | Pass — 0 |
| SHA-256 export records | Pass — 1,010 exact file records |

Mobile 393×852 is exported for every screen. Tablet 768 and desktop 1440 behaviour remains documented in the shell reference and every `responsiveBehaviour` field: the centred 480px column remains on the base background without a breakpoint redesign.

## State and accessibility coverage

Default/populated, loading, empty, validation, server error, permission-denied, read-only, stale/conflict, offline, realtime update, and migration/recovery states are represented. Destructive confirmation, accessible naming, visible focus treatment, touch-target, contrast, reduced-motion, and announcement requirements remain preserved.

R-02 remains **Specified; implementation verification required** for measured contrast, keyboard traversal/focus restoration, reduced-motion operation, and screen-reader announcements. Static design exports do not claim these implementation measurements.

## Traceability completeness

| Check | Result |
|---|---|
| UI-01 through UI-14 | 14 of 14 mapped to accepted-roadmap owners |
| Screen families | 13 of 13 mapped |
| Primary IR mapping | 462 of 462 valid |
| Primary Wave mapping | 462 of 462 roadmap-consistent |
| Unmapped screens | 0 |
| R-01 | Closed |
| Active invented IR/Wave identifiers | 0 |
| Architecture, security, finance, document, and migration references | Retained through `relatedIrItems` and architecture references |

W1 and W7 have no primary visual screen because their foundation and separately authorised release work is not UI-owned; they remain represented as related roadmap coverage. See [Design-to-Roadmap Review](../design-to-roadmap-review.md).

## Architecture consistency

The package preserves Group-is-Trip tenancy, Supabase Auth authority, Owner/Member-only roles, evidence-based claiming, deny-by-default access, exact finance, private documents, Group configuration, authorised realtime, and migration/rollback gates. No active design claim makes Viewer a role, separates Group and Trip tenants, adds a sixth AI tab, treats public documents as target behaviour, grants authority by a name/emoji or invitation possession, enables Group deletion, permits custom unequal-split authoring, lets live FX rewrite history, introduces a global notification centre, guesses migration values, or releases partial security activation.

## Deferred items

Background parse continuation, automatic duplicate detection, resumable upload, per-reader display-currency preference, participant emoji selection, retention/purge/anonymisation, and an Owner review queue for contested claims remain explicitly deferred.
