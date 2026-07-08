# Page Builder Components

Pet Share Standard Pages use Sanity `sections[]` arrays as a page builder. These documents still use the internal Sanity type name `marketingPage` for migration stability. Each section should model content semantics first, while the frontend owns the polished layout and visual variants.

## Organization Pattern

Group new section schemas by category under `sanity/schemaTypes/objects/sections/` when practical:

```text
sanity/schemaTypes/objects/sections/
  process.ts
  pricing.ts
  marketing.ts
  content.ts
  media.ts
```

The existing `sanity/schemaTypes/objects/sections.ts` file currently acts as the registry for section array members and exported object types. New organized section files should export individual object schemas, then `sections.ts` should import and register them in:

- `sectionMembers`: controls what editors can insert into page-builder arrays.
- `sectionObjects`: controls which object schemas are available to Sanity Studio.

Use editor-facing titles with category prefixes, such as `Process: Step path`, so the insert menu stays scannable even before thumbnail previews are added.

## Approved Insert Menu

Current editor-insertable page-builder blocks:

- `hero`
- `contentSection`
- `calloutBlock`
- `statBlock`
- `featureList`
- `accordion`
- `pricingComparisonTable`
- `pricingValueSection`
- `pricingPackageGrid`
- `pricingCtaBand`
- `processPathSection`
- `warrantyConditionGrid`
- `warrantyNoticeSection`
- `warrantyClaimPrep`
- `ctaGroup`

Removed legacy or under-polished page-builder blocks:

- `alertBlock`
- `warningBlock`
- `testimonialBlock`
- `pricingTier`
- Page-builder `videoEmbed`

Notes:

- Pet-level video support remains available through the pet document schema. Only generic page-builder video sections were removed.
- Testimonials remain available as documents and are rendered by dedicated page surfaces such as the homepage. The generic page-builder testimonial block was removed because it was not used by seeded pages and did not match the newer component quality bar.
- `ctaGroup` remains insertable because legacy seeded page CTAs are normalized into this block. Prefer page-specific CTA blocks such as `pricingCtaBand` when a richer component exists.

## Component Contract

Every page-builder component should include:

- A Sanity object schema with `defineType`, `defineField`, and `defineArrayMember`.
- A clear `title`, `icon`, validation rules, and `preview.prepare`.
- Editor-friendly field descriptions for choices that affect frontend rendering.
- Curated option lists instead of fragile free-text values when editors are choosing from known values.
- Visual Studio inputs for important options such as tone, style, and icons when plain radio buttons are not descriptive enough.
- A GROQ projection in `sanity/queries/fragments.ts`.
- A typed renderer in `components/features/sections/page-sections.tsx`.
- Seed examples in `sanity/seed/data/pages.json` when the component is used by seeded pages.
- Seed normalization in `scripts/seed-sanity.mjs` when the component has nested CTAs, nested blocks, media asset keys, or other values that need conversion before writing to Sanity.
- Documentation in this file.

Shared objects should be reused before adding page-specific fields:

- `sectionHeader` for section title, eyebrow, body, and alignment.
- `cta` and `ctaGroup` for actions.
- `imageWithAlt` for meaningful images.
- `portableText` for rich text body content.

Shared `sectionHeader` and `ctaGroup` alignment values support `left`, `center`, and `right`. Add new alignment values only when the frontend has a corresponding responsive treatment.

After schema or query changes, run:

```bash
pnpm typegen
pnpm typecheck
pnpm lint
```

## Studio UX Pattern

For broader custom Studio input guidance, including dialog layering, scrollable picker layouts, and Sanity-native styling rules, use `docs/sanity-studio-extensions.md`.

Use `sanity/schemaTypes/objects/studio-options.ts` for reusable editor options:

- `alignmentOptions`: alignment values with editor descriptions for left, center, and right.
- `processToneOptions`: tone values with labels, descriptions, and color metadata.
- `ctaStyleOptions`: CTA style values with labels, descriptions, and button color metadata.
- `heroLayoutOptions`: shared hero layout choices.
- `contentLayoutOptions`: shared content section layout choices.
- `calloutToneOptions`: generic callout tone choices.
- `featureIconStyleOptions`: feature-list icon badge choices.

Use `sanity/components/studio-string-inputs.tsx` for reusable custom Studio inputs:

