# Execution Package Governance

## Roles

| Role | Responsibility |
|---|---|
| Product owner | Pranjal Kumar Maurya — product owner; approves product scope and required acceptance decisions |
| Architecture authority | Governs accepted architecture and architecture-impacting amendments |
| Implementation executor | Performs only explicitly authorised packet work |
| Reviewer | Reviews packet evidence and scope compliance |
| Security reviewer | Reviews RLS, trusted operations, Storage, Realtime, secrets, and negative evidence |
| Database/migration reviewer | Reviews schema/data/policy order, transform, rollback, and reconciliation evidence |
| Design reviewer | Applies locked UI/UX change control and validates design traceability |
| Release authority | Reviews readiness and release gates |
| Cutover authority | Provides the separate W7 production authorisation required before cutover |

## Status vocabulary

Draft; Under review; Accepted; Locked; Authorised; In progress; Blocked; Implemented; Verified; Rejected; Rolled back; Superseded.

## Meaning

| Term | Meaning |
|---|---|
| Accepted | A reviewed decision or packet has approval for its documented content. |
| Locked | The accepted scope is stable and changes require change control. |
| Authorised | A named actor may begin the specifically bounded next action. |
| Started | Authorised execution has actually begun and is recorded. |
| Implemented | The approved change exists in the repository/environment. |
| Verified | Required functional, security, rollback, and accessibility evidence passes. |
| Released | Separately authorised deployed/cutover outcome is recorded. |

## Approval requirements

Implementation packet changes require product/reviewer approval; design divergence requires the accepted UI/UX change-control process; architecture-impacting changes require architecture review; database migration, RLS, trusted-operation, Storage-policy, and Realtime changes require database/migration and security review. Wave entry and exit require their documented evidence and reviewers. W7 cutover requires separate cutover authority; no prior acceptance implies it.

## Current execution-package decision

- Execution package acceptance: Complete
- Execution package lock: Complete
- Planning freeze: Active
- Explicit packet authorisation: Still required
- GATE-004: Separate and unsatisfied
- W7 separate production authorisation: Mandatory

Package acceptance and lock establish trusted planning authority. They do not
authorise implementation work, IR-001, a Wave start, deployment, or cutover.
