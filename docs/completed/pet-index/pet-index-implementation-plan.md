# Pet Index Implementation Plan

Status:

- Working implementation plan for retrofitting the approved pet-index direction into the Next.js app.
- Companion to `docs/completed/pet-index/pet-index-enhancement-spec.md`.
- Focused on execution order, file ownership, and data-model impact.

## Milestone Alignment

This plan primarily supports `docs/milestones.md` Milestone 10: **Pet Marketplace Page Refinement**.

Milestone 10 alignment:

- Stage 1 supports the marketplace-index layout refinement goal directly.
- Stage 2 supports filters, sorting, visible URL-state behavior, and browse-surface polish.
- Stage 3 supports pet-card alignment with the broader polished component system.
- Stage 4 supports query/state cleanup so the implemented browse surface matches the approved marketplace rules.
- Stage 5 supports the responsive/accessibility finish expected in Milestone 10 and reinforced again in Milestone 12.

Boundary note:

- Keep `/pets` structured and bespoke to marketplace behavior.
- Do not let browse-page refinement drift into generic page-builder treatment, which Milestone 10 explicitly rejects.

## Purpose

This plan turns the approved pet-index prototype/spec into a staged implementation plan for the production route:

- Route target: `app/(site)/pets/page.tsx`
- Prototype reference: `docs/completed/pet-index/pet-index.html`
- Current production markup reference: `app/(site)/pets/page.tsx`

Use this plan when we shift `/pets` from design review into implementation so the work stays staged, reviewable, and aligned with the approved browsing-first direction.

## Reference Markup

Primary reference files:

- Flat HTML prototype markup: `docs/completed/pet-index/pet-index.html`
- Current route markup: `app/(site)/pets/page.tsx`
- Current filter rail: `components/features/pets/pet-filters.tsx`
- Current sort control: `components/features/pets/sort-control.tsx`
- Current active chips: `components/features/pets/active-filter-chips.tsx`
- Current mobile drawer: `components/features/pets/mobile-filter-drawer.tsx`
- Current pet card: `components/features/pets/pet-card.tsx`
- Homepage card direction: `app/(site)/page.tsx`

Supporting implementation references:

- Index spec: `docs/completed/pet-index/pet-index-enhancement-spec.md`
- Milestone 10 AA checklist: `docs/ongoing/pet-marketplace-milestone-10-aa-checklist.md`
- Page blueprint: `docs/page-blueprints.md` (`/pets` sections)
- Milestone scope: `docs/milestones.md`

## Current State Summary

The current `/pets` page already includes:

- a Sanity-driven top hero/banner
- desktop filter rail
- mobile filter drawer
- active filter chips
- server-driven result count
- sort control
- paginated pet results
- page-builder sections below the results

The approved prototype/spec direction changes or refines:

- remove the top hero/banner
- remove the bottom promo CTA from the prototype direction
- make filters/results the first primary scanning surface
- align `Sort by` with the `Pet type` dropdown pattern
- tighten filter-rail hierarchy and add icons beside each filter heading
- change availability + pickup urgency to clearer stacked button controls
- remove the borrowing-rules filter section
- change household impact to full-width emoji-based minimum filters
- align the index cards to the homepage card pattern
- let the prototype use homepage-card placeholders instead of maintaining a second card design

## Recommended Implementation Order

Keep this staged. Do not refactor the entire browse page in one pass.

### Stage 1 — Route simplification and surface hierarchy

Goal:

- Remove the banner-first structure and make `/pets` feel browse-first immediately.

Scope:

- remove the top hero/banner from `app/(site)/pets/page.tsx`
- let the filter/results layout begin at the top of the route
- review whether page-builder sections remain below results or need spacing changes
- preserve current loader/error/empty behavior

Likely files:

- `app/(site)/pets/page.tsx`

Notes:

- This is the clearest functional shift and should land before filter-control polish.
- No schema changes required.

### Stage 2 — Filter rail control overhaul

Goal:

- Match the approved filter interaction language.

Scope:

- align sort styling to the pet-type dropdown family
- improve availability buttons
- make pickup urgency use the same stacked-button treatment
- remove borrowing rules from the visible rail
- convert household impact controls to full-width emoji rows
- ensure all filter headings have icons
- remove divider-rule styling between groups if the rail still reads clearly

Likely files:

- `components/features/pets/pet-filters.tsx`
- `components/features/pets/sort-control.tsx`
- possibly `components/features/pets/pet-index-state.ts` if filter state changes

Notes:

- This stage should preserve URL-driven behavior.
- Avoid changing query semantics unless necessary.

### Stage 3 — Card alignment and result-grid consistency

Goal:

- Stop maintaining a separate public card language for the index.

Scope:

- align `components/features/pets/pet-card.tsx` with the homepage card direction
- review whether a shared card component should be extracted
- preserve accessibility of full-card linking

Likely files:

- `components/features/pets/pet-card.tsx`
- possibly a new shared card component under `components/features/pets/`
- `app/(site)/page.tsx` only if extraction requires homepage usage updates

Notes:

- Prefer one shared card system with small variations over two visually divergent implementations.

### Stage 4 — Query/state cleanup after UI approval

Milestone note:

- This stage is important for satisfying Milestone 10's expectation that filters, sorting, URL state, and seeded marketplace fields all match the current approved behavior rather than lingering legacy logic.

