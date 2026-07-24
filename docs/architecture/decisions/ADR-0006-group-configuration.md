# ADR-0006: Timezone, Currency, Destination, and Dates Are Group Configuration

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owners/reviewers | Pranjal Kumar Maurya — product owner; architecture review completed 2026-07-24 |
| Related documents | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md); [Multi-Tenant Target Architecture](../multi-tenant-target-architecture.md); [Domain and Data Model](../domain-and-data-model.md); [Architecture Glossary](../glossary.md); [Deferred-Scope Register](../../product/deferred-scope-register.md); [ADR-0001](ADR-0001-group-is-trip-tenant.md); [ADR-0003](ADR-0003-commercial-membership-deferred.md) |
| Supersedes | None |
| Superseded by | None |

## Context

### Current state

V1 compiles one Bali/DPS Trip, 22–27 May 2026 dates, IST-stored timestamps,
WITA-oriented display behaviour, INR/IDR conversion, IDR accounting, and
Bali-specific price information into multiple frontend constants and feature
paths. Those assumptions work only for the fixed Trip and cannot safely govern
unrelated new Groups.

### Target problem

Because one Group represents one Trip and is the Tenant boundary, schedule,
destination, and accounting interpretation need a single group-owned authority.
Leaving them global, user-profile-specific, or inferred from individual records
would reproduce legacy coupling and make Event ordering, countdowns, finance
totals, FX conversion, migration, and Feature parity ambiguous.

## Decision

1. The user-facing Trip name belongs to Group configuration.
2. Destination belongs to Group configuration.
3. Trip start and end dates belong to Group configuration.
4. The canonical Trip timezone belongs to Group configuration and is
   represented by an IANA timezone identifier.
5. The Group ledger accounting currency belongs to Group configuration and is
   represented by an ISO 4217 currency code.
6. Approved currency-display context needed to show Original and accounting
   values may also be Group configuration, but it does not change the
   accounting currency.
7. Event scheduling and Trip-relative date interpretation use the Group
   timezone rather than global IST/WITA constants or a Profile timezone.
8. Expense accounting and Group totals use the Group accounting currency while
   preserving Original amount/currency and immutable conversion evidence.
9. Configuration is owned by exactly one Group and grants no authority outside
   that Group.
10. The migrated Bali Group preserves its validated Bali destination, Trip
    dates, WITA scheduling meaning through an IANA mapping, and IDR accounting
    context. Exact migration mapping and compatibility checks belong to
    Phase 6.
11. New Groups receive their own configuration and do not inherit Bali-specific
    guide or price content.

This decision does not define schema columns, configuration flows, permission
rules, migration commands, worldwide guide generation, or UI localization.

## Rationale

- Group configuration follows the Accepted one-Group/one-Trip ownership model.
- IANA timezone identifiers preserve daylight and regional time semantics more
  reliably than informal labels or fixed offsets.
- ISO currency codes give accounting values an explicit standard context.
- One Group accounting currency lets payer, share, balance, and Settlement
  totals reconcile while preserving Original currencies separately.
- Explicit date and destination configuration removes fixed Bali assumptions
  from unrelated workspaces.
- Preserving validated Bali values supports later migration and Feature parity
  without making them global defaults.

## Consequences

### Positive

- Different Groups can represent different destinations, dates, timezones, and
  accounting currencies.
- Events and countdowns have one canonical Trip-time interpretation.
- Finance has one group-owned accounting context and retains Original monetary
  evidence.
- The migrated Bali Group can preserve existing behaviour through explicit
  values rather than global constants.
- New Groups do not receive misleading Bali-specific information.

### Constraints and costs

- Group creation and configuration-change flows must collect and validate these
  values in Phase 4.
- Later documents must define the effect of timezone, date, or accounting
  currency changes on existing history.
- Migration must resolve v1 IST storage and WITA presentation into validated
  canonical schedule values.
- Currency display preferences cannot silently alter ledger authority.
- Destination configuration alone does not provide guide content.

## Alternatives considered

### Keep global Bali and INR/IDR constants

Rejected. They make unrelated Groups incorrect and prevent global product use.

### Store Trip settings on each Profile

Rejected. A Profile is global presentation data, while collaborators in one
Group need one shared Trip and accounting interpretation.

### Infer configuration from Events or Expenses

Rejected. Individual records may be incomplete or inconsistent and cannot
provide a durable authority for the Group.

### Store only fixed UTC offsets

Rejected. Offsets do not provide the regional timezone semantics required for
reliable scheduling.

### Create a worldwide destination-guide model now

Deferred, not selected. Destination identity is required Group configuration;
automatic guide content is a separate product scope.

## Security implications

- Configuration belongs to one Group and cannot be read or changed through
  another Group.
- Active Group or a client-supplied timezone, currency, date, or destination
  does not authorize configuration access or override stored accounting
  authority.
- Later operation rules must distinguish who may change configuration and
  validate downstream effects.
- Service-role operations must validate actor, Group, requested change, and
  affected records.
- Detailed RLS and authorization rules remain Phase 5 work.

## Migration/compatibility implications

- Phase 6 must map the Bali destination and 22–27 May 2026 dates into the Bali
  Group configuration.
- WITA schedule meaning must be mapped to a validated IANA timezone while
  reconciling existing IST-stored timestamps and display behaviour.
- IDR remains the migrated Group's accounting context where v1 `amount_idr`
  drives balances; Original INR/IDR values and conversion evidence must remain
  reproducible.
- Existing product-title variants and currency/time display conventions require
  explicit parity review rather than an invented migration default.
- Configuration changes after migration must not silently rewrite historical
  Event or finance meaning.

## Deferred implications

- Worldwide destination price guides remain Deferred under
  [DEF-005](../../product/deferred-scope-register.md#def-005--worldwide-destination-price-guides).
- Automatic or global travel-content generation remains Deferred under
  [DEF-012](../../product/deferred-scope-register.md#def-012--automatic-or-global-travel-content-generation).
- A permanent friend-group-to-many-Trips hierarchy remains Deferred under
  [DEF-004](../../product/deferred-scope-register.md#def-004--permanent-friend-groups-containing-multiple-trips).
- This ADR does not approve provider-backed guide generation, new commercial
  features, or organization-level configuration.

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- each Group has one effective Trip name, destination, date range, IANA
  timezone, and ISO accounting currency context;
- Event scheduling and Trip-relative calculations use the Group timezone;
- Group accounting reconciles in its configured currency while retaining
  Original values and immutable FX evidence;
- configuration and referenced records cannot cross Groups;
- the migrated Bali Group passes destination, date, timezone, currency, Event,
  and finance parity checks;
- new Groups receive no Bali-specific content by default; and
- no worldwide guide system is introduced as part of configuration.
