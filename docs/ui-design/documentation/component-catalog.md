# Component catalog

Cumulative. Batches 1–8 of 8. 86 components. UI/UX Design Package: Accepted. UI/UX Design Lock: Complete.

Export format: 2× PNG. SVG is not practical — these are live DOM compositions using backdrop-filter, radial gradients and variable-font settings, which do not survive a DOM-to-SVG conversion faithfully. The master HTML is the vector-accurate source.

## CMP-01 — Button variants

- **Board:** 05
- **Source analogue:** Confirmed — NeonBtn.tsx
- **Classification:** Confirmed
- **Variants:** primary, secondary, ghost, destructive, pressed, focused, disabled, loading, icon-button
- **States:** primary, secondary, ghost, destructive, pressed, focused, disabled, loading, icon-button
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-01-button-variants.png`
- **Status:** Accepted

## CMP-02 — Identity — avatars, chips, badges

- **Board:** 05
- **Source analogue:** Confirmed — Avatar.tsx, UserChips.tsx, VIPBadge.tsx
- **Classification:** Confirmed
- **Variants:** avatar 22/32/44, neutral avatar, selected chip, unselected chip, unclaimed chip, owner / member / pending / unclaimed / inactive / you badges
- **States:** avatar 22/32/44, neutral avatar, selected chip, unselected chip, unclaimed chip, owner / member / pending / unclaimed / inactive / you badges
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-02-identity-avatars-chips-badges.png`
- **Status:** Accepted

## CMP-03 — Group switcher

- **Board:** 05
- **Source analogue:** New — extends the header identity chip
- **Classification:** Extended
- **Variants:** closed, open, current selected, other Group, create, join
- **States:** closed, open, current selected, other Group, create, join
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-03-group-switcher.png`
- **Status:** Accepted

## CMP-04 — Rows and cards

- **Board:** 05
- **Source analogue:** Extended — surface + TodoRow
- **Classification:** Extended
- **Variants:** member row, pending member row, document row, expense row
- **States:** member row, pending member row, document row, expense row
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-04-rows-and-cards.png`
- **Status:** Accepted

## CMP-05 — Invitation card states

- **Board:** 05
- **Source analogue:** New — surface + pill
- **Classification:** Extended
- **Variants:** valid, expired, already used, revoked, other account
- **States:** valid, expired, already used, revoked, other account
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-05-invitation-card-states.png`
- **Status:** Accepted

## CMP-06 — Sheet, dialog, confirmation

- **Board:** 05
- **Source analogue:** Confirmed — Modal.tsx
- **Classification:** Confirmed
- **Variants:** overlay, 480px sheet, destructive confirmation
- **States:** overlay, 480px sheet, destructive confirmation
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-06-sheet-dialog-confirmation.png`
- **Status:** Accepted

## CMP-07 — Text, email and password inputs

- **Board:** 06
- **Source analogue:** Confirmed — NeonInput.tsx
- **Classification:** Confirmed
- **Variants:** default, focused, error, password with reveal, strength meter, disabled
- **States:** default, focused, error, password with reveal, strength meter, disabled
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-07-text-email-password-states.png`
- **Status:** Accepted

## CMP-08 — Currency, textarea, search, segmented, toggle

- **Board:** 06
- **Source analogue:** Confirmed — AddExpenseModal, ScanTab
- **Classification:** Confirmed
- **Variants:** currency + segmented, textarea, search, checkbox unchecked/checked, toggle on, toggle disabled
- **States:** currency + segmented, textarea, search, checkbox unchecked/checked, toggle on, toggle disabled
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-08-currency-textarea-search-segmented-toggle.png`
- **Status:** Accepted

## CMP-09 — Validation timing and form feedback

- **Board:** 06
- **Source analogue:** Extended — current dialog behaviour
- **Classification:** Extended
- **Variants:** on blur, on change after first error, on submit, form-level error, success
- **States:** on blur, on change after first error, on submit, form-level error, success
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-09-validation-timing-form-feedback.png`
- **Status:** Accepted

## CMP-10 — Loading, skeleton, in progress

- **Board:** 07
- **Source analogue:** Confirmed — TripTab skeleton
- **Classification:** Confirmed
- **Variants:** three-row skeleton, inline spinner with label
- **States:** three-row skeleton, inline spinner with label
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-10-loading-skeleton-in-progress.png`
- **Status:** Accepted

## CMP-11 — Empty states

- **Board:** 07
- **Source analogue:** Confirmed — Todo and Settle Up empty states
- **Classification:** Confirmed
- **Variants:** no Groups, single member
- **States:** no Groups, single member
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-11-empty-states.png`
- **Status:** Accepted

## CMP-12 — Connection states

- **Board:** 07
- **Source analogue:** Extended — FX offline treatment
- **Classification:** Extended
- **Variants:** reconnecting, offline, reconnected, remote change conflict
- **States:** reconnecting, offline, reconnected, remote change conflict
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-12-connection-states.png`
- **Status:** Accepted

## CMP-13 — Permission and access states

- **Board:** 07
- **Source analogue:** New — plain-language blocks
- **Classification:** Extended
- **Variants:** read-only, owner-only action, private document, Group unavailable
- **States:** read-only, owner-only action, private document, Group unavailable
- **Accessibility rules:** 44x44 minimum target, visible focus ring, accessible name on icon-only controls, status never by colour alone.
- **Screens using it:** See screen-manifest reusedComponents
- **Export path:** `components/CMP-13-permission-and-access-states.png`
- **Status:** Accepted

