# Screenshot index

Supplied raw evidence consists of 38 mobile 590 × 1280 JPEG captures. Generated raw evidence consists of 95 deterministic-fixture PNG captures: 63 mobile at 393 × 852, 16 tablet at 768 × 1024, and 16 desktop at 1440 × 900. `Legacy` means the capture conflicts with the current `App.tsx` shell or contains a screen absent from the current source; it is retained as evidence, not silently treated as current. Generated fixture evidence is source-backed but is not a live production observation. No existing raw capture was overwritten.

| Raw file | Curated file | Screen/flow | State | Visible components | Classification | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| WhatsApp Image 2026-07-22 at 1.01.41 AM.jpeg | 01-legacy-trip-hero-default.jpeg | Trip | hero / crew partial | legacy header, hero, crew, six-tab nav | Unclear | Legacy title and six tabs conflict with current five-tab shell. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (1).jpeg | 02-legacy-trip-itinerary-empty.jpeg | Trip | empty itinerary | crew, collapsed flight card, timezone, add | Unclear | Legacy shell; useful evidence for empty-trip composition. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (2).jpeg | 03-legacy-add-event-modal-top.jpeg | Add event | top of form | type chips, fields, modal scroll | Unclear | Legacy member set and shell. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (3).jpeg | 04-legacy-scan-default.jpeg | Scan | default | hero, upload zone, toggle, disabled scan | Unclear | Legacy shell and named user differ from current data. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (4).jpeg | 05-legacy-scan-hero-partial.jpeg | Scan | hero crop | scan hero, six-tab nav | Unclear | Partial capture of the legacy screen. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (5).jpeg | 06-legacy-add-event-modal-visible-to.jpeg | Add event | bottom of form | member chips, primary and cancel actions | Unclear | Legacy three-member set. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (6).jpeg | 07-legacy-split-dashboard.jpeg | Split | settled dashboard | hero, balance card, roster | Unclear | Legacy shell and incomplete roster. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (7).jpeg | 08-legacy-split-group-totals-expense.jpeg | Split | populated | group totals, actions, expense card | Unclear | Legacy data is useful only as historical evidence. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (8).jpeg | 09-legacy-fx-hero.jpeg | FX | converter top | hero, rate card, INR input | Unclear | Legacy six-tab shell. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (9).jpeg | 10-legacy-ai-coming-soon.jpeg | AI | placeholder | hero, explanatory copy, coming-soon pill | Unclear | `AITab` remains in source but is not wired into current nav. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (10).jpeg | 11-legacy-todo-empty.jpeg | Todo | empty | hero, input, disabled Add, empty copy | Unclear | Legacy six-tab shell. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (11).jpeg | 12-legacy-fx-price-guide.jpeg | FX | guide scrolled | quick chips, price-guide rows | Unclear | Legacy shell; price-guide content agrees with source. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (12).jpeg | 13-legacy-group-settings-top.jpeg | Group Settings | top | current-trip card, member list | Unclear | No corresponding current route/component. |
| WhatsApp Image 2026-07-22 at 1.01.41 AM (13).jpeg | 14-legacy-group-settings-invite.jpeg | Group Settings | invite / leave | invite link, Copy, Leave Group | Unclear | No corresponding current route/component. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM.jpeg | 15-persona-picker.jpeg | Persona picker | initial | five persona choices | Preserve | Matches current component structure and five source personas. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (1).jpeg | 16-add-event-modal-top.jpeg | Add event | top of form | type chips and inputs | Preserve | Current modal form, captured without all controls. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (2).jpeg | 17-trip-persona-vaibhav.jpeg | Trip | Vaibhav selected | shell, chips, hero, crew | Correct | Broken-image glyph is observed where source requests a remote hero asset. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (3).jpeg | 18-trip-persona-astitva.jpeg | Trip | Astitva selected | selected profile/chip, hero, crew | Correct | Same concrete remote-hero load concern. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (4).jpeg | 19-add-event-modal-visible-to.jpeg | Add event | bottom / all people | visible-to chips, actions | Preserve | Matches five-person current set. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (5).jpeg | 20-trip-persona-partha.jpeg | Trip | Partha selected | shell, chips, hero, crew | Correct | Same concrete remote-hero load concern. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (6).jpeg | 21-trip-itinerary-empty.jpeg | Trip | empty / India | crew, collapsed no-flight, empty timeline | Preserve | Current empty-state composition. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (7).jpeg | 22-trip-countdown-expanded-no-flight.jpeg | Trip | expanded no flight / Bali | crew, no-flight clock, timezone | Preserve | Confirms no-flight expanded variant. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (8).jpeg | 23-trip-itinerary-bali-timezone.jpeg | Trip | empty / Bali | collapsed card, timezone toggle | Preserve | Confirms alternate timezone selection. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (9).jpeg | 24-scan-hero-partial.jpeg | Scan | hero crop | header, selected user, scan hero | Correct | Broken-image glyph observed. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (10).jpeg | 25-scan-default.jpeg | Scan | default | upload target, off toggle, disabled scan | Preserve | Current default Scan state. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (11).jpeg | 26-native-file-picker.jpeg | Scan upload | native chooser | Photo Library, Take Photo, Choose File | Preserve | Operating-system UI, not an application component. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (12).jpeg | 27-split-empty.jpeg | Split | empty / settled | balance hero, roster, actions, empty log | Preserve | Current empty Split state. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (13).jpeg | 28-split-hero-partial.jpeg | Split | hero crop | header, selected user, Split hero | Correct | Broken-image glyph observed. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (14).jpeg | 29-scan-assign-all.jpeg | Scan | assign everyone on | upload target, on toggle | Preserve | Confirms copy and on-state treatment. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (15).jpeg | 30-add-expense-modal.jpeg | Add expense | default | inputs, currency segmented control, payer/split chips | Preserve | Matches current five-person form. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (16).jpeg | 31-settle-up-all-settled-modal.jpeg | Settle up | no transfers | modal overlay, all-settled copy, Done | Preserve | Current zero-transaction state. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (17).jpeg | 32-fx-hero-partial.jpeg | FX | hero crop | header, selected user, converter | Correct | Broken-image glyph observed. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (18).jpeg | 33-fx-default.jpeg | FX | default / fetched rate | converter, quick chips | Preserve | Rate is time-dependent content; layout matches source. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (19).jpeg | 34-fx-idr-source.jpeg | FX | IDR-to-INR entry | rotated swap, paired values | Preserve | Confirms source-field direction behaviour. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (20).jpeg | 35-fx-inr-calculated.jpeg | FX | INR-to-IDR calculated | paired values, updated time | Preserve | Confirms calculated-target state. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (21).jpeg | 36-todo-draft-ready.jpeg | Todo | non-empty draft | enabled user-colour Add, empty-state copy | Preserve | Captures enabled action before submit. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (22).jpeg | 37-todo-loading.jpeg | Todo | loading | disabled Add, `Loading…` | Preserve | Current loading state. |
| WhatsApp Image 2026-07-25 at 12.49.54 AM (23).jpeg | 38-fx-price-guide.jpeg | FX | guide scrolled | first eight price-guide rows | Preserve | Current price-guide layout; row list remains longer in source. |

