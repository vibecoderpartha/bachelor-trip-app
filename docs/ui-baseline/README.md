# Current UI baseline

This package records the factual current-user-interface baseline for the Trip application. The rendered current application and its implementation are the visual source of truth; the screenshots are evidence of observed states, not a proposal for a replacement design.

Original raw captures are preserved in [`screenshots/raw/mobile/`](screenshots/raw/mobile/). Deterministic browser-fixture captures from the audited commit are separately preserved in [`screenshots/raw/generated/`](screenshots/raw/generated/) and copied with semantic names to [`screenshots/curated/`](screenshots/curated/). Supplied captures remain 590 × 1280 mobile images; generated captures use 393 × 852, 768 × 1024, and 1440 × 900 browser viewports. Browser and operating-system chrome are not application UI.

The baseline consists of:

- [`current-ui-baseline.md`](current-ui-baseline.md) — implementation-backed visual and behaviour inventory.
- [`screenshot-index.md`](screenshot-index.md) — one-to-one raw-capture index and assessment.
- [`missing-captures.md`](missing-captures.md) — acceptance gaps and reproduction checklist.
- [`capture-methodology.md`](capture-methodology.md) — isolated-worktree fixture and interception method.
- [`acceptance-record.md`](acceptance-record.md) — formal baseline acceptance and lock record.

## Acceptance status

- Current UI Baseline: Accepted
- Current UI Baseline Lock: Complete
- P0 blocking gaps: 0
- Full UI/UX Design Package: Not yet imported
- Full UI/UX Design Acceptance: Not complete
- Full UI/UX Design Lock: Not complete
- Application implementation: Not started

Audit evidence comprises 38 supplied raw screenshots and 95 deterministic-fixture raw screenshots (63 mobile, 16 tablet, 16 desktop), with 133 one-to-one raw/curated evidence pairs. The factual baseline evidence is complete, Accepted, and locked as the current-application baseline. Fixture evidence is source-backed but is not a live-production observation.

This accepted factual baseline remains evidence of the current application, not a proposal for a replacement design. It does not itself implement multi-user behaviour and is not the complete target design system; the full UI/UX design package has not yet been imported or accepted.
