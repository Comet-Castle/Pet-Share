# Milestone Plans

This folder holds the granular, iterable step list for each milestone — the
checkable plan an AI agent (or a human) works through, separate from the
high-level scope in [`docs/milestones.md`](../milestones.md).

## Why this exists

`docs/milestones.md` defines each milestone's **goal, scope, and exit criteria**.
It is the controlling scope and should stay relatively stable and readable.

Detailed, line-anchored checklists (audit findings, per-step task lists) go stale
fast and bloat `milestones.md` every time it is read. Keeping them here means:

- The main milestones file stays scannable.
- Each plan gives an at-a-glance view of exactly where a milestone stands.
- Agents read only the one plan they're working through, not the whole roadmap.

## Source of truth for status

**A milestone's status is the folder its plan file lives in.** The status icons in
`docs/milestones.md` are a convenience for readers and must be kept pointing at the
matching folder — but if they ever disagree, the folder wins.

| Folder | Meaning | Icon in `milestones.md` |
| --- | --- | --- |
| `pending/` | Planned, not started | ⚪ |
| `active/` | In progress | 🟢 |
| `completed/` | Done and verified | ✅ |

## Conventions

- One file per milestone, named `m<number>.md` (e.g. `m12.md`).
- Each plan starts with a `Status:` line and a link back to its milestone section.
- Use `- [ ]` / `- [x]` checkboxes so progress is visible.
- Plans start in `pending/` (M12 onward; earlier milestones shipped before this
  folder existed and are summarized in `milestones.md` only).

## Lifecycle

1. **Create** the plan in `pending/` when a milestone is scoped.
2. **Move** it to `active/` when work starts; set the milestone icon to 🟢.
3. **Iterate**, checking items off as they land.
4. **Move** it to `completed/` when every item is resolved and verified; set the
   icon to ✅.

Moving is a plain `git mv`; the file content carries its own history.
