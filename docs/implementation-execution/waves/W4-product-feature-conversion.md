# W4 — Product feature conversion

## Status and authorisation

- Status: Draft
- Implementation authorised: No
- Wave complete: No

## Wave objective

Scoped client data layer, locked UI contracts, safe errors, archive/read-only handling, R-02 implementation evidence, and no stale previous-Group display.

## IR packets

- [IR-011 — Active Group and data access](../packets/IR-011-active-group-and-data-access.md)
- [IR-012 — Events, audiences and Todos](../packets/IR-012-events-audiences-and-todos.md)
- [IR-013 — Documents and scan](../packets/IR-013-documents-and-scan.md)
- [IR-014 — Finance and Settlements](../packets/IR-014-finance-and-settlements.md)
- [IR-015 — FX and destination](../packets/IR-015-fx-and-destination.md)

## Accepted entry conditions

W3 scoped foundations pass.

## Internal execution order

IR-011 Active Group/data access is serial first. IR-012 Events/Todos, IR-013 Documents, IR-014 Finance, and IR-015 FX/destination may use parallel lanes only after their stated dependencies.

## Parallel work boundaries

Events/Todos, Documents, Finance, and FX/destination may proceed in parallel after IR-011; shared contracts and changed files require an explicit integration checkpoint.

## Shared schema changes

Plan Group-scoped Event/Todo, private document, normalized finance/settlement, and destination/timezone/accounting-FX data contracts on the approved W1–W3 foundations.

## Shared frontend changes

IR-011 owns the Active Group/data boundary before Events/Todos, Scan/Documents, Split/Finance, and FX/Destination lanes touch shared App, hooks, modals, tabs, or UI primitives. Locked Screen/Component IDs and 480px shell are inputs, not assets to modify here.

## Shared security changes

No stale prior-Group display; archived read-only/denial behavior; Event audiences are presentation not confidentiality; documents private; finance exact; server-confirmed trusted writes; no client authority.

## Shared test fixtures

Group switching/loading/error/empty/read-only/offline/reconnect/stale cases, document orphan/reconciliation, EQ-01/SET-01/USD-01, timezone and FX fallback, multi-tab/two-Group isolation, and applicable R-02 running-build checks.

## Integration checkpoints

Review packet interfaces, shared repository paths, design traceability, R-02 obligations, test fixtures, and rollback assumptions before a dependent packet starts.

## Rollback checkpoint

Feature-specific rollback must preserve Group boundaries, exact finance history, and reconciled document state.

## Required evidence and Wave exit gate

FP/UI/TC implementation evidence plan, fixture coverage, safe incomplete-path disablement, and no active design divergence.

## Downstream consumers

W5 transforms, integrated parity/security evidence, and governance evidence.

## Known risks

Current tabs directly query global tables and mutate directly; exact finance and document reconciliation need server-confirmed boundaries.

## Stop conditions

Stop for global query, name authority, float accounting, public document route, or a design-contract contradiction.

## Implementation-authorisation status

No
