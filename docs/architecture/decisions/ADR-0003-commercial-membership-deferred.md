# ADR-0003: Commercial Membership Is Deferred

| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-24 |
| Decision owners/reviewers | Pranjal Kumar Maurya — product owner; architecture review completed 2026-07-24 |
| Related documents | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md); [Multi-Tenant Target Architecture](../multi-tenant-target-architecture.md); [Architecture Glossary](../glossary.md); [Deferred-Scope Register](../../product/deferred-scope-register.md) |
| Supersedes | None |
| Superseded by | None |

## Context

The current conversion must replace v1's fixed personas and global data with
authenticated, isolated Trip workspaces while preserving the existing feature
set. V1 records shared expenses and settlements, but it does not process
payments, hold funds, sell plans, enforce trials or paywalls, or grant premium
feature Entitlements.

The term `group_members` is required for the relationship between an Auth User
and a Group. “Membership” is also commonly used for a paid customer state.
Without a permanent boundary, later schema or implementation work could
silently mix Tenant access with billing, place existing parity features behind
commercial gates, or add speculative payment and entitlement systems.

## Decision

1. The application remains free during the current multi-user conversion and
   testing period.
2. Paid plans, paid memberships, Subscriptions, trials, paywalls, billing
   integration, and premium feature Entitlements are outside the current
   conversion.
3. Group membership is the non-commercial relationship between an Auth User and
   a Group.
4. Owner and Member are non-commercial, group-scoped access roles, not plan
   tiers.
5. `group_members` must not represent or imply purchase, Subscription, trial,
   billing, or Entitlement state.
6. Existing in-scope Trip, Scan, Split, settlement, FX, Todo, realtime, and
   storage parity capabilities must not be gated by commercial state during the
   conversion.
7. Payment processing, wallets, custody, and stored monetary balances are not
   introduced.
8. A later implementation slice cannot add commercial gates without the
   deferred item first entering Reconsidering and an explicit approved
   architecture amendment or superseding ADR.

This is a scope and authorization boundary. It does not design a future
commercial model.

## Rationale

- Secure multi-user tenancy and Feature parity are already substantial
  conversion goals.
- V1 has no commercial behaviour that must be preserved.
- Group access is a collaboration authorization concern, while paid access is a
  separate product and billing concern.
- Keeping these concepts separate prevents billing failures or missing
  Entitlements from corrupting Tenant membership.
- Deferral avoids speculative schema, security paths, UI, and operational
  obligations before pricing and packaging decisions exist.
- Expense balances and settlements can remain non-custodial accounting
  behaviour without implying payment processing.

## Consequences

### Positive

- Every valid Group Member can use in-scope parity capabilities without a plan
  or premium gate.
- Owner and Member authorization can be designed without billing-state
  dependencies.
- Phase 3 does not need speculative Subscription or Entitlement entities.
- Phase 4 and Phase 5 can distinguish Group access from future commercial
  access.
- The word “membership” has an explicit non-commercial meaning when referring
  to `group_members`.

### Constraints and costs

- The conversion cannot enforce trials, quotas, paid limits, or premium
  capabilities.
- Product copy and UI must not imply unavailable commercial plans.
- Future monetization requires deliberate product, architecture, security, and
  migration work rather than a small feature flag.
- Any future commercial authority must remain separate from Auth User identity,
  Group membership, and Member role.

## Alternatives considered

### Add subscriptions and paywalls during the conversion

Rejected for the current scope. It would add billing lifecycle, authorization,
failure, testing, and support requirements unrelated to Tenant conversion.

### Treat `group_members` as both collaboration and paid membership

Rejected. Removing a paid state could incorrectly remove Trip access, and a
valid Group relationship could incorrectly imply payment. The concepts have
different authorities and lifecycles.

### Add dormant billing and entitlement fields for later use

Rejected. Speculative fields would create ambiguous authority without an
approved commercial model and could be used accidentally by later code.

### Gate only selected existing features

Rejected during conversion and testing. It would violate the free boundary and
change Feature parity without an approved exception.

## Security implications

- Group authorization must derive from authenticated identity, Group Member
  relationship, and Member role where applicable—not from billing or
  Entitlement state.
- No RLS, Edge Function, Storage, realtime, or frontend decision may deny or
  grant in-scope Group access based on a plan, trial, or premium flag.
- Commercial status must not become a substitute for Authentication or Tenant
  membership.
- No payment credentials, provider secrets, financial custody controls, or
  billing webhooks are introduced.
- If commercial scope is reconsidered, its authority, failure modes, revocation,
  auditability, and separation from Tenant access require security review.

## Migration/compatibility implications

- The existing Bali data needs no Subscription, paid membership, or Entitlement
  backfill.
- Legacy Participants and future Auth Users must not receive inferred
  commercial status during claiming or migration.
- Existing expense balances and recorded settlements remain accounting records,
  not stored funds or processed payments.
- The Phase 6 migration and parity contract must confirm that in-scope features
  remain usable without commercial state.
- This ADR adds no schema or migration requirement beyond preserving the
  separation.

## Deferred implications

- [DEF-001](../../product/deferred-scope-register.md#def-001--paid-plans-subscriptions-trials-and-paywalls)
  governs paid plans, Subscriptions, trials, and paywalls.
- [DEF-002](../../product/deferred-scope-register.md#def-002--premium-feature-entitlements)
  governs premium feature Entitlements.
- [DEF-009](../../product/deferred-scope-register.md#def-009--payment-processing)
  governs payment processing.
- [DEF-010](../../product/deferred-scope-register.md#def-010--wallets-custody-or-stored-monetary-balances)
  governs wallets, custody, and stored balances.
- Revisit conditions remain those recorded in the deferred-scope register.
  This ADR does not accelerate or broaden them.

## Verification or compliance notes

Later documentation and implementation demonstrate compliance when:

- `group_members` and Member roles contain no pricing, plan, trial, billing, or
  Entitlement meaning;
- Group access and in-scope features require no commercial state;
- no Subscription, paywall, payment, wallet, custody, or premium-gate
  implementation appears in conversion slices;
- expense balances and settlements are consistently described as accounting,
  not stored or transferred funds;
- every future commercial proposal begins by updating the relevant DEF entries
  and approving an architecture change; and
- repository reviews search for and reject commercial gates added without that
  approval.
