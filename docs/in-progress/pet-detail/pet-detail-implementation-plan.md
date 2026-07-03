# Pet Detail Implementation Plan

Status:

- Working implementation plan for retrofitting the approved pet detail direction into the Next.js app.
- Companion to `docs/in-progress/pet-detail/pet-detail-enhancement-spec.md`.
- Focused on execution order, file ownership, and content-model impact.

## Milestone Alignment

This plan primarily supports `docs/milestones.md` Milestone 10: **Pet Marketplace Page Refinement**.

Milestone 10 alignment:

- Stage 1 directly supports layout, gallery, structured facts, owner summary, and status-display refinement.
- Stage 2 supports CTA-surface refinement, but the actual form-delivery plumbing still belongs with Milestone 11.
- Stage 4 supports the milestone requirement to improve pet schemas, Studio grouping, previews, validation, and seed alignment.
- Stage 5 supports the responsive/polish expectations reinforced again in Milestone 12.

Boundary note:

- Keep the drawer UI/interaction planning in Milestone 10 scope.
- Keep Mailgun submission wiring, server action/route behavior, and production form delivery in Milestone 11 scope.

## Purpose

This plan turns the approved pet detail prototype/spec into a staged implementation plan for the production route:

- Route target: `app/(site)/pets/[slug]/page.tsx`
- Prototype reference: `docs/in-progress/pet-detail/pet-detail.html`
- Current production markup reference: `app/(site)/pets/[slug]/page.tsx`

Use this plan when we return to `/pets/[slug]` implementation work so the scope stays reviewable and aligned with the approved prototype direction.

## Reference Markup

Primary reference files:

- Flat HTML prototype markup: `docs/in-progress/pet-detail/pet-detail.html`
- Current route markup: `app/(site)/pets/[slug]/page.tsx`
- Current gallery component: `components/features/pets/pet-image-gallery.tsx`
- Current fact grid: `components/features/pets/pet-fact-grid.tsx`
- Current pet card for related pets: `components/features/pets/pet-card.tsx`

Supporting implementation references:

- Detail-page spec: `docs/in-progress/pet-detail/pet-detail-enhancement-spec.md`
- Detail-page Sanity plan: `docs/in-progress/pet-detail/pet-detail-sanity-plan.md`
- Milestone 10 AA checklist: `docs/ongoing/pet-marketplace-milestone-10-aa-checklist.md`
- Page blueprint: `docs/page-blueprints.md` (`/pets/[slug]` sections)
- Milestone scope: `docs/milestones.md`

## Current State Summary

The current `/pets/[slug]` page already includes:

- back link + status row
- gallery + sticky about panel
- fact grid
- about/description section
- care notes / borrowing terms / warnings
- owner summary
- related pets

The approved flat-HTML/spec direction adds or refines:

- stronger section hierarchy and polish around the existing structure
- quick-jump pills in the about panel
- gallery photo-count chip
- contact-owner drawer
- vibe profile
- good fit / maybe avoid module
- day-with-the-pet timeline
- owner trust strip
- mobile sticky contact bar
- contextual share / copy-link affordance
- optional video placement above the About section if the content supports it

## Recommended Implementation Order

Keep this work staged. Do not try to ship the entire enhancement spec in one pass.

### Stage 1 — Structural polish on the existing route

Goal:

- Bring the current route closer to the approved markup without expanding the content model much.

Scope:

- refine the status row
- add quick-jump pills/anchors
- add gallery photo-count treatment
- tighten section headings and spacing to better match the prototype
- normalize the displayed fact values for age, breed, temperament, availability, pickup urgency, and cuddle policy against the approved detail-page label chart
- preserve existing data usage wherever possible

Likely files:

- `app/(site)/pets/[slug]/page.tsx`
- `components/features/pets/pet-image-gallery.tsx`
- `components/features/pets/pet-fact-grid.tsx`

Notes:

- This is the safest first pass because it mostly reorganizes and styles existing data.
- No new CMS fields should be required unless we choose to author quick-jump labels.

### Stage 2 — Contact-owner interaction

Milestone note:

- UI-level drawer behavior belongs to Milestone 10.
- Server submission wiring should stay milestone-aware and avoid expanding into full Milestone 11 email delivery unless explicitly approved.

Goal:

- Introduce the primary contact interaction without leaving the detail page.

Scope:

- build the contact-owner drawer
- wire CTA triggers from the about panel and owner section
- align primary CTA copy to `Borrow this pet` or equivalent borrowing language
- include contextual hidden fields for pet/owner metadata
- align the preferred pickup window control with the pet-index dropdown/select family
- add success and error states
- ensure keyboard/focus management is correct

Likely files:

- `components/features/pets/owner-contact-drawer.tsx` (new)
- `app/(site)/pets/[slug]/page.tsx`
- form submission utilities or existing contact form plumbing

Implementation note:

- Use `docs/in-progress/pet-detail/pet-detail-sanity-plan.md` for the drawer field contract and pickup-window control expectations.

Dependencies / constraints:

- Should reuse existing form patterns where practical.
- Must stay server-safe and avoid exposing sensitive configuration client-side.

### Stage 3 — Secondary editorial modules using existing or derivable data

Goal:

- Add richer storytelling modules that can be supported with little or no schema expansion.

Candidate modules:

- vibe profile
- why-this-pet-is-listed callout
- owner trust strip
- contextual share / copy-link affordance

Planning note:

- treat `vibe profile` as schema-backed rather than derived if we want stable editorial quality
- keep the callout, trust strip, and share action separate from that schema decision

Likely files:

- `app/(site)/pets/[slug]/page.tsx`
- small new feature components under `components/features/pets/`

Notes:

- Vibe profile should not invent fake precision if the source data is only categorical.
- If a module depends on editorial shorthand rather than authored data, document the derivation clearly.

### Stage 4 — Schema-backed enhancements

Milestone note:

- This stage is the main path for satisfying Milestone 10 expectations around clearer pet schemas, Studio grouping, reusable objects, validation, and seed/schema alignment.

Goal:

- Add modules that deserve explicit authored content rather than brittle derivation.

Candidate modules:

- good fit / maybe avoid
- day-with-the-pet timeline
- optional pet video section
- richer owner trust metadata if needed
- authored vibe-profile data if Stage 3 does not already introduce it

Recommended schema additions for this stage:

- `vibeProfile[]`
- `fitGuidance`
- `dailySchedule[]`
- keep `careNotes[]`, `borrowTerms[]`, and `warnings[]` as separate arrays, with only small field refinements if truly needed
- keep `videos[]` as the source for the dedicated detail-page video section rather than promoting `cardMedia.lowFrameRateVideo`

Required catch-up work in the same stage:

- add the new fields to `sanity/schemaTypes/...`
- project them from `sanity/queries/pets.ts`
- update loaders and generated types
- update route/component rendering only after the schema + query path exists
- keep the current docs/code mismatch explicit until that implementation pass happens

Likely files:

- `sanity/schemaTypes/documents/pet.ts`
- possibly owner/object schemas
- `sanity/queries/pets.ts`
- `sanity/lib/loaders.ts`
- `sanity.types.ts`
- `app/(site)/pets/[slug]/page.tsx`
- new pet-detail feature components
- relevant seed docs / sample data docs if the model changes

Notes:

- This stage should only happen after product decisions are explicit.
- If new fields are added, update the relevant docs in the same stage.

### Stage 5 — Mobile conversion polish

Goal:

- Finish the detail page as a strong small-screen experience.

Scope:

- mobile sticky contact bar
- tighter anchor behavior on mobile
- spacing and stacking polish for long content flows
- reduced-motion and focus-state review

Likely files:

- `app/(site)/pets/[slug]/page.tsx`
- new or updated client components used by the page
- `app/globals.css` only if a shared utility is truly needed

## Component Ownership Map

Use small, focused components rather than growing the route file indefinitely.

Likely ownership:

- route composition: `app/(site)/pets/[slug]/page.tsx`
- gallery behavior: `components/features/pets/pet-image-gallery.tsx`
- fact grid: `components/features/pets/pet-fact-grid.tsx`
- related pets: `components/features/pets/pet-card.tsx`
- contact drawer: `components/features/pets/owner-contact-drawer.tsx`
- optional future modules:
  - `pet-vibe-profile.tsx`
  - `pet-fit-guidance.tsx`
  - `pet-day-timeline.tsx`
  - `pet-owner-trust-strip.tsx`
  - `pet-mobile-contact-bar.tsx`

Keep the route responsible for data orchestration and section order. Push display logic into feature components once a block becomes substantial or reusable.

## Content-Model Decision Checklist

Before implementing Stage 4 modules, confirm whether each should be:

- derived from existing pet fields
- authored directly on the pet document
- authored via a reusable object schema
- optional and omitted when data is missing

Questions to resolve before schema work:

1. Should “good fit / maybe avoid” be authored copy or generated from existing structured attributes?
2. The day-with-the-pet timeline should be modeled as an authored `dailySchedule[]` array on pets unless a stronger cross-site timeline use case appears.
3. First-class pet video support should use authored `videos[]` entries for the detail section, while `cardMedia.lowFrameRateVideo` stays card-specific.
4. Should owner trust items like reply time / verification exist in the content model?
5. Does the contact drawer reuse an existing shared form definition, or need a pet-specific wrapper around that model?
6. Do any current public labels for temperament, availability, pickup urgency, or cuddle policy need renaming for realism before implementation starts?
7. `vibeProfile` should use a dedicated object with numeric strength rather than expanding `petTrait`, because that is clearer and easier for editors to fill out in Sanity.
8. Do care notes need icons, or is their current severity-based model enough?
9. Do borrow terms need a severity/priority field, or is order alone enough?
10. Lock semantic tones as: care notes `mint`, borrow terms `mint`, warnings `coral`, good fit `mint`, maybe avoid `coral`, with `blue`/`cream` reserved for neutral/editorial support.

## Accessibility Requirements

Every stage should preserve or improve:

- keyboard access for quick-jump links
- visible focus states on all actions
- descriptive labels for gallery controls
- dialog semantics and focus trapping for the contact drawer
- accessible names for copy-link and share actions
- reasonable reading order on mobile and desktop
- reduced-motion respect for gallery or drawer motion

## Verification Plan

During implementation review, prefer stage-sized checks.

Recommended per-stage verification:

- visual QA of `/pets/[slug]` at mobile and desktop widths
- keyboard pass for anchors, gallery controls, CTAs, and drawer behavior
- confirm empty/missing-content fallbacks still read clearly
- confirm related pets and owner links still work
- run formal `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` after the user approves the stage direction

## Suggested First Execution Slice

When we resume implementation, the best next slice is:

1. Stage 1 structural polish
2. contact-drawer planning stub in the route/component map
3. no schema changes yet

Reason:

- It improves the current live detail page fastest.
- It keeps risk low.
- It gives us a cleaner baseline before we add drawer/stateful behavior.

## Acceptance Criteria For The First Slice

The first reviewable slice should be considered successful if:

- `/pets/[slug]` visually moves closer to `docs/in-progress/pet-detail/pet-detail.html`
- the existing data-driven sections remain intact
- quick-jump anchors and gallery-count polish are present if approved in the slice
- no new schema fields are required
- the route remains responsive and accessible
- the changed files are still easy to scan and own
