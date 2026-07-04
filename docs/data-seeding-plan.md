# Data Seeding Plan

This document defines how Pet Share demo content should be seeded into Sanity. It turns the content model into an operational plan for seed scripts, generated media, stable IDs, and demo-quality content.

Seed data is expected to evolve as the site is designed and built. The preferred workflow is to do one strong generation pass for all content, review and curate that output, save it as project seed data, then replay the saved seed data into Sanity rather than regenerating everything from scratch on every run.

## Goals

- Make the demo usable immediately after setup.
- Populate every major route with realistic CMS-authored content.
- Demonstrate references between pets, owners, pet types, testimonials, forms, and pages.
- Provide enough structured pet data to test filters, card displays, detail pages, owner pages, and revalidation.
- Generate or attach pet imagery with meaningful alt text and provenance notes.
- Save curated generated seed data for all content types in the project so future seed runs are deterministic.
- Keep all seed content fictional, satirical, and safe.

## Non-Goals

- Do not seed real people, real private contact information, or real pet listings.
- Do not seed user accounts; public accounts are a post-launch backlog item.
- Do not seed favorite/save data or direct messaging data; those are backlog features.
- Do not seed content that implies animal harm, neglect, abandonment, or unsafe handling.
- Do not recreate official copyrighted images, logos, or exact character likenesses for pop-culture references.

## Seed Order

Seed content in dependency order so references can be created reliably.

1. `petType` documents.
2. `owner` documents.
3. `testimonial` documents that do not require pet references.
4. `pet` documents connected to owners and pet types.
5. Pet-related testimonials that reference pets and/or owners.
6. `formDefinition` documents.
7. Singleton documents: `siteSettings`, `homePage`, `petIndexPage`, and required `systemPage` documents.
8. `marketingPage` documents for About, Process, Pricing, Contact, and Warranty.
9. Relationship patches for featured pets, featured owners, testimonials, and page sections if needed.

Reasoning:

- Pet types and owners must exist before pets reference them.
- Pets should exist before pages reference featured pets.
- Form definitions should exist before pages or CTAs reference them.
- Singletons should use explicit IDs and can be patched safely after dependencies exist.

## Stable Seed IDs

Use stable seed IDs so repeated seed runs can create-or-replace or patch content without creating duplicates. For ordinary Sanity documents, these should be represented as `seedId` values in JSON and stored in Sanity as a field such as `seedKey` or another implementation-approved source key. Let Sanity generate ordinary document `_id` values unless implementation constraints require otherwise.

The stored source key should be hidden or read-only in Studio. Editors should not need to manage seed identity during normal content editing.

Singleton documents are the exception. Use explicit Sanity document IDs for singletons so Studio structure, queries, preview links, revalidation handlers, and seed scripts all target the same records.

Singleton IDs:

- `siteSettings`
- `homePage`
- `petIndexPage`
- `systemPage-notFound`
- `systemPage-serverError`
- `systemPage-genericError`

Recommended seed ID patterns:

- Pet types: `petType-dog`, `petType-cat`, `petType-rabbit`
- Owners: `owner-dana-muffins`, `owner-graham-pelton`
- Pets: `pet-sir-nibbles`, `pet-pip-after-midnight`
- Testimonials: `testimonial-sir-nibbles-neighbor`
- Forms: `form-contact`, `form-owner-contact`, `form-warranty`
- System pages: `systemPage-notFound`, `systemPage-serverError`, `systemPage-genericError`
- Marketing pages: `marketingPage-about`, `marketingPage-process`, `marketingPage-pricing`, `marketingPage-contact`, `marketingPage-warranty`

Reference rules:

- JSON seed files should reference related records by `seedId`.
- Seed scripts should resolve ordinary document `seedId` values to Sanity `_id` values before creating references.
- Relationship patches should use resolved Sanity `_id` values after dependent documents exist.

Slug rules:

- Slugs should be lowercase, readable, and URL-safe.
- Marketing page slugs must avoid reserved routes such as `pets`, `owners`, `preview`, `studio`, `api`, and `_next`.
- Owner pages can exist at `/owners/[slug]`, but no owner index route should be seeded or linked.

## Suggested Seed Counts

Use enough records to exercise filters and relationships without making the first seed pass noisy. Since this project is intended to demonstrate a rich CMS experience, aim for a larger curated seed set rather than a tiny placeholder set.

- Pet types: all approved starter pet types from the content model.
- Owners: 16-24 fictional owners.
- Pets: 50 fictional pets by default, with a seed command and wizard option to generate a different positive whole-number count when needed.
- Testimonials: 16-24 testimonials.
- Forms: 3 forms.
- Home page: 1 singleton.
- Pet index page: 1 singleton.
- System pages: 3 initial pages.
- Marketing pages: 4 initial pages.

Pet distribution:

- Include common pets such as dogs, cats, rabbits, birds, fish, and reptiles.
- Include a few unusual but real pet types such as ferrets, chickens, axolotls, tortoises, and tarantulas.
- Make sure every major filter has a useful spread of values.
- Give each owner at least one pet where practical.
- Give several owners multiple pets so owner pages and inverse queries can be tested.
- Keep owner and pet satire connected. Owners should feel intentionally paired with their pets rather than randomly assigned.
- For pop-culture-inspired pets, create owner profiles that echo the same parody world or archetype without directly reproducing official characters.

## Required Seed Coverage

Every seeded pet should include:

- Name.
- Slug.
- Pet type reference.
- Owner reference.
- Plain-English breed, species, or variety label using a real breed/species/variety where applicable.
- `submittedBy` reference matching owner for phase one.
- `submissionStatus`.
- `source`.
- Listing headline.
- Listing summary.
- Availability status.
- Spoofed local distance in kilometers for listing cards and homepage cards.
- Owner-paid listing plan.
- Host payout amount, currency, and payout unit. The service model should read as owners paying temporary hosts to take the pet for a short stay, not temporary hosts paying to rent the pet.
- Structured filter fields.
- Card media or hero image fallback.
- Hero image gallery.
- Five to ten curated pet images saved under that pet's media folder.
- One- or two-paragraph detail description.
- At least two personality traits.
- At least one care note.
- At least one borrow term.
- At least one warning when useful.
- SEO fields.

Seeded pet listing summaries and detail descriptions should read as if the owner is personally writing the listing, not as neutral third-person copy about the owner. Use first-person phrasing such as "I am listing..." or "I need..." instead of "Owner Name is listing..." or "Owner Name has reached...". The listing summary should be a short version of the full description, suitable for cards, featured sections, and SEO fallbacks. Keep breed/species detail in the structured breed field and media prompts; do not foreground the breed in the owner-written description unless it directly supports a specific joke. The description should focus on personality, borrowability, why the pet is being listed, and the household problem the owner needs a break from. Keep the voice satirical, specific, and varied across pets. Owner voice can include playful format gimmicks when they fit the pet, such as a rabbit-chewed keyboard note missing a letter, but avoid repeating the same joke structure across many records.

Every seeded owner should include:

- Name.
- Slug.
- AI-generated portrait or curated portrait image.
- Tagline.
- User-generated-style bio.
- Public owner location in `City, Province` format.
- Member since date in the past.
- SEO fields.

Every seeded pet type should include:

- Name.
- Slug.
- Plural name.
- Filter label.
- Sort order.
- Icon.
- Project-owned SVG icon asset that visually matches Lucide's outline style.
- Lucide-compatible icon name for fallback and editor-friendly selection.

Every seeded page should include:

- SEO fields.
- Hero or equivalent page intro.
- AI-generated or curated hero/banner image where the page design calls for one.
- Clear CTA where the page blueprint expects one.
- Any reusable section images needed by the seeded page content.
- Enough reusable sections to demonstrate CMS editing without overfilling the page.

## Pet Field Value Strategy

Use consistent structured values so filters and UI scales can be built predictably.

Recommended availability values:

- `available`
- `temporarilyUnavailable`
- `pendingPickup`
- `retired`

Recommended source values:

- `demoSeed`
- `editorial`
- `userSubmitted`
- `imported`

Recommended submission status values:

- `draft`
- `pending`
- `approved`
- `rejected`
- `archived`

Rating-style fields:

- `chaosLevel`
- `messRisk`
- `energyLevel`

Use numeric values from `0` to `5`, allowing half-step values such as `2.5` when useful. The frontend filter behavior should treat these as minimum/range filters, such as `messRisk=3+`.

Categorical fields:

- `temperament`
- `pickupUrgency`
- `cuddlePolicy`

These categorical fields now have controlled values defined in `sanity/schemaTypes/documents/constants.ts` and used by the seed runner. Use exactly those values so filters and labels resolve consistently. Avoid one-off category strings that make filters hard to test.

`temperament` values:

- `regal`
- `friendly`
- `suspicious`
- `dramatic`
- `independent`

`pickupUrgency` values:

- `anytime`
- `withinSevenDays`
- `immediately`
- `appointmentOnly`

`cuddlePolicy` values:

- `openEnrollment`
- `consentRequired`
- `afterSnacksOnly`
- `lookDoNotCuddle`

## Shared browse/detail field alignment in seed data

Seeded pets should use one canonical set of values across both `/pets` and `/pets/[slug]`.

Shared fields that must stay aligned:

- `petType`
- `breed`
- `availabilityStatus`
- `pickupUrgency`
- `temperament`
- `cuddlePolicy`
- `chaosLevel`
- `messRisk`
- `energyLevel`

Alignment rules:

- The same stored enum should drive both browse filters and detail labels.
- Browse prototypes should not introduce alternate enum values that do not exist in the Sanity model.
- Detail-page satire should live in authored modules and supporting copy, not in incompatible structured field values.

## Pet detail editorial modules in seed data

For the richer pet detail plan, seed data should also support authored detail-page modules rather than deriving them later in code.

Recommended seed-backed fields:

- `vibeProfile[]`
- `fitGuidance`
- `dailySchedule[]`
- `careNotes[]`
- `borrowTerms[]`
- `warnings[]`
- `videos[]`

Seeder expectations:

- Preserve authored array order for `vibeProfile[]` and `dailySchedule[]`.
- Treat `fitGuidance` as authored copy, not generated copy.
- Keep `careNotes[]`, `borrowTerms[]`, and `warnings[]` as distinct editorial groups.
- Use `videos[]` for the dedicated detail-page video section.
- Do not automatically promote `cardMedia.lowFrameRateVideo` into `videos[]`.
- Omit optional modules cleanly when seed data does not provide them.

Authoring guidance for seed content:

- `vibeProfile[]` should usually have 2-4 items.
- `fitGuidance` lists should usually have 3-5 items per side.
- `dailySchedule[]` should usually have 3-6 time-ordered items.
- `videos[]` should be rare and intentional; not every pet needs one.

## AI Media Generation

Seeded content can use AI-generated imagery when real licensed images are not available. This applies to pets, owners, page hero images, banner backgrounds, reusable section images, and SEO/open graph images.

Recommended provider direction:

- Primary recommendation: use a hosted, low-cost image provider for the curated seed image pass, with a target budget under USD $5 for the initial approved asset set.
- Strong current candidates are Gemini 2.5 Flash Image or another current Gemini image model, Replicate with a fast FLUX model, or fal image generation. Re-check pricing immediately before implementation because model availability and pricing change.
- Use inline provider calls for media generation so progress is visible, generated files are written immediately, and failures are easier to recover from.
- True no-cash option: use a local open-source workflow such as ComfyUI with an approved open image model. This avoids API spend but costs setup time, local GPU/CPU runtime, storage, and more manual quality control.
- Use hosted free tiers only for experiments unless their terms, rate limits, and output rights are confirmed. Free tiers can change and may not be reliable enough for the final one-time seed pass.
- Avoid high-end paid image models unless a cheaper model cannot produce acceptable final assets. The seed set needs coherent, friendly demo imagery more than maximum photorealism.
- Keep the provider behind a small seed-media generation wrapper so it can be swapped without changing saved seed data shape.
- Normal `pnpm seed` should never call the image provider; it should use committed local media files and the media manifest.

Budget guidance:

- Estimate the full asset list before generation: pet images, owner portraits, page heroes, banner backgrounds, reusable section images, and OG images.
- Plan for 50 pets by default with five to ten approved images per pet, or roughly 250-500 approved pet images before owner portraits and page art. If the pet count is overridden, media prompt and approval volume scales with the selected count.
- Generate in small selected inline runs, review each run, and stop once each planned media slot has an approved image.
- Prefer one final image per required media slot, plus a small number of alternate attempts for difficult pets or hero art.
- Keep raw rejected generations outside Git.
- Treat provider quota and rate-limit errors as recoverable workflow failures: report the model, retry delay, and quota details; do not record media approval; and allow the user to retry a small preview run after quota, billing, or model settings are corrected.
- If a provider supports cheap draft models and higher-quality final models, use the cheap model for exploration and reserve final models for selected prompts only.

Generation modes:

- `preview`: generate one or two images for one or two selected pets so art direction, prompt shape, output size, and provider behavior can be reviewed before paying for a larger generation pass.
- `inline`: generate the selected prompt set one prompt at a time, write each generated image immediately, and print request, response, parse, write, processed, and remaining status as it runs.
- `upload`: upload approved local files from `sanity/seed/media/` to Sanity and update `media-manifest.json`, without calling an AI provider.

Generation configuration:

- Keep provider, model, image count, image size, aspect ratio, output format, and selected pet slugs configurable through command flags or a small config file.
- Do not hardcode Gemini model names, image dimensions, or per-pet image counts inside the generator implementation.
- Default image size should be practical for Sanity and Next.js display, but easy to override for testing or final generation.
- Current Gemini image pricing is model-specific. `gemini-2.5-flash-image` prices output images up to 1024x1024px at the same per-image amount, so requesting 512px is not expected to reduce cost on that model. `gemini-3.1-flash-image` lists separate lower pricing for 0.5K/512px output and higher pricing for 1K/1024px output.
- Preview mode should default to a tiny count, such as `--count 1` or `--count 2`.
- Inline mode should require an explicit flag such as `--confirm` or `--mode inline` so large generation jobs do not start accidentally.
- Scripts should print an estimated generation count and provider/model configuration before starting any paid media generation.