## CMP-14 — Member and participant rows

- **Board:** 05 / 12 / 13
- **Source analogue:** Extended — derived from UserChips.tsx and the current 56px list row
- **Classification:** Extended
- **Variants:** Owner row, Member row, new participant row (initials), pending invitation row, unclaimed participant row (dashed), inactive historical participant row, claim selection row unselected, claim selection row selected
- **States:** default, selected, unselected, disabled, inactive, pending
- **Accessibility rules:** 56px minimum row height; 44x44 kebab; role and status always word plus glyph so colour is never the only signal; name and initial always visible on neutral avatars; dashed ring conveys unclaimed alongside the 'Unclaimed' badge.
- **Screens using it:** MBR-01, MBR-02, MBR-13, MBR-15, CLM-01, CLM-03, CLM-13, GRP-12
- **Export path:** `components/CMP-14-member-and-participant-rows.png`
- **Status:** Accepted

## CMP-15 — Read-only Group banner

- **Board:** 14
- **Source analogue:** New — no analogue; nearest is the connection banner (CMP-12)
- **Classification:** Extended (new for multi-user)
- **Variants:** archived · Owner, archived · Member, stale membership, maintenance
- **States:** default, with action, without action
- **Accessibility rules:** Never labelled Viewer. Announced as a status region on entry; the action inside is a real 44px control with an accessible name.
- **Screens using it:** PERM-05, PERM-10, PERM-11, PERM-12, GRP-06
- **Export path:** `components/CMP-15-read-only-group-banner.png`
- **Status:** Accepted — batch 3

## CMP-16 — Permission explanation card

- **Board:** 14
- **Source analogue:** Extended — from the batch-1 permission block on board 07
- **Classification:** Extended
- **Variants:** inline · owner-only, inline · nothing changed, sheet · denied action
- **States:** default, with owner names, with state marker
- **Accessibility rules:** Heading is the rule, body is the next safe action, mono line carries the state so it is never colour-only. Associated with the control it explains via aria-describedby.
- **Screens using it:** PERM-06, PERM-07, PERM-08, PERM-12, PERM-15, PERM-16, PERM-19
- **Export path:** `components/CMP-16-permission-explanation-card.png`
- **Status:** Accepted — batch 3

## CMP-17 — Unavailable-resource state

- **Board:** 14
- **Source analogue:** New — page-level; extends the batch-1 empty-state geometry
- **Classification:** Extended (new for multi-user)
- **Variants:** not a member, unavailable Group, unavailable link
- **States:** default, loading, no-recovery
- **Accessibility rules:** Identical layout for every cause. Neutral mark has no alt text requirement because it carries no information; the heading is the h1 of the page and takes focus on entry.
- **Screens using it:** PERM-01, PERM-02, PERM-03, PERM-04
- **Export path:** `components/CMP-17-unavailable-resource-state.png`
- **Status:** Accepted — batch 3

## CMP-18 — Owner-only setting row

- **Board:** 14
- **Source analogue:** Extended — from the configuration row on board 05
- **Classification:** Extended
- **Variants:** Owner · editable, Member · Owner only, Member · own action
- **States:** default, disabled, focused
- **Accessibility rules:** 56px minimum. Disabled rows are not focusable and are not announced as buttons; the OWNER ONLY marker is read as part of the row label.
- **Screens using it:** PERM-05, PERM-06
- **Export path:** `components/CMP-18-owner-only-setting-row.png`
- **Status:** Accepted — batch 3

## CMP-19 — Last-Owner protection notice

- **Board:** 14
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** leaving, demoting yourself, being removed, archiving
- **States:** blocked, with unblock action
- **Accessibility rules:** Lives inside the blocking confirmation sheet. The unblock action replaces the blocked primary so no dead control receives focus.
- **Screens using it:** PERM-09, GRP-12, MBR-13
- **Export path:** `components/CMP-19-last-owner-protection-notice.png`
- **Status:** Accepted — batch 3

## CMP-20 — Server-denied form summary

- **Board:** 14
- **Source analogue:** Extended — from the form-level error block on board 06
- **Classification:** Extended
- **Variants:** access changed mid-form, role changed mid-action, preserved input
- **States:** default, focused, announced
- **Accessibility rules:** Takes focus on appearance, announced politely, and is the accessible description of the disabled submit. Input stays visible and copyable.
- **Screens using it:** PERM-13, PERM-17, PERM-18
- **Export path:** `components/CMP-20-server-denied-form-summary.png`
- **Status:** Accepted — batch 3

## CMP-21 — Private-resource state

- **Board:** 14
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** stale direct reference, omission
- **States:** default
- **Accessibility rules:** Carries no metadata at all. The omission variant is documentation of an absence, not a rendered placeholder; screen readers encounter nothing where a private item would be.
- **Screens using it:** PERM-10, PERM-14
- **Export path:** `components/CMP-21-private-resource-state.png`
- **Status:** Accepted — batch 3

## CMP-22 — Recovery block

- **Board:** 14
- **Source analogue:** New — composed from existing buttons
- **Classification:** Extended (new for multi-user)
- **Variants:** choose another trip, back to your trip, ask an Owner, restore, choose a new Owner, try again, copy the details, sign in with another account, no recovery
- **States:** default, pressed, focused, absent
- **Accessibility rules:** One primary and at most one secondary; 44px minimum. The no-recovery variant renders a sentence, never a disabled button.
- **Screens using it:** PERM-01, PERM-02, PERM-03, PERM-04, PERM-08, PERM-13, PERM-15, PERM-16, PERM-20
- **Export path:** `components/CMP-22-recovery-block.png`
- **Status:** Accepted — batch 3