- `VisualStringOptionsInput`: renders string options as descriptive visual cards with color indicators.
- `IconPickerInput`: opens a searchable modal browser for the Lucide icon set and stores the selected icon name as a string.

The shared icon registry lives in `lib/icons/lucide-icons.ts`. It supports current Lucide export names while preserving older seed aliases such as `home`, `search`, and `calendarCheck`.

Prefer these inputs when a field affects visible frontend styling. A plain string or radio input is fine only when the value is self-explanatory to editors.

Current fields using this pattern:

- `hero.layoutHint`
- `contentSection.layoutHint`
- `calloutBlock.tone`
- `featureList.iconStyle`
- `processPathSection.tone`
- `processPathSection.icon`
- `processStep.icon`
- `cta.style`
- `cta.icon`
- `ctaGroup.alignment`
- `sectionHeader.alignment`
- Section icon fields in callouts, stats, hero slides, and feature items.

Generic block Studio expectations:

- Use field groups such as `Content`, `Display`, `Media`, `Actions`, `Rows`, and `Plans` so editors can scan complex blocks quickly.
- Add descriptions to fields when the value changes frontend behavior, requires a specific content shape, or has a common source of confusion.
- Use `preview.prepare` to surface the block title, item counts, selected tone/layout/style, and selected icon where useful.
- Prefer one polished generic block over several page-specific lookalikes when the editing model is the same.
- Keep frontend-only choices out of Sanity unless editors need to make that choice deliberately.

When adding a new visual choice:

1. Add the option to the relevant options array in `studio-options.ts`.
2. Reuse `VisualStringOptionsInput` or `IconPickerInput` on the schema field.
3. Update the frontend renderer so the value changes visible output.
4. Update this documentation with the new field.

When adding an icon field, do not add a restrictive `options.list` unless the field must be limited for product reasons. Prefer `IconPickerInput` with a plain string field so editors can search the broader Lucide set.

## Process: Step Path

Schema:

- `sanity/schemaTypes/objects/sections/process.ts`
- Object type: `processPathSection`
- Studio title: `Process: Step path`

Purpose:

Use this for a process lane with a heading, body copy, tone, optional icon, nested steps, and an optional CTA. It is intended for sections like:

- Owners sharing their pet.
- Temporary hosts.
- Any future step-by-step marketing flow.

Fields:

- `title`: section heading.
- `body`: short explanatory copy.
- `tone`: visual selector for `owner`, `host`, or `neutral`; controls the frontend color treatment.
- `icon`: optional icon selected through the shared icon picker and rendered with `IconBadge`.
- `steps`: two to six nested `processStep` objects. Step numbers are derived from array order.
- `cta`: optional section-level CTA.

Studio behavior:

- Fields are grouped into `Content`, `Display`, `Steps`, and `CTA`.
- New process path sections start with four placeholder steps.
- Editors should drag steps into the desired order instead of setting a manual order number.

Frontend renderer:

- `ProcessPathSection` in `components/features/sections/page-sections.tsx`.
- Rendered through the shared `PageSections` switch, so it can be used on any page-builder-backed page.

Seed example:

- `sanity/seed/data/pages.json`
- The seeded `/how-it-works` page uses two `processPathSection` blocks: one for owners and one for temporary hosts.

Notes:

- Keep steps nested when they belong only to this section.
- Use references only if the same process steps need central management across many pages.
- Do not store layout details such as column counts or heading levels in Sanity. The frontend chooses responsive layout and semantic heading levels.
- Do not add `processStep` directly as a generic page-builder section. Use `processPathSection` so related steps stay grouped.

## Pricing: Approved Page Blocks

Schema:

- `sanity/schemaTypes/objects/sections/pricing.ts`
- Object types: `pricingValueSection`, `pricingPackageGrid`, `pricingCtaBand`

Purpose:

Use these blocks for the approved clean pricing-page direction. They turn the static pricing prototype into reusable CMS sections while keeping the editor model semantic:

- `pricingValueSection`: short value cards that clarify the pricing model and can be moved independently from the hero.
- `pricingPackageGrid`: grouped owner-paid listing packages with price, duration, description, icon, tone, optional badge, and feature bullets.
- `pricingCtaBand`: final conversion band with CTA group and short proof items.

