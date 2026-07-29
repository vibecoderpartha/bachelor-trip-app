# Exception register

Cumulative. Batches 1–8 of 8. An exception is never deleted once raised; its decision is recorded here.

| ID | Exception | Decision | Affected screens |
|---|---|---|---|
| E-01 | Pre-authentication shell | **Approved** | AUTH-01…11, ONB-01, ONB-02, ONB-08, INV-01…05, SHL-02 |
| E-02 | Confirmation before destructive actions | **Approved** | GRP-08, GRP-13, GRP-17, MBR-04, MBR-06, MBR-07, MBR-11, CLM-04, INV-06, INV-14 |
| E-03 | Minimum 44×44 controls and 56px interactive rows | **Approved** | Every screen |
| E-04 | Accessible names, labels and connected errors | **Approved, mandatory** | Every screen with a control or an error |
| E-05 | Reduced-motion alternatives | **Approved, mandatory** | Every loading and in-progress state |
| E-06 | Contrast correction | **Approved** | Every screen; tertiary text raised where it carried meaning |
| E-07 | Broken-image fallback | **Approved** | SHL-01, GRP-01, GRP-06, ONB-10 |
| E-08 | Accounts, Groups and participant claiming replace persona login | **Approved, architecture-required** | Boards 08–13 in full |
| E-09 | Warm-neutral treatment for participants beyond the migrated five | **Approved** | CMP-02, CMP-14, INV-02, MBR-01, MBR-15, CLM-01…03, CLM-02 |
| E-10 | Permission pages replace content instead of overlaying it | **Approved** | PERM-01…04, PERM-19, PERM-20, FIN-47 |
| E-11 | Mutation affordances absent rather than disabled in read-only states | **Approved** | PERM-05, PERM-10…12, PERM-14, FIN-07, FIN-39, FIN-40 |
| E-12 | Claim outcomes stop safely with no Owner review surface (O-07) | **Approved by decision O-07** | PERM-16, CLM-09, CLM-11, CLM-13, CLM-04 |
| E-13 | Participant-share editor for unequal splits | **Approved with limit by O-10** | FIN-11, FIN-13, FIN-16, CMP-24 |
| E-14 | Removing a document keeps the Event it created | **Approved — batch 6** | DOC-57…DOC-61, DOC-65 |
| E-15 | In-app authorised document render replaces the public object URL | **Approved — batch 6** | DOC-49…DOC-56, DOC-80…DOC-83 |
| E-16 | Thirteen document states, with server-derived uploader provenance | **Approved — batch 6** | DOC-19…DOC-28, DOC-35…DOC-38, DOC-40, DOC-41, DOC-57…DOC-70 |

## Detail

### E-01 Pre-authentication shell
**Current behaviour.** The application has no screen before the authenticated five-tab shell.
**Proposed behaviour.** A pre-authentication shell: same palette, typography, translucency and spacing; header carries the neutral application label “Trip” with no Trip date line; no bottom navigation; no identity chip.
**Reason.** Authentication must exist before any Group is resolved, and before resolution no Group is authoritative.
**Architecture impact.** New route group ahead of the app shell.
**Decision.** Approved. Revised in batch 2 so no generic pre-auth screen names a Group or shows Trip dates; a Group name, inviter and dates appear only on an invitation-specific screen after successful safe inspection (INV-01…04).

### E-02 Confirmation before destructive actions
**Current behaviour.** Destructive actions in the current app can fire immediately.
**Proposed behaviour.** A confirmation sheet with focus trapping, focus restoration, a non-destructive default focus, and the consequence stated in figures before the button.
**Reason.** Multi-user destructive actions affect other people's data and a shared ledger.
**Decision.** Approved. Applied to leave, archive, restore, removal, role change, ownership transfer and claiming.

### E-03 Minimum 44×44 controls and 56px rows
**Current behaviour.** Some current controls fall below 44px.
**Proposed behaviour.** 44×44 minimum for every control; 56px minimum for interactive rows; management actions moved off the row into a per-person sheet rather than crowding it.
**Decision.** Approved.

