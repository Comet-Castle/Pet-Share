# Pet Index Implementation Checklist

Use this as the short execution checklist for `/pets`.

Full plan:

- `docs/completed/pet-index/pet-index-implementation-plan.md`

Reference markup:

- Flat HTML prototype: `docs/completed/pet-index/pet-index.html`
- Current route: `app/(site)/pets/page.tsx`
- Index spec: `docs/completed/pet-index/pet-index-enhancement-spec.md`

## Stage 1 — Route Simplification

- [x] Review `docs/completed/pet-index/pet-index.html` against `app/(site)/pets/page.tsx`
- [x] Remove the top hero/banner from `/pets`
- [x] Let the filter/results layout begin immediately
- [x] Remove or re-space any now-awkward top padding caused by hero removal
- [ ] Verify lower CMS sections still sit comfortably below the result grid
- [ ] Verify mobile and desktop layouts

## Stage 2 — Filter Rail Overhaul

- [x] Align `Sort by` visually with the pet-type control family
- [x] Update availability to the clearer stacked-button treatment
- [x] Update pickup urgency to the same stacked-button treatment
- [x] Remove the borrowing-rules filter section from the visible UI
- [x] Add icons beside every filter heading
- [x] Remove divider-rule styling between filter groups if readability holds
- [x] Convert household impact to full-width emoji rows
- [x] Use approved emoji set:
  - [x] Chaos `😈`
  - [x] Mess `💩`
  - [x] Energy `⚡`
- [x] Preserve URL-driven filtering behavior
- [ ] Verify no overflow in the desktop rail or mobile drawer

## Stage 3 — Card Alignment

- [x] Review homepage card markup/pattern against `components/features/pets/pet-card.tsx`
- [x] Decide whether to update `PetCard` directly or extract a shared browse card
- [x] Align index card presentation with the homepage card family
- [x] Preserve full-card-link accessibility
- [ ] Verify grid density on mobile, tablet, and desktop

## Stage 4 — State / URL Cleanup

- [x] Decide whether cuddle-policy state should be removed entirely or only hidden from UI
- [x] Update `PetFilterState` if product confirms filter removal
- [x] Update active-chip rendering to match the final visible filter set
- [x] Clean default/empty query params from generated URLs
- [x] Recheck active-filter count behavior after cleanup

## Stage 5 — Accessibility / Mobile Finish

- [x] Add or confirm `aria-live` result count behavior where practical
- [x] Ensure emoji rows have text equivalents like `Chaos 3 or higher`
- [x] Recheck drawer focus trap and Escape behavior
- [x] Recheck keyboard access for all filter controls
- [x] Recheck focus states across rail, drawer, chips, and pagination
- [x] Recheck no-results flow after filter changes

## Verification Checklist

- [ ] Check `/pets` on mobile width
- [ ] Check `/pets` on tablet width
- [ ] Check `/pets` on desktop width
- [ ] Keyboard-test filter rail, mobile drawer, sort, chips, and pagination
- [ ] Confirm shareable URLs still restore the visible filter state
- [ ] Confirm empty-state CTA still makes sense after filter changes
- [ ] After user approval, run `pnpm lint`
- [ ] After user approval, run `pnpm typecheck`
- [ ] After user approval, run `pnpm test`
- [ ] After user approval, run `pnpm build`

## Current Slice Status

- [x] Route simplification landed
- [x] Filter rail overhaul landed
- [x] Card alignment landed without extracting a shared card yet
- [x] State/query cleanup landed for removed cuddle-policy browse filters
- [ ] Manual QA + formal project checks still pending review approval
