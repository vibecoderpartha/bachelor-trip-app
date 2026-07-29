# W5 — Migration and integrated evidence

## Status and authorisation

- Status: Draft
- Implementation authorised: No
- Wave complete: No

## Wave objective

Reviewed manifests, checksums, exception/quarantine handling, full FP/UI/TC/IPE evidence, R-02 rollup, and gate-ledger records.

## IR packets

- [IR-016 — Migration transforms and manifests](../packets/IR-016-migration-transforms-and-manifests.md)
- [IR-021 — Integrated parity and security evidence](../packets/IR-021-integrated-parity-and-security-evidence.md)
- [IR-022 — Release governance and lock evidence](../packets/IR-022-release-governance-and-lock-evidence.md)

## Accepted entry conditions

W3–W4 required records and operations complete, GATE-019 read-only
deployed-state/source inventory is reviewed, and GATE-020 exception inventories
are available for IR-016. These are W5 entry conditions; they do not block W1.

## Internal execution order

IR-016 transform and manifest design is serial after its product dependencies. IR-021 joins completed evidence lanes. IR-022 maintains gate evidence throughout and must be current before W6.

## Parallel work boundaries

IR-022 governance recording can run throughout; IR-021 evidence preparation can run after its dependent packet evidence exists. No transform execution overlaps an unresolved security or parity failure.

## Shared schema changes

No new product model. IR-016 sequences approved schema/data/policy/Storage/Realtime transition units and generated-type provenance; IR-022 records gate evidence. No migration is created or run in this Draft.

## Shared frontend changes

No redesign. IR-021 rolls implementation evidence against the locked design mapping and state matrix; any difference follows accepted design change control.

## Shared security changes

Manifest/reconciliation success cannot waive RLS, private Storage, Realtime, Auth, or two-Group negative results. Ambiguous source rows are retained/quarantined, never silently repaired.

## Shared test fixtures

Source manifests/counts/checksums, rerun/idempotency, quarantine, finance/document/participant reconciliation, FP-001–FP-020, UI-01–UI-14, TC/IPE, two-Group, and R-02 evidence rollup.

## Integration checkpoints

Review packet interfaces, shared repository paths, design traceability, R-02 obligations, test fixtures, and rollback assumptions before a dependent packet starts.

## Rollback checkpoint

No production execution. Failed transform units quarantine and retain source evidence; no silent repair.

## Required evidence and Wave exit gate

Transform, reconciliation, traceability, and quarantine evidence design; every retained item mapped or excepted.

## Downstream consumers

W6 rehearsal and readiness.

## Known risks

Production inventory, representative snapshots, participant adjudications, and deployment topology are not established by this repository.

## Stop conditions

Stop for count/checksum mismatch, unreviewed mapping, missing evidence, or any waived security failure.

## Implementation-authorisation status

No