### E-04 Accessible names, labels and connected errors
**Proposed behaviour.** Semantic labels on every input, accessible names on icon-only controls, errors programmatically connected to their input, form-level errors announced, status announced politely rather than as alerts.
**Decision.** Approved and mandatory.

### E-05 Reduced-motion alternatives
**Proposed behaviour.** Skeleton pulses and spinners resolve to a static state under reduced-motion; no state depends on motion to be understood.
**Decision.** Approved and mandatory.

### E-06 Contrast correction
**Current behaviour.** Tertiary and quaternary text is used for content that carries meaning.
**Proposed behaviour.** Quaternary is reserved for decoration and disabled affordances; anything meaningful sits at secondary or above.
**Decision.** Approved. Measured verification remains open (D-03).

### E-07 Broken-image fallback
**Current behaviour.** A failed hero illustration leaves an empty area.
**Proposed behaviour.** The hero degrades to its radial wash with the eyebrow and headline intact.
**Decision.** Approved.

### E-08 Accounts, Groups and claiming replace persona login
**Current behaviour.** Persona selection from five fixed people.
**Proposed behaviour.** Authenticated accounts, Groups as the tenant boundary, and deliberate participant claiming. Display-name equality is never treated as evidence (CLM-09).
**Decision.** Approved and architecture-required.

### E-09 Warm-neutral participants beyond the migrated five
**Current behaviour.** Five participant colours exist.
**Proposed behaviour.** The migrated five keep their colours and emoji (O-04). Additional active participants use solid warm neutral #C8B8A6; unclaimed participants use the same neutral with a dashed ring; name and initial are always visible; colour never communicates authority or role.
**Decision.** Approved. Implemented in CMP-14.

## Rejected, revised or withdrawn

**Withdrawn in batch 2 (superseded by decisions, not exceptions):** a third read-only role (O-01), automatic invitation email delivery (O-03), a short human-readable invitation code as the token format (O-03), fixed lifetimes for verification and reset links (O-03), and permanent Group deletion (O-05). None of these appear in the current package.


### E-10 Permission pages replace content instead of overlaying it
**Current behaviour.** The application has no permission surface at all; every screen assumes a single trusted user, and modal sheets always sit over live content.

**Proposed behaviour.** When a Group or resource is unavailable (PERM-01 to PERM-04), the explanation is a page inside the same shell, and the unavailable content is removed from the document in the same paint — not dimmed behind a scrim. The five-tab bar is hidden on these pages because no Group is resolved, matching the pre-authentication shell (E-01). Where the rest of the page remains usable, the explanation stays an inline card or a sheet instead (PERM-06 to PERM-09, PERM-13, PERM-15 to PERM-18).

**Reason.** Anything left behind an overlay is still in the DOM and still reachable; a permission state that overlays private data is not a permission state. Hiding the tab bar avoids offering five destinations that cannot resolve.

**Affected screens.** PERM-01, PERM-02, PERM-03, PERM-04, and the contract screens PERM-19 and PERM-20.

**Architecture impact.** The client needs a Group-resolution result before rendering the shell body, and a distinction between "no Group resolved" and "Group resolved but refused". No new endpoint.

**Approval required.** Yes — it introduces a navigation state where the tab bar is absent inside an authenticated session. **Decision: Approved in batch 4.** Extended to FIN-47, where a refused Group switch clears the previous ledger rather than dimming it.

### E-11 Mutation affordances absent rather than disabled in read-only states
**Current behaviour.** Add and edit affordances are always present because the single user can always act.

**Proposed behaviour.** In archived or otherwise read-only Groups, per-item edit and delete affordances and the add row are removed, while the section headers, counts and content keep their geometry. Screen-level actions that remain meaningful (Restore for an Owner, Leave for a Member) stay as real controls. Configuration rows are the exception: they stay visible but closed, with the mono OWNER ONLY marker, because their value is the information.

**Reason.** A dead control on every card is noisier than the content and invites repeated failed taps; a control that cannot act should not take focus. Keeping section geometry means the trip looks unchanged when it is restored.

**Affected screens.** PERM-05, PERM-10, PERM-11, PERM-12, PERM-14, and GRP-06 from batch 2.

