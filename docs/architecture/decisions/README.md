# Architecture Decision Records

| Field | Value |
|---|---|
| Status | Draft |
| Document type | ADR index and governance |
| Scope | Repository-wide architecture decision creation, numbering, lifecycle, and indexing |
| Current-state baseline | [V1 Codebase Feature and Flow Report](../../v1-codebase-feature-and-flow-report.md) |
| Related ADRs | [ADR-0001](ADR-0001-group-is-trip-tenant.md), [ADR-0002](ADR-0002-supabase-auth-is-authoritative.md), [ADR-0003](ADR-0003-commercial-membership-deferred.md), [ADR-0004](ADR-0004-group-member-id-is-participant-identity.md), [ADR-0005](ADR-0005-normalized-finance-payers-and-shares.md), and [ADR-0006](ADR-0006-group-configuration.md) are Accepted |
| Last reviewed | 2026-07-24 |

## Purpose

An Architecture Decision Record (ADR) preserves a consequential decision, its
context, rationale, alternatives, and implications so later documentation and
implementation sessions do not have to reconstruct it from chat history.

An ADR is required for:

- a permanent architectural boundary;
- an identity or authorization decision;
- a data-ownership decision;
- a security-model decision;
- a major irreversible or expensive-to-change choice; or
- superseding an Accepted architectural decision.

Routine implementation details that remain within Accepted architecture do not
need ADRs. When uncertainty affects one of the categories above, the decision
must be resolved in an ADR before the dependent architecture document is
Accepted.

## Existing convention audit

The Phase 1 repository audit found no ADR files, ADR index, architecture
decision directory, or historical ADR filenames in the current tree or Git
history. The Phase 2 repository-wide recheck found no intervening numbered ADR.
Therefore there was no existing number to preserve and no earlier filename
convention to extend.

This document established the first repository-wide convention. Phase 2
assigned `ADR-0001` through `ADR-0003`, and the Phase 3 repository-wide recheck
confirmed `ADR-0004` as next available before assigning `ADR-0004` through
`ADR-0006` in the required topic order. The next available number is currently
`ADR-0007`, but it is not reserved. Before authoring another ADR, search the
repository and history again.

## Numbering and filenames

- Numbers are repository-wide, sequential, and zero-padded to four digits:
  `ADR-0001`, `ADR-0002`, and so on.
- Use the filename form `ADR-NNNN-short-kebab-case-title.md`.
- The next ADR uses one greater than the highest ADR number found anywhere in
  the repository, including Rejected and Superseded records.
- Existing ADR numbers are never reused.
- Rejected or Superseded ADR numbers are never recycled.
- Filenames and numbers remain stable after acceptance.
- Renaming an Accepted ADR to make its title appear current is prohibited; a
  changed decision is recorded through a new ADR.
- Concurrent authors must resolve numbering collisions before review. Numbering
  conveys sequence, not priority or status.

The three Phase 2 topics and three Phase 3 topics have assigned files and are
Accepted. The two later-phase topics
remain unnumbered and Planned; this index does not reserve their numbers, and
no placeholder ADR file should be created.

## ADR lifecycle

ADR statuses are:

- **Proposed:** The decision is being reviewed and is not an implementation
  authority.
- **Accepted:** The decision has been reviewed, approved, and locked as
  architecture authority.
- **Rejected:** The proposal was considered and declined. It remains as
  historical evidence and its number is not reused.
- **Superseded:** A later Accepted ADR replaces the decision. Both ADRs link to
  one another and both remain in the repository.

Accepted ADR content cannot be silently rewritten. Non-decision corrections
such as an unambiguous broken link or typo may be made without changing meaning.
Any changed decision, material rationale, boundary, consequence, security
implication, or compatibility implication requires a new Proposed ADR that
references the old ADR. Once the new ADR is Accepted, the old ADR becomes
Superseded and names the replacement.

Rejecting a Proposed ADR does not authorize its decision. Superseding an ADR
does not erase obligations already implemented; migration and compatibility
effects must be recorded in the replacement.

## Authoring and review process

1. Search the entire repository and Git history for ADR numbers.
2. Assign the next available repository-wide number without creating
   placeholders for later ideas.
3. Create a Proposed ADR from the template below.
4. Link current-state evidence, affected Draft documents, deferred items, and
   any ADR it would supersede.
5. Review identity, authorization, ownership, security, migration, parity, and
   deferred-scope implications as applicable.
