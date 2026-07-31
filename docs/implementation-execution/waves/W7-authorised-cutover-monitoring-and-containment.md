# W7 — Authorised cutover, monitoring, and containment

## Status and authorisation

- Status: Draft
- Implementation authorised: No
- Wave complete: No

## Wave objective

Final freeze, migration execution, security activation, smoke/isolation evidence, reconciliation, incident handling, retention, and containment.

## IR packets

- [IR-019 — Separately authorized cutover](../packets/IR-019-separately-authorized-cutover.md)
- [IR-020 — Monitoring and containment](../packets/IR-020-monitoring-and-containment.md)

## Accepted entry conditions

GATE-024 separate production authorisation and GATE-025 cutover inputs, in
addition to all prior Wave exits. Package or packet review never supplies this
authority.

## Internal execution order

IR-019 separately authorised cutover precedes IR-020 monitoring and containment.

## Parallel work boundaries

No production-affecting parallelism is presumed. Monitoring preparation can exist before cutover but activation/containment decisions follow authorised release governance.

## Shared schema changes

No new schema design. IR-019 would use the separately authorized final migration/policy/Storage/Realtime plan; IR-020 observes, reconciles, contains, or directs an approved rollback/forward-fix.

## Shared frontend changes

Only locked-design implementation smoke is relevant. Documentation acceptance cannot authorize code or visual change.

## Shared security changes

Atomic security activation; two-account/two-Group isolation; inactive/removed denial; private-object/subscription scope; no browser service-role route; no insecure legacy re-enable during containment.

## Shared test fixtures

Final freeze/delta/reconciliation, migration and security smoke, two-Group release smoke, R-02 evidence, monitoring/alert/containment drill, retention, and release decision artifacts.

## Integration checkpoints

Review packet interfaces, shared repository paths, design traceability, R-02 obligations, test fixtures, and rollback assumptions before a dependent packet starts.

## Rollback checkpoint

Use the approved cutover recovery decision; never re-enable insecure legacy access merely to restore service.

## Required evidence and Wave exit gate

Deployed reconciliation, monitoring, retention, and secured legacy-containment evidence.

## Downstream consumers

Final release authority and operations records.

## Known risks

This repository does not establish production access, environment topology, backup posture, or deployment authority.

## Stop conditions

Abort for any security activation failure, two-Group isolation failure, smoke-test failure, or unavailable approved recovery path.

## Implementation-authorisation status

No — separate production authorisation required. Packet acceptance is not cutover authorisation, and documentation acceptance alone cannot deploy.


Separate production authorisation is required. Packet acceptance is not cutover authorisation, and no deployment may occur from documentation acceptance alone.