**Architecture impact.** None. The server refuses these mutations regardless of what the client renders.

**Approval required.** Yes — it changes the affordance inventory of existing tabs in one state. **Decision: Approved in batch 4.** Extended to Split: FIN-40 drops Add expense, Settle up and every Edit while keeping the ledger readable and the Owner’s Restore live.

### E-12 Claim outcomes stop safely with no Owner review surface
**Current behaviour.** Batch 2 routed contested claims (CLM-09, CLM-11) to an Owner decision and CLM-13 to an Owner releasing a participant.

**Proposed behaviour.** Per decision O-07, there is no Owner review queue, approval screen, claim inbox, manual identity matching or reassignment. A claim that lacks evidence, conflicts, is already taken or cannot resolve atomically stops: it states what happened, confirms that no account or participant association changed, offers retry only where retry could succeed, gives sign-in or account-switch guidance where relevant, and otherwise points at an Owner adding a new participant.

**Reason.** The decision. Also removes an unbuilt surface the design would otherwise imply.

**Affected screens.** PERM-16, and the revised CLM-04, CLM-09, CLM-11 and CLM-13.

**Architecture impact.** Closes C-08. No claim-review table, notification or Owner action is required.

**Approval required.** No — recorded as approved by decision O-07.


### E-13 Participant-share display for retained non-equal history
**Current behaviour.** The expense model carries `split_mode` of equal, custom, percent or shares and a `custom_splits` map, and `computeShares` reads all four modes — but no screen writes them. Both the Add and Edit dialogs always save `split_mode: 'equal'`, so non-equal shares exist only as whatever v1 or its predecessors actually persisted.

**Proposed behaviour, revised in batch 5 per O-10.** A participant-share **display** surface, reusing CMP-23's row geometry, valid for exactly three uses: equal-split participant selection, historical exact-share display, and migration or reconciliation review. Retained non-equal shares are calculated and displayed at their exact values and protected from silent equal-split overwrite; malformed retained history is held out of the settlement arithmetic and routed to review. No amount, percentage or weight can be entered anywhere, because no such authoring surface exists in the product.

**Reason.** Persisted history must be inventoried, migrated, reconciled and displayed accurately — that is a data-preservation obligation, not a feature request. The latent calculation branches do not become user-visible authoring parity.

**Affected screens.** FIN-11 (Historical non-equal shares, read-only), FIN-13 (Multiple payers with equal final shares), FIN-16 (Historical non-equal share reconciliation), and CMP-24 (Participant-share display).

**Architecture impact.** No new writing surface and no schema change. What is required is an inventory of persisted non-equal rows and a reconciliation path for malformed ones. Fixture CS-01 is retitled as retained non-equal history and marked as requiring a history inventory. Closes C-12.

**Approval required.** Recorded. **Decision: Approved with limit by O-10** — display and reconciliation only; arbitrary custom, percentage and weighted authoring explicitly deferred.

### E-14 Removing a document keeps the Event it created
**Current behaviour.** `deleteDoc` in `ScanTab` removes the Storage object and then deletes the `events` row, so removing a document also removes the itinerary entry it produced — and does so as two unguarded calls.

**Proposed behaviour.** Document removal removes the document. The associated Event stays, keeps its `FROM DOCUMENT SCAN` provenance, and the confirmation says so before anything happens (DOC-57, DOC-59). If the object and metadata come apart, the outcome is a detected, named, held state rather than a reported success (DOC-61).

**Reason.** An itinerary entry people are travelling on should not disappear because somebody tidied up a receipt. Provenance is a historical fact and survives the document; the two objects have different lifetimes and different audiences.

**Affected screens.** DOC-57, DOC-58, DOC-59, DOC-60, DOC-61, DOC-65.

**Architecture impact.** Removal must not cascade to `events`, and the object-plus-metadata pair needs a reconciliation owner. Closes C-14.

**Approval required.** Yes — it changes an existing destructive behaviour. **Decision: Approved — batch 6.** Document removal and Event removal are separate lifecycle actions. Removing a document removes or reconciles the private object and its metadata and clears the association where required; it does not automatically delete an independently valid Event, must not leave an authorised dangling document reference, and uses controlled reconciliation after partial failure.