## CMP-23 — Multi-payer contribution block

- **Board:** 15
- **Source analogue:** Confirmed — AddExpenseModal split-payment block
- **Classification:** Confirmed
- **Variants:** filled, empty (zero), inactive participant, total match
- **States:** default, focused, error, disabled
- **Accessibility rules:** Rows are 44px minimum; each field is labelled by the participant name, and the currency suffix is part of the field label rather than decoration.
- **Screens using it:** FIN-12, FIN-13, FIN-15, FIN-20, FIN-25
- **Export path:** `components/CMP-23-multi-payer-contribution-block.png`
- **Status:** Accepted — batch 4

## CMP-24 — Participant-share display

- **Board:** 15
- **Source analogue:** New — no current screen writes custom shares (E-13)
- **Classification:** Extended (new for multi-user)
- **Variants:** equal-split participant selection, historical exact-share display, migration and reconciliation review
- **States:** default, focused, error
- **Accessibility rules:** Three uses only. No arbitrary custom-share authoring: no amount, percentage or weight can be entered, because no such authoring surface exists in the product (O-10). Rows keep 44px targets and per-row accounting equivalents.
- **Screens using it:** FIN-10, FIN-11, FIN-16
- **Export path:** `components/CMP-24-participant-share-display.png`
- **Status:** Revised in batch 5 — O-10, E-13 limited

## CMP-25 — Exact-total status

- **Board:** 15
- **Source analogue:** Confirmed — AddExpenseModal total indicator
- **Classification:** Confirmed
- **Variants:** match, short, over, nothing entered
- **States:** default, live-updating
- **Accessibility rules:** A live region announced on change; it is also the accessible description of the disabled Save. Never colour-only — the tick and the wording carry the state.
- **Screens using it:** FIN-10, FIN-12, FIN-13, FIN-14, FIN-15, FIN-16, FIN-20
- **Export path:** `components/CMP-25-exact-total-status.png`
- **Status:** Accepted — batch 4

## CMP-26 — Accounting-currency label

- **Board:** 15
- **Source analogue:** Confirmed — header subtitle plus IDR/INR control
- **Classification:** Confirmed
- **Variants:** header, figure pair, input
- **States:** default, selected
- **Accessibility rules:** Currency is stated once per Group in the header; figures pair accounting value with original currency so no amount is ambiguous.
- **Screens using it:** FIN-01, FIN-02, FIN-03, FIN-04, FIN-41
- **Export path:** `components/CMP-26-accounting-currency-label.png`
- **Status:** Accepted — batch 4

## CMP-27 — Original / accounting amount row

- **Board:** 15
- **Source analogue:** New — assembled from existing mono key/value rows
- **Classification:** Extended (new for multi-user)
- **Variants:** original, accounting, rate recorded, unavailable
- **States:** default, unavailable
- **Accessibility rules:** Mono key, mono value, no table. The unavailable variant uses an em dash plus accent colour and the word is repeated in the body copy.
- **Screens using it:** FIN-25, FIN-29, FIN-42, FIN-44
- **Export path:** `components/CMP-27-original-accounting-amount-row.png`
- **Status:** Accepted — batch 4

## CMP-28 — Historical FX explanation

- **Board:** 15
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** sheet, inline card
- **States:** default
- **Accessibility rules:** Two or three statements, never a paragraph. Dismissible; focus returns to the figure that opened it.
- **Screens using it:** FIN-29, FIN-43
- **Export path:** `components/CMP-28-historical-fx-explanation.png`
- **Status:** Accepted — batch 4

## CMP-29 — Recorder attribution row

- **Board:** 15
- **Source analogue:** New — created_by exists in the model but is not surfaced
- **Classification:** Extended (new for multi-user)
- **Variants:** recorded by, paid by, shared by
- **States:** default
- **Accessibility rules:** Three separate rows with mono keys. Names are text, avatars are supporting; attribution is never carried by an avatar alone.
- **Screens using it:** FIN-01, FIN-25, FIN-27, FIN-30
- **Export path:** `components/CMP-29-recorder-attribution-row.png`
- **Status:** Accepted — batch 4

## CMP-30 — Inactive ledger participant

- **Board:** 15
- **Source analogue:** Extended — from CMP-14 rows and E-09
- **Classification:** Extended
- **Variants:** inactive in an expense, unclaimed in a split, inactive in history
- **States:** default, no actions
- **Accessibility rules:** Warm neutral #C8B8A6 with a dashed ring plus the literal word on the row. No participant-management action is reachable from a ledger row.
- **Screens using it:** FIN-07, FIN-08, FIN-39
- **Export path:** `components/CMP-30-inactive-ledger-participant.png`
- **Status:** Accepted — batch 4

## CMP-31 — Settlement confirmation summary

- **Board:** 15
- **Source analogue:** New — source records on a single tap
- **Classification:** Extended (new for multi-user)
- **Variants:** confirmation, success recap
- **States:** default
- **Accessibility rules:** From, to, exact amount in both currencies, what changes, what becomes history — in that order, before an irreversible write.
- **Screens using it:** FIN-33, FIN-35, FIN-31
- **Export path:** `components/CMP-31-settlement-confirmation-summary.png`
- **Status:** Accepted — batch 4