Recommended generator defaults:

- Provider: `gemini`.
- Model: `gemini-2.5-flash-image`, unless pricing, availability, or quality changes before implementation.
- Preview count: `2` images.
- Per-pet image count: varied targets between `5` and `10` approved images, with `5` as the default minimum when no pet-specific target is set.
- Image size: `1024x1024`.
- Aspect ratio: `1:1` for pet card and gallery images unless a field-specific override is required.
- Output format: `webp` when provider output and post-processing support it; otherwise save the provider output and convert during curation if useful.

Defaults can be overridden by command flags, for example `--provider`, `--model`, `--count`, `--size`, `--aspect`, `--format`, and `--pet`.

Pet image generation inputs:

- Pet name.
- Pet type.
- Breed or appearance.
- Longer owner-perspective pet description.
- Personality traits.
- Warnings or quirks.
- Desired image style: bright, friendly, modern marketplace listing, pet-forward, inspectable.

Pet prompt strategy:

- Use one base prompt per pet to preserve visual identity and tone across that pet's image set.
- Use a unique shot prompt for each generated image so the pet's five to ten images are varied and useful.
- Pet image sets should include varied camera angles, including side profiles, three-quarter views, full-body shots, seated/standing poses, and occasional close-ups. Avoid generating every image as a straight-on headshot.
- Build each final prompt from the pet base prompt, the image-specific shot prompt, and shared global style/safety rules.
- Avoid generating every image for a pet from the exact same prompt; repeated prompts tend to create wasteful near-duplicates.
- Pet image prompts should produce photorealistic candid phone-camera pet photos only: full-bleed, edge-to-edge, owner-snapped, informal, slightly imperfect, not professionally staged, no animated style, no cartoon, no illustration, no 3D render, no vector, no mascot, no card, no border, no frame, no UI layout, no poster, no caption, no labels, no logo, and no watermark.
- Each pet should have a stable visual identity used across all generated images, including primary color, secondary color/detail, distinctive markings, and eye color. Every prompt for that pet must repeat those details so the pet does not change color or markings between gallery shots.
- Do not pass satirical listing copy, warning copy, legal jokes, waiver jokes, or other text-heavy content into pet image prompts. Those phrases can cause image models to render unwanted readable props. Prefer neutral constraints such as "no readable items" and "no flat rectangular props" instead of repeating legal or paperwork-related words.
- Store the pet base prompt and image-level shot prompts directly with the relevant pet seed record in `pets.json`.

Example pet prompt shape:

```json
{
  "id": "pet-sir-nibbles",
  "mediaPrompt": {
    "basePrompt": "A tiny white rabbit with suspiciously regal confidence, bright friendly modern marketplace photography, airy pastel interior, soft daylight, playful satirical danger cues, not scary, not violent.",
    "imagePrompts": [
      {
        "role": "card",
        "shotPrompt": "Front-facing seated portrait, full body visible, clean background, strong eye contact, centered composition."
      },
      {
        "role": "gallery",
        "shotPrompt": "Three-quarter angle on a rounded sofa, one slipper nearby, cozy home setting, playful expression."
      }
    ]
  }
}
```

Pet image count:

- Generate enough attempts to curate five to ten approved images per pet.
- Use varied target counts across the seed set so pets do not all have identical gallery depth.
- Assign pet-specific image targets arbitrarily during seed content planning, such as `5`, `6`, `7`, `8`, `9`, or `10`, based on how visually important or feature-worthy the pet is.
- Use one primary card image, several detail-gallery images, and optional alternate crops where useful.
- Keep the pet visually consistent across its approved image set.
- Store pet image metadata directly with the relevant pet seed record in `pets.json`.

Owner portrait generation inputs:

- Owner name.
- Owner tagline.
- Owner bio.
- Owner location.
- Owned pets and shared satire theme.
- Desired image style: photorealistic casual phone selfie of a fictional person, friendly, informal, natural light, realistic skin texture, not animated, not illustrated, not a real-person identity mimicry.

Page and content image generation inputs:

- Page type, such as home, about, process, pricing, contact, or pet index.
- Section type, such as hero, banner, CTA, process summary, alert, or testimonial block.
- Headline and supporting copy.
- Featured pet or pet type references when relevant.
- Desired image style: photorealistic banner/background elements, pet-related objects, bright airy negative space, usable behind overlaid website text, not a finished poster, not UI, not text-bearing.

Generation rules:

- Keep generated images fictional.
- Avoid dark, blurred, overly atmospheric, or stock-like images.
- Do not generate images showing harm, neglect, distress, blood, weapons, or unsafe handling.
- For pop-culture-inspired pets, generate parody-friendly original imagery rather than exact official character likenesses or film stills.
- For owners, generate fictional people only; do not mimic real people, actors, public figures, or exact film characters.
- Prefer clean pet portraits, friendly owner portraits, and simple environmental context.
- Page hero and banner images should leave room for overlay text or glass panels where needed.
- Generate an image fallback before any optional video or animated media.

