# Capture methodology

Audited commit: `b77d0f6cb54436a72470e5a01cc2bc0692f75587`.

## Viewports

- Mobile: 393 × 852
- Tablet: 768 × 1024
- Desktop: 1440 × 900

## Fixture and request strategy

Capture ran from `/tmp/trip-ui-baseline-capture`, a disposable Git worktree created directly from the audited commit. A temporary `.env.local` pointed the current Supabase client to `http://audit.local`. The browser ran the real application/component/styling code with a fixed `2026-07-25T12:00:00.000Z` clock. It intercepted only PostgREST fixture records, document-parser success/error/delay, FX success/delay/offline, and remote persona-image success/blocking. PDF/PNG selection used browser `setInputFiles`; no native operating-system chooser was automated.

`Live observed` is reserved for supplied raw screenshots and their actual runtime observations. `Deterministic fixture` means real checked-out UI rendered with controlled data/network outcomes; it is source-backed audit evidence, not production observation. `Source confirmed` is code inspection only; `Missing evidence` was not reproduced.

Commands: `git worktree add --detach /tmp/trip-ui-baseline-capture HEAD`; `npm ci`; temporary `npm install --no-save --package-lock=false playwright-core@1.52.0`; `npm run dev -- --host 127.0.0.1`; disposable `node scripts/capture-ui-baseline.mjs`; non-overwriting `cp -n` into this package.

Limitations: no production data, native chooser UI, live remote-image trace, device safe-area proof, accessibility test, or unreproduced P0 state was implied by the harness. The broken hero-image behaviour remains Correct-classified from live supplied evidence; fixture success/blocking does not fix or replace it.

## Final capture pass

Final capture worktree: `/tmp/trip-ui-baseline-final-capture` (removed after capture). It reused the same fixed clock and interception approach, adding fixture branches for: Partha as a settlement debtor; delayed, successful, and failed settlement inserts (failure scoped to that insert); zero/negative/no-participant expense validation; PNG input selection; Astitva-only event filtering; and explicit persona-picker, five-tab, scrolled sticky-shell, and modal-overlay frames at all audit viewports.

The final pass added 27 non-overwriting screenshots: 17 mobile, 5 tablet, and 5 desktop. The full generated total is 95 (63 mobile, 16 tablet, 16 desktop). Remaining manual/non-blocking limitations are live remote-image tracing, device safe-area proof, keyboard/focus, contrast and reduced-motion testing, native chooser variants, and deferred AI/legacy Group Settings evidence. No P0 limitation remains.
