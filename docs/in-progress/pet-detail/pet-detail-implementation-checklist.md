# Pet Detail Implementation Checklist

Use this as the short execution checklist for `/pets/[slug]`.

Full plan:

- `docs/in-progress/pet-detail/pet-detail-implementation-plan.md`

Reference markup:

- Flat HTML prototype: `docs/in-progress/pet-detail/pet-detail.html`
- Current route: `app/(site)/pets/[slug]/page.tsx`
- Detail spec: `docs/in-progress/pet-detail/pet-detail-enhancement-spec.md`

## Stage 1 — Structural Polish

- [ ] Review `docs/in-progress/pet-detail/pet-detail.html` against `app/(site)/pets/[slug]/page.tsx`
- [ ] Tighten back/status row layout
- [ ] Add quick-jump anchor pills if approved for this slice
- [ ] Add gallery photo-count treatment if approved for this slice
- [ ] Refine section spacing/headings to better match the prototype
- [ ] Normalize displayed fact values for age, breed, temperament, availability, pickup urgency, and cuddle policy
- [ ] Keep existing data usage intact
- [ ] Verify mobile and desktop layouts

## Stage 2 — Contact Drawer

- [ ] Add `components/features/pets/owner-contact-drawer.tsx`
- [ ] Wire CTA triggers from about panel
- [ ] Wire CTA triggers from owner section
- [ ] Add contextual hidden fields for pet/owner metadata
- [ ] Add success state
- [ ] Add error state
- [ ] Add keyboard/focus management
- [ ] Verify drawer close behavior, escape, and focus return

## Stage 3 — Editorial Modules From Existing Data

- [ ] Add “why this pet is listed” callout if approved
- [ ] Add owner trust strip if supported by current owner data
- [ ] Add copy-link/share affordance if approved
- [ ] Verify modules degrade cleanly when data is missing

## Stage 4 — Schema-Backed Enhancements

- [ ] Confirm product decision for `vibeProfile[]`
- [ ] Confirm product decision for `fitGuidance`
- [ ] Confirm product decision for “good fit / maybe avoid”
- [ ] Confirm product decision for day-with-the-pet timeline
- [ ] Confirm product decision for optional pet video
- [ ] Keep care notes, borrow terms, and warnings as clearly CMS-powered arrays
- [ ] Update Sanity schemas only after those decisions are approved
- [ ] Update queries/loaders/types for any new fields
- [ ] Update seed/docs if content-model changes are introduced

## Stage 5 — Mobile Finish

- [ ] Add mobile sticky contact bar if approved
- [ ] Recheck small-screen anchor behavior
- [ ] Recheck long-page spacing and stacking
- [ ] Recheck reduced-motion behavior
- [ ] Recheck focus states on all interactive elements

## Verification Checklist

- [ ] Check `/pets/[slug]` on mobile width
- [ ] Check `/pets/[slug]` on desktop width
- [ ] Keyboard-test anchors, gallery controls, CTAs, and drawer
- [ ] Confirm owner links and related-pet links still work
- [ ] Confirm missing-content fallbacks still read clearly
- [ ] After user approval, run `pnpm lint`
- [ ] After user approval, run `pnpm typecheck`
- [ ] After user approval, run `pnpm test`
- [ ] After user approval, run `pnpm build`

## Recommended Next Slice

- [ ] Start with Stage 1 only
- [ ] Do not change schemas yet
- [ ] Hand back for review before contact-drawer implementation
