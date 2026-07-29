# Current UI baseline

## 1. Baseline scope and authority

This is a factual audit of the application at `b77d0f6cb54436a72470e5a01cc2bc0692f75587`. Screenshot observations are marked **Observed**; exact source-backed statements are **Confirmed**; conclusions from incomplete evidence are **Inferred**; absent coverage is **Missing evidence**. Current rendered source takes precedence over screenshot compression and over README marketing copy. This document does not specify future multi-user work.

## 2. Application shell

**Confirmed:** [`src/App.tsx`](../../src/App.tsx) renders one centred, flex-column application shell with `maxWidth: 480`, `minHeight: 100dvh`, a sticky translucent header, scrollable main content, and sticky bottom navigation. The header uses `rgba(15, 11, 8, 0.78)`, `saturate(180%) blur(14px)`, a one-pixel `--border`, horizontal `20px` padding, and a `16/12px` vertical rhythm. Bottom navigation uses `rgba(15, 11, 8, 0.92)`, the same filter, safe-area padding, and a top border.

**Observed:** the supplied set contains 38 mobile 590 × 1280 screens with iOS/browser chrome. **Deterministic fixture evidence:** 46 mobile 393 × 852, 11 tablet 768 × 1024, and 11 desktop 1440 × 900 captures render the checked-out components with intercepted data/network outcomes. The OS/browser UI is not an app token.

## 3. Navigation model

**Confirmed:** navigation is client-side `activeTab` state, not URL routing. The current selectable order is **Trip, Scan, Split, FX, Todo** (`src/App.tsx:11-17`); tab content fades in. The active item has primary text and a centred `22 × 2px` coral top marker. Initial state has no user and shows the persona picker.

**Contradictory observed evidence:** the 14 July 22 captures use a six-item nav including **AI**; `src/tabs/AITab.tsx` and the `ai` tab asset remain in source, but `App.tsx` does not import or render it. Group Settings is also visible in two legacy captures but has no current entry point or component. See section 20.

## 4. Screen inventory

| Current entry/view | Evidence | Principal states |
| --- | --- | --- |
| Initial persona picker | live observed + deterministic fixture + confirmed | five personas; explicit mobile/tablet/desktop overlay frames |
| Trip tab | deterministic fixture + confirmed | loading, populated past/live/next/upcoming, notes, India/Bali, audience filter, flight countdown/departure, sticky shell |
| Scan tab | deterministic fixture + confirmed | default, PDF/PNG selection, scanning, success/error, assignment, documents and deletion |
| Split tab | deterministic fixture + confirmed | populated dashboard, totals, cards/history, debtor settlement recording/success/error, add/edit expense |
| FX tab | live observed + deterministic fixture + confirmed | rate loading/success/offline, disabled refresh, INR↔IDR and guide |
| Todo tab | live observed + deterministic fixture + confirmed | empty, pending/done, completion, clear and deletion |
| Add/Edit Event dialog | deterministic fixture + confirmed | default, required validation, saving/error, populated edit and removal |
| Add/Edit Expense dialog | deterministic fixture + confirmed | payer modes, contribution match/mismatch, description/amount/people validation, saving/error, populated edit |
| Settle Up dialog | live observed + deterministic fixture + confirmed | all-settled, debtor transfer, recording, success result and insert error |
| AI tab / Group Settings | missing current entry point | legacy-only evidence; do not treat as current navigable screens |

## 5. Screen-by-screen visual description

