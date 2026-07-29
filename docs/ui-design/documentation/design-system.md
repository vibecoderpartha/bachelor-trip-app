# Design system

Every value here is either lifted from the current application and the accepted baseline audit, or explicitly labelled. Classification: **Confirmed** (in current source), **Extended** (new for multi-user), **Corrected** (source behaviour changed by an approved exception), **Deferred** (named and not designed).

## Colour

| Token | Value | Use | Class |
|---|---|---|---|
| Base | `#0F0B08` | Application background, every frame | Confirmed |
| Page base | `#080604` | Board canvas behind frames | Confirmed |
| Elevated surface | `#16110D` | Toasts, anchored menus, raised sheets | Confirmed |
| Surface wash | `rgba(245,241,235,0.035)` | Cards, rows, panels | Confirmed |
| Surface wash strong | `rgba(245,241,235,0.04)` | Inputs, chips | Confirmed |
| Hairline | `rgba(245,241,235,0.08)` | Borders, dividers | Confirmed |
| Hairline strong | `rgba(245,241,235,0.16)` | Input borders, quiet emphasis | Confirmed |
| Text primary | `#F5F1EB` | Headings, values | Confirmed |
| Text secondary | `rgba(245,241,235,0.62)` | Body copy | Confirmed |
| Text tertiary | `rgba(245,241,235,0.38)` | Metadata, labels | Confirmed |
| Text quaternary | `rgba(245,241,235,0.18)` | Matrix "not applicable" only | Confirmed |
| Accent | `#FF8B4D` | Primary action, active tab, links | Confirmed |
| Accent hover | `#FFA86B` | Link hover | Confirmed |
| Success | `#00FFD1` | Confirmed outcomes, evidence | Confirmed |
| Caution | `#FFD600` | Warnings, stale state, held items | Confirmed |
| Destructive | `#FF2D78` | Destructive actions, failures | Confirmed |
| Unclaimed neutral | `#C8B8A6` | Unclaimed participants | Extended (E-09) |

Tertiary text at 0.38 and quaternary at 0.18 carry contrast risk and are recorded as exception **E-06**. Quaternary is used only for a non-essential matrix glyph that is duplicated by position.

### Participant accents

Five hues exist in source, one per seeded persona, and the migrated five keep them. Additional participants use the warm neutral `#C8B8A6` with a dashed ring, an initial and the literal word UNCLAIMED. **Colour never communicates authority or role** — that is exception E-09 and it holds across every board.

## Typography

| Family | Role | Sizes in use |
|---|---|---|
| Fraunces (variable, `opsz` 96, `SOFT` 30, `wght` 400) | Display: board headings, screen titles, Group name, tab labels | 32 / 26 / 22 / 20 / 19 / 16 / 14 |
| Inter | Interface: body copy, values, buttons, inputs | 15 / 14.5 / 14 / 13.5 / 13 / 12.5 / 12 / 11.5 / 11 |
| Share Tech Mono | Metadata: labels, dates, IDs, currency codes, amounts | 13 / 12 / 11 / 10 / 9.5 / 9 |

Letter-spacing: `-0.025em` on Fraunces display, `-0.01em` on body, `0.10em`–`0.28em` on mono labels by size. Line-height 1.16 on display, 1.5–1.62 on body, 1.35–1.55 on annotation copy.

**Export note.** Fraunces is a variable font and re-measures wider in the PNG export renderer. Annotation titles therefore sit in a full-width block below the Screen ID rather than as a shrink-to-fit flex sibling, so a re-measured title grows the card instead of overprinting the paragraph. Classification: Corrected.

## Spacing, radii, borders

- Mobile gutters 20px; frame padding 20px 16px on card frames, 14px 18px on full-shell bodies.
- Vertical rhythm 6 / 7 / 8 / 10 / 12 / 14 px inside frames; 28px between frames on a board; 34px above a group heading.
- Radii: 999px pills and buttons, 24px device frame, 16px component sheet, 14px raised card, 12px panel and field, 11px inline row, 10px key-value row, 9px matrix row, 6px badge.
- Borders are always 1px hairlines. Tinted borders use the state hue at `59` alpha over a `14`–`1A` fill.

## Transparency, blur, shadow

- Sticky header `rgba(15,11,8,0.78)`, tab bar `rgba(15,11,8,0.92)`, both with `backdrop-filter: saturate(180%) blur(14px)`.
- Modal and sheet backdrop `rgba(8,6,4,0.62)`–`0.66`.
- Exactly two shadows: `0 24px 60px rgba(0,0,0,0.45)` on device frames and `0 12px 30px rgba(0,0,0,0.45)` on toasts and anchored menus. Nothing else casts a shadow.

## Icons and emoji

No icon library. The package uses a small set of system glyphs (chevrons, calendar, lock, archive box, document, offline) and the five seeded participant emoji. Emoji are never decorative and never carry meaning alone. New participants use initials — emoji selection is **Deferred** (D-04).

## Motion

- `spin` 0.9s linear infinite on loading spinners.
- `pulseSoft` 1.6s ease-in-out infinite on skeletons and the reconnecting dot.
- `fadeIn` on transient feedback.
- Nothing else animates. There are no page transitions, no parallax and no scroll-driven effects.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` disables every animation and transition package-wide. Every animated state has a specified static equivalent: the reconnecting pulse becomes a static dot, skeletons hold geometry without pulsing, toasts appear without transition, and migration progress shows step status text. Exception **E-05**.

## Application shell

- One centred column capped at **480px** at every viewport.
- Mobile reference frame **393×852**.
- Sticky translucent header carrying the Group title with a caret, the mono date line, and the current identity chip.
- Sticky five-tab navigation: Trip, Scan, Split, FX, Todo. **No sixth tab is introduced anywhere in the package.**
- Tablet 768 and desktop 1440 centre the same 480px column on the base background. No layout change, no new breakpoint, no separate image exports.

## Accessibility corrections

44×44 minimum touch targets, visible keyboard focus, accessible names on icon-only controls, reduced-motion branches, contrast verification, image fallback, destructive confirmation. Recorded as exceptions E-02 through E-07 and detailed in `accessibility-requirements.md`.

## Copy and voice

Informal but controlled. Light personality is allowed in ordinary successful moments — a renamed trip, a saved display setting. It is not allowed in accounting currency, timezone impact, stale configuration, migrated evidence, validation failure, archival, permission denial, migration or recovery.

Forbidden vocabulary, package-wide: "Global settings", "Workspace admin", "Convert all money", "We fixed the dates", "Automatic destination guide", "Timezone offset", "secret Event", "private Event", "document audience", "Viewer", database and infrastructure terminology, error codes, service names, channel names, migration stage identifiers.
