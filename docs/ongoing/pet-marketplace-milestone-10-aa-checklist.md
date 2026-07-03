# Pet Marketplace Milestone 10 AA Checklist

Use this as the working execution checklist for **Milestone 10: Pet Marketplace Page Refinement**.

Agent workflow rule:

- Update this checklist as work is completed.
- Mark only finished items.
- If a task is intentionally deferred, add a short note in the relevant plan/spec instead of marking it complete.
- Keep implementation aligned with:
  - `docs/completed/pet-index/pet-index-implementation-plan.md`
  - `docs/in-progress/pet-detail/pet-detail-implementation-plan.md`
  - `docs/in-progress/pet-detail/pet-detail-sanity-plan.md`
  - `docs/milestones.md`

## 0. Planning And Alignment

- [x] Re-read Milestone 10 in `docs/milestones.md`
- [x] Re-read pet index implementation plan
- [ ] Re-read pet detail implementation plan
- [ ] Re-read pet detail Sanity plan
- [x] Confirm current implementation slice stays within Milestone 10 scope
- [x] Confirm any form-delivery plumbing beyond UI-level drawer behavior is deferred to Milestone 11 unless explicitly approved

## 1. Pet Index — Route And Surface Hierarchy

- [x] Remove the top hero/banner from `/pets`
- [x] Ensure filters/results become the first primary scanning surface
- [x] Remove or suppress the extra bottom promo CTA if still present in the old direction
- [ ] Verify page-builder sections below results still space correctly
- [x] Verify empty/loading/error behavior still reads clearly

## 2. Pet Index — Filter Rail Overhaul

- [x] Align `Sort by` visually with the pet-type dropdown family
- [x] Update filter section headers/icons to the approved treatment
- [x] Convert availability UI to clearer stacked buttons
- [x] Convert pickup urgency UI to the same stacked-button treatment
- [x] Remove visible cuddle-policy / borrowing-rules filter UI
- [x] Convert household impact controls to full-width emoji rows
- [x] Use approved emoji set on index:
  - [x] Chaos `😈`
  - [x] Mess `💩`
  - [x] Energy `⚡`
- [x] Ensure active/selected filter states are visually obvious
- [ ] Verify no horizontal overflow on mobile

## 3. Pet Index — Query, URL State, And Cleanup

- [x] Confirm visible browse filters match the approved field set:
  - [x] `petType`
  - [x] `availabilityStatus`
  - [x] `pickupUrgency`
  - [x] `minChaos`
  - [x] `minMess`
  - [x] `minEnergy`
- [x] Remove transitional visible UI dependencies on `cuddlePolicy`
- [x] Clean up active-filter chips to match the approved visible filter model
- [x] Clean up URL/query-param handling for removed browse controls when approved
- [x] Update `sanity/queries/pets.ts` so runtime browse filter logic matches the approved surface
- [x] Confirm pagination still works with the revised filter state
- [x] Confirm sort changes preserve compatible filter params

## 4. Pet Index — Card Alignment

- [x] Align browse cards with the homepage card language
- [x] Remove lingering index-only card treatment where no longer needed
- [x] Confirm full-card linking remains accessible
- [x] Confirm card content still uses the right shared marketplace fields

## 5. Pet Detail — Structural Polish

- [ ] Refine back/status row
- [ ] Add or refine quick-jump pills if included in the slice
- [ ] Add or refine gallery photo-count treatment
- [ ] Tighten section spacing/headings
- [ ] Normalize displayed fact values for:
  - [ ] age
  - [ ] breed
  - [ ] temperament
  - [ ] availability
  - [ ] pickup urgency
  - [ ] cuddle policy
- [ ] Align household impact meters with index emoji language
- [ ] Use approved emoji set on detail:
  - [ ] Chaos `😈`
  - [ ] Mess `💩`
  - [ ] Energy `⚡`
- [ ] Verify owner summary still reads clearly
- [ ] Verify related pets section still fits the refined page

## 6. Pet Detail — CTA And Drawer UX