- **Persona picker:** fixed blurred dark overlay; date in mono caps, 36px Fraunces title, italic question, then five 320px-max cards. Cards carry 44px initial avatars and a colour dot. Source: `src/components/PersonaPicker.tsx:10-90`; observed in curated 15.
- **Trip:** persona-specific hero image with dark gradient and 13px eyebrow/26px tagline; crew status is five equal tiles. Then a collapsible flight card and itinerary header with India/Bali toggle and `+ Add`. Empty timeline says “No events yet.” Sources: `src/tabs/TripTab.tsx:44-191`, `src/components/CrewStatus.tsx:55-133`, `src/components/CountdownClock.tsx:29-184`; observed in 17-23.
- **Scan:** hero, centred title and explanatory paragraph, 2px dashed upload target, on/off assignment toggle, and disabled/enabled `SCAN IT` pill. Sources: `src/tabs/ScanTab.tsx:92-254`; observed in 24-26 and 29.
- **Split:** hero, 20px balance card, four other-person balance tiles, side-by-side actions, then expense log. A populated source view additionally has group totals, cards and settlements. Sources: `src/tabs/SplitTab.tsx:28-112`, `src/components/BalanceHero.tsx:20-89`, `src/components/GroupTotals.tsx:46-114`; observed in 27-28.
- **FX:** hero, 18px-padded rate card with two large serif numeric inputs and swap arrow, horizontal quick-chip rows, then 10 compact price-guide rows. Sources: `src/tabs/FXTab.tsx:68-226`; observed in 32-35 and 38.
- **Todo:** hero, one-line input plus button, followed by loading, empty, pending and done sections. Source: `src/tabs/TodoTab.tsx:27-216`; observed in 36-37.
- **Modal dialogs:** source uses a viewport overlay with blurred backdrop and a centred, scrollable 480px-max rounded sheet. Add Event / Expense use coral solid action plus ghost Cancel; Settle Up ends in a full-width ghost Done. Sources: `src/components/ui/Modal.tsx:12-48`, modal files below; observed in 16, 19, 30-31.

## 6. Shared component inventory

`TabHero`, `Avatar`, `UserChips`, `NeonBtn`, `NeonInput`, `Modal`, `VIPBadge`, `CrewStatus`, `CountdownClock`, `EventCard`, `BalanceHero`, `GroupTotals`, `ExpenseCard`, and `TodoRow` are current shared UI units. Their implementation lives in `src/components/` and `src/components/ui/`; there is no separate component-library package or locked design-token layer.

## 7. Exact token inventory from source

`src/styles/global.css:8-42` is the canonical defined-token inventory:

| Family | Identifiers / values |
| --- | --- |
| Background | `--bg-base #0F0B08`; `--bg-elevated #16110D`; `--bg-card rgba(245,241,235,0.035)`; hover `rgba(245,241,235,0.06)` |
| Text | primary `#F5F1EB`; secondary `.62`; tertiary `.38`; quaternary `.18` of the primary colour |
| Borders | `--border rgba(245,241,235,0.08)`; strong `.16` |
| Accent | `--accent #FF8B4D`; deep `#E66B2C`; soft `rgba(255,139,77,0.14)` |
| Named neon values | pink `#FF2D78`; gold `#FFD600`; cyan `#00FFD1`; purple `#BF5FFF`; orange `#FF6B00` |
| Radii | `--radius-sm 8px`; md `12px`; lg `16px`; xl `22px` |

Other concrete values are component-local, not invented global tokens: modal overlay `rgba(15,11,8,.82)` / blur `14px` and sheet radius `20px` (`src/components/ui/Modal.tsx:12-35`); hero image `saturate(.92) contrast(1.02)` (`TabHero.tsx:22-27`); scan target `rgba(245,241,235,.02)` (`ScanTab.tsx:104-108`).

## 8. Typography

**Confirmed:** Google Fonts loads Fraunces (`opsz`, `wght`, `SOFT`), Inter 300–700, and Share Tech Mono in `src/styles/fonts.css:1`. Display uses Fraunces with `opsz 96`, `SOFT 30`, weight 400 and `-0.025em`; eyebrow uses Fraunces italic with `opsz 14`, `SOFT 50`; mono adds `.04em` tracking (`global.css:52-71`). Body is Inter with `-0.01em` tracking and antialiasing (`global.css:28-38`). Typical display sizes are 36 picker, 38 balance, 32 countdown airport, 26 hero, and 22 section/dialog headings. Mono serves dates, rates, metadata, and small labels.

## 9. Spacing and layout

**Confirmed:** main tab bodies consistently use 20px horizontal padding (`px-5`), with 20–32px top padding and 32–40px bottom padding. Major vertical groups use 20px (`space-y-5`) or 24px (`space-y-6`). Cards commonly pad 14–22px. The hero overlay text is inset 24px left/right and 18px bottom (`TabHero.tsx:39-70`). The only explicit shell width cap is 480px; no source media queries or breakpoint configuration are defined.

## 10. Radii, borders, shadows, transparency and blur

Surfaces are translucent, one-pixel bordered, and generally have 8/12/16px radii. Pills and chips use `999px`; modal sheets use 20px. `Avatar` derives translucent fill and border as `${participantColor}22` / `${participantColor}66` (`Avatar.tsx:11-31`). The header/nav use backdrop blur; the picker uses 18px blur; modal uses 14px blur. Shadows are deliberately sparse: the scan toggle thumb has `0 1px 3px rgba(0,0,0,.3)` (`ScanTab.tsx:170-177`); user dot has a 4px colour glow (`App.tsx:57-66`).