Required metadata:

- Alt text.
- Caption when useful.
- Generation prompt or prompt summary.
- Generation provider or source note when known.
- Provenance note that the image is AI-generated seed content.

Storage strategy:

- Save curated generated seed images locally in the repo and commit them as project seed assets.
- Save unreviewed generated images under `sanity/seed/generated/`, which is ignored by Git.
- Mirror the approved media folder structure inside `sanity/seed/generated/` so approved files can be moved or copied into `sanity/seed/media/` without renaming.
- Upload those same curated local images to Sanity assets during the seed operation.
- Treat the committed local image files and media manifest as the repeatable source of truth for image seeding.
- Store references on `heroImages`, `cardMedia`, owner portraits, page heroes, reusable content images, banner backgrounds, and SEO/open graph images as appropriate.
- Keep unreviewed raw generations out of Git; commit only curated images approved for the demo seed set.

## Video Generation Planning

Video is optional for phase one, but seed data should be prepared so video can be generated later without rewriting the content plan.

Recommended direction:

- Store pet video generation details directly on the relevant pet seed record in `pets.json`, near the card media or gallery media it would enhance.
- Store page/banner video generation details directly in `pages.json` with the relevant page or section.
- Treat video generation as a separate intentional workflow, not part of normal `pnpm seed`.
- Do not generate or commit video binaries for the initial seed pass.
- Save video prompts and motion notes only so future generation can reuse the same curated seed content.
- Generate videos from approved still images when possible so pets, owners, and page art stay visually consistent.
- Keep video short, lightweight, muted by default, and suitable for lazy loading.
- Use still images as the canonical fallback for every video slot.

Planned video data should include:

- Stable video ID.
- Related document ID and field path, such as `pet-sir-nibbles.cardMedia.video`.
- Intended placement, such as pet card, pet detail gallery, page hero, or CTA banner.
- Source image reference.
- Prompt or motion prompt.
- Negative prompt or safety notes.
- Duration target.
- Aspect ratio.
- Resolution target.
- Looping expectation.
- Fallback image reference.
- Provider/model when generated.
- Generation status, such as `planned`, `generated`, `approved`, `rejected`, or `deferred`.

Video provider guidance:

- True no-cash video generation is possible with local open-source tooling, but it is more hardware-intensive and slower than image generation.
- Hosted video generation is likely to cost money. Use it sparingly for a small number of high-impact loops rather than trying to generate video for every pet.
- For an under-$5 target, prioritize short card/detail loops only for featured pets and maybe one or two page hero/background clips.
- Re-check provider pricing before implementation; video models are commonly billed per second or per generated clip, and failed generations or retries can affect the practical cost.

Storage strategy:

- Commit planned video metadata with the seed data even before videos exist.
- If pet videos are generated, save only approved final clips under that pet's `sanity/seed/media/pets/[pet-slug]/videos/` folder after reviewing file size.
- If page videos are generated, save only approved final clips under a page-owned media folder such as `sanity/seed/media/pages/[page-slug]/videos/`.
- Avoid committing large raw videos, rejected videos, or intermediate upscales.
- Upload approved local video files to Sanity only when the frontend and schemas support video fields.
- Normal seed runs should attach approved videos when present and otherwise fall back to still images.

## Card Media

Card media should be image-first.

Rules:

- Every pet card must have an image fallback.
- Low-frame-rate video or animated media is optional.
- Optional card video should be lazy-loaded.
- Optional card video must be muted and should not autoplay with sound.
- Respect reduced-motion preferences.
- Do not make card video required for any pet.

## Pop-Culture-Inspired Seeds

Pop-culture pet references are allowed as satire, but they should be handled as parody-friendly archetypes.

Good direction:

- A tiny white rabbit with a medieval danger rating.
- A cute creature with strict after-midnight care rules.
- A heroic dog with suspiciously cinematic timing.
- A dramatic cat who believes every household is a kingdom.

Avoid:

- Official names when they make the listing feel like a direct reproduction.
- Exact costume, scene, still, or character likeness recreation.
- Official logos or franchise marks.
- Copy implying endorsement by a rights holder.

Relationship guidance:

- Pair pop-culture-inspired pets with owners who strengthen the same joke.
- For a tiny white rabbit with a medieval danger rating, the owner can be an exaggerated medieval quest-adjacent character or caretaker, without using exact official character names or reproducing the film's dialogue.
- For a cute creature with strict after-midnight care rules, the owner can be a suspicious antique-shop operator, overly confident caretaker, or rule-obsessed borrower, without recreating official characters.
- Owner bios, pet warnings, testimonials, and care notes should cross-reference each other so the seed content feels written as a connected demo world.
- Avoid random owner-pet pairings unless the randomness itself is the joke and is clear in the copy.

