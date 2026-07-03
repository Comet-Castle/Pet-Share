# Pet Index Stage 1 Task List

Status:

- Concrete first execution slice for `/pets`.
- Companion to `docs/completed/pet-index/pet-index-implementation-plan.md`.

## Goal

Bring the current production pet-index route closer to the approved prototype direction **without** doing the deeper card extraction or state cleanup yet.

Route target:

- `app/(site)/pets/page.tsx`

Primary reference markup:

- `docs/completed/pet-index/pet-index.html`

## Files In Scope

Primary:

- `app/(site)/pets/page.tsx`
- `components/features/pets/pet-filters.tsx`
- `components/features/pets/sort-control.tsx`

Secondary review only if needed:

- `components/features/pets/mobile-filter-drawer.tsx`
- `components/features/pets/active-filter-chips.tsx`
- `components/features/pets/pet-index-state.ts`

Out of scope for this slice:

- homepage/index card extraction
- full `PetCard` redesign/refactor
- query-layer count expansion
- state-model removal of cuddle policy
- lower CMS section redesign

## Stage 1 Deliverables

### 1. Remove The Hero / Banner

Target file:

- `app/(site)/pets/page.tsx`

Tasks:

- [ ] Remove the top hero section
- [ ] Remove any now-unused hero-derived summary variables if no longer needed
- [ ] Let the filter/results layout become the first main route surface
- [ ] Recheck top spacing after removal

Acceptance notes:

- No large empty gap remains at the top of the page
- The page still feels intentionally framed, not abruptly cut off

### 2. Sort Control Alignment

Target file:

- `components/features/pets/sort-control.tsx`

Tasks:

- [ ] Review the pet-type control visual language
- [ ] Update sort control shell, spacing, and chevron treatment to feel like the same family
- [ ] Keep native `select` behavior intact

Acceptance notes:

- Sort remains keyboard accessible
- Sort changes still preserve current URL behavior

### 3. Availability + Pickup Controls

Target file:

- `components/features/pets/pet-filters.tsx`

Tasks:

- [ ] Replace availability pill cluster with clearer stacked buttons
- [ ] Replace pickup urgency pill cluster with the same stacked-button treatment
- [ ] Ensure visual states remain obvious
- [ ] Keep link/button semantics and shareable URLs intact

Acceptance notes:

- Controls read more clearly than the old pill layout
- Buttons wrap/stack safely in mobile drawer and desktop rail

### 4. Remove Borrowing Rules From The Visible Rail

Target file:

- `components/features/pets/pet-filters.tsx`

Tasks:

- [ ] Remove the borrowing-rules / cuddle-policy group from the visible rail UI
- [ ] Confirm the rail still feels balanced after removal
- [ ] Leave deeper state/query cleanup for a later stage unless explicitly required

Acceptance notes:

- No visual gap or awkward logic remains in the rail
- Current route still functions without immediate state-model refactor

### 5. Household Impact Redesign

Target file:

- `components/features/pets/pet-filters.tsx`

Tasks:

- [ ] Replace segmented bars with full-width emoji rows
- [ ] Use approved emoji set:
  - [ ] Chaos `😈`
  - [ ] Mess `💩`
  - [ ] Energy `⚡`
- [ ] Keep minimum-filter logic (`3+`, `4+`, etc.)
- [ ] Add or preserve accessible text equivalents

Acceptance notes:

- No horizontal overflow
- Active state is visually obvious
- Emoji rows still feel polished, not sloppy

### 6. Filter Heading Cleanup

Target file:

- `components/features/pets/pet-filters.tsx`

Tasks:

- [ ] Ensure every filter heading has an icon
- [ ] Remove divider-rule styling between groups if readability remains strong
- [ ] Recheck spacing rhythm between groups

Acceptance notes:

- Rail feels cleaner and less boxed-in
- Sections remain easy to scan without the dividers

## Data Boundaries For Stage 1

Use the current route/query data and current URL model as much as possible.

Already available:

- pet type filters
- availability filters
- pickup urgency filters
- cuddle policy state
- minimum chaos/mess/energy values
- total count
- sorted/paginated result grid

Do not change the query/state model in this slice unless the UI changes cannot land without it.

## Suggested Review Sequence

1. Remove the hero in `app/(site)/pets/page.tsx`
2. Update sort control in `components/features/pets/sort-control.tsx`
3. Update the filter rail in `components/features/pets/pet-filters.tsx`
4. Smoke-test mobile drawer behavior
5. Hand back for review before card-alignment work

## Stage 1 Review Checklist

- [ ] `/pets` is visually closer to `docs/completed/pet-index/pet-index.html`
- [ ] the hero is gone
- [ ] sort matches the pet-type control family
- [ ] availability and pickup urgency are clearer
- [ ] borrowing rules are no longer visible
- [ ] household impact uses the approved emoji rows
- [ ] mobile drawer still works
- [ ] no schema or query changes were introduced