## 11. Icons and imagery

Emoji identify event types, people in crew tiles, expenses, and price-guide rows. Native inline SVG supplies the Todo tick and delete marks (`TodoTab.tsx:186-214`); the countdown ring is inline SVG (`CountdownClock.tsx:103-146`). Hero/persona imagery is remote Supabase Storage URLs (`src/constants/users.ts:1-16`, `tabAssets.ts:10-46`) with empty alt text. **Observed:** current-shell captures show a broken-image glyph in several hero areas (17, 18, 20, 24, 28, 32), a concrete functional concern, not a desired visual treatment.

## 12. Participant colour system

The five source identities are Partha/pink `#FF2D78`/🦁, Astitva/cyan `#00FFD1`/🐯, Vaibhav/gold `#FFD600`/🦊, Suryansh/purple `#BF5FFF`/🐺, and Bittu/orange `#FF6B00`/🦅 (`src/constants/users.ts:11-17`). Their colours drive avatar fill/border/text, selected chips, active Todo controls, roster borders, and status dots. Event-type colours are a separate mapping in `src/constants/eventTypes.ts:8-20`. **Observed:** the July 22 set instead has three identities including an email-address participant; this is legacy evidence only.

## 13. Motion and transitions

Source defines `fadeIn .45s ease-out`, `slideUp .5s cubic-bezier(.22,1,.36,1)`, `pulseSoft 2.4s`, and `spin 1.6s linear` (`global.css:42-49`). Tabs fade; dialog and event cards slide up; live crew/event dots pulse; countdown ring changes over 1s linear; normal card/chip/input/button transitions are 150–300ms. Scan defines a local 0.7s spinner. **Missing evidence:** no captures of motion and no `prefers-reduced-motion` handling was found.

## 14. Responsive behaviour

**Confirmed:** shell is max 480px, buttons/chips use flex wrapping or horizontal overflow, and modal width is max 480px. The nav remains five equal columns. **Deterministic fixture evidence:** at 768 × 1024 and 1440 × 900 the shell remains a centred 480px column against the base background; header/nav remain inside it, modal sheets stay capped at 480px, and long Add Event content scrolls in the overlay. Explicit picker, five-tab, scrolled sticky-header/bottom-nav, and modal-overlay frames exist at all three audit viewports. No CSS breakpoint branch was observed. This is fixture evidence, not a live-device observation.

## 15. Existing interaction behaviour

Persona selection and header chips change current persona in memory. Trip toggles countdown and timezone, filters events by audience, expands notes, links Maps, and opens add/edit event. Scan accepts PDF/image, toggles audience, invokes parsing, and exposes document View/Delete. Split calculates balances and transfers, opens add/edit expense and records a settlement. FX fetches a live rate, refreshes it, swaps conversion direction, recalculates on input, and exposes quick amounts. Todo adds, toggles, deletes and clears completed rows. These are confirmed in the respective tab/component source listed above; not all have screenshot coverage.

## 16. Existing loading, empty, validation, error and success states

| Area | Confirmed source state | Screenshot evidence |
| --- | --- | --- |
| Trip | three pulsing timeline skeletons; empty; past/live/next/upcoming; audience filtering | deterministic fixture: all listed states, notes, timezone and flight variants |
| Scan | disabled; PDF/image selected; scanning spinner; success; pink error; scanned-doc list | deterministic fixture: all listed states and direct deletion outcome |
| Split | skeleton; empty; populated dashboard/cards/history; settlement recording/error | deterministic fixture: populated and debtor transfer/recording/current-success/error; Split skeleton remains P1 |
| FX | `Fallback rate`; `Refreshing…` disabled; `offline` suffix on error | deterministic fixture: all listed states |
| Todo | `Loading…`; empty; pending/done; disabled/enabled Add | deterministic fixture: empty/populated, completion, clear and deletion |
| Event dialogs | required title/date/start validation; saving; server error | deterministic fixture: required validation, saving/error, edit and removal |
| Expense dialogs | required description/positive amount/people/split-sum validation; saving; server error | deterministic fixture: description, zero/negative amount, no-people, split match/mismatch, saving/error and edit |
| Settle dialog | all-settled; transfer list; `Paid` recording; error | live all-settled plus deterministic debtor transfer, recording, current success result and insert error |