## Seeded Forms

Initial form definitions:

- Contact form: general project contact.
- Owner contact form: used by pet detail owner contact drawer.
- Warranty/compatibility inquiry form: used by the pet index final CTA and contact/warranty page.

Form behavior:

- Phase one sends a branded acknowledgement email to the submitter through Mailgun. There is no internal notification email.
- Do not send emails directly to individual owners in phase one.
- Include hidden context fields where useful, such as pet ID, pet name, owner ID, source page, and form type.
- Success and error copy should use the Pet Share voice.

Example error:

- "The dog ate the email. Please try again."

Example success:

- "Your message made it through the chew-proof tunnel."

## Seeded Pages

Singletons:

- `siteSettings`
- `homePage`
- `petIndexPage`
- `systemPage-notFound`
- `systemPage-serverError`
- `systemPage-genericError`

Marketing pages:

- About.
- Process.
- Pricing.
- Contact or warranty.

Page seeding rules:

- Singleton pages and marketing pages should follow the same one-time generate, review, save, and replay workflow as pets, owners, testimonials, and forms.
- Normal seed runs should replay saved page content rather than regenerating homepage, pet index, system page, site settings, or marketing page copy.
- Use reusable sections rather than hardcoded page bodies.
- Keep marketing pages flexible enough to demonstrate the page-builder model.
- Do not inline pet, owner, pet type, or form internals into marketing page section arrays.
- Reference reusable content and documents where appropriate.
- Seed system pages with clear status labels, satirical pet-related copy, no-index SEO, and recovery CTAs.
- Keep system page fallback copy duplicated in code during implementation so error rendering does not depend on Sanity availability.

## Validation Expectations

Seed data should pass the same validation rules expected in Studio.

Before treating seed data as ready:

- Slugs are present and unique.
- Required references resolve.
- Meaningful images have alt text.
- Public pet queries show only approved/published pets.
- Owners have associated pets where expected.
- Singleton IDs are correct.
- Reserved marketing slugs are not used.
- System pages include clear fallback-friendly copy and no-index SEO.
- Form definitions include stable field names.
- Generated images have provenance notes.

## Re-Seed Behavior

The seed process should be repeatable and deterministic.

Primary seed workflow:

Use the guided wizard as the default workflow for full demo seed review, approval, media preparation, and Sanity population:

```bash
pnpm seed:wizard
```

The wizard should remain the user-facing path because it keeps approvals explicit and prevents accidental Sanity writes or AI media generation. It should cover the complete seed set: site settings, singleton pages, marketing pages, pet types, owners, pets, testimonials, forms, page relationships, and media prompts.

The wizard should start with these workflow choices:

1. **Quickly replace the website without media**: choose the generated pet count, generate and approve the content preview, purge existing seeded documents, and write fresh content to Sanity while skipping media approval and local media upload.
2. **Quickly replace the website with approved local media**: choose the generated pet count, generate and approve the content preview, approve files already in `sanity/seed/media/`, purge existing seeded documents, and write fresh content/media references to Sanity.
3. **Wizard steps**: run the full guided flow for detailed content approval, media prompt packages, optional human-run inline media generation, media approval, optional purge, and final Sanity write.
4. **Start fresh reset**: purge seeded Sanity documents without writing replacements, clear `sanity/seed/generated/`, and clear approved local media under `sanity/seed/media/`.

The quick replace choices should be the simplest path for generating X pets and all content pages. They must not call AI media providers. The final Sanity write must still require explicit confirmation and `SANITY_API_WRITE_TOKEN`.

The start fresh reset choice should be clearly destructive, require a typed confirmation such as `RESET`, and preserve the committed seed templates under `sanity/seed/data/`.

The detailed wizard path should proceed through the full workflow in one run, asking for `y/N` confirmation before each step:

0. Validate required local environment values and print setup instructions for anything missing.
1. Ask for the generated pet count.
2. Ask whether the media prompt package should include all media or pet images only.
3. Generate local preview files for all seed documents.
4. Approve the full content preview.
5. Prepare media prompt packages for the selected media scope.
6. Optionally run human-confirmed preview or inline media generation from the prepared prompt package.
7. Approve reviewed media after approved files are copied into `sanity/seed/media/`.
8. Populate Sanity from approved seed data and approved local media.

The pet-only media scope should skip owner portrait, page hero, and marketing/background image prompts without removing owner, page, or marketing documents from the content preview or Sanity seed write.

The wizard should treat upstream `n` answers as branch decisions. If media package preparation is skipped, media generation and media approval should be skipped for that run. If media generation is skipped, media approval should also be skipped instead of asking the user to approve or upload unchanged media.

