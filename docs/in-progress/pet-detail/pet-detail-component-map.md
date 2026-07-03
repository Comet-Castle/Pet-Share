# Pet Detail Component Map And Data Sources

Status:

- Working inventory of the components expected on `/pets/[slug]`.
- Maps each detail-page section to ownership, current data source, and likely implementation status.

Route target:

- `app/(site)/pets/[slug]/page.tsx`

Primary data source:

- `PET_BY_SLUG_QUERY` in `sanity/queries/pets.ts`
- loaded via `loadPetBySlug()` in `sanity/lib/loaders.ts`

Related data source:

- `loadRelatedPets()` / related pets query

## How To Use This Doc

For each detail-page component, this doc answers:

- what the component is
- whether it already exists or should be created
- where its data should come from
- whether that data already exists in the query/model
- whether the component belongs in Stage 1, later UI work, or schema-backed follow-up

---

## 1. Page Route Composer

Purpose:

- Orchestrates section order, empty/error states, and section-level props.

Current file:

- `app/(site)/pets/[slug]/page.tsx`

Expected responsibility:

- load the pet
- load related pets
- derive lightweight labels and fallback copy
- compose the full page in the approved order

Data source:

- `loadPetBySlug(slug, { preview })`
- `loadRelatedPets(...)`

Status:

- already exists
- remains the top-level composition layer

---

## 2. Back + Status Row

Purpose:

- Gives users context and a quick escape back to `/pets`.
- Shows pet type and availability at a glance.

Current implementation:

- inline in `app/(site)/pets/[slug]/page.tsx`

Expected sub-elements:

- back link
- pet type pill
- availability pill
- optional future share/copy-link affordance

Data source:

- back link: static route `/pets`
- pet type label: `pet.petType?.filterLabel`
- availability label: `pet.availabilityStatus`
- optional future share: browser URL, no CMS field required

Status:

- already exists
- Stage 1 polish target

---

## 3. Hero Gallery

Purpose:

- Presents the primary pet imagery first.

Current component:

- `components/features/pets/pet-image-gallery.tsx`

Expected sub-elements:

- main image
- next/previous controls
- dot controls
- thumbnail rail
- optional image-count chip

Data source:

- assembled in route from:
  - `pet.cardMedia?.image`
  - `pet.heroImages`

Current data notes:

- image alt comes from Sanity image data
- no extra query fields required for Stage 1 gallery polish

Status:

- already exists
- Stage 1 polish target

---

## 4. Sticky About Panel

Purpose:

- Provides the primary marketplace summary and CTA area.

Current implementation:

- inline in `app/(site)/pets/[slug]/page.tsx`

Expected sub-elements:

- pet type eyebrow
- pet name
- listing headline
- summary / listing summary
- availability + breed row
- primary CTA
- secondary CTA
- optional quick-jump pills

Data source:

- pet type eyebrow: `pet.petType?.filterLabel`
- pet name: `pet.name`
- listing headline: `pet.listingHeadline`
- summary text: `pet.summary || pet.listingSummary`
- availability: `pet.availabilityStatus`
- breed: `pet.breed`
- primary CTA label: `pet.contactOwnerCta?.label`
- secondary CTA target: `pet.owner?.slug`

Status:

- already exists
- Stage 1 polish target

---

## 5. Quick-Jump Pills

Purpose:

- Helps users navigate longer detail pages.

Suggested component:

- can remain inline in `app/(site)/pets/[slug]/page.tsx` initially
- can become `components/features/pets/pet-detail-jump-links.tsx` later if needed

Expected links:

- facts
- about
- care
- owner

Data source:

- static labels
- local section ids in the route

Status:

- not implemented yet
- suitable for Stage 1 if approved
- no schema/query changes needed

---

## 6. Fact Grid

Purpose:

- Shows the structured attributes of the pet in a highly scannable way.

Current component:

- `components/features/pets/pet-fact-grid.tsx`

Expected facts:

- age
- breed
- temperament
- availability
- pickup urgency
- cuddle policy
- chaos meter
- mess-risk meter
- energy meter

Data source:

- age: `pet.ageYears`, `pet.dateOfBirth`
- breed: `pet.breed`
- temperament: `pet.temperament`
- availability: `pet.availabilityStatus`
- pickup urgency: `pet.pickupUrgency`
- cuddle policy: `pet.cuddlePolicy`
- chaos: `pet.chaosLevel`
- mess risk: `pet.messRisk`
- energy: `pet.energyLevel`