Studio behavior:

- Pricing icons use the shared `IconPickerInput`, so editors can search the Lucide set without being restricted to a small hardcoded list.
- Package `tone` values are curated because they map directly to frontend color treatments.
- Package features are nested objects because they belong to a specific package and do not need central reuse.

Frontend renderer:

- Rendered in `components/features/sections/page-sections.tsx`.
- Pricing uses the shared generic `hero` block with `layoutHint: "centered"` for page hero content.
- Process also uses the shared generic `hero` block with `layoutHint: "centered"` so the page starts with a clean text-first hero and no hero image.
- Use the same shared `hero` block with `layoutHint: "mediaCard"` when a page needs the image-card hero treatment.
- Do not create page-specific hero block types unless the editing model is materially different.
- `PricingValueSection` owns the three-value explanation strip below the hero.
- `PricingPackageGrid` owns the 2x2 spacious package card layout.
- `PricingCtaBand` owns the final coral CTA band and proof-item tiles.

Seed example:

- `sanity/seed/data/pages.json`
- The seeded `/pricing` page uses the shared `hero`, then `pricingValueSection`, `pricingPackageGrid`, `pricingComparisonTable`, `accordion`, and `pricingCtaBand`.

Seeder behavior:

- `scripts/seed-sanity.mjs` normalizes nested CTA groups, package features, value items, and proof items before writing to Sanity.
- Pricing pages that include `pricingCtaBand` intentionally skip the legacy appended `primaryCta` section so the page does not render duplicate final CTAs.
- To update only the pricing page after local changes, run:

```bash
node scripts/seed-sanity.mjs --confirm --skip-media-upload --only pricing
```

Notes:

- Keep the package grid as one section so packages can be reordered together in Studio.
- Do not add per-package layout fields such as column span or card width. The frontend owns responsive card layout.
- Use the existing `pricingComparisonTable` for detailed plan comparison until it needs a dedicated redesign.

## Warranty: Approved Page Blocks

Schema:

- `sanity/schemaTypes/objects/sections/warranty.ts`
- Object types: `warrantyConditionGrid`, `warrantyNoticeSection`, `warrantyClaimPrep`

Purpose:

Use these blocks for the approved guarantee-page direction. They combine the cleaner marketing hero style from pricing/process with the selected warranty mockup details:

- `warrantyConditionGrid`: the three-card summary row for `Covered-ish`, `Not covered`, and `Please do not send`.
- `warrantyNoticeSection`: the substantial legal-ish notice block with rich text and an optional anchor ID for hero CTA links.
- `warrantyClaimPrep`: the lower claim guidance panel that leads users toward the guarantee form.

Studio behavior:

- Warranty condition and claim-prep icons use the shared `IconPickerInput`.
- Warranty condition `tone` values are curated because they map to specific frontend color treatments.
- The legal notice body uses rich text so future edits can become paragraphs instead of a single long plain-text field.
- Optional `anchorId` fields should use lowercase letters, numbers, and hyphens so CTA links such as `/guarantee#guarantee-notice` remain stable.

Frontend renderer:

- Rendered in `components/features/sections/page-sections.tsx`.
- The seeded guarantee page uses the shared generic `hero` block with `layoutHint: "centered"`.
- The form remains controlled by the marketing page `showContactForm` and `formSeedId` fields, so the page-specific warranty blocks do not own form submission behavior.

Seed example:

- `sanity/seed/data/pages.json`
- The seeded `/guarantee` page uses the shared `hero`, then `warrantyConditionGrid`, `warrantyNoticeSection`, and `warrantyClaimPrep`.

Seeder behavior:

- `scripts/seed-sanity.mjs` normalizes warranty cards, rich legal notice content, prep items, and CTA groups before writing to Sanity.
- Set `primaryCta` to `null` for the warranty page when the page already has a dedicated claim-prep CTA and form.
- To update only the warranty page after local changes, run:

```bash
node scripts/seed-sanity.mjs --confirm --skip-media-upload --only warranty
```

Notes:

- Keep the three warranty condition cards together in one section. They are a matched editorial pattern, not independent reusable callouts.
- Do not put mailed-evidence warnings back into generic alert blocks unless the page needs a temporary editorial callout.
- Keep claim-form behavior separate from this block set until the form system milestone.
