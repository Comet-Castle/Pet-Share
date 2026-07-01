# Page Builder Components

Pet Share marketing pages use Sanity `sections[]` arrays as a page builder. Each section should model content semantics first, while the frontend owns the polished layout and visual variants.

## Organization Pattern

Group new section schemas by category under `sanity/schemaTypes/objects/sections/` when practical:

```text
sanity/schemaTypes/objects/sections/
  process.ts
  marketing.ts
  content.ts
  media.ts
```

The existing `sanity/schemaTypes/objects/sections.ts` file currently acts as the registry for section array members and exported object types. New organized section files should export individual object schemas, then `sections.ts` should import and register them in:

- `sectionMembers`: controls what editors can insert into page-builder arrays.
- `sectionObjects`: controls which object schemas are available to Sanity Studio.

Use editor-facing titles with category prefixes, such as `Process: Step path`, so the insert menu stays scannable even before thumbnail previews are added.

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

After schema or query changes, run:

```bash
pnpm typegen
pnpm typecheck
pnpm lint
```

## Studio UX Pattern

For broader custom Studio input guidance, including dialog layering, scrollable picker layouts, and Sanity-native styling rules, use `docs/sanity-studio-extensions.md`.

Use `sanity/schemaTypes/objects/studio-options.ts` for reusable editor options:

- `processToneOptions`: tone values with labels, descriptions, and color metadata.
- `ctaStyleOptions`: CTA style values with labels, descriptions, and button color metadata.

Use `sanity/components/studio-string-inputs.tsx` for reusable custom Studio inputs:

- `VisualStringOptionsInput`: renders string options as descriptive visual cards with color indicators.
- `IconPickerInput`: opens a searchable modal browser for the Lucide icon set and stores the selected icon name as a string.

The shared icon registry lives in `lib/icons/lucide-icons.ts`. It supports current Lucide export names while preserving older seed aliases such as `home`, `search`, and `calendarCheck`.

Prefer these inputs when a field affects visible frontend styling. A plain string or radio input is fine only when the value is self-explanatory to editors.

Current fields using this pattern:

- `processPathSection.tone`
- `processPathSection.icon`
- `processStep.icon`
- `cta.style`
- `cta.icon`
- Section icon fields in callouts, warnings, stats, and feature items.

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
- The seeded `/process` page uses two `processPathSection` blocks: one for owners and one for temporary hosts.

Notes:

- Keep steps nested when they belong only to this section.
- Use references only if the same process steps need central management across many pages.
- Do not store layout details such as column counts or heading levels in Sanity. The frontend chooses responsive layout and semantic heading levels.
- Do not add `processStep` directly as a generic page-builder section. Use `processPathSection` so related steps stay grouped.

## Process: Step

Schema:

- `sanity/schemaTypes/objects/sections.ts`
- Object type: `processStep`
- Studio title: `Process step`

Purpose:

Use this as a nested item inside process-specific fields, especially `processPathSection.steps` and homepage process summaries. It is not intended as a standalone marketing page section.

Fields:

- `title`: step heading.
- `body`: rich text description rendered inside the step card.
- `icon`: optional icon selected through the shared icon picker.
- `cta`: optional step-level CTA.

Legacy fields:

- `description`: deprecated plain-text fallback for older seeded or already-published content.
- `order`: deprecated manual number. Frontend step numbers come from array position.

Studio behavior:

- Fields are grouped into `Content`, `Display`, `CTA`, and `Legacy`.
- New process steps start with a placeholder title, rich description, and neutral icon.
- Preview displays the title, a short description excerpt, and the selected icon when available.
