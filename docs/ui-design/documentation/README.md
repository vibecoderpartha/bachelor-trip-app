# Trip multi-user UI/UX design package

Pre-implementation design package for the multi-user and Group evolution of the existing Trip application.

**Status: UI/UX Design Package Accepted. UI/UX Design Lock Complete. Full UI/UX Design Freeze Complete. Application implementation is not started and is not authorised; execution packets have not yet been created or accepted.**

## Purpose

This package answers what the multi-user product looks like and how it behaves, screen by screen and state by state, before any implementation begins. It is a design artefact: it contains no application production source code, and this repository import changes design documentation and assets only.

## Visual authority hierarchy

1. **Accepted architecture and implementation roadmap** — behaviour, authority and security rules.
2. **Accepted Current UI Baseline** at commit `6067b21` — tokens, spacing rhythm, typography variation settings and state matrices.
3. **Accepted UI/UX design package manifests and indexed exports** — the locked visual and interaction package.

Anything not derived from those three is labelled in the package as an extension, a correction or a deferral. The green enterprise-learning design system attached to this project is ignored entirely (decision O-06).

## Totals

| | Count |
|---|---|
| Screens | 462 |
| Components | 86 |
| Clean PNG exports | 462 |
| Annotated PNG exports | 462 |
| Component PNG exports | 86 |
| Boards | 24 |
| Batches | 8 of 8 |

| Prefix | Screens |
|---|---|
| SHL | 2 |
| AUTH | 11 |
| ONB | 10 |
| GRP | 18 |
| INV | 18 |
| MBR | 15 |
| CLM | 13 |
| PERM | 20 |
| FIN | 47 |
| DOC | 83 |
| CFG | 80 |
| MIG | 90 |
| RT | 55 |

## Folder structure

```
master/          the editable master, the offline standalone copy and its runtime
screens/mobile/  clean/ and annotated/ 2x PNG exports, one pair per screen
components/      one 2x PNG sheet per component
manifests/       screen, component and state manifests; exceptions; open items; conflicts
documentation/   this folder — design system, contracts, traceability, coverage, checklist
verification/    validation report, export audits, unresolved review items
```

## How to review the standalone HTML

Open `master/Trip-Multi-User-Design-Package-standalone.html` in any browser. It is self-contained: no network, no external fonts, no external scripts, no missing dependencies. It contains every board and every batch, and it renders the same design content as the editable master.

The editable master (`master/Trip-Multi-User-Design-Package.dc.html`) needs `support.js` beside it and is the file to edit if the package is revised.

## How to use the exports

- **Clean** exports are the screen alone at 2×, on the 393×852 mobile frame. Use them for visual review and for pasting into review documents.
- **Annotated** exports are the same frame with its annotation card beneath: Screen ID, title, the design rationale, and the board, flow, components and state. Use them for design review and handover conversations.
- Filenames match `cleanExport` and `annotatedExport` in `manifests/screen-manifest.json` exactly. `documentation/export-index.md` lists every file.

## Manifest authority

`manifests/screen-manifest.json` and `manifests/component-manifest.json` are the authority for inventory, naming and export paths. The screen manifest also records one Accepted-roadmap `irOwner`, one roadmap-consistent `wave`, and any genuinely required `relatedIrItems` for every Screen ID. `documentation/screen-contracts.md` is derived from that manifest.

## What this package is not

It does not authorise implementation, migrations, deployment, cutover, or any Wave execution. R-01 roadmap mapping is closed by the Accepted-roadmap traceability audit. **R-02** accessibility requirements are specified but not measured against a running build and remain `Specified; implementation verification required`. See [`../import-record.md`](../import-record.md), [`../acceptance-record.md`](../acceptance-record.md), and [`../design-to-roadmap-review.md`](../design-to-roadmap-review.md).
