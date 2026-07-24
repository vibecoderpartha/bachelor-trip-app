# Architecture Documentation

| Field | Value |
|---|---|
| Status | Draft |
| Document type | Governance and package index |
| Scope | Multi-user, multi-group conversion documentation |
| Current-state baseline | [V1 Codebase Feature and Flow Report](../v1-codebase-feature-and-flow-report.md) |
| Related ADRs | [ADR-0001](decisions/ADR-0001-group-is-trip-tenant.md), [ADR-0002](decisions/ADR-0002-supabase-auth-is-authoritative.md), [ADR-0003](decisions/ADR-0003-commercial-membership-deferred.md), [ADR-0004](decisions/ADR-0004-group-member-id-is-participant-identity.md), [ADR-0005](decisions/ADR-0005-normalized-finance-payers-and-shares.md), [ADR-0006](decisions/ADR-0006-group-configuration.md), and [ADR-0007](decisions/ADR-0007-single-use-atomic-invitation-acceptance.md) are Accepted; the later Planned topic is indexed in [Architecture Decisions](decisions/README.md) |
| Last reviewed | 2026-07-24 |

## Purpose

This documentation package governs the conversion of the current fixed
five-person Bali application into a globally usable, multi-user, multi-group
trip application. The conversion must preserve the existing Trip, Scan, Split,
FX, settlement, Todo, realtime, and storage behaviour unless an intentional
exception is explicitly reviewed and approved.

This is a documentation stage. It establishes boundaries, decisions, contracts,
and implementation prerequisites; it does not authorize application changes,
database migrations, Supabase changes, or deployment. Implementation may begin
only after the complete documentation package has passed the final lock
conditions defined in this document.

## Current-state and target-state separation

The repository maintains a strict separation between observed behaviour and
approved future design:

- [`docs/v1-codebase-feature-and-flow-report.md`](../v1-codebase-feature-and-flow-report.md)
  is the frozen factual current-state baseline.
- `docs/architecture/*` describes the target architecture as it progresses from
  Draft to Accepted.
- `docs/architecture/decisions/*` contains permanent architectural decisions
  and the rules governing those decisions.
- [`docs/product/deferred-scope-register.md`](../product/deferred-scope-register.md)
  tracks work intentionally postponed beyond the current conversion.
- Implementation code is evidence of repository behaviour, but it does not
  override Accepted architecture documents.
- If implementation and an Accepted architecture document disagree, the
  conflict must be reported and resolved explicitly before the affected work
  continues.

The v1 report must never be rewritten, reinterpreted, or updated to describe the
target architecture. It remains a snapshot of the existing application. Target
documents must label current facts, target requirements, planned decisions, and
deferred work distinctly.

The root `README.md` and `EMERGENT-HANDOFF.md` contain historical statements
that the v1 report identifies as stale or conflicting, including trip dates,
persona persistence, offline behaviour, authentication wording, and AI feature
availability. They are historical implementation notes, not architecture
authority. This package does not modify them.

## Complete document inventory

Status values in this table describe the current documentation package. A
Planned entry is not a file and must not be cited as though it exists.

