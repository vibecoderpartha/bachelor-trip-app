# Observability and Containment Plan

No telemetry stack, alert channel, retention period, or incident service is
established by repository inspection. This plan therefore specifies required
evidence and containment decisions without asserting implementation.

| Outcome / signal | Owner | Evidence and exclusions | First consuming gate | Containment rule |
|---|---|---|---|---|
| Trusted operation result, idempotency/replay/race class, and audit reference | TOP owner / IR-008 | Correlation/reference, actor/Group validation result, transaction outcome; exclude secrets and full inputs. | Owning W3/W4 packet exit | Stop the operation path on partial/unauthorised result; reconcile from audit record. |
| RLS/Storage/Realtime denial or unexpected cross-Group attempt | IR-007/009/010 | Two-Group negative results, policy/channel/object reference; exclude document contents/URLs. | W3/W5 and GATE-026 | Contain affected target path; never broaden policy or delivery. |
| Document object/metadata orphan, parse, or removal mismatch | IR-013 | Checksum/reference, reconciliation state, no private content. | W4/W5 and GATE-027 | Quarantine pair; no public URL or untracked deletion. |
| Finance/Settlement exactness or reconciliation mismatch | IR-014/016 | Fixture/manifest/checksum/audit-safe totals. | W4/W5 and GATE-027 | Hold logical unit; no float repair or history rewrite. |
| Migration count/checksum/exception/retry outcome | IR-016/017 | Manifest version, source/target counts, quarantine and recovery status. | GATE-021/GATE-023 | Stop transform/rehearsal; preserve source and forward-correct only after review. |
| Freeze, final delta, stale-client, and cutover smoke | IR-018/019 | Runbook decision, writer/delta/smoke results; no credentials. | GATE-025/GATE-026 | Abort/contain rather than route traffic to insecure authority. |
| Post-cutover reconciliation, incident, retention, and legacy disposition | IR-020 | Thresholds, decision, containment/recovery, retention record. | GATE-027 | Keep unsafe legacy access contained; never re-enable public/global/permissive paths. |

Sensitive-data exclusions are passwords, tokens, full Invitation secrets,
service-role credentials, private document contents, permanent public URLs,
unnecessary personal data, and raw provider payloads. Alerting, operational
telemetry implementation, and retention mechanisms remain external W6/W7
inputs; their absence does not create a W1 or IR-001 circular gate.