6. Record owners/reviewers and the review date; do not infer acceptance from a
   merged file or completed discussion.
7. Change status to Accepted or Rejected only through explicit review.
8. Update this index and every affected document in the same documentation
   change.

Repository Markdown is canonical. External copies or project trackers may
mirror ADRs but cannot change their status or content independently.

## Reusable ADR template

```markdown
# ADR-NNNN: Title

| Field | Value |
|---|---|
| Status | Proposed |
| Date | YYYY-MM-DD |
| Decision owners/reviewers | Names or accountable roles |
| Related documents | Relative repository links |
| Supersedes | None, or ADR link |
| Superseded by | None, or ADR link |

## Context

Describe the current facts, constraints, problem, and why a durable decision is
required. Distinguish the frozen current state from the proposed target state.

## Decision

State the decision precisely, including its scope and boundaries.

## Rationale

Explain why this choice best satisfies the documented constraints.

## Consequences

Record positive, negative, operational, and long-term consequences.

## Alternatives considered

List meaningful alternatives and why they were not selected.

## Security implications

Describe effects on identity, authorization, tenant isolation, privileged
operations, storage, realtime, and verification as applicable.

## Migration/compatibility implications

Describe v1 migration, feature parity, rollout, rollback, and compatibility
effects as applicable.

## Deferred implications

Reference affected DEF identifiers and identify work that remains out of scope.

## Verification or compliance notes

State how later documents and implementation can demonstrate compliance with
the decision.
```

Template headings must not be removed merely because an implication is absent;
write “None identified” with a reason so review coverage remains visible.

## ADR index

The first three entries are **Accepted** Phase 2 records. The next three are
**Accepted** Phase 3 records. The final two are **Planned**, unnumbered, and do
not yet have files.

| ADR or planned topic | Status | Purpose | Documentation phase |
|---|---|---|---|
| [ADR-0001: One Group Represents One Trip and Is the Tenant Boundary](ADR-0001-group-is-trip-tenant.md) | Accepted | Lock the workspace/Tenant unit, prevent an unapproved Group-to-many-Trips hierarchy, and establish the ownership scope used by later models. | Phase 2 — Product, tenant, and identity boundaries |
| [ADR-0002: Supabase Auth Is the Authoritative Identity Provider](ADR-0002-supabase-auth-is-authoritative.md) | Accepted | Separate authenticated global identity from Profile, Group Member, Legacy Participant, and display-name concepts. | Phase 2 — Product, tenant, and identity boundaries |
| [ADR-0003: Commercial Membership Is Deferred](ADR-0003-commercial-membership-deferred.md) | Accepted | Permanently separate Group access and Participant identity from commercial paid status during the free conversion and testing period. | Phase 2 — Product, tenant, and identity boundaries |
| [ADR-0004: `group_members.id` Is the Stable Participant Identity](ADR-0004-group-member-id-is-participant-identity.md) | Accepted | Prevent display names or global user presentation data from serving as identity in group-owned Event, finance, Settlement, Todo, and related records. | Phase 3 — Domain and data model |
| [ADR-0005: Finance Payers and Shares Use Normalized Tables](ADR-0005-normalized-finance-payers-and-shares.md) | Accepted | Replace name-keyed and JSON Participant references with stable, constrainable finance relationships that preserve payer/share semantics. | Phase 3 — Domain and data model |
| [ADR-0006: Timezone, Currency, Destination, and Dates Are Group Configuration](ADR-0006-group-configuration.md) | Accepted | Remove Bali-, IST/WITA-, INR/IDR-, and fixed-date coupling while retaining configuration-driven parity behaviour for the migrated Bali Group. | Phase 3 — Domain and data model |
| Invitations are single-use and accepted atomically server-side. | Planned | Prevent reuse and race conditions while ensuring a Group Member relationship is created only through an authorized, all-or-nothing acceptance operation. | Phase 4 — Authentication, Group, and Invitation flows |
| Group access is enforced through database RLS. | Planned | Lock the primary database Tenant-isolation boundary and require client queries and realtime behaviour to align with server enforcement. | Phase 5 — Security architecture |

The Planned Phase 4 and Phase 5 topics receive filenames and numbers only when
authored after a fresh repository-wide sequence check. The allocation remains
three ADRs in Phase 2, three in Phase 3, one in Phase 4, and one in Phase 5.