Supporting components:

- `components/features/pets/rating-meter.tsx`
- `components/features/pets/format.ts`

Status:

- already exists
- Stage 1 presentation review target

---

## 7. Optional Video Section

Purpose:

- Displays a pet video only when the content supports it.

Suggested component:

- `components/features/pets/pet-video-section.tsx`

Placement direction:

- render above the main About section in the approved detail-page flow
- keep it close to the hero/fact-summary area so it reads as primary pet media rather than late supporting content

Current available data:

- `pet.videos[]`
- `pet.cardMedia?.lowFrameRateVideo`

Recommended rendering rules:

- use `pet.videos[]` for the dedicated detail-page video section
- treat `pet.cardMedia?.lowFrameRateVideo` as card/listing media, not as an automatic detail-page section source
- render nothing when no complete detail-page video item exists
- prefer poster-first, click-to-play behavior

Seed/content notes:

- seed data should support authored `videos[]` entries specifically for the detail page
- seeders should not automatically promote card-loop video data into the detail-page section

Status:

- not implemented in the current route
- can be added with the existing `videos[]` model
- needs explicit rendering and fallback rules, now documented here

---

## 8. About Section

Purpose:

- Holds the longer written description and personality tags.

Current implementation:

- inline in `app/(site)/pets/[slug]/page.tsx`
- wrapped in local `SectionShell`

Expected sub-elements:

- section heading
- rich-text description
- fallback text when description is missing
- personality trait chips
- optional future “why this pet is listed” callout

Data source:

- description: `pet.description`
- fallback summary: `pet.summary || pet.listingSummary`
- personality traits: `pet.personalityTraits[]`

Supporting components:

- `components/ui/portable-text.tsx` via `RichText`

Status:

- already exists
- Stage 1 spacing/heading target
- future callout may be derivable or schema-backed depending on product choice

---

## 9. Vibe Profile

Purpose:

- Adds personality shorthand beyond the main fact grid.

Suggested component:

- `components/features/pets/pet-vibe-profile.tsx`

Recommended data source:

- dedicated authored `pet.vibeProfile[]`

Recommended item shape:

- `label`
- `descriptor`
- `strength`
- optional `tone`
- optional `icon`

Current status of data:

- current query has `personalityTraits[]`, but that is better suited to chips
- no dedicated numeric vibe-strength model exists yet

Status:

- not implemented
- should be schema-backed
- Stage 4 candidate unless schema work is pulled earlier

---

## 10. Good Fit / Maybe Avoid

Purpose:

- Gives editorial guidance about which borrowers or homes suit the pet.

Suggested component:

- `components/features/pets/pet-fit-guidance.tsx`

Recommended data source:

- dedicated authored `pet.fitGuidance`

Recommended shape:

- `goodFitTitle`
- `goodFitItems[]`
- `avoidTitle`
- `avoidItems[]`

Status:

- not implemented
- should be schema-backed rather than inferred
- Stage 4 candidate

---

## 11. Care Notes / Borrowing Terms / Warnings Cluster

Purpose:

- Surfaces practical and comedic caution notes.

Current implementation:

- inline in `app/(site)/pets/[slug]/page.tsx`
- uses local `NoteCard`

Expected sub-groups:

- care notes
- borrowing terms
- warnings

Data source:

- care notes: `pet.careNotes[]`
- borrowing terms: `pet.borrowTerms[]`
- warnings: `pet.warnings[]`

Current field shape:

- care notes: `title`, `description`, `severity`
- borrowing terms: `title`, `description`, optional `icon`
- warnings: `title`, `description`, `severity`, optional `icon`

Recommended direction:

- keep these CMS-powered as three distinct editorial arrays
- optionally add `icon` to care notes if the section needs stronger visual distinction
- avoid merging them into one generic notes array unless editors truly need that flexibility

Status:

- already exists
- needs clearer implementation guidance, not a full remodel

---

## 12. Day-With-The-Pet Timeline

Purpose:

- Provides a playful schedule-like module.

Suggested component:

- `components/features/pets/pet-day-timeline.tsx`

Recommended data source:

- dedicated authored `pet.dailySchedule[]`

Recommended item shape:

- `timeLabel`
- `title`
- `description`
- optional `tone`

Status:

- not implemented
- should be schema-backed
- Stage 4 candidate

---

## 13. Owner Summary Section

Purpose:

- Gives enough owner context to support the handoff without exposing a browseable owner directory.

Current implementation:

- inline in `app/(site)/pets/[slug]/page.tsx`

Expected sub-elements:

- owner portrait
- owner heading
- tagline or short owner copy
- location
- CTA row
- handoff/contact note
- optional future owner trust strip

Data source:

- portrait: `pet.owner?.portrait`
- name: `pet.owner?.name`
- tagline: `pet.owner?.tagline`
- location: `pet.owner?.location`
- owner page URL: `pet.owner?.slug`
- optional future trust info:
  - current: `pet.owner?.memberSince`
  - missing today: verification state, reply time

Supporting component:

- `components/ui/sanity-image.tsx`

Status:

- already exists
- Stage 1 polish target
- trust strip is later work

---

## 14. Contact Owner Drawer

Purpose:

- Keeps the user on the listing while opening a contact flow.

Suggested component:

- `components/features/pets/owner-contact-drawer.tsx`

Expected triggers:

- about-panel CTA
- owner-section CTA
- future mobile sticky bar CTA

Data source:

- pet id: `pet._id`
- pet name: `pet.name`
- owner id: `pet.owner?._id`
- owner name: `pet.owner?.name`
- CTA label: `pet.contactOwnerCta?.label`
- current URL: browser location at runtime
- form definition: likely shared contact form infrastructure

Status:

- not implemented
- Stage 2 target

Authoring/contract reference:

- `docs/in-progress/pet-detail/pet-detail-sanity-plan.md`

---

## 15. Owner Trust Strip

Purpose:

- Adds a small marketplace-style confidence module.

Suggested component:

- `components/features/pets/pet-owner-trust-strip.tsx`

Possible data source:

Available now:

- `pet.owner?.memberSince`
- `pet.owner?.location`

Not clearly available now:

- reply time
- verified owner flag

Status:

- not implemented
- some pieces are available now, but a full trust strip likely needs product clarification
- Stage 3 or 4 depending on scope

---

## 16. Related Pets Section

Purpose:

- Keeps users in the catalog flow after one listing.

Current implementation:

- section composed in `app/(site)/pets/[slug]/page.tsx`
- cards rendered with `components/features/pets/pet-card.tsx`

Expected sub-elements:

- section heading
- browse-all link
- related pet card grid

Data source:

- `loadRelatedPets(pet._id, pet.petType?._id, pet.owner?._id, ...)`

Status:

- already exists
- Stage 1 layout-polish target only

---

## 17. Mobile Sticky Contact Bar

Purpose:

- Keeps the primary action visible on long mobile pages.

Suggested component:

- `components/features/pets/pet-mobile-contact-bar.tsx`

Potential data source:

- pet name: `pet.name`
- CTA label: `pet.contactOwnerCta?.label`
- optional price if pricing is ever added to the detail model

Status:

- not implemented
- Stage 5 candidate
- current pet data does not appear to include a public detail-page price field

---

## 18. Copy-Link / Share Action

Purpose:

- Lets users quickly share the listing URL.

Suggested component:

- inline in route initially
- can become `components/features/pets/pet-share-button.tsx` later

Data source:

- browser URL at runtime
- optional pet name for accessible label

Status:

- not implemented
- can be added without schema changes
- likely Stage 3 candidate unless pulled into Stage 1

---

## Current Query Coverage Summary

Already in `PET_BY_SLUG_QUERY` and usable now:

- identity and listing copy
- ratings and structured facts
- hero images and videos
- description and trait arrays
- care notes / borrow terms / warnings
- pet type reference
- owner reference
- CTA label
- testimonial reference

Likely requires no query change for early UI improvements:

- status-row polish
- quick-jump pills
- gallery count chip
- section-heading cleanup
- optional video section if based on existing fields
- copy-link/share button

Likely needs product or schema decisions:

- vibe profile with explicit strength values
- good fit / maybe avoid
- day-with-the-pet timeline
- full owner trust strip
- advanced contact-flow customization beyond existing CTA/form plumbing

## Recommended Component Creation Order

If we keep this incremental, create or refine components in this order:

1. refine `app/(site)/pets/[slug]/page.tsx`
2. refine `components/features/pets/pet-image-gallery.tsx`
3. refine `components/features/pets/pet-fact-grid.tsx` only if needed
4. add `components/features/pets/owner-contact-drawer.tsx`
5. add optional editorial modules only after product decisions are explicit
