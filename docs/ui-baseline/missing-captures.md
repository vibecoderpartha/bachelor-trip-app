# Remaining capture work

## 1. Current blocking gaps

None. Every P0 capture state is present as deterministic-fixture evidence in `screenshot-index.md`. This means the real checked-out component and styling rendered with controlled fixture data or network outcomes; it does not reclassify any fixture frame as a live-production observation.

## 2. Non-blocking P1 evidence

| Item | Why it remains useful | Manual or follow-up method |
| --- | --- | --- |
| Live remote-image network trace | Fixture success/blocking and supplied broken-image evidence do not prove a particular live response path. | Record browser network outcome against the deployed/current environment. |
| Device safe-area proof | Browser viewport captures do not establish physical-device inset behaviour. | Capture on representative iOS/Android devices. |
| Keyboard/focus testing | Screenshots do not establish tab order, focus visibility, or keyboard dialog handling. | Keyboard-only walkthrough. |
| Automated contrast testing | Opacity-based text concerns require measured output. | Run contrast tooling against rendered states. |
| Reduced-motion testing | Source lacks an audited `prefers-reduced-motion` result. | Test with the operating-system preference enabled. |
| Scan deletion failure/loading-list branch | Existing capture proves immediate successful deletion, not a failing storage/database chain. | Force those requests independently in disposable fixtures. |
| Loading skeleton breadth and overflow variants | Trip loading and long-event/modal cases are captured; Split/Expense loading and additional overflow combinations remain optional depth. | Delay each hook and add longer fixture values. |
| Offline/reconnect beyond FX | FX offline is captured; Supabase-backed tabs expose no confirmed reconnect UI. | Toggle connectivity during their requests and record actual absence/presence of feedback. |

P1 items do not block factual UI-baseline acceptance unless a review explicitly promotes one.

## 3. Deferred P2 evidence

| Item | Reason |
| --- | --- |
| Native chooser variants | The supplied iOS chooser establishes the hand-off; Android/desktop chooser UI is platform-owned. |
| Dormant AI screen | `AITab` has no current navigation entry point. |
| Legacy Group Settings reconciliation | Legacy-only captures have no corresponding current route/component. |

P2 items do not block factual UI-baseline acceptance unless a review explicitly promotes one. AI and legacy Group Settings remain deferred.

## 4. Completed P0 coverage summary

- Trip: loading, populated past/live/next/upcoming cards, expanded notes, India/Bali, upcoming/departed flight, restricted-audience recipient/non-recipient, and explicit shell/sticky frames.
- Scan: default, PDF and PNG selection, scanning, success, parser error, document list, assignment, and immediate deletion outcome.
- Split/settlement: populated dashboard, totals, cards/history, debtor transfer, recording, current success result, and settlement-insert error.
- Event dialogs: default, required validation, saving, server error, populated edit, and immediate removal outcome.
- Expense dialogs: default, split payment match/mismatch, missing description, zero and negative amount, no participants, saving, server error, and populated edit.
- FX: loading, successful rate, refresh-disabled, offline fallback, both directions, and price guide.
- Todo: empty, populated pending/done, completion, clear completed, and immediate deletion outcome.
- Responsive shell: persona picker, five-tab navigation, sticky header/bottom navigation, and modal overlay/sheet at mobile, tablet, and desktop.
- Hero images: deterministic success/blocking plus supplied live-observed broken-image evidence. Broken-image and accessibility concerns remain Correct classifications.

## 5. Acceptance impact

Factual P0 baseline evidence is complete. Formal acceptance and lock details are recorded in [`acceptance-record.md`](acceptance-record.md).

- Current UI Baseline: Accepted
- Current UI Baseline Lock: Complete
- P0 blocking gaps: 0
- Full UI/UX Design Package: Not yet imported
- Full UI/UX Design Acceptance: Not complete
- Full UI/UX Design Lock: Not complete
- Application implementation: Not started

P1 and P2 items remain retained as non-blocking evidence. Baseline acceptance does not make this package a complete target design system, accept or lock the full UI/UX design package, or authorize implementation.
