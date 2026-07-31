# Security Verification Plan

This is a Draft verification matrix, not evidence that a policy or operation
exists. It defines 144 planned case slots: 18 security areas times eight
mandatory cases. Each slot requires an audit-safe result, owning-packet test
evidence, and IR-021 rollup before its consuming release gate. `A` means an
explicit allowed result under the stated predicate; `D` means an explicit deny
without metadata leak; `O` means Owner-only; `N/A` is forbidden unless a
reviewer records a source-backed justification.

## Mandatory cases

| Case | Required actor/state and expected outcome |
|---|---|
| 01 | Unauthenticated actor: `D`; no route, row, object, channel, or operation authority. |
| 02 | Authenticated non-member/unrelated Group actor: `D`, including a forged Group/row reference. |
| 03 | Active same-Group Member: explicit `A` only for the accepted read/write action. |
| 04 | Active same-Group Owner: `O` only for the accepted Owner action; ordinary Member equivalent must deny. |
| 05 | Inactive Member or stale membership: `D` for write and subscription; any documented historical read must be separately asserted. |
| 06 | Removed Member: `D`, including cached/stale client state. |
| 07 | Archived Group: accepted read-only or `D` result is explicit; ordinary write, Invitation acceptance, and subscription mutation deny. |
| 08 | Direct ID/Storage-object substitution and elevated boundary: `D` for substituted authority; any service-role path is narrow, server-only, actor/Group validated, and never browser-exposed. |

## 144-slot matrix

| Security area / owner | 01 unauthenticated | 02 non-member | 03 active Member | 04 active Owner | 05 inactive | 06 removed | 07 archived | 08 substitution / elevated boundary |
|---|---|---|---|---|---|---|---|---|
| Auth — IR-004 | AUTH-01 D | AUTH-02 D | AUTH-03 A session only | AUTH-04 N/A justified | AUTH-05 D stale session | AUTH-06 D terminated session | AUTH-07 D no Group inference | AUTH-08 D forged actor; no elevated route |
| Profiles — IR-004/007 | PRO-01 D | PRO-02 D | PRO-03 A permitted own presentation action | PRO-04 O only if accepted profile administration exists | PRO-05 D | PRO-06 D | PRO-07 explicit read-only/D | PRO-08 D substituted profile/Auth ID |
| Groups — IR-003/005/007 | GRP-01 D | GRP-02 D | GRP-03 A membership-scoped read | GRP-04 O lifecycle action | GRP-05 D | GRP-06 D | GRP-07 read-only/D, no normal selection | GRP-08 D forged Group ID/elevated bypass |
| memberships — IR-005/007 | MEM-01 D | MEM-02 D | MEM-03 A own permitted state/read | MEM-04 O lifecycle transition | MEM-05 D stale relation | MEM-06 D | MEM-07 D ordinary lifecycle | MEM-08 D target/member substitution |
| Invitations — IR-005/007 | INV-01 minimal inspection only or D | INV-02 D recipient mismatch | INV-03 A only accepted continuation | INV-04 O create/revoke | INV-05 D | INV-06 D | INV-07 D acceptance | INV-08 D replay/secret substitution |
| Participants — IR-006/007 | PAR-01 D | PAR-02 D | PAR-03 A same-Group reference/read | PAR-04 O only accepted lifecycle control | PAR-05 D authority | PAR-06 D authority | PAR-07 explicit historical read/D | PAR-08 D cross-Group/claim-ID substitution |
| Events — IR-012/007 | EVT-01 D | EVT-02 D | EVT-03 A same-Group accepted action | EVT-04 O only accepted configuration/lifecycle exception | EVT-05 D write | EVT-06 D | EVT-07 read-only/D; no write | EVT-08 D Event/Group/audience substitution |
| Todos — IR-012/007 | TOD-01 D | TOD-02 D | TOD-03 A only current Participant same-Group action | TOD-04 O no extra authority unless accepted | TOD-05 D | TOD-06 D | TOD-07 read-only/D; no write | TOD-08 D forged Participant/Todo ID |
| expenses — IR-014/007 | EXP-01 D | EXP-02 D | EXP-03 A read/accepted request | EXP-04 O only accepted lifecycle control | EXP-05 D write | EXP-06 D | EXP-07 read-only/D; no write | EXP-08 D Expense/Group ID substitution |
| payer contributions — IR-014/007 | PAY-01 D | PAY-02 D | PAY-03 A only through complete finance unit | PAY-04 O no implicit finance privilege | PAY-05 D | PAY-06 D | PAY-07 history read-only/D | PAY-08 D Participant/contribution substitution |
| participant shares — IR-014/007 | SHR-01 D | SHR-02 D | SHR-03 A only through complete finance unit | SHR-04 O no implicit finance privilege | SHR-05 D | SHR-06 D | SHR-07 history read-only/D | SHR-08 D Participant/share substitution |
| settlements — IR-014/007 | SET-01 D | SET-02 D | SET-03 A authorized debtor/recorder request | SET-04 O no payment authority | SET-05 D | SET-06 D | SET-07 history read-only/D | SET-08 D party/recorder/Group substitution |
| documents — IR-009/013/007 | DOC-01 D | DOC-02 D | DOC-03 A validated same-Group metadata action | DOC-04 O only accepted lifecycle control | DOC-05 D write | DOC-06 D | DOC-07 read-only/D; no normal mutation | DOC-08 D metadata/Event/object substitution |
| Storage — IR-009/007 | STO-01 D | STO-02 D | STO-03 A private current-authorized object action | STO-04 O only accepted retention/lifecycle action | STO-05 D | STO-06 D | STO-07 read-only/D per policy | STO-08 D guessed object/public URL; no browser service role |
| Group configuration — IR-003/015/007 | CFG-01 D | CFG-02 D | CFG-03 A permitted read only | CFG-04 O validated change | CFG-05 D write | CFG-06 D | CFG-07 read-only/D; no ordinary edit | CFG-08 D Group/config/version substitution |
| Realtime — IR-010/007 | RT-01 D | RT-02 D | RT-03 A authorized current Group delivery | RT-04 O no role bypass | RT-05 D and unsubscribe | RT-06 D and unsubscribe | RT-07 D or accepted read-only delivery | RT-08 D channel/row substitution; no stale elevated fan-out |
| migration — IR-016/017/007 | MIG-01 D | MIG-02 D source access | MIG-03 A only reviewed isolated actor | MIG-04 O approval does not grant row authority | MIG-05 D | MIG-06 D | MIG-07 controlled read-only/D | MIG-08 D forged manifest/service-role input |
| archive/restore — IR-005/007 | ARC-01 D | ARC-02 D | ARC-03 A read-only only where accepted | ARC-04 O trusted archive/restore | ARC-05 D | ARC-06 D | ARC-07 A/D as lifecycle result; writes deny | ARC-08 D Group/lifecycle substitution |

