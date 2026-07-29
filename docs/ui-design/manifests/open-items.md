# Open items

Cumulative. Batches 1–8 of 8. Every O item is resolved. Every D item carries a final status. R-01 traceability is Closed; R-02 remains an implementation-verification item and does not block the accepted design lock.

## Accepted traceability and implementation verification

**R-01 — IR ownership and wave assignment — closed.**
The Accepted implementation roadmap now supplies the mapping authority. Every entry in `screen-manifest.json` has one valid primary IR owner, one roadmap-consistent W1–W7 wave, and related IR items only where needed. Affects 462 screens; unmapped entries: 0.

**R-02 — Measured accessibility verification.**
Contrast ratios, keyboard traversal, focus restoration, accessible names and reduced-motion behaviour are specified throughout the package but have not been measured against a running build. Static design exports cannot evidence production compliance. Status: specified; implementation verification required.

## Resolved decisions

**O-16 Trip-name length — resolved: implementation-configured.** The Trip name is required, leading and trailing whitespace is trimmed, and an empty value is rejected. No numerical minimum or maximum is locked into accepted UI copy unless implementation configuration supplies one; a character counter renders only when a real configured limit exists. Otherwise the copy is configuration-neutral: "Add a name for this Trip." and "This name is longer than the app currently allows." Applied to CFG-07 to CFG-10.

**O-17 Accounting-currency migration ownership — resolved: outside ordinary Owner authority.** A reviewed accounting-currency migration is not a Group Owner action and is not an executable user-facing workflow in this package. It belongs to the controlled migration, recovery and release process. The UI explains that a reviewed migration is required, states that nothing changed, and offers controlled support or read-only status where such a process exists. It never lets an Owner trigger conversion, never shows a "Convert ledger" action, never implies ordinary configuration can reinterpret history, and never invents an admin role. Applied to CFG-43 to CFG-45 and MIG-67 to MIG-72. The mapped primary owners are IR-016/W5 with related IR-014 evidence.

**O-18 Display-currency context ownership — resolved: Group configuration.** Approved currency-display context belongs to the Group, not to the reader. Current authorised Members see the same approved reference currencies; an Owner configures the context; it does not change accounting authority, rewrite historical accounting values, change the original expense currency, or turn the FX converter into ledger authority. Per-reader display preferences are deferred. Applied to CFG-49 to CFG-55 and RT-44.

**O-11 Document size ceiling — resolved: implementation-configured.** Size is validated; no numerical limit is hard-coded in accepted UI copy; the configured limit displays only when implementation supplies it. Filename and size stay visible and the file can be replaced. Applied to DOC-07.

**O-12 Background parsing — resolved: no background promise; deferred.** Parsing is a tracked foreground operation. The UI never claims processing continues after the app closes. Leaving is safe only once a durable accepted document state exists. No push notification, no completion promise. Applied to DOC-22.

**O-13 Duplicate detection — resolved: not a current product requirement.** No automatic semantic duplicate detection, merge, suppression or similarity claim. DOC-39 is retained as deferred only, with no implementation owner and no release-blocking evidence requirement.

**O-14 Resumable upload — resolved: not promised.** A lost connection states plainly that the upload did not complete. Retry begins a new upload attempt; no byte-level resume is claimed; the selected local file is retained where the browser permits; duplicate accepted outcomes are prevented. Applied to DOC-72.

**O-15 Document audience persistence — resolved: no per-document audience exists.** Document access is current same-Group authorisation. The persisted participant selection belongs to the scan-created Event presentation relationship. Applied across board 16.

**O-09 Finance fixtures — resolved: three accepted fixtures supplied.** EQ-01 equal-split remainder, SET-01 deterministic transfers, USD-01 non-Bali USD accounting.

**O-10 Non-equal splits — resolved: display and reconciliation only.** The authoring surface is one payer, multiple payers and equal splitting. E-13 approved with that limit; C-12 closed.

**O-07 Contested participant claims — resolved: no Owner review surface.** Claims that cannot resolve stop safely and state that nothing changed. Closes C-08. Reaffirmed by MIG-61 and MIG-62.

**O-08 Retention, purge and anonymisation — resolved: explicitly deferred.** No permanent deletion, purge, anonymisation, attribution removal or retention control is designed anywhere in the package.

**O-01 Roles — resolved.** Exactly Owner and Member. Read-only presentation survives as a Group state, a permission outcome, a maintenance state or an archive state — never a role. The word Viewer appears nowhere.

**O-02 Group configuration — resolved and designed.** Name, destination, start date, end date, canonical IANA timezone, accounting currency and approved display context all belong to the Group. Board 17.

**O-03 Link lifetimes — resolved.** Group invitations expire after 7 days and are single-use. Verification and reset link durations are provider configuration and are never promised. Reaffirmed by MIG-83.

**O-04 Participant emoji — resolved.** The migrated five keep their animal emoji; new participants use initials.

**O-05 Group deletion — resolved.** No permanent deletion in scope. Leave, last-Owner protection, Archive and Restore.

**O-06 Conflicting design system — resolved.** The attached green enterprise-learning system is ignored entirely.

## Design-foundation items — final status

**D-01 Remote imagery delivery — resolved for design scope.** A graceful warm fallback replaces any failed image; the browser broken-image glyph never appears. Meaningful imagery carries useful alternative text or an adjacent textual equivalent; decorative imagery uses intentionally empty alternative text. Delivery and caching remain implementation concerns and are not design blockers. Recorded as exception E-07.

**D-02 Realtime surface — resolved.** There is no dedicated notification centre in scope. Realtime uses contextual inline update, a restrained status pill, a small temporary toast, a conflict card where action is required, and existing screen history or list state where durable evidence belongs. No inbox, bell, notification tab, unread count or global activity feed exists anywhere in the package. Board 18.

**D-03 Measured accessibility verification — resolved as final design-review evidence.** The package specifies required contrast verification, keyboard and focus verification, reduced-motion verification, accessible-name verification and screen-reader status behaviour. It does not claim measured production compliance from static exports. Status: specified; implementation verification required. Tracked as R-02.

**D-04 Emoji selection — resolved as deferred.** The migrated five retain their existing emoji; new participants use initials; selection and customisation are not designed. Not a final-review blocker.
