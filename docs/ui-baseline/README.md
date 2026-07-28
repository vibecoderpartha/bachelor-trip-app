# Current UI baseline

This package records the factual current-user-interface baseline for the Trip application. The rendered current application and its implementation are the visual source of truth; the screenshots are evidence of observed states, not a proposal for a replacement design.

Original raw captures are preserved in [`screenshots/raw/mobile/`](screenshots/raw/mobile/). Deterministic browser-fixture captures from the audited commit are separately preserved in [`screenshots/raw/generated/`](screenshots/raw/generated/) and copied with semantic names to [`screenshots/curated/`](screenshots/curated/). Supplied captures remain 590 × 1280 mobile images; generated captures use 393 × 852, 768 × 1024, and 1440 × 900 browser viewports. Browser and operating-system chrome are not application UI.

The baseline consists of:

- [`current-ui-baseline.md`](current-ui-baseline.md) — implementation-backed visual and behaviour inventory.
- [`screenshot-index.md`](screenshot-index.md) — one-to-one raw-capture index and assessment.
- [`missing-captures.md`](missing-captures.md) — acceptance gaps and reproduction checklist.
- [`capture-methodology.md`](capture-methodology.md) — isolated-worktree fixture and interception method.

Audit status: 38 supplied raw screenshots inspected, plus 95 deterministic-fixture raw screenshots (63 mobile, 16 tablet, 16 desktop); 133 curated copies exist. Factual baseline evidence is complete and the package is ready for UI Baseline Acceptance Review. Fixture evidence is source-backed but is not a live-production observation. The package is not yet the locked design system and is not Accepted or Locked until review and commit.