## CMP-32 — Idempotent-result notice

- **Board:** 15
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** settlement already recorded, invitation already accepted
- **States:** default
- **Accessibility rules:** Never styled as a fresh success. States the existing record and why the screen appeared.
- **Screens using it:** FIN-37
- **Export path:** `components/CMP-32-idempotent-result-notice.png`
- **Status:** Accepted — batch 4

## CMP-33 — Finance conflict notice

- **Board:** 15
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** edit conflict, accounting value unavailable, what we did not do
- **States:** default
- **Accessibility rules:** Both sides stated; nothing merged, guessed or rounded. The choice stays with the person or with a controlled reconciliation.
- **Screens using it:** FIN-28, FIN-44
- **Export path:** `components/CMP-33-finance-conflict-notice.png`
- **Status:** Accepted — batch 4

## CMP-34 — Selected-file row

- **Board:** 16
- **Source analogue:** ScanTab selected-file line (file icon + ellipsised name)
- **Classification:** Extended (new for multi-user)
- **Variants:** PDF, image, unsupported, too large, long name
- **States:** default, error
- **Accessibility rules:** One line, min-width:0, ellipsised at the end and never wrapped. Replace and Remove are 44px targets. The accessible label carries the full filename.
- **Screens using it:** DOC-01, DOC-04, DOC-05, DOC-06, DOC-07, DOC-08, DOC-09, DOC-19, DOC-23
- **Export path:** `components/CMP-34-selected-file-row.png`
- **Status:** Accepted — batch 5

## CMP-35 — File-type badge

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** PDF, image, not supported, unreadable
- **States:** default
- **Accessibility rules:** Reports the validator’s decision, never the file extension. The same value drives the row glyph so icon and badge cannot disagree.
- **Screens using it:** DOC-01, DOC-04, DOC-05, DOC-06
- **Export path:** `components/CMP-35-file-type-badge.png`
- **Status:** Accepted — batch 5

## CMP-36 — Upload progress block

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** uploading, accepted, failed before acceptance, interrupted
- **States:** in progress, success, error
- **Accessibility rules:** Progress announced politely, not assertively. Every state names what does not exist yet. Reduced motion replaces the bar animation with a static fill.
- **Screens using it:** DOC-01, DOC-19, DOC-20, DOC-23, DOC-72
- **Export path:** `components/CMP-36-upload-progress-block.png`
- **Status:** Accepted — batch 5

## CMP-37 — Parsing status

- **Board:** 16
- **Source analogue:** ScanTab Scanning… spinner
- **Classification:** Extended (new for multi-user)
- **Variants:** parsing, slow, warnings, failed object kept, nothing usable, service unavailable
- **States:** in progress, warning, error
- **Accessibility rules:** The accepted spinner reused unmodified. Status changes are announced once, not per frame. Reduced motion shows a static indicator.
- **Screens using it:** DOC-20, DOC-21, DOC-22, DOC-24, DOC-25, DOC-28, DOC-73
- **Export path:** `components/CMP-37-parsing-status.png`
- **Status:** Accepted — batch 5

## CMP-38 — Extracted-field review group

- **Board:** 16
- **Source analogue:** Add Event form fields
- **Classification:** Extended (new for multi-user)
- **Variants:** confident, uncertain, required missing, Group timezone context
- **States:** default, warning, error
- **Accessibility rules:** Every field is a real labelled control with its provenance in the hint. Errors are programmatically associated. Primary action reads Continue until a person has reviewed it.
- **Screens using it:** DOC-26, DOC-27, DOC-30, DOC-31, DOC-32, DOC-33
- **Export path:** `components/CMP-38-extracted-field-review-group.png`
- **Status:** Accepted — batch 5

## CMP-39 — Extraction warning

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** uncertain date, missing reference, ambiguous location, timezone, summary strip
- **States:** warning
- **Accessibility rules:** Caution styling, never error styling, for anything user review can resolve. The summary strip is focusable and moves focus to the first warning.
- **Screens using it:** DOC-26, DOC-27, DOC-39
- **Export path:** `components/CMP-39-extraction-warning.png`
- **Status:** Accepted — batch 5

## CMP-40 — Scan provenance badge

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** from document scan, added by hand
- **States:** default
- **Accessibility rules:** Four words, recorded server-side. Never a provider, model, version or confidence value. Distinct from the manual badge by shape and colour, not colour alone.
- **Screens using it:** DOC-30, DOC-34, DOC-36, DOC-42, DOC-65
- **Export path:** `components/CMP-40-scan-provenance-badge.png`
- **Status:** Accepted — batch 5

## CMP-41 — Event presentation summary

- **Board:** 16
- **Source analogue:** ScanTab assign-to-everyone toggle
- **Classification:** Extended (new for multi-user)
- **Variants:** only you, everyone, selected participants, Event presentation, unclaimed in audience
- **States:** default, denied
- **Accessibility rules:** Renders document access and Event presentation as separate statements. The phrase private Event is prohibited. Unclaimed identity keeps warm neutral, dashed ring and a visible name. Corrected in batch 6: this summarises who an extracted Event is presented to. There is no per-document audience; document access is current same-Group authorisation.
- **Screens using it:** DOC-11, DOC-12, DOC-13, DOC-14, DOC-15, DOC-16, DOC-17, DOC-18, DOC-41
- **Export path:** `components/CMP-41-event-presentation-summary.png`
- **Status:** Corrected in batch 6

