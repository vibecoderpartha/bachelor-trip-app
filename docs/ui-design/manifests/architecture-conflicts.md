# Architecture conflicts and source-of-truth notes

Cumulative. Batches 1–8 of 8. UI/UX Design Package: Accepted. UI/UX Design Lock: Complete. Architecture conflicts open: 0.

## Closed

**C-01 — Six-tab legacy shell vs current five tabs.**
Legacy captures show a sixth AI tab. The current application ships five: Trip, Scan, Split, FX, Todo. Resolved in favour of the current application (authority 1). Every screen in this package uses the five-tab shell. Dormant AI navigation is not treated as a current screen.

**C-02 — Legacy persona switching vs accounts.**
Legacy evidence shows persona selection with five fixed people. The accepted architecture replaces this with authenticated accounts, Groups and participant claiming. Recorded as exception E-08, approved and architecture-required.

**C-03 — Legacy Group Settings screen.**
Historical evidence only. GRP-07 and board 17 are derived from the accepted architecture, not from that capture. Board 17 introduces no sixth tab, no admin dashboard, no organization settings, no account-owned Trip settings and no separate Group and Trip entities: a Group is the Trip workspace and the tenant boundary.

**C-04 — Conflicting design system.**
A green enterprise-learning design system is attached to this project. It contradicts authority 1 and the instruction not to restyle the product. Confirmed by decision O-06: ignored entirely. Nothing in this package derives from it.

**C-05 — Participant colour supply.**
The current app defines five participant colours. Groups can exceed five people. Resolved by exception E-09: the migrated five keep their colours; additional participants use warm neutral #C8B8A6, dashed while unclaimed, with name and initial always visible. Colour never communicates authority or role.

**C-08 — Owner-confirmed participant reassignment.**
Batch 2 designed CLM-09, CLM-11 and CLM-13 as routing to an Owner decision. Decision O-07 closes this: there is no Owner review surface, approval screen or manual reassignment in the current scope. Contested claims stop safely and state that nothing changed (PERM-16). Board 17 no longer inherits a claim queue.

**C-06 — Role vocabulary.**
Batch 1 explored a third read-only role. Decision O-01 confirms exactly two roles, Owner and Member. Read-only presentation survives as a Group state (archived), a permission outcome, or a maintenance state — never a role. Removed from badges, copy, matrices and annotations.

**C-11 — No per-record accounting rate exists in current source. CLOSED as a target correction.**
v1 used the static 188.68 IDR/INR constant in `src/lib/currency.ts` and persisted no per-record rate field; `amount`, `currency` and `amount_idr` preserve the original side only. The target behaviour is now settled: new converted accounting records retain immutable FX evidence; migrated valid Bali records carry verified legacy 188.68 provenance; the live converter never replaces historical accounting evidence; missing or malformed legacy evidence enters controlled reconciliation. No screen claims that every v1 row originally stored a rate. Applied to FIN-25, FIN-29, FIN-42, FIN-43, FIN-44 and to fixtures FX-01 and RATE-01.

**C-12 — Unequal splits are unreachable in the current writing surface. CLOSED.**
Resolved by O-10 rather than by adding a writing surface. The latent custom, percentage and weighted calculation branches do not become user-visible authoring parity. They are data-preservation only: retained history is calculated and displayed exactly, malformed history is held for review, and no screen offers to create or edit arbitrary amounts, percentages or weights. E-13 is limited to display and reconciliation. FIN-11, FIN-13, FIN-16 and CMP-24 revised accordingly.

**C-10 — Presentation filtering must apply to aggregates, not only rows. CLOSED, restated in batch 6.**
Event presentation filters may be applied before participant-specific itinerary counts and presentation summaries are rendered. That is presentation parity, not database confidentiality: active same-Group Members retain accepted Event database-read authority. It does **not** apply to expenses, balances, settlements or Group-wide finance totals, which stay Group-wide — every member sees every expense. **Documents are not audience-filtered in the current accepted target**: document access is current same-Group authorisation, and no per-document audience exists. Applied to PERM-10, PERM-14, CMP-21, board 15 and the corrected board 16.

