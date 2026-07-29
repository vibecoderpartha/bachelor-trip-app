# IR-004 — Auth, Profile, session
## 1. Status and ownership

- Status: Draft
- Wave: W2
- Primary implementation owner: Not assigned unless documented
- Review owners: architecture, security, database/migration, design, and product reviewers as applicable
- Implementation authorised: No

## 2. Objective

Replace persona/PIN authority with Supabase Auth session authority, Profile lifecycle, verification/reset continuation, session restoration, and privacy-safe errors.

## 3. Authoritative inputs

ADR-0002; docs/architecture/auth-groups-and-invitations.md; security model; roadmap IR-004; accepted AUTH design family.

The accepted documents govern; this Draft packet does not restate or amend their decisions.

## 4. Entry gate

Verified exit evidence for IR-001, IR-002., clean repository, accepted design mapping, and no unresolved prerequisite security or architecture contradiction.

## 5. Dependencies

- Direct IR dependencies: IR-001, IR-002.
- Schema dependencies: target schema/data contracts approved by owning earlier packets where applicable
- Auth dependencies: session-derived actor and current membership where applicable
- Trusted-operation dependencies: IR-008 for any authoritative atomic action
- Design dependencies: accepted docs/ui-design/manifests/screen-manifest.json and relevant screen contracts
- Test/fixture dependencies: IR-001 capability and packet-specific fixture/evidence plan

## 6. In scope

Draft Auth boundary, Profile lifecycle, session restoration, verification/reset/invitation continuation, expired session, sign-out recovery, and no provider-lifetime promises.

## 7. Explicitly out of scope

Google OAuth or unapproved provider, persona/PIN/Profile authority, actual Auth configuration, or unconfirmed provider lifetime copy.

## 8. Current repository state

src/lib/supabase.ts creates an anon-key client only. src/hooks/useCurrentUser.ts stores `User | null` in local state. src/components/PersonaPicker.tsx chooses from src/constants/users.ts; no Auth helper or route exists.

## 9. Target repository change map

| Path | Action | Purpose | Depends on | Risk | Verification |
|---|---|---|---|---|---|
| src/lib/supabase.ts | Existing file — later extension candidate | Browser anon client | IR-004 | High | Session-bound client review |
| src/hooks/useCurrentUser.ts | Existing file — likely replace | Local persona state | IR-004 | High | Auth/session tests |
| src/components/PersonaPicker.tsx | Existing file — likely retire/replace later | Legacy identity picker | IR-004/IR-011 | High | No-impersonation evidence |
| `Proposed path — verify at packet start: src/features/auth/` | Proposed path | Auth UI/data boundary | IR-004 | Medium | Design and security review |

Every proposed path is deliberately labelled **Proposed path — verify at packet start**. No proposed path is an assertion that it already exists.

## 10. Database and data-model work

Consumes Profile/identity schema planned by IR-002; no schema application in this Draft.

## 11. RLS and authorization work

No policy is written by this Draft. The implementation plan must define same-Group success; unrelated-Group, inactive Member, removed Member, archive-state, and direct-object substitution denial; Owner/Member boundaries; service-role confinement; and frontend non-authority. Any cross-Group success or permissive fallback blocks the packet.

## 12. Trusted operations

No service-role operation for ordinary session. Provider/session actor is validated server-side by later trusted operations.

For every applicable operation, record caller, validated Auth actor, validated current Group relationship and role, transaction boundary, idempotency key, replay/concurrency result, failure response, audit output, service-role use, test evidence, and reconciliation/rollback path.

## 13. Storage work

No Storage work.

## 14. Realtime work

No Realtime work; session change must later trigger authorised subscription reset.

## 15. Frontend implementation

Map AUTH screens and pre-auth shell states; session restoration, verification continuation, reset continuation, expired-session, offline/error states are server-confirmed and preserve safe input behavior.

## 16. Design traceability

Affected Screen IDs: AUTH and pre-auth SHL states assigned to IR-004. Components include input, validation, loading, and session/error variants in the accepted component manifest.

No annotated export creates behavior beyond its accepted contract. Existing Screen IDs, Component IDs, tokens, navigation, and locked states remain stable unless their separate change-control process approves a change.

## 17. Migration and compatibility

M02 no-PIN disposition; legacy persona data cannot become Auth authority.

## 18. Security acceptance

Required evidence includes same-Group success; unrelated-Group denial; inactive and removed Member denial; Owner/Member boundary; direct object/ID substitution denial; replay and race handling where applicable; service-role confinement; secret handling; and audit-safe output. Failure in a required negative case blocks release consumption.

## 19. Functional acceptance

FP-001, TC-001, TC-003, IPE-AUTH-001.

## 20. Automated tests

Use current test tooling only where it exists. Repository inspection found no configured test, lint, database-test, browser-test, or CI runner; any new tooling is a proposed dependency for review under IR-001. Planned coverage may include unit, integration, database/RLS, browser, concurrency, idempotency, migration, rollback, visual-regression, and accessibility automation only after the selected tooling and environment capability are approved.

## 21. Manual verification

Inspect affected locked screen states; keyboard/focus behavior; screen-reader announcements; responsive 480px-shell behavior; offline/reconnect/stale behavior; multi-tab behavior; and two-account/two-Group isolation. Where applicable, inspect archive/removal/current-user-change states and browser/device-specific safe-area/native chooser behavior.

## 22. R-02 accessibility obligations

Applicable running-build evidence must cover contrast measurement, touch-target measurement, keyboard order, visible focus, focus trap, focus restoration, connected errors, reduced motion, screen-reader loading/success/error announcements, realtime announcements, and safe-area behavior where relevant.

**R-02 remains open until verified on the running implementation.**

## 23. Observability

Use structured, audit-safe operation results and failure classification; correlation/reference identifiers; security-event evidence; reconciliation status; and release monitoring where applicable. Exclude passwords, tokens, full Invitation secrets, service-role credentials, private document contents, and unnecessary personal data.

## 24. Rollback and recovery

Define packet boundary, reversible and irreversible work, safe stop, data preservation, schema/application rollback, partial failure handling, reconciliation, and release-blocking conditions before implementation. Do not imply all migrations are reversible.

## 25. Implementation sequence

1. Confirm target Profile contract. 2. Specify session state machine. 3. Define privacy/error evidence. 4. Map AUTH shell screens. 5. Gate IR-007 on session-derived actor only.

Each future step must name its intended outcome, systems/files touched, prerequisite, verification, and rollback point before execution begins.

## 26. Stop conditions

Stop rather than improvise for an architecture or locked-design contradiction, missing fixture, unsafe RLS result, cross-Group access, unreviewed migration ambiguity, unexpected production dependency, impossible rollback, unreviewed design change, or an R-02 defect that blocks the applicable acceptance gate.

## 27. Completion evidence

Before this packet can be Verified, retain reviewed implementation diff/test artifacts, negative security evidence, relevant fixture results, R-02 implementation evidence, rollback/recovery evidence, updated traceability, and an approved packet exit record. Draft status cannot satisfy this gate.

## 28. Open questions

Provider configuration, verification-link lifetime, and environment identity settings are Not established by current repository inspection.

## 29. Packet exit gate

Dependent work may begin only when this packet has its required evidence, rollback conditions, reviewer decision, and an explicit exit record. This Draft packet neither marks the packet complete nor authorises implementation.