## CMP-42 — Document list row

- **Board:** 16
- **Source analogue:** ScanTab previously-scanned row
- **Classification:** Extended (new for multi-user)
- **Variants:** default, no Event, not read, inactive uploader, held, new via realtime
- **States:** default, dim, held
- **Accessibility rules:** 56px row, single ellipsised line, min-width:0 so a 120-character filename cannot push View off the edge. Status is a labelled badge, never colour alone. Corrected in batch 6: the row shows name, type, upload time, server-derived uploader provenance and Event status. No per-document audience summary is rendered.
- **Screens using it:** DOC-01, DOC-40, DOC-44, DOC-45, DOC-46, DOC-47, DOC-48, DOC-59, DOC-79
- **Export path:** `components/CMP-42-document-list-row.png`
- **Status:** Corrected in batch 6

## CMP-43 — Associated-Event status

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** event created, no event, not read, event missing, needs reconciliation
- **States:** default
- **Accessibility rules:** NO EVENT is gold because nothing failed; EVENT MISSING is the defect. Every value is a word as well as a colour.
- **Screens using it:** DOC-40, DOC-42, DOC-43, DOC-44, DOC-66
- **Export path:** `components/CMP-43-associated-event-status.png`
- **Status:** Accepted — batch 5

## CMP-44 — Private document viewer shell

- **Board:** 16
- **Source analogue:** ScanTab View ↗ public-URL link
- **Classification:** Extended (new for multi-user)
- **Variants:** loading, PDF, image, unavailable
- **States:** loading, default, denied
- **Accessibility rules:** One shell for both types. In-app render from an authorised short-lived read: no address bar, no copyable link, no permanent URL, and no metadata before authorization returns. Escape closes and restores focus to the invoking row.
- **Screens using it:** DOC-49, DOC-50, DOC-51, DOC-52
- **Export path:** `components/CMP-44-private-document-viewer-shell.png`
- **Status:** Accepted — batch 5

## CMP-45 — Removal impact summary

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** document only, Event kept, held document
- **States:** confirmation
- **Accessibility rules:** Consequences enumerated rather than a bare confirmation. Destructive action is never the focused default; Escape and backdrop cancel.
- **Screens using it:** DOC-57
- **Export path:** `components/CMP-45-removal-impact-summary.png`
- **Status:** Accepted — batch 5

## CMP-46 — Orphan and reconciliation status

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** metadata without object, partial removal, reconciling, succeeded, failed safely, member view
- **States:** warning, in progress, success, error, denied
- **Accessibility rules:** Never reports success it cannot prove, never falls back to a public path, never shows repair controls or operational vocabulary to an ordinary Member.
- **Screens using it:** DOC-61, DOC-63, DOC-65, DOC-66, DOC-67, DOC-68, DOC-69, DOC-70, DOC-82
- **Export path:** `components/CMP-46-orphan-reconciliation-status.png`
- **Status:** Accepted — batch 5

## CMP-47 — Document migration notice

- **Board:** 16
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** in progress, secured, held, mismatch
- **States:** default, warning
- **Accessibility rules:** Calm and counted. No object path, bucket, identifier, error code or service name, and never the old public address.
- **Screens using it:** DOC-80, DOC-81, DOC-82, DOC-83
- **Export path:** `components/CMP-47-document-migration-notice.png`
- **Status:** Accepted — batch 5

## CMP-48 — Configuration overview row

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** editable, read-only, locked
- **States:** default, owner, member
- **Accessibility rules:** One row, three renderings. Value is a single line with nowrap ellipsis; the affordance is absent for a Member rather than disabled. 56px minimum height and a 44px Edit target.
- **Screens using it:** CFG-01, CFG-02, CFG-03, CFG-06, CFG-59, CFG-68, CFG-75
- **Export path:** `components/CMP-48-configuration-overview-row.png`
- **Status:** Accepted — batch 6

## CMP-49 — Settings section header

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** default
- **States:** default
- **Accessibility rules:** A mono label and a hairline. Decorative rule is aria-hidden; the label is the group heading for assistive technology.
- **Screens using it:** CFG-02, CFG-03, CFG-56
- **Export path:** `components/CMP-49-settings-section-header.png`
- **Status:** Accepted — batch 6

## CMP-50 — Read-only configuration value

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** plain, with reason
- **States:** default
- **Accessibility rules:** No dimmed control ever renders. Where the reason is not obvious from context, it reads: Only an Owner can change these details. The word Viewer is never used.
- **Screens using it:** CFG-03, CFG-06
- **Export path:** `components/CMP-50-read-only-configuration-value.png`
- **Status:** Accepted — batch 6

## CMP-51 — Editable configuration field

- **Board:** 17
- **Source analogue:** Extends CMP-08 input
- **Classification:** Extended (new for multi-user)
- **Variants:** default, focused, error, with configured limit
- **States:** default, focus, error, disabled
- **Accessibility rules:** Extends CMP-08. Validation on submit; the error is announced politely against its own field. The counter renders only when implementation supplies a configured limit — no invented number.
- **Screens using it:** CFG-07, CFG-08, CFG-09, CFG-10, CFG-15, CFG-16, CFG-56, CFG-65, CFG-74
- **Export path:** `components/CMP-51-editable-configuration-field.png`
- **Status:** Accepted — batch 6

