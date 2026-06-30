# Pet Share Seed Data

This directory contains saved seed data and local media for Pet Share.

The files under `data/` define the saved JSON shape that Sanity schemas, seed scripts, queries, and frontend types should align with. The seed runner expands this saved demo set into a browsable dataset with site settings, homepage content, pet index content, system pages, marketing pages, pet types, owners, fictional pets, testimonials, forms, and media prompts. The default generated pet count is 50 and can be changed for previews or seed writes.

Use the guided wizard as the primary seed workflow:

```bash
pnpm seed:wizard
```

The wizard validates required environment values up front and offers three workflow choices:

1. **Quickly replace the website without media**: choose the generated pet count, generate and approve the content preview, purge existing seeded documents, and write fresh content to Sanity while skipping media approval and local media upload.
2. **Quickly replace the website with approved local media**: choose the generated pet count, generate and approve the content preview, approve files already in `sanity/seed/media/`, purge existing seeded documents, and write fresh content/media references to Sanity.
3. **Wizard steps**: run the full guided flow for detailed content approval, media prompt packages, optional human-run inline media generation, media approval, optional purge, and final Sanity write.
4. **Start fresh reset**: purge seeded Sanity documents without writing replacements, clear `sanity/seed/generated/`, and clear approved local media under `sanity/seed/media/`.

The quick replace choices are the simplest path when you want to generate X pets and all content pages. They do not call AI media providers. The final Sanity write still requires explicit confirmation and `SANITY_API_WRITE_TOKEN`.

The start fresh reset choice is destructive and requires a typed `RESET` confirmation. It keeps `sanity/seed/data/` because those files are the committed seed templates used to generate future preview data.

The detailed wizard path proceeds through the seed workflow in one run, asks for the generated pet count, asks whether to prepare all media prompts or pet-image-only prompts, asks `y/N` before each step, creates local review and approval files under `sanity/seed/generated/`, and requires explicit confirmation before any Sanity write. Review files include the generated content documents and media prompt packages for the selected media scope.

When an upstream media step is skipped, dependent media steps are skipped for that wizard run. Skipping media generation means the wizard will not ask to approve newly generated media.

Required seed environment values:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: required for all seed workflows.
- `NEXT_PUBLIC_SANITY_DATASET`: required for all seed workflows.
- `NEXT_PUBLIC_SANITY_API_VERSION`: required for all seed workflows.
- `SANITY_API_WRITE_TOKEN`: required only for the final Sanity write/upload step.

If any value is missing, the wizard prints where to get it and which `.env.local` key to set.

Use the direct commands below only when you need to run one seed step manually or debug the wizard.

Run a dry-run with:

```bash
pnpm seed:sanity
```

Write local preview files with:

```bash
pnpm seed:sanity -- --preview
```

Override the generated pet count with:

```bash
pnpm seed:sanity -- --preview --pet-count 25
```

Prepare a preview for the full content dataset while limiting the media prompt package to pet images only:

```bash
pnpm seed:sanity -- --preview --media-scope pets
```

Preview only the homepage document with:

```bash
pnpm seed:sanity -- --preview --only homePage
```

Write to Sanity with:

```bash
pnpm seed:sanity -- --confirm
```

When using direct commands, pass the same `--pet-count` value to preview and confirm so the reviewed preview matches the dataset write.

Purge existing seeded Sanity documents before writing fresh seed content with:

```bash
pnpm seed:sanity -- --confirm --purge
```

Purge existing seeded Sanity documents without writing replacement content with:

```bash
pnpm seed:sanity -- --confirm --purge-only
```

Write content without uploading approved local media with:

```bash
pnpm seed:sanity -- --confirm --skip-media-upload
```

Replace only the homepage in Sanity while preserving existing page media with:

```bash
pnpm seed:sanity -- --confirm --only homePage --skip-media-upload
```

The write command requires `SANITY_API_WRITE_TOKEN`. Do not commit real tokens.

Media rules:

- `media-manifest.json` records the planned and approved media assets referenced by seed data.
- Milestone 1 manifest entries may use `status: "planned"` before actual image files exist.
- Approved generated files should eventually live under `sanity/seed/media/`.
- Unreviewed generated files belong under `sanity/seed/generated/`, which is ignored by Git.
- The wizard's media approval step can copy reviewed generated files from `sanity/seed/generated/media/` into `sanity/seed/media/`.
- Normal seed replay must not call AI generation providers.
- Missing approved image files are allowed during early development. The seed runner preserves alt text and the frontend renders placeholders until approved media is copied into `sanity/seed/media/`.
- The wizard prepares media prompt packages for the full demo dataset, can run preview or inline media generation, and pet image prompts must explicitly account for the pet's selected breed, species, or variety.
- The wizard can also prepare pet-image-only media prompts, which skips owner portrait, page hero, and marketing/background image prompts without removing those documents from the seed preview.
- Pet image prompts should generate photorealistic full-bleed candid phone-camera photos of the pet only, as if snapped by the owner. They should not look like animated images, cartoons, illustrations, 3D renders, vectors, mascots, professional studio portraits, cards, frames, borders, posters, UI mockups, labels, logos, captions, or watermarks.
- Pet image prompts repeat a stable visual identity for each pet so color, markings, and eye details stay consistent across multiple generated shots.
- Pet image prompt sets should vary the camera angle with side profiles, three-quarter views, full-body poses, and selective close-ups instead of only straight-on headshots.
- Pet image prompts must not include satirical listing copy, waiver jokes, legal jokes, warning text, or paperwork-related words because those phrases can cause unwanted readable props, signs, labels, or cards.
- Owner image prompts should generate photorealistic casual selfies, not animated or illustrated portraits.
- Page hero prompts should generate banner/background elements with open space for overlaid text, not complete posters or UI mockups.
- Provider-backed image generation must be run by a human and requires explicit confirmation.
- Sanity seed writes upload approved local media from `sanity/seed/media/` and attach matching image references to seeded documents.
- Inline media generation calls the provider one prompt at a time, writes each generated file immediately, and prints processed/remaining counts plus request, response, parse, and write status.
- Use small preview runs before larger inline runs. Direct commands remain available: run `pnpm seed:media -- --mode preview --count 1 --confirm` for a sample, then `pnpm seed:media -- --mode inline --confirm` after the sample direction is approved.
- Gemini quota or rate-limit failures should stop media generation without approving files. Resolve quota, billing, model, or retry-window issues, then rerun the wizard's media generation step.
- Sanity writes, optional purges, and approved media uploads should print processed and remaining counts.