The raw directory remains authoritative for the original files; the table includes every raw filename verbatim.

## Generated deterministic-fixture evidence

These are not live production observations. Each raw file is an immutable new generated capture; its curated counterpart is a non-overwriting semantic copy.

| Raw file | Curated file | Viewport | Screen/flow | State | Evidence type | Visible components | Classification | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| generated/mobile/trip-loading-skeleton.png | mobile/trip-loading-skeleton.png | 393×852 | Trip | loading skeleton | Deterministic fixture | shell, hero, crew, timeline skeleton | Preserve | Delayed events response. |
| generated/mobile/trip-populated.png | mobile/trip-populated.png | 393×852 | Trip | populated past/live/next/upcoming | Deterministic fixture | cards, crew, timezone, nav | Preserve | Fixed audit clock. |
| generated/mobile/trip-live-expanded-notes.png | mobile/trip-live-expanded-notes.png | 393×852 | Trip | live event, notes expanded | Deterministic fixture | live badge, event card, notes | Preserve | Real card interaction. |
| generated/mobile/trip-bali-timezone.png | mobile/trip-bali-timezone.png | 393×852 | Trip | Bali timezone | Deterministic fixture | timezone toggle, cards | Preserve | WITA labels. |
| generated/mobile/trip-upcoming-flight-countdown.png | mobile/trip-upcoming-flight-countdown.png | 393×852 | Trip | upcoming flight countdown | Deterministic fixture | countdown clock | Preserve | Fixture flight. |
| generated/mobile/trip-departed-flight.png | mobile/trip-departed-flight.png | 393×852 | Trip | departed-flight/no-upcoming state | Deterministic fixture | collapsed/expanded flight area | Preserve | Fixture departure. |
| generated/mobile/scan-default-documents.png | mobile/scan-default-documents.png | 393×852 | Scan | default with previous document | Deterministic fixture | upload, toggle, document list | Preserve | Controlled document row. |
| generated/mobile/scan-selected-pdf.png | mobile/scan-selected-pdf.png | 393×852 | Scan | selected PDF | Deterministic fixture | file row, enabled Scan | Preserve | Input injection, not native chooser. |
| generated/mobile/scan-assignment-everyone.png | mobile/scan-assignment-everyone.png | 393×852 | Scan | assignment to everyone | Deterministic fixture | assignment toggle | Preserve | Real toggle interaction. |
| generated/mobile/scan-scanning.png | mobile/scan-scanning.png | 393×852 | Scan | scanning | Deterministic fixture | spinner, scanning copy | Preserve | Delayed parser response. |
| generated/mobile/scan-success.png | mobile/scan-success.png | 393×852 | Scan | successful result | Deterministic fixture | success feedback | Preserve | Controlled parser success. |
| generated/mobile/scan-server-error.png | mobile/scan-server-error.png | 393×852 | Scan | parsing error | Deterministic fixture | pink error feedback | Preserve | Controlled parser error. |
| generated/mobile/scan-before-document-delete.png | mobile/scan-before-document-delete.png | 393×852 | Scan | immediately before deletion | Deterministic fixture | document row, Delete | Correct | No confirmation is present. |
| generated/mobile/scan-after-document-delete.png | mobile/scan-after-document-delete.png | 393×852 | Scan | immediately after deletion | Deterministic fixture | document list | Correct | Direct removal outcome. |
| generated/mobile/split-populated-dashboard.png | mobile/split-populated-dashboard.png | 393×852 | Split | populated dashboard | Deterministic fixture | balance hero, totals, expense cards, history | Preserve | Controlled balances. |
| generated/mobile/split-suggested-transfer.png | mobile/split-suggested-transfer.png | 393×852 | Settle Up | suggested transfer | Deterministic fixture | modal, transfer list | Preserve | Current persona is recipient. |
| generated/mobile/event-add-default.png | mobile/event-add-default.png | 393×852 | Add Event | default | Deterministic fixture | modal, type/field controls | Preserve | Current dialog. |
| generated/mobile/event-add-required-validation.png | mobile/event-add-required-validation.png | 393×852 | Add Event | required-field validation | Deterministic fixture | modal, validation copy | Preserve | Blank title branch. |
| generated/mobile/event-add-saving.png | mobile/event-add-saving.png | 393×852 | Add Event | saving | Deterministic fixture | disabled primary action | Preserve | Delayed insert. |
| generated/mobile/event-add-server-error.png | mobile/event-add-server-error.png | 393×852 | Add Event | server error | Deterministic fixture | error copy | Preserve | Controlled insert failure. |
| generated/mobile/event-edit-populated.png | mobile/event-edit-populated.png | 393×852 | Edit Event | populated | Deterministic fixture | prefilled modal | Preserve | Fixture event. |
| generated/mobile/event-before-removal.png | mobile/event-before-removal.png | 393×852 | Event | immediately before removal | Deterministic fixture | Remove control | Correct | No confirmation is present. |
| generated/mobile/event-after-removal.png | mobile/event-after-removal.png | 393×852 | Event | immediately after removal | Deterministic fixture | revised itinerary | Correct | Direct removal outcome. |
| generated/mobile/expense-default-single-payer.png | mobile/expense-default-single-payer.png | 393×852 | Add Expense | default single payer | Deterministic fixture | currency, payer chips, splits | Preserve | Current dialog. |
| generated/mobile/expense-split-payment-mode.png | mobile/expense-split-payment-mode.png | 393×852 | Add Expense | split-payment entry | Deterministic fixture | payer contribution inputs | Preserve | Real toggle. |
| generated/mobile/expense-matching-contributions.png | mobile/expense-matching-contributions.png | 393×852 | Add Expense | matching contributions | Deterministic fixture | match indicator | Preserve | Controlled amounts. |
| generated/mobile/expense-mismatched-contributions.png | mobile/expense-mismatched-contributions.png | 393×852 | Add Expense | mismatched contributions | Deterministic fixture | mismatch indicator | Preserve | Controlled amounts. |
| generated/mobile/expense-missing-description.png | mobile/expense-missing-description.png | 393×852 | Add Expense | missing description | Deterministic fixture | validation copy | Preserve | Real validation branch. |
| generated/mobile/expense-saving.png | mobile/expense-saving.png | 393×852 | Add Expense | saving | Deterministic fixture | disabled Save | Preserve | Delayed insert. |
| generated/mobile/expense-server-error.png | mobile/expense-server-error.png | 393×852 | Add Expense | server error | Deterministic fixture | error copy | Preserve | Controlled insert failure. |
| generated/mobile/expense-edit-populated.png | mobile/expense-edit-populated.png | 393×852 | Edit Expense | populated | Deterministic fixture | prefilled modal | Preserve | Fixture expense. |
| generated/mobile/fx-initial-loading.png | mobile/fx-initial-loading.png | 393×852 | FX | initial loading | Deterministic fixture | converter, disabled refresh | Preserve | Delayed rate response. |
| generated/mobile/fx-success-rate.png | mobile/fx-success-rate.png | 393×852 | FX | successful rate | Deterministic fixture | fetched rate, inputs | Preserve | Controlled rate 191.25. |
| generated/mobile/fx-refresh-disabled.png | mobile/fx-refresh-disabled.png | 393×852 | FX | refreshing disabled | Deterministic fixture | Refreshing… control | Preserve | Delayed refresh. |
| generated/mobile/fx-offline-fallback.png | mobile/fx-offline-fallback.png | 393×852 | FX | offline fallback | Deterministic fixture | fallback/offline copy | Preserve | Blocked rate request. |
| generated/mobile/fx-inr-to-idr.png | mobile/fx-inr-to-idr.png | 393×852 | FX | INR to IDR | Deterministic fixture | paired inputs | Preserve | Real input interaction. |
| generated/mobile/fx-idr-to-inr.png | mobile/fx-idr-to-inr.png | 393×852 | FX | IDR to INR | Deterministic fixture | paired inputs | Preserve | Real input interaction. |
| generated/mobile/fx-price-guide.png | mobile/fx-price-guide.png | 393×852 | FX | price guide | Deterministic fixture | guide rows | Preserve | Scrolled current tab. |
| generated/mobile/todo-empty.png | mobile/todo-empty.png | 393×852 | Todo | empty | Deterministic fixture | input, empty copy | Preserve | Empty fixture list. |
| generated/mobile/todo-mixed-long-list.png | mobile/todo-mixed-long-list.png | 393×852 | Todo | pending/done, long text | Deterministic fixture | rows, Clear all | Preserve | Controlled wrapped text. |
| generated/mobile/todo-checkbox-result.png | mobile/todo-checkbox-result.png | 393×852 | Todo | checkbox interaction result | Deterministic fixture | completed row | Preserve | Real mutation/refetch. |
| generated/mobile/todo-after-clear-completed.png | mobile/todo-after-clear-completed.png | 393×852 | Todo | after clear completed | Deterministic fixture | remaining rows | Correct | Direct clear outcome. |
| generated/mobile/todo-before-delete.png | mobile/todo-before-delete.png | 393×852 | Todo | immediately before deletion | Deterministic fixture | Delete control | Correct | No confirmation is present. |
| generated/mobile/todo-after-delete.png | mobile/todo-after-delete.png | 393×852 | Todo | immediately after deletion | Deterministic fixture | revised list | Correct | Direct removal outcome. |
| generated/mobile/shell-hero-fixture-load.png | mobile/shell-hero-fixture-load.png | 393×852 | Shell/hero | remote image succeeds | Deterministic fixture | shell, hero, nav | Preserve | Intercepted image response. |
| generated/mobile/shell-hero-blocked-broken-image.png | mobile/shell-hero-blocked-broken-image.png | 393×852 | Shell/hero | remote image blocked | Deterministic fixture | shell, broken-image behaviour | Correct | Existing live captures remain authoritative for actual breakage. |
| generated/tablet/trip-populated-shell.png | tablet/trip-populated-shell.png | 768×1024 | Trip | populated shell | Deterministic fixture | centred shell, sticky chrome | Preserve | 480px cap visible. |
| generated/tablet/trip-long-event-content.png | tablet/trip-long-event-content.png | 768×1024 | Trip | long event | Deterministic fixture | long card content | Preserve | Controlled long title/notes. |
| generated/tablet/scan-default.png | tablet/scan-default.png | 768×1024 | Scan | default | Deterministic fixture | upload and document list | Preserve | Centred shell. |
| generated/tablet/scan-selected-file.png | tablet/scan-selected-file.png | 768×1024 | Scan | selected PDF | Deterministic fixture | selected-file row | Preserve | Input injection. |
| generated/tablet/split-populated-dashboard.png | tablet/split-populated-dashboard.png | 768×1024 | Split | populated | Deterministic fixture | dashboard/cards/history | Preserve | Controlled balances. |
| generated/tablet/split-settle-up-dialog.png | tablet/split-settle-up-dialog.png | 768×1024 | Settle Up | dialog | Deterministic fixture | modal/transfer list | Preserve | Sheet cap visible. |
| generated/tablet/todo-populated.png | tablet/todo-populated.png | 768×1024 | Todo | populated | Deterministic fixture | pending/done rows | Preserve | Centred shell. |
| generated/tablet/fx-converter-price-guide.png | tablet/fx-converter-price-guide.png | 768×1024 | FX | converter and guide | Deterministic fixture | full tab content | Preserve | Full-page capture. |
| generated/tablet/event-long-add-form-scrolling.png | tablet/event-long-add-form-scrolling.png | 768×1024 | Add Event | long form scrolling | Deterministic fixture | overlay/sheet/form | Preserve | Current modal scroll. |
| generated/tablet/expense-split-payment-entry.png | tablet/expense-split-payment-entry.png | 768×1024 | Add Expense | split entry | Deterministic fixture | contribution inputs | Preserve | Current modal. |
| generated/tablet/shell-blocked-hero-centred.png | tablet/shell-blocked-hero-centred.png | 768×1024 | Shell/hero | blocked image | Deterministic fixture | centred shell, broken image | Correct | Fixture blocked request. |
| generated/desktop/trip-populated-shell.png | desktop/trip-populated-shell.png | 1440×900 | Trip | populated shell | Deterministic fixture | complete 480px shell/page | Preserve | Surrounding page visible. |
| generated/desktop/trip-long-event-content.png | desktop/trip-long-event-content.png | 1440×900 | Trip | long event | Deterministic fixture | long card content | Preserve | Centred cap. |
| generated/desktop/scan-default.png | desktop/scan-default.png | 1440×900 | Scan | default | Deterministic fixture | upload/document list | Preserve | Centred shell. |
| generated/desktop/scan-selected-file.png | desktop/scan-selected-file.png | 1440×900 | Scan | selected PDF | Deterministic fixture | selected-file row | Preserve | Input injection. |
| generated/desktop/split-populated-dashboard.png | desktop/split-populated-dashboard.png | 1440×900 | Split | populated | Deterministic fixture | dashboard/cards/history | Preserve | Centred shell. |
| generated/desktop/split-settle-up-dialog.png | desktop/split-settle-up-dialog.png | 1440×900 | Settle Up | dialog | Deterministic fixture | modal/transfer list | Preserve | Sheet cap visible. |
| generated/desktop/todo-populated.png | desktop/todo-populated.png | 1440×900 | Todo | populated | Deterministic fixture | pending/done rows | Preserve | Centred shell. |
| generated/desktop/fx-converter-price-guide.png | desktop/fx-converter-price-guide.png | 1440×900 | FX | converter and guide | Deterministic fixture | full tab content | Preserve | Full-page capture. |
| generated/desktop/event-long-add-form-scrolling.png | desktop/event-long-add-form-scrolling.png | 1440×900 | Add Event | long form scrolling | Deterministic fixture | overlay/sheet/form | Preserve | Current modal scroll. |
| generated/desktop/expense-split-payment-entry.png | desktop/expense-split-payment-entry.png | 1440×900 | Add Expense | split entry | Deterministic fixture | contribution inputs | Preserve | Current modal. |
| generated/desktop/shell-blocked-hero-centred.png | desktop/shell-blocked-hero-centred.png | 1440×900 | Shell/hero | blocked image | Deterministic fixture | centred shell, broken image | Correct | Fixture blocked request. |
| generated/mobile/settlement-debtor-transfer-available.png | mobile/settlement-debtor-transfer-available.png | 393×852 | Settle Up | debtor transfer available | Deterministic fixture | modal, Partha→Astitva, Paid | Preserve | Controlled balance makes active persona debtor. |
| generated/mobile/settlement-recording-in-progress.png | mobile/settlement-recording-in-progress.png | 393×852 | Settle Up | recording in progress | Deterministic fixture | disabled `…` Paid control | Preserve | Only settlement insert delayed. |
| generated/mobile/settlement-success-result.png | mobile/settlement-success-result.png | 393×852 | Settle Up | successful insert result | Deterministic fixture | transfer row, restored Paid control | Preserve | Current UI has no success toast or list refresh. |
| generated/mobile/settlement-insert-server-error.png | mobile/settlement-insert-server-error.png | 393×852 | Settle Up | settlement server error | Deterministic fixture | transfer row, error copy | Preserve | Only settlement insert failed. |
| generated/mobile/expense-zero-amount-validation.png | mobile/expense-zero-amount-validation.png | 393×852 | Add Expense | zero amount validation | Deterministic fixture | amount field, validation copy | Preserve | `Amount must be > 0`. |
| generated/mobile/expense-negative-amount-validation.png | mobile/expense-negative-amount-validation.png | 393×852 | Add Expense | negative amount validation | Deterministic fixture | amount field, validation copy | Preserve | Same current non-positive branch. |
| generated/mobile/expense-no-participants-validation.png | mobile/expense-no-participants-validation.png | 393×852 | Add Expense | no participants selected | Deterministic fixture | split chips, validation copy | Preserve | Real empty-participant branch. |
| generated/mobile/scan-selected-png-enabled.png | mobile/scan-selected-png-enabled.png | 393×852 | Scan | selected PNG, enabled Scan | Deterministic fixture | image file row, Scan action | Preserve | Browser input injection; no OS chooser. |
| generated/mobile/trip-audience-recipient-sees-restricted.png | mobile/trip-audience-recipient-sees-restricted.png | 393×852 | Trip | recipient persona | Deterministic fixture | Astitva shell | Preserve | Overview counterpart for filtered timeline. |
| generated/mobile/trip-audience-nonrecipient-filtered.png | mobile/trip-audience-nonrecipient-filtered.png | 393×852 | Trip | non-recipient persona | Deterministic fixture | Partha shell | Preserve | Overview counterpart for filtered timeline. |
| generated/mobile/trip-audience-recipient-sees-restricted-timeline.png | mobile/trip-audience-recipient-sees-restricted-timeline.png | 393×852 | Trip | recipient sees restricted event | Deterministic fixture | itinerary, Astitva-only card | Preserve | Same fixture data as non-recipient frame. |
| generated/mobile/trip-audience-nonrecipient-filtered-timeline.png | mobile/trip-audience-nonrecipient-filtered-timeline.png | 393×852 | Trip | non-recipient filters restricted event | Deterministic fixture | itinerary without Astitva-only card | Preserve | Same fixture data as recipient frame. |
| generated/mobile/shell-persona-picker.png | mobile/shell-persona-picker.png | 393×852 | Shell | persona picker | Deterministic fixture | fixed picker overlay | Preserve | Explicit shell frame. |
| generated/mobile/shell-five-tab-navigation.png | mobile/shell-five-tab-navigation.png | 393×852 | Shell | five-tab navigation | Deterministic fixture | header, five tabs | Preserve | Explicit shell frame. |
| generated/mobile/shell-sticky-header-bottom-nav.png | mobile/shell-sticky-header-bottom-nav.png | 393×852 | Shell | scrolled sticky chrome | Deterministic fixture | sticky header and bottom nav | Preserve | Initial explicit scroll frame. |
| generated/mobile/shell-modal-overlay-centred-sheet.png | mobile/shell-modal-overlay-centred-sheet.png | 393×852 | Shell | modal overlay/sheet | Deterministic fixture | overlay, centred Add Event sheet | Preserve | Explicit shell frame. |
| generated/mobile/shell-scrolled-sticky-header-bottom-nav.png | mobile/shell-scrolled-sticky-header-bottom-nav.png | 393×852 | Shell | scrolled sticky chrome | Deterministic fixture | timeline under sticky header/nav | Preserve | Clear scroll proof. |
| generated/tablet/shell-persona-picker.png | tablet/shell-persona-picker.png | 768×1024 | Shell | persona picker | Deterministic fixture | fixed picker overlay | Preserve | Explicit shell frame. |
| generated/tablet/shell-five-tab-navigation.png | tablet/shell-five-tab-navigation.png | 768×1024 | Shell | five-tab navigation | Deterministic fixture | centred shell, five tabs | Preserve | Explicit shell frame. |
| generated/tablet/shell-sticky-header-bottom-nav.png | tablet/shell-sticky-header-bottom-nav.png | 768×1024 | Shell | scrolled sticky chrome | Deterministic fixture | sticky header and bottom nav | Preserve | Initial explicit scroll frame. |
| generated/tablet/shell-modal-overlay-centred-sheet.png | tablet/shell-modal-overlay-centred-sheet.png | 768×1024 | Shell | modal overlay/sheet | Deterministic fixture | overlay, centred Add Event sheet | Preserve | Explicit shell frame. |
| generated/tablet/shell-scrolled-sticky-header-bottom-nav.png | tablet/shell-scrolled-sticky-header-bottom-nav.png | 768×1024 | Shell | scrolled sticky chrome | Deterministic fixture | timeline under sticky header/nav | Preserve | Clear scroll proof. |
| generated/desktop/shell-persona-picker.png | desktop/shell-persona-picker.png | 1440×900 | Shell | persona picker | Deterministic fixture | fixed picker overlay | Preserve | Explicit shell frame. |
| generated/desktop/shell-five-tab-navigation.png | desktop/shell-five-tab-navigation.png | 1440×900 | Shell | five-tab navigation | Deterministic fixture | centred shell, five tabs | Preserve | Explicit shell frame. |
| generated/desktop/shell-sticky-header-bottom-nav.png | desktop/shell-sticky-header-bottom-nav.png | 1440×900 | Shell | scrolled sticky chrome | Deterministic fixture | sticky header and bottom nav | Preserve | Initial explicit scroll frame. |
| generated/desktop/shell-modal-overlay-centred-sheet.png | desktop/shell-modal-overlay-centred-sheet.png | 1440×900 | Shell | modal overlay/sheet | Deterministic fixture | overlay, centred Add Event sheet | Preserve | Explicit shell frame. |
| generated/desktop/shell-scrolled-sticky-header-bottom-nav.png | desktop/shell-scrolled-sticky-header-bottom-nav.png | 1440×900 | Shell | scrolled sticky chrome | Deterministic fixture | timeline under sticky header/nav | Preserve | Clear scroll proof. |