- [ ] Align primary CTA copy to `Borrow this pet` or approved equivalent
- [ ] Ensure all main borrow CTAs target the same drawer behavior
- [ ] Align preferred pickup window control with the pet-index dropdown/select family
- [ ] Preserve focus management, escape handling, and focus return
- [ ] Keep drawer behavior within Milestone 10 UI scope unless Milestone 11 work is explicitly approved

## 7. Pet Detail — Media And Section Order

- [ ] Keep optional video section above About when present
- [ ] Confirm detail-page video uses `videos[]`
- [ ] Confirm `cardMedia.lowFrameRateVideo` is not auto-promoted into the detail-page video section
- [ ] Confirm omission behavior is clean when no usable video exists

## 8. Pet Detail — CMS-Backed Editorial Modules

- [ ] Implement or prepare `vibeProfile[]` support only when schema/query work for the slice is approved
- [ ] Implement or prepare `fitGuidance` support only when schema/query work for the slice is approved
- [ ] Implement or prepare `dailySchedule[]` support only when schema/query work for the slice is approved
- [ ] Keep `careNotes[]`, `borrowTerms[]`, and `warnings[]` as distinct editorial groups
- [ ] Preserve tone semantics:
  - [ ] Care notes `mint`
  - [ ] Borrow terms `mint`
  - [ ] Warnings `coral`
  - [ ] Good fit `mint`
  - [ ] Maybe avoid `coral`
  - [ ] Blue/cream only for neutral/editorial support

## 9. Sanity Schema And Studio Work

- [ ] Improve pet schema grouping where editing workflow is unclear
- [ ] Add any approved new pet-detail objects/fields:
  - [ ] `petVibeItem`
  - [ ] `petFitGuidance`
  - [ ] `petFitGuidanceItem`
  - [ ] `petScheduleItem`
- [ ] Add clear previews for new objects
- [ ] Add helpful field descriptions/help text for editorial modules
- [ ] Keep optional editorial groups scannable/collapsible in Studio where practical
- [ ] Ensure marketplace schemas stay structured and bespoke rather than drifting toward generic page-builder modeling

## 10. Queries, Loaders, And Types

- [ ] Add approved new pet-detail fields to `PET_BY_SLUG_QUERY`
- [ ] Add approved new pet-detail fields to `PET_BY_ID_QUERY`
- [ ] Update any affected loaders
- [ ] Regenerate or refresh generated Sanity types
- [ ] Confirm index/detail query contracts still align on shared marketplace fields

## 11. Seed Data And Seed Tooling

- [ ] Update saved seed data to match the approved schema/renderer contract
- [ ] Keep browse/detail shared field values aligned in seed data
- [ ] If schema-backed editorial modules are implemented, update seed support for:
  - [ ] `vibeProfile`
  - [ ] `fitGuidance`
  - [ ] `dailySchedule`
- [ ] Preserve authored order where required
- [ ] Keep detail-page `videos[]` separate from card-loop media handling
- [ ] Confirm seeded pet, owner, pet type, and pet index content matches current renderer expectations

## 12. Responsive, Accessibility, And QA

- [ ] Check `/pets` on mobile
- [ ] Check `/pets` on desktop
- [ ] Check `/pets/[slug]` on mobile
- [ ] Check `/pets/[slug]` on desktop
- [ ] Verify no horizontal overflow
- [ ] Verify filter controls remain keyboard accessible
- [ ] Verify detail gallery controls remain keyboard accessible
- [ ] Verify drawer behavior remains keyboard accessible
- [ ] Verify emoji controls/meters have text equivalents
- [ ] Verify shareable URLs still represent browse state correctly
- [ ] Verify omission/fallback behavior stays clean for missing optional data

## 13. Docs And Handoff

- [x] Update relevant docs when implementation changes the agreed plan
- [ ] Keep `docs/in-progress/pet-detail/pet-detail-sanity-plan.md` aligned with any approved schema changes
- [ ] Keep pet index and pet detail plans aligned with each other on shared fields
- [x] Note any intentionally unfinished work before handoff
- [x] Summarize changed files and milestone coverage for review
