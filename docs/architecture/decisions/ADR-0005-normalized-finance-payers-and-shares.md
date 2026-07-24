# ADR-0005: Finance Payers and Shares Use Normalized Tables

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owners/reviewers | Pranjal Kumar Maurya — product owner; architecture review completed 2026-07-24 |
| Related documents | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md); [Multi-Tenant Target Architecture](../multi-tenant-target-architecture.md); [Domain and Data Model](../domain-and-data-model.md); [Architecture Glossary](../glossary.md); [ADR-0001](ADR-0001-group-is-trip-tenant.md); [ADR-0003](ADR-0003-commercial-membership-deferred.md); [ADR-0004](ADR-0004-group-member-id-is-participant-identity.md) |
| Supersedes | None |
| Superseded by | None |

## Context

### Current state

V1 Expenses store a single payer in `paid_by`, multi-payer values in
`paid_by_splits` JSON, split participants in a `split_among` name array, and
custom values in `custom_splits` JSON. These structures use display names
rather than durable identities. The visible UI creates equal splits, while
custom, percent, and weighted-share calculation branches exist but are not
current user-visible flows.

V1 preserves Original amount and currency and computes `amount_idr` using a
static 188.68 IDR/INR accounting conversion. The separate live converter and
unused `exchange_rates` records are not authoritative evidence for those
stored accounting values. Settlements also use display-name parties and record
accounting declarations rather than transferring funds. The
`settlements.recorded_by` field stores a display-name string, and the current
Paid flow writes the active persona to it. That captured recorder is mutable
legacy identity, not a missing field.

### Target problem

Multi-Group accounting needs same-Group Participant references, exact amounts,
reconciliation, reproducible conversion evidence, and single- or multi-payer
support. Name-keyed and opaque JSON structures cannot provide enforceable
relationships or reliable cross-Group validation.

## Decision

1. Each Expense has normalized payer-contribution relationships and normalized
   share relationships.
2. Every Expense has one or more payer contributions and one or more shares.
3. Each payer contribution relates one Expense, one same-Group Participant, and
   an exact contribution amount.
4. Each share relates one Expense, one same-Group Participant, and an exact
   final allocated amount.
5. Payer contributions sum exactly to the Expense accounting amount.
6. Shares sum exactly to the Expense accounting amount.
7. Stored monetary values and FX rates use exact-decimal semantics. Binary
   floating-point values are not authoritative stored accounting values.
8. Currency precision, conversion precision, rounding, and remainder allocation
   are explicit and deterministic.
9. An Expense preserves Original amount and currency, accounting amount and the
   Group's accounting currency, and immutable FX evidence when conversion is
   required.
10. Names, name-keyed maps, `paid_by`, `paid_by_splits`, `split_among`, and
    custom split JSON are not authoritative target finance relationships.
11. Single-payer, multi-payer, and equal-split behaviour remain representable.
    Custom-amount, percent, and weighted-share results can be represented by
    exact final share rows without declaring latent v1 calculation branches to
    be current user-visible parity.
12. Settlements continue as normalized, non-custodial accounting records whose
    payer, receiver, and recorder are stable same-Group Participants.

This decision defines logical relationships and invariants. It does not define
table or column names, SQL types, migration transforms, UI calculation flows,
or payment infrastructure.

## Rationale

- Normalized relationships make Participant and Group consistency explicit and
  constrainable.
- Final persisted contribution and share rows support both current simple
  behaviour and verified future calculation modes without identity in JSON
  keys.
- Exact-decimal reconciliation prevents ledger drift and makes balances
  auditable.
- Preserving Original and accounting contexts avoids losing user-entered values
  while retaining one Group ledger currency.
- Immutable FX evidence makes historical conversions reproducible even when
  live reference rates change.
- Settlement compatibility remains accounting-only and does not introduce
  payments, custody, or billing.

## Consequences

### Positive

- Single and multiple payers share one model.
- Equal, custom-amount, percent, and weighted calculations can all persist
  exact final allocations.
- Duplicate or changed display names do not corrupt ledger relationships.
- Group and Participant consistency can be verified independently for every
  contribution and share.
- Balance, settlement, parity, and migration checks can operate on explicit
  relationships.

### Constraints and costs

- Creation and editing must produce complete, reconciling sets of payer and
  share relationships.
- Rounding and remainder rules must be documented and tested before
  implementation.
- Legacy JSON requires validation and exception handling during migration.
- Historical FX context must be retained rather than recalculated from a
  current rate.
- The model does not decide which latent split modes become user-visible.

## Alternatives considered

### Keep name-keyed JSON and arrays

Rejected. Names are not identity, JSON relationships cannot reliably enforce
same-Group references, and malformed or duplicate keys weaken reconciliation.

### Retain one `paid_by` field and add special multi-payer JSON

Rejected. Two competing payer representations create branching invariants and
make totals harder to validate.

### Store only percentages or weights and calculate shares on every read

Rejected. Historical results could change with rounding or algorithm changes.
Final exact shares are required as accounting evidence; calculation method
metadata may supplement them.

### Use binary floating-point accounting values

Rejected. Floating-point representation cannot guarantee exact ledger
reconciliation.

### Recalculate old accounting amounts from the latest FX rate

Rejected. It changes history and makes recorded balances non-reproducible.

## Security implications

- Expense, payer, share, FX, Settlement, and Participant references must share
  one Group.
- A client-provided payer/share set is untrusted until identity, membership,
  exact totals, currency context, and authorization are validated.
- Name-keyed payloads cannot authorize or identify Participants.
- Service-role finance operations must validate the actor and all affected
  Group relationships despite RLS bypass capability.
- Normalization supports but does not replace Phase 5 RLS, role, and
  operation-level rules.
- Finance records remain unrelated to paid membership or Entitlements.

## Migration/compatibility implications

- Phase 6 must map `paid_by`, `paid_by_splits`, `split_among`, and
  `custom_splits` through controlled Legacy Participant identities.
- Migration must verify that payer and share totals reconcile to the retained
  accounting amount and preserve exceptions for review rather than silently
  repairing them.
- Original amount/currency and `amount_idr` require exact preservation and
  validation against known v1 accounting behaviour.
- The static 188.68 IDR/INR conversion must have reproducible legacy
  provenance; the live converter rate and unused `exchange_rates` records must
  not be substituted without evidence.
- Phase 6 decides parity for latent custom, percent, and weighted-share paths.
- Settlement `from_user`, `to_user`, and `recorded_by` display-name strings must
  be mapped through the controlled Legacy Participant mapping. The current Paid
  flow captures the active persona in `recorded_by`; unresolved or malformed
  stored values require exception handling only if actual data verification
  discovers them.

## Deferred implications

- Payment processing remains Deferred under
  [DEF-009](../../product/deferred-scope-register.md#def-009--payment-processing).
- Wallets, custody, and stored monetary balances remain Deferred under
  [DEF-010](../../product/deferred-scope-register.md#def-010--wallets-custody-or-stored-monetary-balances).
- Paid plans and premium Entitlements remain outside the conversion under
  [ADR-0003](ADR-0003-commercial-membership-deferred.md).
- This ADR neither approves new user-visible split modes nor designs billing.

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- every Expense has at least one payer contribution and one share;
- every finance Participant and record belongs to the same Group;
- contribution and share totals reconcile exactly to the accounting amount;
- exact-decimal and deterministic rounding tests cover every approved currency
  and split mode;
- no authoritative payer or share relationship depends on a name or JSON key;
- single-payer, multi-payer, and equal-split parity cases pass;
- persisted conversions reproduce from immutable FX evidence; and
- Settlements remain stable-identity, non-custodial accounting records.
