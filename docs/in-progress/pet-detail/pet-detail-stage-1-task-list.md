# Pet Detail Stage 1 Task List

Status:

- Concrete execution slice for the first `/pets/[slug]` implementation pass.
- Companion to `docs/in-progress/pet-detail/pet-detail-implementation-plan.md`.

## Goal

Bring the current production detail page closer to the approved reference markup **without** expanding the Sanity content model yet.

Route target:

- `app/(site)/pets/[slug]/page.tsx`

Primary reference markup:

- `docs/in-progress/pet-detail/pet-detail.html`

## Files In Scope

Primary:

- `app/(site)/pets/[slug]/page.tsx`
- `components/features/pets/pet-image-gallery.tsx`
- `components/features/pets/pet-fact-grid.tsx`

Optional only if clearly needed:

- `components/features/pets/rating-meter.tsx`
- `components/features/pets/format.ts`

Out of scope for this slice:

- schema changes
- query expansion
- contact drawer
- new form submission flows
- new owner trust data
- new CMS-backed `vibeProfile` or `fitGuidance` implementation
- timeline / good-fit / vibe modules unless they can be safely stubbed and explicitly approved

## Stage 1 Deliverables

### 1. Status Row Polish

Target file:

- `app/(site)/pets/[slug]/page.tsx`

Tasks:

- [ ] Review current back/status row against `docs/in-progress/pet-detail/pet-detail.html`
- [ ] Tighten the visual hierarchy of:
  - back link
  - pet type pill
  - availability pill
- [ ] Decide whether to add a small share/copy-link affordance in this slice or defer it
- [ ] Keep the row compact and wrap-safe on mobile

Acceptance notes:

- Must still read clearly at narrow mobile widths
- Must not introduce horizontal overflow
- Must preserve keyboard focus styling

### 2. Sticky About Panel Refinement

Target file:

- `app/(site)/pets/[slug]/page.tsx`

Tasks:

- [ ] Compare the current about panel to the flat HTML reference
- [ ] Refine spacing and information order for:
  - pet type eyebrow
  - pet name
  - listing headline
  - summary / listing summary
  - availability + breed row
  - primary / secondary CTAs
- [ ] Decide whether quick-jump pills are included in this slice
- [ ] If quick-jump pills are included, add in-page anchors for:
  - facts
  - about
  - care
  - owner

Acceptance notes:

- Keep current CTA behavior unchanged
- Do not require new data fields
- Preserve sticky behavior on large screens only if it still feels stable

### 3. Gallery Treatment Upgrade

Target file:

- `components/features/pets/pet-image-gallery.tsx`

Tasks:

- [ ] Add a lightweight current-image count treatment, such as `1 of 4`
- [ ] Compare arrow, dot, and thumbnail hierarchy to the flat HTML reference
- [ ] Tighten mobile spacing between main image, dots, and thumbnail rail
- [ ] Keep swipe behavior intact
- [ ] Keep empty-image fallback intact

Acceptance notes:

- Must still work with:
  - no valid images
  - one image
  - multiple images
- Must remain keyboard accessible
- Must respect reduced-motion behavior already in place

### 4. Section Anchors + Heading Rhythm

Target file:

- `app/(site)/pets/[slug]/page.tsx`

Tasks:

- [ ] Add stable ids to the sections we expect to jump to:
  - facts
  - about
  - care
  - owner
- [ ] Tighten heading rhythm between:
  - fact grid
  - about section
  - care/borrow/warnings cluster
  - owner section
  - related pets
- [ ] Confirm anchor jumps do not hide content awkwardly behind sticky UI

Acceptance notes:

- Anchor ids should be semantic and stable
- Do not add a second sticky nav in this slice

### 5. Fact Grid Presentation Review

Target file:

- `components/features/pets/pet-fact-grid.tsx`

Tasks:

- [ ] Compare the current fact-grid density to the detail prototype direction
- [ ] Decide whether the existing six text facts + three rating cards need only spacing changes or structural changes
- [ ] Normalize public labels and display rules for:
  - age
  - breed
  - temperament
  - availability
  - pickup urgency
  - cuddle policy
- [ ] Keep current data usage:
  - age
  - breed
  - temperament
  - availability
  - pickup urgency
  - cuddle policy
  - chaos
  - mess risk
  - energy
- [ ] Preserve accessible labels on rating meters

Acceptance notes:

- Do not redesign this into a new data model in Stage 1
- Keep the current grid performant and responsive

### 6. Owner Section Polish

Target file:

- `app/(site)/pets/[slug]/page.tsx`

Tasks:

- [ ] Compare the owner block to the flat HTML reference
- [ ] Tighten spacing between portrait, heading, tagline, location, and CTA row
- [ ] Keep current owner CTA behavior intact
- [ ] Preserve the “Pet Share handles contact requests” note

Acceptance notes:

- No new owner trust data in this slice
- Must still degrade gracefully when owner fields are missing

### 7. Related Pets Section Review

Target files:

- `app/(site)/pets/[slug]/page.tsx`
- `components/features/pets/pet-card.tsx` only if necessary

Tasks:

- [ ] Review heading + browse-all row spacing
- [ ] Confirm the current related-pet card works well enough unchanged
- [ ] Avoid card redesign in this slice unless a clear detail-page issue forces it

Acceptance notes:

- Keep this low-risk
- Prefer route-level spacing changes over card changes

## Data Boundaries For Stage 1

Use only currently loaded pet data from `PET_BY_SLUG_QUERY` and `loadRelatedPets`.

Already available to this route:

- pet core identity (`name`, `slug`, `breed`, `ageYears`, `dateOfBirth`)
- listing copy (`listingHeadline`, `listingSummary`, `summary`, `description`)
- status fields (`availabilityStatus`, `pickupUrgency`, `cuddlePolicy`, `temperament`)
- ratings (`chaosLevel`, `messRisk`, `energyLevel`)
- media (`cardMedia.image`, `heroImages`, `videos`)
- arrays (`personalityTraits`, `careNotes`, `borrowTerms`, `warnings`, `availability`, `stats`)
- CTA (`contactOwnerCta`)
- pet type reference
- owner reference
- testimonial reference
- related pets query result

Do not add new query fields in Stage 1 unless a clearly approved UI element cannot be built without them.

## Suggested Review Sequence

1. Update route structure and anchors in `app/(site)/pets/[slug]/page.tsx`
2. Update gallery treatment in `components/features/pets/pet-image-gallery.tsx`
3. Adjust fact-grid spacing only if still needed after route polish
4. Hand back for review before any contact drawer work

## Stage 1 Review Checklist

- [ ] `/pets/[slug]` is visually closer to `docs/in-progress/pet-detail/pet-detail.html`
- [ ] no schema or query changes were introduced
- [ ] mobile layout remains clean
- [ ] desktop sticky behavior remains stable
- [ ] anchors work if included
- [ ] gallery controls still work with keyboard and touch
- [ ] owner and related-pet links still work