Goal:

- Remove logic and state that no longer support the approved UI.

Scope:

- remove borrowing-rules / cuddle-policy filtering from the route state if we fully drop it
- remove corresponding query-param handling if approved
- simplify chip rendering and active-filter counts accordingly
- normalize URL defaults and clean query output
- review server-side counts or filter metadata opportunities
- update `sanity/queries/pets.ts` filter logic so runtime behavior matches the approved visible filter model

Likely files:

- `app/(site)/pets/page.tsx`
- `components/features/pets/pet-index-state.ts`
- `components/features/pets/active-filter-chips.tsx`
- `sanity/queries/pets.ts`
- `sanity/lib/loaders.ts`

Notes:

- Do this only after the UI direction is stable.
- If cuddle policy is still needed later, document the decision before reintroducing it into the browse state model.
- Implementation note: the visible `cuddlePolicy` browse state and query handling have now been removed from `/pets`.

### Stage 5 — Accessibility and mobile finish

Goal:

- Make the revised browse page strong on small screens and assistive tech.

Scope:

- add `aria-live` result-count updates where practical
- ensure emoji meters have text equivalents
- review drawer focus/escape/close behavior
- verify no horizontal overflow from full-width emoji rows
- review active-chip clarity after filter simplification

Likely files:

- `components/features/pets/mobile-filter-drawer.tsx`
- `components/features/pets/pet-filters.tsx`
- `components/features/pets/active-filter-chips.tsx`
- `app/(site)/pets/page.tsx`

## Component Ownership Map

Keep route composition separate from filter-control logic.

Likely ownership:

- route composition: `app/(site)/pets/page.tsx`
- filter state helpers: `components/features/pets/pet-index-state.ts`
- filter rail UI: `components/features/pets/pet-filters.tsx`
- pet-type combobox: `components/features/pets/pet-type-filter-preview.tsx`
- mobile filter drawer: `components/features/pets/mobile-filter-drawer.tsx`
- active chips: `components/features/pets/active-filter-chips.tsx`
- sort control: `components/features/pets/sort-control.tsx`
- browse card: `components/features/pets/pet-card.tsx`

## Query, URL, And Filter Semantics

These are the intended browse-page semantics to keep `/pets` and `/pets/[slug]` aligned:

| Field | URL/query behavior | UI behavior |
| --- | --- | --- |
| `petType` | multi-value list | combobox with multi-select chips |
| `availabilityStatus` | multi-value list | stacked buttons |
| `pickupUrgency` | multi-value list | stacked buttons |
| `minChaos` | single numeric minimum | emoji row minimum selector |
| `minMess` | single numeric minimum | emoji row minimum selector |
| `minEnergy` | single numeric minimum | emoji row minimum selector |
| `cuddlePolicy` | transitional only if still present in code | not part of approved visible rail |
| `sort` | single value | native select styled like pet type |
| `page` | single value | pagination only |

Recommended cleanup rule:

- Once the approved rail is stable, remove any hidden query/state branches that no longer map to visible product behavior.

## Seed And Demo Data Alignment

The flat prototype, seed JSON, and production implementation should stay aligned on the same controlled values for:

- `availabilityStatus`
- `pickupUrgency`
- `temperament`
- `cuddlePolicy`
- `chaosLevel`
- `messRisk`
- `energyLevel`

The browse page should not invent prototype-only enum values that diverge from the Sanity model.

## Data And State Decision Checklist

Before removing or changing state/query behavior, confirm:

1. `Borrowing rules` should be treated as removed from the approved browse UI, not merely visually hidden.
2. `cuddlePolicy` may remain queryable only as transitional implementation debt; the target state is removal from the route/filter model unless product direction changes.
3. Availability and pickup urgency should remain multi-select unless product testing shows a strong reason to narrow them.
4. Server-side counts are optional polish, not a blocker.
5. Homepage and index cards should converge on one query/card language where practical.

## Accessibility Requirements

Every stage should preserve or improve:

- keyboard access for all filter controls
- visible focus states across rail, chips, drawer, and pagination
- meaningful labels on emoji-based household impact controls
- accessible naming for sort and mobile drawer controls
- safe reading order on mobile and desktop
- reduced-motion respect for drawer transitions

## Verification Plan

Per-stage verification should include:

- mobile and desktop visual QA of `/pets`
- keyboard pass for filter rail, drawer, sort, chips, and pagination
- confirm shareable URLs still represent the filter state correctly
- confirm empty state still behaves correctly after filter removals
- formal `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` after the user approves the implementation direction

## Suggested First Execution Slice

When implementation begins, the best first slice is:

1. Stage 1 route simplification
2. Stage 2 filter-rail control overhaul
3. no card extraction yet
4. no state-model cleanup yet

Reason:

- It gets the page structurally correct first.
- It makes the approved direction visible quickly.
- It avoids mixing route composition, UI overhaul, and state cleanup in one pass.

## Acceptance Criteria For The First Slice

The first reviewable slice should be considered successful if:

- `/pets` no longer shows the hero banner
- the page begins with filters/results
- `Sort by` visually matches the pet-type control family
- availability and pickup urgency use the approved clearer button treatment
- household impact uses the approved full-width emoji rows
- no mobile overflow or broken drawer behavior is introduced
- the changed files remain easy to scan and own
