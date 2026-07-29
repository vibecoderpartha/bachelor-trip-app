# Accessibility requirements

Two categories throughout: **Designed** — specified and visible in the package exports; **Verify** — requires measurement against a running build and cannot be evidenced by static design exports.

| # | Requirement | Category | Where |
|---|---|---|---|
| 1 | Minimum 44×44 touch target on every interactive control | Designed | Every board; exception E-03 corrects header chips, the Todo delete cross and the Scan toggle |
| 2 | Visible keyboard focus on every focusable control | Designed | Board 06 focus states; exception E-03 |
| 3 | Focus trapping inside modals and sheets | Designed | Board 21 interaction contracts |
| 4 | Focus restoration to the launching control on close or cancel | Designed | Board 21; CFG and MIG editors |
| 5 | Errors programmatically connected to their input | Designed | Board 06; CMP-08, CMP-51 |
| 6 | Screen-reader status for loading, success and error | Designed | CMP-72; boards 07, 18, 20 |
| 7 | Status never signalled by colour alone | Designed | Every badge and pill carries a word; MIG-89 is readable in greyscale |
| 8 | Meaningful alternative text; decorative images intentionally empty | Designed | Exception E-07; decision D-01 |
| 9 | Graceful warm image fallback — no browser broken-image glyph | Designed | Exception E-07; decision D-01 |
| 10 | Accessible names on icon-only controls | Designed | Exception E-04 |
| 11 | Reduced-motion branch for every animation | Designed | Exception E-05; RT-03, MIG-15 |
| 12 | Notification timing long enough to perceive; outcome also in durable state | Designed | CMP-64; board 18 |
| 13 | No focus theft from background realtime updates | Designed | RT-12, RT-17, RT-21; board 22 |
| 14 | Content removed before a permission or unavailable state is drawn | Designed | RT-33, RT-55; CMP-21 |
| 15 | List and table semantics where tabular data is presented | Designed | Boards 15, 19, 20 matrices; MIG-88, MIG-89, MIG-90 |
| 16 | Long-running status always accompanied by status copy | Designed | CMP-76; MIG-15, MIG-16 |
| 17 | Maintenance and archived states expose absent controls, not disabled ones | Designed | Exception E-11; CMP-74 |
| 18 | Measured contrast ratios against WCAG thresholds | **Verify** | Tertiary 0.38 and quaternary 0.18 text; exception E-06 |
| 19 | Measured keyboard traversal order on a real build | **Verify** | Whole package |
| 20 | Measured reduced-motion behaviour on a real device | **Verify** | Whole package |
| 21 | Measured screen-reader announcement behaviour | **Verify** | Boards 18 and 20 in particular |

Items 18–21 are tracked together as review item **R-02**. The package does not claim measured production compliance from static exports.

## Announcement politeness

| Situation | Politeness | Reason |
|---|---|---|
| Background list or value update | Polite | The person is not blocked; interrupting them is the harm |
| Loading and progress | Polite | Repeated status must not preempt |
| Save success | Polite | Outcome is also in durable screen state |
| Validation error on submit | Polite, against the field | The person is already at the control |
| Access removed mid-action | **Assertive** | The current action can no longer succeed |
| Form can no longer be saved | **Assertive** | Continuing would waste the person's work |
| Release-blocking migration failure | **Assertive** | The person must stop and not retry |