## CMP-52 — Date-range editor

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** default, range error
- **States:** default, error
- **Accessibility rules:** Two fields treated as one value. The range error sits under the pair, not on a field, and dates are never auto-swapped. The Group timezone is named in the read-back line.
- **Screens using it:** CFG-21, CFG-22, CFG-24
- **Export path:** `components/CMP-52-date-range-editor.png`
- **Status:** Accepted — batch 6

## CMP-53 — Timezone result row

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** unselected, selected
- **States:** default, selected
- **Accessibility rules:** Place label above the canonical identifier, always both. Two rows may share one identifier without being duplicates. 52px minimum height.
- **Screens using it:** CFG-29, CFG-30, CFG-31
- **Export path:** `components/CMP-53-timezone-result-row.png`
- **Status:** Accepted — batch 6

## CMP-54 — IANA timezone identity block

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** default
- **States:** default
- **Accessibility rules:** Canonical IANA identifier presented as identity. No fixed UTC offset is displayed or stored as the canonical value; an abbreviation such as WITA is a presentation of the identifier.
- **Screens using it:** CFG-28, CFG-30, CFG-35, CFG-69, CFG-76
- **Export path:** `components/CMP-54-iana-timezone-identity-block.png`
- **Status:** Accepted — batch 6

## CMP-55 — Configuration impact summary

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** neutral, with confirmed items
- **States:** default, confirmed
- **Accessibility rules:** Statements, not warnings. Never claims that Events were moved, shifted or repaired. Read as a list by assistive technology.
- **Screens using it:** CFG-17, CFG-24, CFG-32, CFG-54, CFG-71
- **Export path:** `components/CMP-55-configuration-impact-summary.png`
- **Status:** Accepted — batch 6

## CMP-56 — Accounting-currency authority card

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** zero minor units, two minor units, with reference line
- **States:** default
- **Accessibility rules:** Minor units come from the currency, never from a default. Reference conversions render smaller, dimmer and prefixed with an approximation sign so they cannot be mistaken for the obligation.
- **Screens using it:** CFG-38, CFG-41, CFG-43, CFG-46, CFG-47, CFG-48, CFG-70, CFG-77
- **Export path:** `components/CMP-56-accounting-currency-authority-card.png`
- **Status:** Accepted — batch 6

## CMP-57 — Accounting-currency lock notice

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** locked, blocked attempt
- **States:** default, blocked
- **Accessibility rules:** Replaces a selector rather than disabling one. Read as text, not as a disabled control. No Convert everything action exists in any state.
- **Screens using it:** CFG-43, CFG-44, CFG-45
- **Export path:** `components/CMP-57-accounting-currency-lock-notice.png`
- **Status:** Accepted — batch 6

## CMP-58 — Display-currency selector

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** available, selected, required
- **States:** default, selected, required
- **Accessibility rules:** The accounting currency renders as REQUIRED with no removal affordance. Display context never becomes ledger authority.
- **Screens using it:** CFG-49, CFG-50, CFG-51, CFG-70
- **Export path:** `components/CMP-58-display-currency-selector.png`
- **Status:** Accepted — batch 6

## CMP-59 — Bali-only content notice

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** available, not available
- **States:** default
- **Accessibility rules:** States the condition as well as the outcome. No worldwide guide is invented for a non-Bali destination.
- **Screens using it:** CFG-18, CFG-19, CFG-55
- **Export path:** `components/CMP-59-bali-only-content-notice.png`
- **Status:** Accepted — batch 6

## CMP-60 — Configuration change summary

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** changed, unchanged, invalid
- **States:** default, error
- **Accessibility rules:** One line per field, from and to. Fields validate independently. The accounting currency is omitted entirely when it is not legally editable — never shown as unchanged.
- **Screens using it:** CFG-25, CFG-57, CFG-60
- **Export path:** `components/CMP-60-configuration-change-summary.png`
- **Status:** Accepted — batch 6

## CMP-61 — Stale-configuration notice

- **Board:** 17
- **Source analogue:** Extends PERM-17 stale notice
- **Classification:** Extended (new for multi-user)
- **Variants:** another Owner changed it, realtime with form open
- **States:** default, warning
- **Accessibility rules:** Extends PERM-17. Never auto-merges and never overwrites an active local form; always offers to hand the unsaved text back.
- **Screens using it:** CFG-14, CFG-27, CFG-37, CFG-62, CFG-74, CFG-80
- **Export path:** `components/CMP-61-stale-configuration-notice.png`
- **Status:** Accepted — batch 6

## CMP-62 — Migration configuration evidence

- **Board:** 17
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** timezone evidence, currency evidence, held for review
- **States:** default, warning
- **Accessibility rules:** Evidence in product language. No migration table names, database field names or internal identifiers appear in any state.
- **Screens using it:** CFG-71, CFG-75, CFG-76, CFG-77, CFG-78, CFG-79
- **Export path:** `components/CMP-62-migration-configuration-evidence.png`
- **Status:** Accepted — batch 6

## CMP-63 — Connection-status pill

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** interrupted, reconnecting, offline, realtime only, failed
- **States:** default, warning, error
- **Accessibility rules:** Absent when healthy. Sits under the sticky header, never floats. Word plus hue, never hue alone; reduced motion drops the pulse.
- **Screens using it:** RT-01, RT-02, RT-03, RT-05, RT-07, RT-08, RT-09, RT-10
- **Export path:** `components/CMP-63-connection-status-pill.png`
- **Status:** Accepted — batch 7