| Document | Inventory class | Package role | Status |
|---|---|---|---|
| [`docs/v1-codebase-feature-and-flow-report.md`](../v1-codebase-feature-and-flow-report.md) | Existing | Factual current-state baseline | Existing/Frozen |
| [`docs/architecture/README.md`](README.md) | Created in Phase 1 | Architecture entry point and governance | Draft |
| [`docs/architecture/glossary.md`](glossary.md) | Created in Phase 1 | Canonical project terminology | Draft |
| [`docs/product/deferred-scope-register.md`](../product/deferred-scope-register.md) | Created in Phase 1 | Permanent deferred-work register | Draft |
| [`docs/architecture/decisions/README.md`](decisions/README.md) | Created in Phase 1 | ADR index, numbering, lifecycle, and template | Draft |
| [`docs/architecture/multi-tenant-target-architecture.md`](multi-tenant-target-architecture.md) | Created in Phase 2 | Product, Tenant, and global identity boundaries | Accepted |
| [`docs/architecture/domain-and-data-model.md`](domain-and-data-model.md) | Created in Phase 3 | Target domain identities, ownership, relationships, Group configuration, and finance invariants | Accepted |
| [`docs/architecture/auth-groups-and-invitations.md`](auth-groups-and-invitations.md) | Created in Phase 4 | Authentication, Group, membership, ownership, configuration, archival, and Invitation flows | Accepted |
| `docs/architecture/security-model.md` | Planned | Authorization, RLS, service-role, storage, and realtime security | Planned |
| `docs/architecture/v1-migration-plan.md` | Planned | Safe conversion from the frozen v1 state | Planned |
| `docs/architecture/feature-parity-test-contract.md` | Planned | Verifiable preservation and approved exceptions | Planned |
| `docs/architecture/implementation-roadmap.md` | Planned | Ordered implementation work after documentation lock | Planned |
| [`ADR-0001: One Group Represents One Trip and Is the Tenant Boundary`](decisions/ADR-0001-group-is-trip-tenant.md) | Created in Phase 2 | Group/Trip workspace and Tenant boundary | Accepted |
| [`ADR-0002: Supabase Auth Is the Authoritative Identity Provider`](decisions/ADR-0002-supabase-auth-is-authoritative.md) | Created in Phase 2 | Global authentication and session identity authority | Accepted |
| [`ADR-0003: Commercial Membership Is Deferred`](decisions/ADR-0003-commercial-membership-deferred.md) | Created in Phase 2 | Separation of Group access from commercial scope | Accepted |
| [`ADR-0004: group_members.id Is the Stable Participant Identity`](decisions/ADR-0004-group-member-id-is-participant-identity.md) | Created in Phase 3 | Stable Group-scoped Participant identity | Accepted |
| [`ADR-0005: Finance Payers and Shares Use Normalized Tables`](decisions/ADR-0005-normalized-finance-payers-and-shares.md) | Created in Phase 3 | Normalized payer/share relationships and finance reconciliation | Accepted |
| [`ADR-0006: Timezone, Currency, Destination, and Dates Are Group Configuration`](decisions/ADR-0006-group-configuration.md) | Created in Phase 3 | Group-owned destination, dates, timezone, and accounting currency | Accepted |
| [`ADR-0007: Invitations Are Single-Use and Accepted Atomically Server-Side`](decisions/ADR-0007-single-use-atomic-invitation-acceptance.md) | Created in Phase 4 | Recipient-bound, single-use, atomic Invitation acceptance | Accepted |
| One later-phase ADR topic, using the future next available sequential number | Planned | Phase 5 RLS decision listed in the ADR index | Planned |

ADR-0001 through ADR-0007 are Accepted. The Phase 5 RLS topic remains
unnumbered and Planned.

## Documentation phases

The seven-phase sequence is locked. A later phase may refine an earlier Draft,
but it may not skip an earlier acceptance gate or silently overturn an Accepted
decision.