## 17. Copy, terminology and writing tone

Tone is informal, trip-specific and teasing: “Drop a ticket. We’ll read it.”, “Nobody walks home broke.”, “Pour another Bintang.” Labels use sentence case with occasional stylised lowercase/mono headings (`live rate`, `bali price guide`, `your itinerary`). Currency uses INR and IDR; trip locations refer to Bali and India/Bali timezone choice. Current source title is “Bakchodi in Bali” while legacy captures say “Bali Bachelor Trip (v2 Demo)”; source wins for current shell.

## 18. Accessibility findings

- **Correct:** hero images have empty `alt` while serving as visually meaningful persona imagery; current broken-image captures further show this content has no text fallback.
- **Correct:** no reduced-motion query is present for continuous pulse/spin and view transitions.
- **Correct:** destructive event/document/todo deletion executes immediately in source; no confirmation exists (`TripTab.tsx:177-178`, `ScanTab.tsx:86-89`, `TodoTab.tsx:207-215`).
- **Correct:** several icon-only controls lack accessible names (for example Todo’s delete control); Scan’s toggle also has no label association. The swap and dialog-close controls do have `aria-label`.
- **Inferred:** low-opacity tertiary/quaternary text and thin borders may fail contrast in some contexts; this needs measured testing, not a claim of failure from screenshots.

## 19. Preserve / Extend / Correct / Deferred register

| Classification | Item | Evidence / reason |
| --- | --- | --- |
| Preserve | warm dark palette, serif/UI/mono hierarchy, compact cards and five-person chip treatment | observed and source-confirmed |
| Preserve | current empty/populated cards, Scan assignment/document flow, FX converter, Todo row treatment, five-tab shell and modal sheet | live and deterministic-fixture evidence now cover these reusable patterns |
| Extend | P1 verification depth only: device/accessibility, live network trace, additional skeleton/overflow and reconnect evidence | factual P0 capture coverage is complete |
| Correct | remote hero-image delivery / fallback | broken glyph observed in current-shell captures; remote source URL confirmed |
| Correct | confirmation and accessibility gaps in section 18 | concrete behavioural/accessibility concerns in source |
| Deferred | AI navigation and Group Settings | legacy evidence / dormant or absent current entry points; no redesign or implementation implied |
| Unclear | legacy six-tab, legacy title, legacy three-person data | directly conflicts with current source; retain only as audit evidence |

## 20. Contradictions and unresolved observations

1. **Navigation:** July 22 shows AI in a six-item bottom nav; current `App.tsx` has five tabs. `AITab` is present but unreachable.
2. **Group Settings:** two supplied legacy captures show group configuration, invitation and leaving; no current source route/component implements that screen.
3. **Trip identity:** legacy title is “Bali Bachelor Trip (v2 Demo)” with “BALI, INDONESIA”; current source says “Bakchodi in Bali” and “MAY 22 — 27 · 2026”.
4. **Participant set:** legacy images include three people and an email-address user; current `USERS` has five named personas.
5. **Hero assets:** source specifies remote image URLs and supplied live-current captures show a broken-image glyph. Deterministic fixture captures separately show controlled success/blocking; they do not replace the live observation or its Correct classification.
6. **Screenshot provenance:** supplied evidence is mobile browser JPEG; generated deterministic-fixture evidence is PNG at mobile, tablet and desktop audit viewports. Source values—not screenshot pixels—are used where an exact dimension, colour, typeface, blur, or transition is available.

## 21. Baseline completion status

All P0 capture states have deterministic-fixture or live-observed evidence and are indexed in [`screenshot-index.md`](screenshot-index.md). Formal acceptance and lock details are recorded in [`acceptance-record.md`](acceptance-record.md).

- Current UI Baseline: Accepted
- Current UI Baseline Lock: Complete
- P0 blocking gaps: 0
- Full UI/UX Design Package: Not yet imported
- Full UI/UX Design Acceptance: Not complete
- Full UI/UX Design Lock: Not complete
- Application implementation: Not started

Acceptance locks this factual current-application baseline as a preservation input. It does not make the baseline a complete target design system, accept or lock the full UI/UX design package, authorize new multi-user screens, or authorize application, architecture, data-model, migration, or implementation work.
