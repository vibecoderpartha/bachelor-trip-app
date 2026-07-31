# IR-001 Remaining Blocker Resolution — F-IR001-VER-005

## Resolution status

**Resolved in hosted CI** on 2026-07-31. This record is not an IR-001
verification decision and does not promote any gate or delivery status.

## Original failure

- Failed workflow: `30622965721`
- Hosted commit: `5f73f5c45fe87bf24a5815baf9c165fb2c9e48b3`
- Job: Database and RLS evidence
- Failure phase: initial normal, `same-scope-account-a`
- Safe classification: `assertion-failed` with
  `context-unavailable`; exact cleanup was confirmed.

The former probe selected a JSON-looking line from ordinary `psql` output and
returned the same safe fallback for a display variation, malformed record, or
client/query error. The prior safe artifact intentionally did not retain raw
client stdout/stderr, so its exact raw stream cannot be reconstructed without
breaking the evidence redaction boundary.

## Correction and validation

- Commit: `7a566338248b0df7ac42414dbc664138bee9c655`
  (`fix(ir-001): resolve hosted database probe`)
- Result boundary: `COPY (SELECT …) TO STDOUT WITH (FORMAT text)` emits one
  JSON record; quiet `psql` and strict parsing reject command status, multiline
  output, multiple records, and malformed shapes.
- Semantic boundary: all six same-scope and denial assertions are unchanged.
- Regression coverage: one-record JSON accepts surrounding CRLF/LF; the former
  display-stream shape is rejected; malformed and duplicate records are
  rejected.
- Local validation: clean install, type checks, two 23-test unit runs, build,
  browser evidence, normal → controlled-failure → recovery database evidence,
  two manifests, exact cleanup, checksums, path/secret scans, and ignore checks
  passed.
- Hosted validation: run `30624184154` on
  `review/ir-001-consolidated-evidence` at `7a566338…` passed both jobs. The
  database lane passed normal, controlled failure, recovery, manifest, exact
  cleanup, and upload.

## Hosted artifact review

The database artifact contains exactly:

- `normal-result.json`
- `controlled-failure-result.json`
- `recovery-result.json`
- `evidence-manifest.json`

The three records have matching sequence identity and confirmed cleanup. Their
manifest SHA-256 and byte counts matched downloaded files. No hosted failure
diagnostic, connection material, raw log, absolute filesystem path, secret-like
value, or Docker identifier was present. Artifact retention is 14 days; the
successful database artifact expires 2026-08-14.

## Rollback

Revert `7a566338248b0df7ac42414dbc664138bee9c655` to restore the previous
result boundary. That rollback would restore the ambiguous hosted result
handling and is not an acceptable final evidence state.

## Status and handoff

IR-001 remains **In progress**. GATE-007 through GATE-010 remain unchanged;
GATE-011 remains unsatisfied; W1 exit remains blocked; IR-002 remains
unauthorised; no product feature, target schema, migration, production RLS,
Storage, Realtime, agent-initiated deployment, merge, production credential,
or external Supabase resource was used. The existing Vercel PR-preview status
check reported a preview deployment after the authorised review-branch push;
it is outside the IR-001 workflow and was not a production deployment or
cutover.

Restart one final independent IR-001 verification from mandatory preflight at
the clean local documentation head. Re-run all local, audit, governance, and
hosted-CI review sections; do not infer a gate decision from this correction.
