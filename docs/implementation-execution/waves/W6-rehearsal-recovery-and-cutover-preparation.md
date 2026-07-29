# W6 — Rehearsal, recovery, and cutover preparation

## Status and authorisation

- Status: Draft
- Implementation authorised: No
- Wave complete: No

## Wave objective

Isolated representative rehearsal, failure injection, recovery, approval record, maintenance/freeze, final-delta, stale-client, and secret checks.

## IR packets

- [IR-017 — Representative rehearsal and recovery](../packets/IR-017-representative-rehearsal-and-recovery.md)
- [IR-018 — Secured cutover preparation](../packets/IR-018-secured-cutover-preparation.md)

## Accepted entry conditions

W5 exit evidence and current gate ledger, plus GATE-022: an isolated
representative rehearsal environment, safely handled snapshot, recovery/backup
capability, and retention owner. Production authority is not an entry input.

## Internal execution order

IR-017 representative rehearsal/recovery evidence precedes IR-018 freeze, delta, and cutover preparation.

## Parallel work boundaries

Monitoring-plan refinement may be prepared beside rehearsal, but no cutover preparation may overtake failed recovery evidence.

## Shared schema changes

Use reviewed migration units only in an isolated rehearsal environment. No production schema/data action, cutover, or policy activation is authorized by W6 or by this Draft.

## Shared frontend changes

Verify only implemented locked contracts for maintenance, recovery, migrated Bali Group, connection, error, and read-only states. A discrepancy invokes design change control.

## Shared security changes

Rehearsal must retain Group/RLS/Storage/Realtime isolation through maintenance, stale client, failure injection, rollback, recovery, and secret-boundary checks.

## Shared test fixtures

Representative snapshots, repeated rehearsals, timing, S01–S13/S18 where applicable, final-delta simulations, two-Group smoke, recovery/rollback evidence, and available R-02 implementation evidence.

## Integration checkpoints

Review packet interfaces, shared repository paths, design traceability, R-02 obligations, test fixtures, and rollback assumptions before a dependent packet starts.

## Rollback checkpoint

Remain on secured source and choose an approved forward-fix or rollback plan; no cutover on failure.

## Required evidence and Wave exit gate

Representative recovery and freeze/delta evidence; production remains unauthorised.

## Downstream consumers

W7 separately authorised release.

## Known risks

Backup/recovery capability, maintenance window, deployment access, and representative snapshot availability are not established.

## Stop conditions

Stop for unproven recovery, impossible rollback, unresolved release blocker, or missing final authority.

## Implementation-authorisation status

No
