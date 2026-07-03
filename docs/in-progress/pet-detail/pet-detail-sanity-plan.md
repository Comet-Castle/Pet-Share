# Pet Detail Sanity Plan

Status:

- Documentation-only planning companion for the pet detail page.
- Consolidates the intended Sanity editing model, query additions, seed expectations, and component contracts for `/pets/[slug]`.

Related docs:

- `docs/in-progress/pet-detail/pet-detail-enhancement-spec.md`
- `docs/in-progress/pet-detail/pet-detail-component-map.md`
- `docs/in-progress/pet-detail/pet-detail-implementation-plan.md`
- `docs/content-model.md`
- `docs/seed-json-contract.md`

## Purpose

Use this doc as the implementation-facing source of truth for the new CMS-powered pet detail modules:

- `vibeProfile[]`
- `fitGuidance`
- `dailySchedule[]`
- `videos[]` detail placement rules
- `careNotes[]`
- `borrowTerms[]`
- `warnings[]`
- contact drawer field/authoring expectations

## Proposed Pet Document Additions

| Field | Type | Purpose |
| --- | --- | --- |
| `vibeProfile` | array of `petVibeItem` | authored vibe rows with strength values |
| `fitGuidance` | `petFitGuidance` object | authored good-fit / maybe-avoid guidance |
| `dailySchedule` | array of `petScheduleItem` | authored day-with-the-pet timeline |

## Existing Pet Detail Fields To Keep Using

| Field | Purpose |
| --- | --- |
| `careNotes[]` | practical care guidance |
| `borrowTerms[]` | handoff/borrowing rules |
| `warnings[]` | cautionary notes |
| `videos[]` | dedicated detail-page video section |
| `cardMedia.lowFrameRateVideo` | card/listing motion only |
| `contactOwnerCta` | main borrowing CTA copy |

## Studio Editing Guidance

### Grouping inside the pet document

Recommended editor grouping/order:

1. Core listing info
2. Structured facts
3. Main description
4. Personality chips (`personalityTraits`)
5. Vibe profile (`vibeProfile`)
6. Fit guidance (`fitGuidance`)
7. Care notes / borrow terms / warnings
8. Day with the pet (`dailySchedule`)
9. Videos
10. CTA / SEO

### Collapse/default guidance

Recommended default collapsed sections:

- `vibeProfile`
- `fitGuidance`
- `dailySchedule`
- `videos`
- `careNotes`
- `borrowTerms`
- `warnings`

Keep core listing info, structured facts, and description expanded.

### Editor help-text guidance

Recommended short descriptions:

| Field | Suggested editor help text |
| --- | --- |
| `vibeProfile` | "Short personality rows with a label, a funny-but-useful descriptor, and a strength value." |
| `fitGuidance` | "Who this pet is a good fit for, and who should probably not volunteer." |
| `dailySchedule` | "Only use when the pet has a meaningful time-based routine worth showing." |
| `videos` | "Optional detail-page media. Do not use card-loop media here unless it is intentionally promoted." |
| `careNotes` | "Day-to-day handling guidance." |
| `borrowTerms` | "Rules that come with the handoff." |
| `warnings` | "Important caution notes or mismatch risks." |

### Recommended validation/editor limits

| Field | Guidance |
| --- | --- |
| `vibeProfile[]` | 2-4 items preferred |
| `fitGuidance.goodFitItems[]` | 3-5 items preferred |
| `fitGuidance.avoidItems[]` | 3-5 items preferred |
| `dailySchedule[]` | 3-6 items preferred |
| `careNotes[]` | 1-4 items preferred |
| `borrowTerms[]` | 1-4 items preferred |
| `warnings[]` | 1-4 items preferred |
| `videos[]` | usually 0-1 items for phase one |

## Object Preview Guidance

Recommended Studio preview titles:

| Object | Preview title | Preview subtitle |
| --- | --- | --- |
| `petVibeItem` | `label` | `descriptor` |
| `petFitGuidanceItem` | `text` | optional tone/emphasis |
| `petFitGuidance` | `goodFitTitle` or `Fit guidance` | item counts, e.g. `3 good fit · 3 avoid` |
| `petScheduleItem` | `timeLabel` | `title` |
| `careNote` | `title` | `severity` |
| `borrowTerm` | `title` | short description excerpt |
| `petWarning` | `title` | `severity` |