| Phase | Objective | Expected documents | Acceptance gate |
|---|---|---|---|
| 1. Documentation governance and terminology | Establish package authority, vocabulary, deferred-scope control, and ADR governance. | This README; [glossary](glossary.md); [deferred-scope register](../product/deferred-scope-register.md); [ADR index](decisions/README.md) | The Phase 1 gate below passes and the v1 report is unchanged. |
| 2. Product, tenant, and identity boundaries | Define what a Group and Trip mean, establish the Tenant boundary and Supabase Auth as the authoritative global identity source, separate global from group-owned concerns, and exclude commercial scope. | [Multi-Tenant Target Architecture](multi-tenant-target-architecture.md) (Accepted); [ADR-0001](decisions/ADR-0001-group-is-trip-tenant.md), [ADR-0002](decisions/ADR-0002-supabase-auth-is-authoritative.md), and [ADR-0003](decisions/ADR-0003-commercial-membership-deferred.md) (Accepted) | Product, Tenant, and identity boundaries are unambiguous; the authoritative global identity source is Accepted before Phase 3 can be accepted; deferred items remain excluded; relevant ADRs are Accepted. |
| 3. Domain and data model | Define stable identities, ownership, relationships, finance normalization, Group configuration, and data invariants without writing migrations. | [Domain and Data Model](domain-and-data-model.md) (Accepted); [ADR-0004](decisions/ADR-0004-group-member-id-is-participant-identity.md), [ADR-0005](decisions/ADR-0005-normalized-finance-payers-and-shares.md), and [ADR-0006](decisions/ADR-0006-group-configuration.md) (Accepted) | The Phase 2 authoritative-identity decision is an Accepted prerequisite; every group-owned record has an owner scope and stable identity model; Group configuration is defined; migration-relevant invariants are reviewable; relevant ADRs are Accepted. |
| 4. Authentication, Group, and Invitation flows | Define authentication and session behaviour using the authoritative Supabase Auth identity established in Phase 2, plus Group creation/selection, membership, ownership, and Invitation state transitions. | [Authentication, Group, and Invitation Flows](auth-groups-and-invitations.md) (Accepted); [ADR-0007](decisions/ADR-0007-single-use-atomic-invitation-acceptance.md) (Accepted). Prerequisites: the Accepted Phase 2 Supabase Auth ADR and the Accepted Phase 3 domain and identity model | All normal and failure flows have explicit authorization boundaries and no UI state is treated as authority; the Supabase Auth decision is treated as an established prerequisite rather than reauthored; the Invitation ADR is Accepted. |
| 5. Security architecture | Define database, API, Edge Function, storage, and realtime enforcement for tenant isolation. | `security-model.md`; ADR for RLS-enforced group access | Deny-by-default access rules, privileged-operation boundaries, and verification requirements are complete; the security ADR is Accepted. |
| 6. Migration and feature parity | Define staged migration, compatibility, rollback, data validation, and a testable parity contract against v1. | `v1-migration-plan.md`; `feature-parity-test-contract.md` | Every preserved behaviour or intentional parity exception is accounted for; migration and rollback gates are measurable. |
| 7. Implementation roadmap | Order implementation only after the architecture, security, migration, and parity package is internally consistent. | `implementation-roadmap.md`; completed package review | All required documents and ADRs are Accepted, conflicts are closed, deferred scope is checked, and final lock conditions pass. |

## Reading order

Read the package in this order so observed behaviour is not confused with future
design:

1. [V1 factual report](../v1-codebase-feature-and-flow-report.md)
2. [Architecture README](README.md)
3. [Glossary](glossary.md)
4. Accepted ADRs listed in the [ADR index](decisions/README.md)
5. [Multi-Tenant Target Architecture](multi-tenant-target-architecture.md)
6. [Domain and Data Model](domain-and-data-model.md)
7. [Authentication, Group, and Invitation Flows](auth-groups-and-invitations.md)
8. `security-model.md` once created
9. `v1-migration-plan.md` and `feature-parity-test-contract.md` once created
10. `implementation-roadmap.md` once created
11. [Deferred-scope register](../product/deferred-scope-register.md)

Paths explicitly qualified with “once created” in this list do not yet exist.
The deferred-scope register is read last as a consolidated scope check, but
every phase must also consult it while drafting.

## Source-of-truth precedence

When documents conflict, use the following precedence:

1. Accepted ADRs
2. Accepted target architecture and security documents
3. Domain/data-model and flow documents
4. Feature-parity contract
5. Migration plan
6. Implementation roadmap
7. Existing v1 report as a current-state reference
8. Historical comments, old READMEs, and implementation notes

Precedence resolves document authority; it does not authorize silent
interpretation. Codex and human contributors must report the conflicting
statements, identify their statuses, and obtain or record an explicit
resolution. If an Accepted higher-precedence source would erase a verified
current behaviour, the difference must also be recorded as an intentional
parity exception before implementation.