**C-07 — Group deletion semantics. CLOSED for design scope.**
Decision O-05 removes permanent deletion from scope and confirms Leave, Archive and Restore. Retention, purge and anonymisation remain deliberately undesigned (O-08). Nothing in this package implies data is ever destroyed.

**C-09 — Superseded. CLOSED in batch 4.**

**C-13 — v1 serves documents from a public Storage object URL. CLOSED as a target security correction.**
`ScanTab` reads documents through `supabase.storage.from('tickets').getPublicUrl(path)` and renders it as a `View ↗` anchor. That address is durable, unauthenticated, shareable and survives a person leaving the Group. **V1 public object URLs are not preserved as target authority.** Target behaviour: private Storage; current same-Group authorisation; temporary narrowly scoped access where implementation uses it; no permanent public URL; no path-based authority. Approved as exception E-14. Applied to DOC-49 to DOC-56 and DOC-80 to DOC-83.

**C-14 — v1 document removal is two unguarded calls, and it deletes the Event. CLOSED as a target reconciliation correction.**
`deleteDoc` calls `storage.remove([...])` and then `from('events').delete()` with nothing between them. Target behaviour: document removal and Event removal are separate lifecycle actions. Removing a document removes or reconciles the private object and its metadata and clears the association where required; it does not automatically delete an independently valid Event; it must not leave an authorised dangling document reference; and it uses controlled reconciliation after partial failure. Approved as exception E-15. Applied to DOC-57 to DOC-69.

**C-15 — Uploader identity is submitted by the client in v1. CLOSED as a target provenance correction.**
The parse call sends `uploaded_by` and `for_users` as form fields from client state. Target behaviour: uploader identity is derived from the validated authenticated actor and the current same-Group relationship, and the client cannot submit, select or override it. The scan participant selection is validated server-side as Event presentation, not as document authorisation. Approved as exception E-16. Applied to DOC-17, DOC-40, DOC-41, DOC-45 and DOC-81.

## Open

None. All conflicts raised in batches 1 to 5 are closed. New conflicts, if any, will be raised against boards 18 and 20 in batches 7 and 8.

## Batch 6 correction to batch 5

The accepted architecture does not define a separate per-document audience, and batch 5 designed one. Corrected: document access is private from the public, private from unrelated Groups, available only through current same-Group authorisation, unavailable after membership removal or inactivity, read-only where an archived Group permits archive-aware reads, and never authorised by filename, path, URL, metadata id or Active Group state. The Scan assignment control is presentation assignment for the Event created from the scan and current Participant filtering behaviour — not document confidentiality, not a private or secret Event, and not per-document Storage authorization. DOC-11 to DOC-18 retitled; per-document audience summaries removed from DOC-40, DOC-41, DOC-48, DOC-55, viewer and download states, document counts and every manifest; DOC-55 restated as a generic unavailable-document state.

## Batch 7 and 8 additions — no new conflicts

Boards 18 and 20 raised no new architecture conflict. Both were designed against decisions already closed in this register:

- Realtime is presentation only and Group-scoped. Nothing renders from a payload alone, so the channel cannot become a side door around the access rules that closed C-13 and C-15.
- Document realtime carries no per-document audience, consistent with the batch 6 correction to C-10.
- Document removal realtime keeps the independently valid Event, consistent with C-14 and E-15.
- Migration never guesses a value, never exposes a public fallback, and never converts historical money — consistent with C-11, C-13 and the O-17 resolution.
- Partial security activation and unproven cross-Group isolation block release. This is stated as an operational contract on MIG-29, MIG-30 and MIG-38 rather than as a user-facing screen.

## Traceability note

IR ownership and wave assignment is now derived from the Accepted roadmap: all 462 Screen IDs have one valid IR-001 through IR-022 primary owner and one roadmap-consistent W1 through W7 wave. Related IR items retain cross-cutting requirements. R-01 is closed; R-02 remains specified for implementation verification.