## Evidence and release-blocking rules

| Blocker ID | Failure that is release-blocking | Owner | Required before |
|---|---|---|---|
| SEC-B01 | Any cross-Group/non-member success, including a direct ID substitution. | IR-007 with owning feature packet | W3/W4 exit and W7 cutover |
| SEC-B02 | Inactive Member write or subscription success. | IR-007, IR-010, owning mutation packet | W3/W4 exit and W7 cutover |
| SEC-B03 | Removed Member access, stale cached view, or delivery success. | IR-007, IR-010, IR-011 | W3/W4 exit and W7 cutover |
| SEC-B04 | Public document/object access or a public URL becoming authority. | IR-009, IR-013 | W3/W4 exit and W7 cutover |
| SEC-B05 | Unauthorised trusted-operation success, replay authority, or partial atomic outcome. | IR-008 and TOP owner | Owning packet exit and W7 cutover |
| SEC-B06 | Service-role secret exposure, browser route, broad proxy, or unvalidated elevated caller. | IR-008, IR-013 | W2/W4 exit and W7 cutover |
| SEC-B07 | Partial security activation, permissive transition, global query/channel, or a waived negative case. | IR-007, IR-009, IR-010, IR-016 | W2/W5 exit and W7 cutover |

The fixture baseline is two authenticated accounts and two unrelated Groups,
with active Owner, active Member, inactive Member, removed Member, and
archived-Group states. All evidence is audit-safe: it contains neither service
role credentials, Invitation secrets, private document contents, nor permanent
public URLs.