## Document metadata and status lifecycle

Architecture-package documents use this header immediately after the title:

```markdown
| Field | Value |
|---|---|
| Status | Draft |
| Document type | Governance, architecture, model, flow, security, contract, plan, register, or ADR index |
| Scope | Short statement of the document boundary |
| Current-state baseline | Relative link to the frozen v1 report |
| Related ADRs | Relative links, or an explicit statement that none are accepted |
| Last reviewed | YYYY-MM-DD |
```

An individual ADR uses the more specific template in the
[ADR index](decisions/README.md). All metadata must describe the document's
actual state; links to Planned files must not be presented as live links.

Architecture document statuses are:

- **Draft:** Under review and not locked for implementation. New architecture
  documents begin here.
- **Accepted:** Reviewed, internally consistent with higher-precedence
  decisions, and locked as an implementation input.
- **Implemented:** Repository behaviour has been verified against the Accepted
  document. This is a verification status, not merely a claim that coding
  started.
- **Superseded:** Replaced by another named document or decision. The
  superseded document remains in history and must link to its replacement.

Accepted decisions may be changed only by an explicit amendment recorded
through the review process or by a superseding ADR. Accepted ADR content itself
must not be silently rewritten.

## Change-control process

1. **Propose:** Create or revise a Draft with the intended boundary, current
   facts, target requirement, alternatives, affected documents, parity impact,
   security impact, migration impact, and deferred implications clearly
   separated.
2. **Review:** Compare the proposal with the frozen v1 report, higher-precedence
   Accepted sources, the glossary, the deferred-scope register, and all linked
   documents. Report conflicts rather than choosing an interpretation silently.
3. **Decide:** Capture every permanent architectural decision in an ADR. A
   document may move to Accepted only when required ADRs are Accepted and review
   findings are resolved.
4. **Synchronize:** Update affected repository Markdown indexes, statuses,
   cross-links, and deferred entries in the same documentation change. External
   or project-source copies are synchronized references only.
5. **Supersede or amend:** Preserve the old record, mark it Superseded where
   applicable, link both directions, and explain compatibility or migration
   consequences. Never reuse an ADR number.
6. **Verify implementation:** Move an Accepted document to Implemented only
   after tests or other recorded evidence show repository behaviour complies
   with it.

Repository Markdown files are canonical. External documents, project trackers,
chat transcripts, and generated summaries are synchronized references and
cannot supersede repository records.

Codex must not silently broaden scope. Any newly postponed work must be added to
the deferred-scope register with a stable identifier. Any permanent decision
must be captured in an ADR. If requested implementation conflicts with an
Accepted document or enters deferred scope, Codex must stop the affected work,
report the conflict, and request an explicit architecture change.

Implementation cannot begin until the complete documentation package passes
its final lock conditions:

- every planned package document exists and is Accepted;
- all eight required ADR topics have repository-wide numbers and Accepted ADRs;
- every internal link and status has been checked;
- the security model and feature-parity contract have explicit verification
  criteria;
- the migration plan has reviewed compatibility, validation, and rollback
  gates;
- the deferred-scope register has been checked against every document;
- all unresolved conflicts and intentional parity exceptions are recorded; and
- the frozen v1 report remains unchanged.

## Phase 1 acceptance gate

Phase 1 is ready for review only when all of the following are true:

- Terminology is unambiguous and the [glossary](glossary.md) is used
  consistently.
- Current-state facts and target-state requirements have separate sources and
  labels.
- `group_members` cannot be confused with paid membership, subscriptions,
  pricing, or entitlements.
- Deferred work has a permanent, stable-ID
  [register](../product/deferred-scope-register.md).
- ADR purpose, lifecycle, repository-wide numbering, and non-reuse rules are
  defined in the [ADR index](decisions/README.md).
- The v1 report remains unchanged.