## Component Contracts

### `pet-vibe-profile.tsx`

- Component type: server component
- Props:
  - `items: Array<{ label: string; descriptor?: string; strength: number; tone?: string; icon?: string }>`
- Behavior:
  - omit when `items.length === 0`
  - render compact grid/list of authored rows
  - display visible text plus a text equivalent for strength

### `pet-fit-guidance.tsx`

- Component type: server component
- Props:
  - `goodFitTitle?: string`
  - `goodFitItems: Array<{ text: string; tone?: string }>`
  - `avoidTitle?: string`
  - `avoidItems: Array<{ text: string; tone?: string }>`
- Behavior:
  - omit when either side is empty in the initial pass
  - good-fit side uses mint semantics
  - avoid side uses coral semantics

### `pet-day-timeline.tsx`

- Component type: server component
- Props:
  - `items: Array<{ timeLabel: string; title?: string; description?: string; tone?: string }>`
- Behavior:
  - preserve authored order
  - omit when no valid items exist
  - use semantic list markup

### `pet-video-section.tsx`

- Component type: server component unless playback state requires a client wrapper
- Props:
  - `videos: Array<VideoEmbedLike>`
- Behavior:
  - render first usable video in phase one
  - poster-first, click-to-play
  - omit when no usable items exist
  - do not auto-fallback to `cardMedia.lowFrameRateVideo`

### `owner-contact-drawer.tsx`

- Component type: client component
- Props:
  - `petId`
  - `petName`
  - `ownerId?`
  - `ownerName?`
  - `ctaLabel`
  - optional `defaultPickupWindow`
- Behavior:
  - shared drawer trigger target for all borrow CTAs
  - focus-trapped dialog
  - success/error states
  - pickup window uses the same control family as the pet-index dropdown/select surfaces

## Contact Drawer Form Contract

Recommended visible fields:

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | freeform text |
| `email` | yes | validated email |
| `pickupWindow` | yes | controlled enum aligned to pickup urgency labels |
| `message` | yes | freeform message |

Recommended hidden/context fields:

- `petId`
- `petName`
- `ownerId`
- `ownerName`
- `currentUrl`

Recommended pickup-window enum values:

- `appointmentOnly`
- `withinSevenDays`
- `anytime`

CTA copy direction:

- prefer `Borrow this pet`
- avoid over-specialized joke CTA copy when a direct marketplace action is clearer

## Query Addition Checklist

When implementation begins:

1. Add new fields to the Sanity schema.
2. Add them to `PET_BY_SLUG_QUERY`.
3. Add them to `PET_BY_ID_QUERY`.
4. Update loaders if they normalize detail data.
5. Regenerate `sanity.types.ts`.
6. Update the route/component render path.
7. Update seed parsing/writing logic.
8. Update example seed data.

New detail-query fields to add:

- `vibeProfile[]`
- `fitGuidance`
- `dailySchedule[]`

## Seed Examples To Support

Recommended sample coverage in seed data/docs:

1. A pet with full modules:
   - `vibeProfile`
   - `fitGuidance`
   - `dailySchedule`
   - `videos`
2. A pet with no timeline and no video.
3. A pet with care notes and warnings only.
4. A pet with minimal optional editorial modules.

## Tone Rules

Canonical tone semantics:

- `mint`: supportive, practical, safe, approved
- `coral`: caution, warning, mismatch, extra attention
- `blue`: neutral/editorial contrast only
- `cream`: neutral/editorial support only

Apply as follows:

- care notes → `mint`
- borrow terms → `mint`
- warnings → `coral`
- good fit → `mint`
- maybe avoid → `coral`
- vibe profile → optional editorial tones
- daily schedule → optional editorial tones

## Open Implementation Notes

- Current runtime query logic intentionally lags behind this plan.
- `cuddlePolicy` remains in browse query logic until pet-index cleanup happens.
- Detail queries do not yet fetch the newly planned fields.
- This doc is planning-only and should not be mistaken for implemented behavior.