## CMP-64 — Temporary update toast

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** neutral success, sync, caution
- **States:** default
- **Accessibility rules:** Four seconds, one line, no action. Announced politely; every outcome it carries also lands in durable screen state.
- **Screens using it:** MIG-82, RT-04, RT-14, RT-19, RT-21, RT-22, RT-25, RT-26, RT-32, RT-35, RT-40
- **Export path:** `components/CMP-64-temporary-update-toast.png`
- **Status:** Accepted — batch 7

## CMP-65 — Persistent contextual update card

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** event, document
- **States:** default
- **Accessibility rules:** Level 3. Stays until viewed. An invitation to look, never an insertion — the list does not reorder under a reading finger.
- **Screens using it:** RT-11, RT-16, RT-29, RT-30, RT-31, RT-34
- **Export path:** `components/CMP-65-persistent-contextual-update-card.png`
- **Status:** Accepted — batch 7

## CMP-66 — Realtime conflict card

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** default
- **States:** default
- **Accessibility rules:** Level 4, the only realtime surface with actions. Never merges, never overwrites, always states that nothing has been sent.
- **Screens using it:** MIG-06, RT-13, RT-15, RT-20, RT-24, RT-48
- **Export path:** `components/CMP-66-realtime-conflict-card.png`
- **Status:** Accepted — batch 7

## CMP-67 — Stale-data notice

- **Board:** 18
- **Source analogue:** Extends CMP-61 stale-configuration notice
- **Classification:** Extended (new for multi-user)
- **Variants:** default
- **States:** default, warning
- **Accessibility rules:** Generalised from CMP-61 to any record. One vocabulary for “this changed somewhere else” across the product.
- **Screens using it:** Referenced across boards; see screen-manifest.json
- **Export path:** `components/CMP-67-stale-data-notice.png`
- **Status:** Accepted — batch 7

## CMP-68 — Remote-change attribution line

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** person, system
- **States:** default
- **Accessibility rules:** One line explaining why something on screen just moved. Mono timestamp, name in full colour, verb secondary.
- **Screens using it:** RT-11, RT-12, RT-17, RT-18, RT-22, RT-23, RT-28
- **Export path:** `components/CMP-68-remote-change-attribution-line.png`
- **Status:** Accepted — batch 7

## CMP-69 — Grouped-update summary

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** default
- **States:** default
- **Accessibility rules:** Collapses a fan-out into one statement. One accepted mutation produces one message, never one per dependent change.
- **Screens using it:** RT-51
- **Export path:** `components/CMP-69-grouped-update-summary.png`
- **Status:** Accepted — batch 7

## CMP-70 — Out-of-sync notice

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** pill, with action
- **States:** default, warning
- **Accessibility rules:** States that the screen may be stale and offers a real refresh. No code, payload, channel name or service name.
- **Screens using it:** MIG-33, RT-09, RT-27, RT-53, RT-54
- **Export path:** `components/CMP-70-out-of-sync-notice.png`
- **Status:** Accepted — batch 7

## CMP-71 — Realtime permission-change notice

- **Board:** 18
- **Source analogue:** Extends CMP-13 permission card
- **Classification:** Extended (new for multi-user)
- **Variants:** role changed, removed, archived, session expired
- **States:** default, error
- **Accessibility rules:** Four causes that must not collapse into one message; each routes somewhere different and means something different.
- **Screens using it:** Referenced across boards; see screen-manifest.json
- **Export path:** `components/CMP-71-realtime-permission-change-notice.png`
- **Status:** Accepted — batch 7

## CMP-72 — Live-update screen-reader status

- **Board:** 18
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** polite, assertive
- **States:** default
- **Accessibility rules:** The non-visual half of every realtime state. Polite for background updates, assertive only when the person must act now. Never moves focus.
- **Screens using it:** Referenced across boards; see screen-manifest.json
- **Export path:** `components/CMP-72-live-update-screen-reader-status.png`
- **Status:** Accepted — batch 7

## CMP-73 — Maintenance banner

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** scheduled, imminent, active
- **States:** default, warning
- **Accessibility rules:** Banner, never modal. Removed the moment it stops being true, because a stale maintenance notice devalues every banner after it.
- **Screens using it:** MIG-01, MIG-02, MIG-03, MIG-05, MIG-06, MIG-07
- **Export path:** `components/CMP-73-maintenance-banner.png`
- **Status:** Accepted — batch 8

## CMP-74 — Read-only maintenance state

- **Board:** 20
- **Source analogue:** Extends CMP-15 read-only Group banner
- **Classification:** Extended (new for multi-user)
- **Variants:** whole group, finance only
- **States:** default
- **Accessibility rules:** Extends CMP-15. Mutation controls absent rather than disabled; copy always states that the account is fine.
- **Screens using it:** MIG-03, MIG-04, MIG-05, MIG-42, MIG-69
- **Export path:** `components/CMP-74-read-only-maintenance-state.png`
- **Status:** Accepted — batch 8

## CMP-75 — Migration progress step

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** done, current, pending
- **States:** default
- **Accessibility rules:** Four-step spine in product language. Status differs by fill and weight as well as colour; read as a list by assistive technology.
- **Screens using it:** MIG-09, MIG-10, MIG-11, MIG-12, MIG-13, MIG-14
- **Export path:** `components/CMP-75-migration-progress-step.png`
- **Status:** Accepted — batch 8