### E-15 In-app authorised document render replaces the public object URL
**Current behaviour.** Documents are read through `storage.from('tickets').getPublicUrl(path)` and opened in a new tab as `View ↗`. That address is durable, unauthenticated and shareable, and it keeps working after a person leaves the Group.

**Proposed behaviour.** One private viewer shell renders both PDFs and images in-app from an authorised short-lived read, with no address bar, no copyable link and no permanent URL anywhere on screen (DOC-50, DOC-51, CMP-44). Download is an authorised transfer, not a link handout (DOC-52). Legacy public documents are migrated to private storage under ordinary same-Group authorisation, and the old address is never printed in the migration copy (DOC-80 to DOC-83).

**Reason.** The accepted rules say Storage objects are private and public object URLs are not target behaviour. A viewer that hands off to a browser tab necessarily hands off a URL.

**Affected screens.** DOC-49 to DOC-56, DOC-80 to DOC-83. Components CMP-44 and CMP-47.

**Architecture impact.** Requires an authorised read path with a short lifetime and a migration for existing objects. Closes C-13. Whether already-shared public addresses must be treated as compromised remains an operational question, not a design one.

**Approval required.** Yes — it changes how every existing document is opened. **Decision: Approved — batch 6.** Target behaviour is private Storage, current same-Group authorisation, temporary narrowly scoped access where implementation uses it, no permanent public URL and no path-based authority.

### E-16 Thirteen document states, and server-derived uploader provenance
**Current behaviour.** `ScanTab` has one boolean `scanning` flag, one success string and one error string. Upload, storage acceptance, extraction and Event creation are indistinguishable to the user, and a failure anywhere reads the same.

**Proposed behaviour.** Thirteen states kept distinct, each stating what exists and what does not: local file selected, uploading, private object accepted, parsing, parse warning, parse failure, reviewed values, Event creation, association complete, document history, viewer and download, removal, reconciliation. The accepted spinner and the word Scanning… are reused unchanged for the parsing step only.

**Reason.** The asymmetric failures are the ones that produce support tickets and orphaned data — a stored document with no Event, an Event with no document, a removal that half-succeeded. None of them can be explained by a spinner, and none of them can be recovered from if the user was told the wrong thing.

**Affected screens.** DOC-19 to DOC-28, DOC-35 to DOC-38, DOC-57 to DOC-70.

**Architecture impact.** The client needs distinguishable outcomes from upload, parse and Event creation rather than one success or failure signal. Uploader identity is derived by the server from the validated authenticated actor and the current same-Group relationship; the client cannot submit, select or override it. Closes C-15.

**Approval required.** Yes — it expands the state inventory of an existing tab substantially, and it removes client-selectable uploader identity. **Decision: Approved — batch 6.**


### Batch 6 note — no new exceptions
Board 17 raises no new exception. Group configuration reuses the accepted buttons, inputs, dialogs, permission cards and status components, and every accessibility correction it depends on (E-02 destructive confirmation, E-03 touch targets, E-04 accessible names, E-05 reduced motion, E-06 contrast) is already recorded.

### Batch 7 and 8 note — no new exceptions

Boards 18 and 20 raise no new exception. Realtime and migration reuse the accepted buttons, inputs, dialogs, permission cards, read-only banners, recovery blocks and status components, and every accessibility correction they depend on is already recorded: E-02 destructive confirmation, E-03 touch targets, E-04 accessible names, E-05 reduced motion, E-06 contrast, E-07 image fallback, E-09 unclaimed-participant treatment, E-11 absent rather than disabled affordances.

Two long-standing exceptions gain new evidence rather than new decisions:

- **E-05 reduced motion** now also covers the reconnecting pulse (RT-03), toast transitions and migration progress animation (MIG-15).
- **E-11 absent rather than disabled** now also covers maintenance read-only states (MIG-03, MIG-04, MIG-42) and realtime role demotion (RT-38).

All sixteen exceptions are decided. None is awaiting approval.