Direct seed commands may still exist for debugging, automation, and targeted reruns, but README and handoff instructions should point users to the wizard first.

Targeted update notes:

- `pnpm seed:sanity -- --confirm --only homePage --skip-media-upload` can replace the homepage singleton while preserving existing page media fields.
- Targeted homepage writes do not automatically update referenced documents such as testimonials, owners, pets, or forms.
- Testimonial copy can come from two places: curated entries in `sanity/seed/data/testimonials.json` and generated testimonial logic in `scripts/seed-sanity.mjs`.
- If homepage testimonial tone changes, update both curated testimonial JSON and the generated testimonial template so a later full reseed does not restore mismatched copy.
- The current seed tooling does not expose a first-class testimonial-only command. Until that exists, testimonial-only Sanity updates require either a full reseed or a narrow one-off Sanity mutation.
- When doing narrow one-off Sanity mutations, also update the saved seed source so the next deterministic seed replay preserves the same content.
- Before assuming a content push failed, verify the Sanity document directly. The rendered Next.js page may still show stale content because Sanity CDN caching and Next.js fetch caching are separate.

Seed environment validation:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION` are required before seed preview or Sanity write steps.
- `SANITY_API_WRITE_TOKEN` is required only before the final Sanity write/upload step.
- `GEMINI_API_KEY` is required only for the human-confirmed media generation step; normal preview, approval, and Sanity seed writes must not call Gemini.
- Missing values should produce actionable instructions that point the user to Sanity Manage, `.env.example`, or Google AI Studio as appropriate.

Progress and purge behavior:

- Sanity writes should print processed and remaining counts for documents and approved media assets.
- Optional purge should be available before writing fresh seed content so a local or demo dataset can return to a clean seeded state.
- A purge-only reset should be available when the intended result is no seeded website content, not an immediate replacement write.
- Purge behavior should target seeded documents only: documents with `seedKey` plus controlled singleton IDs. It must not delete arbitrary editor-created documents.
- Destructive purge behavior must require explicit user confirmation in the wizard or explicit command flags for direct commands.

Generation should not happen on every normal seed run for any content type. The intended workflow is:

1. Generate a larger curated seed set once, including singletons, marketing pages, pet types, owners, pets, testimonials, forms, and page relationships.
2. Review and revise the generated content.
3. Save the approved seed data in the project.
4. Use normal seed commands to replay the saved seed data into Sanity.
5. Regenerate only when intentionally running a separate generation workflow.

Recommended saved seed artifact layout:

```text
sanity/
  seed/
    data/
      petTypes.json
      owners.json
      pets.json
      testimonials.json
      forms.json
      pages.json
    media/
      pets/
        pet-sir-nibbles/
          images/
          videos/
        pet-pip-after-midnight/
          images/
          videos/
      owners/
      pages/
    generated/        # Gitignored review workspace; mirrors media/
      pets/
        pet-sir-nibbles/
          images/
      owners/
      pages/
    media-manifest.json
    README.md