## CMP-76 — Migration status summary

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** running, slow, unknown
- **States:** default, warning
- **Accessibility rules:** Refuses to render without status copy. A silent spinner is indistinguishable from a hang.
- **Screens using it:** MIG-09, MIG-15, MIG-16, MIG-17, MIG-22, MIG-33, MIG-68
- **Export path:** `components/CMP-76-migration-status-summary.png`
- **Status:** Accepted — batch 8

## CMP-77 — Migration warning card

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** default
- **States:** warning
- **Accessibility rules:** Success and warning coexist. The warning always carries a destination.
- **Screens using it:** MIG-16, MIG-23, MIG-37, MIG-78
- **Export path:** `components/CMP-77-migration-warning-card.png`
- **Status:** Accepted — batch 8

## CMP-78 — Safe-stop notice

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** stopped, release blocked
- **States:** default, error
- **Accessibility rules:** States what is authoritative, whether anything partial is exposed, and whether retry exists at all.
- **Screens using it:** MIG-08, MIG-24, MIG-25, MIG-26, MIG-27, MIG-28, MIG-29, MIG-32, MIG-38, MIG-41, MIG-71, MIG-79
- **Export path:** `components/CMP-78-safe-stop-notice.png`
- **Status:** Accepted — batch 8

## CMP-79 — Rollback status

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** started, running, completed
- **States:** default, success
- **Accessibility rules:** A running rollback is reported as running. The completed state uses the sanctioned sentence and claims nothing beyond it.
- **Screens using it:** MIG-31, MIG-34, MIG-35, MIG-36, MIG-37
- **Export path:** `components/CMP-79-rollback-status.png`
- **Status:** Accepted — batch 8

## CMP-80 — Recovery status

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** checking, recovered, failed safely
- **States:** default, success, error
- **Accessibility rules:** Verification creates nothing, deletes nothing and widens no access. Repair restores consistency, never privilege.
- **Screens using it:** MIG-39, MIG-40, MIG-41, MIG-43
- **Export path:** `components/CMP-80-recovery-status.png`
- **Status:** Accepted — batch 8

## CMP-81 — Preserved-data summary

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** default
- **States:** default
- **Accessibility rules:** Counts, not adjectives. Carries a footnote refusing to claim perfection without accepted evidence.
- **Screens using it:** MIG-17, MIG-21, MIG-44, MIG-50, MIG-54, MIG-57, MIG-80
- **Export path:** `components/CMP-81-preserved-data-summary.png`
- **Status:** Accepted — batch 8

## CMP-82 — Claim-after-migration card

- **Board:** 20
- **Source analogue:** Extends CLM-01 claim card
- **Classification:** Extended (new for multi-user)
- **Variants:** available, not required, conflict
- **States:** default, error
- **Accessibility rules:** Extends CLM-01. Migration creates the opportunity and never performs the claim; no automatic linking, no Owner review queue.
- **Screens using it:** MIG-13, MIG-18, MIG-19, MIG-20, MIG-28, MIG-45, MIG-46, MIG-47, MIG-48, MIG-49, MIG-58, MIG-59, MIG-60, MIG-63
- **Export path:** `components/CMP-82-claim-after-migration-card.png`
- **Status:** Accepted — batch 8

## CMP-83 — Document-security migration notice

- **Board:** 20
- **Source analogue:** Extends CMP-47 document migration notice
- **Classification:** Extended (new for multi-user)
- **Variants:** in progress, secured, legacy link
- **States:** default
- **Accessibility rules:** Describes the destination without printing the address being replaced, at any stage.
- **Screens using it:** MIG-11, MIG-27, MIG-52, MIG-53, MIG-73, MIG-74
- **Export path:** `components/CMP-83-document-security-migration-notice.png`
- **Status:** Accepted — batch 8

## CMP-84 — Finance-evidence migration card

- **Board:** 20
- **Source analogue:** Extends CMP-56 accounting-currency authority card
- **Classification:** Extended (new for multi-user)
- **Variants:** evidence, mismatch
- **States:** default, warning
- **Accessibility rules:** The four finance facts a reviewer will test. Live-rate substitution is named explicitly as absent.
- **Screens using it:** MIG-12, MIG-26, MIG-51, MIG-55, MIG-70, MIG-71, MIG-72
- **Export path:** `components/CMP-84-finance-evidence-migration-card.png`
- **Status:** Accepted — batch 8

## CMP-85 — Migration truth-state badge

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** nothing changed, committed, rolled back, still running, unknown, review required
- **States:** default
- **Accessibility rules:** Six mutually exclusive claims. The weakest badge the evidence supports is the one used; readable in greyscale.
- **Screens using it:** MIG-89
- **Export path:** `components/CMP-85-migration-truth-state-badge.png`
- **Status:** Accepted — batch 8

## CMP-86 — Implementation-readiness gate card

- **Board:** 20
- **Source analogue:** New — no analogue
- **Classification:** Extended (new for multi-user)
- **Variants:** blocked, cleared
- **States:** default, error
- **Accessibility rules:** The release gate as a design object. Fully protected or unavailable; no degraded middle setting.
- **Screens using it:** MIG-29, MIG-30, MIG-38, MIG-57, MIG-88, MIG-90
- **Export path:** `components/CMP-86-implementation-readiness-gate-card.png`
- **Status:** Accepted — batch 8
