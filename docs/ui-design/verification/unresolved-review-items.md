# Unresolved review items

## Design-blocking items

None.

R-01 is Closed: all 462 Screen IDs have exactly one primary `irOwner` from
IR-001 through IR-022, one roadmap-consistent `wave` from W1 through W7, and
valid related IR references where they are genuinely required.

## Implementation-verification items

R-02 — **Specified; implementation verification required.**

Static design acceptance and lock do not establish running-build compliance.
Each applicable IR execution packet must carry the relevant R-02 evidence:

- measured colour contrast;
- keyboard traversal, focus entry, focus trapping, and focus restoration;
- reduced-motion behaviour;
- screen-reader loading and success/error announcements;
- realtime announcement behaviour;
- minimum touch-target measurement; and
- native safe-area behaviour where relevant.

R-02 does not block static design acceptance or design lock. It becomes
mandatory implementation acceptance evidence and must not be represented as
measured until validated on a running build.

## Deferred items

Background parse continuation, automatic semantic duplicate detection,
resumable upload, per-reader display-currency preference, participant emoji
selection, retention/purge/anonymisation, Owner review queues for contested
claims, Viewer or other additional roles, permanent Group deletion, and
in-app accounting-currency conversion remain deferred product or design scope.

## Result

Design-blocking review items: 0. Architecture conflicts open: 0. R-01:
Closed. R-02 remains the sole implementation-verification item.