```

Saved seed data rules:

- Commit curated text/JSON seed data when it is approved for the demo.
- Keep stable IDs in the saved data.
- Keep stable seed IDs, slugs, and indexes out of human-facing display names, titles, and testimonial author names.
- Keep breed fields plain English and realistic, such as "Golden Retriever", "Holland Lop", or "Ball python"; satire belongs in summaries, warnings, and care notes instead of fake content-type-like breed values.
- Pet image and video prompts must include the pet's selected breed, species, or variety so generated media visually matches the structured pet data.
- Keep owner-pet-testimonial relationships explicit in the saved data.
- Keep pet image and pet video metadata inside the relevant pet object in `pets.json`.
- Keep singleton and marketing page section content explicit in the saved data.
- Keep page image and page video metadata inside the relevant page or section object in `pages.json`.
- Include generation metadata and provenance notes for AI-generated text and images where useful.
- Do not commit secrets, API responses containing private metadata, or unreviewed raw generation dumps.
- Commit curated generated image binaries under `sanity/seed/media/`.
- Do not commit anything under `sanity/seed/generated/`.
- Before deployment readiness, resolve the production seed media strategy in `docs/backlog.md` so approved media remains available for reseeding without unnecessarily bloating production deployments.
- Commit approved generated video binaries only after file size review, using the same pet-owned or page-owned media folders as the related images.
- Upload committed seed images to Sanity from the local files so asset IDs can be recreated or remapped through `media-manifest.json`.
- Upload committed seed videos to Sanity from local files only when video support is implemented.

Recommended `media-manifest.json` shape:

```json
{
  "version": 1,
  "generatedAt": "2026-06-27T00:00:00.000Z",
  "assets": [
    {
      "localPath": "sanity/seed/media/pets/pet-sir-nibbles/images/hero-01.webp",
      "sourceGeneratedPath": "sanity/seed/generated/pets/pet-sir-nibbles/images/hero-01.webp",
      "ownerType": "pet",
      "ownerId": "pet-sir-nibbles",
      "ownerSlug": "sir-nibbles",
      "fieldPath": "heroImages[0]",
      "mediaRole": "hero",
      "mimeType": "image/webp",
      "alt": "Sir Nibbles sitting politely in a sunny room despite obvious medieval danger warnings.",
      "caption": "Available for brave households with reinforced slippers.",
      "sanityAssetId": null,
      "sanityAssetRef": null,
      "status": "approved",
      "attribution": {
        "sourceType": "aiGenerated",
        "provider": "gemini",
        "model": "to-be-confirmed",
        "promptSummary": "Bright friendly marketplace pet portrait of a tiny white rabbit with playful danger cues.",
        "generatedAt": "2026-06-27T00:00:00.000Z",
        "reviewedBy": "project-owner",
        "usageNote": "Fictional AI-generated seed image for the Pet Share demo."
      }
    }
  ]
}
```

Manifest rules:

- `localPath` points to the approved, committed file used by deterministic seed runs.
- `sourceGeneratedPath` is optional and points to the gitignored review file when known.
- `sanityAssetId` and `sanityAssetRef` can be filled after upload so repeated seed runs can reuse or remap assets.
- `fieldPath` identifies where the media belongs in the seed document.
- `mediaRole` should use stable values such as `card`, `hero`, `gallery`, `ownerPortrait`, `pageHero`, `sectionImage`, `ogImage`, or `plannedVideoFallback`.
- `status` should be `approved` for committed media; rejected or draft media should remain in `sanity/seed/generated/`.

AI attribution rules:

- Store attribution metadata for each approved generated image in the media manifest.
- Store a short prompt summary rather than full private prompt logs unless the full prompt is useful for deterministic regeneration.
- Do not store API keys, raw provider responses, account IDs, billing IDs, or other private metadata.
- Store future video prompts in `pets.json` or `pages.json`, but mark them as `planned` until an actual approved video file exists.

Preferred behavior:

- Create or replace seed documents by stable ID.
- Patch relationship arrays after dependent documents exist.
- Avoid creating duplicate documents on repeated runs.
- Avoid deleting editor-created content unless a seed reset command explicitly says it will do so.
- Do not call AI generation providers from `pnpm seed`; use saved seed artifacts.

Primary command:

- `pnpm seed:wizard`: guide the user through full dataset preview generation, approval, media package preparation, optional human-confirmed inline media generation, media approval, optional purge, and the final Sanity write in one interactive yes/no flow.

Direct commands:

- `pnpm seed:sanity`: dry-run the full Sanity seed document preparation.
- `pnpm seed:sanity -- --preview`: write local preview files for all generated seed documents and media prompts under `sanity/seed/generated/preview/`.
- `pnpm seed:sanity -- --preview --pet-count 25`: write local preview files for a custom generated pet count.
- `pnpm seed:sanity -- --preview --only homePage`: write local preview files for only the homepage document.
- `pnpm seed:sanity -- --preview --media-scope pets`: write local preview files for all generated seed documents while limiting media prompts to pet images.
- `pnpm seed:sanity -- --confirm`: write approved seed content and approved local media to Sanity.
- `pnpm seed:sanity -- --confirm --pet-count 25`: write approved seed content using the same custom pet count reviewed during preview.
- `pnpm seed:sanity -- --confirm --purge`: purge existing seeded documents, then write approved seed content and approved local media to Sanity.
- `pnpm seed:sanity -- --confirm --purge-only`: purge existing seeded documents without writing replacement content.
- `pnpm seed:sanity -- --confirm --skip-media-upload`: write approved seed content without uploading approved local media.
- `pnpm seed:sanity -- --confirm --only homePage --skip-media-upload`: replace only the homepage in Sanity while preserving existing page media fields where possible.
- `pnpm seed:media -- --mode preview --pet pet-sir-nibbles --confirm`: generate a tiny image sample for review using default provider, model, count, and size.
- `pnpm seed:media -- --mode inline --provider gemini --model gemini-2.5-flash-image --count 5 --size 1024x1024 --confirm`: generate five selected prompts inline using the chosen provider, model, and size.
- `pnpm seed:media -- --mode inline --confirm`: generate the selected prompt set inline using default provider, model, count, and size.
- `pnpm seed:media -- --mode upload`: upload approved media from `sanity/seed/media/` and update `media-manifest.json`, if implemented separately from `seed:sanity`.
- `pnpm seed:video`: intentionally generate or upload approved seed video assets, if implemented later.

Generation and destructive seed operations should be clearly named and should not run by accident.

## Open Questions

- Which hosted image/video provider will be used if local generation is not practical?
- Which exact seed assets are worth video generation versus still-image fallback only?
