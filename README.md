# Pet Share

Pet Share is a demo website built with a Next.js frontend and Sanity CMS for structured content.

## Project Status

The project has a scaffolded Next.js App Router application with embedded Sanity Studio routing, TypeScript, Tailwind CSS, ESLint, and Vitest. Public route skeletons are wired for the homepage, pet index, pet detail pages, direct owner pages, Standard Pages, and friendly system states. Page-builder section rendering is underway for CMS-authored standard content.

Implementation work should follow `docs/milestones.md` as the controlling scope. Supporting docs define standards and constraints, but they should not expand a milestone beyond its stated goal.

## Planned Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Sanity CMS
- pnpm
- Vercel deployment
- Mailgun for phase-one form email

## Project Docs

- Product direction and creative brief: `docs/project-brief.md`
- Design and copy guidance: `docs/design-and-copy-guide.md`
- Page implementation blueprints: `docs/page-blueprints.md`
- Data seeding plan: `docs/data-seeding-plan.md`
- Seed JSON contract: `docs/seed-json-contract.md`
- Architecture planning: `docs/architecture.md`
- Content model planning: `docs/content-model.md`
- Environment and deployment planning: `docs/environment-and-deployment.md`
- Testing strategy: `docs/testing-strategy.md`
- Dependency decision log: `docs/dependency-decision-log.md`
- Implementation conventions: `docs/implementation-conventions.md`
- Accessibility checklist: `docs/accessibility-checklist.md`
- Content governance: `docs/content-governance.md`
- Launch checklist: `docs/launch-checklist.md`
- Implementation milestones: `docs/milestones.md`
- Sanity Presentation and preview workflow: `docs/sanity-presentation-and-media.md`
- Future work backlog: `docs/backlog.md`
- Shared agent instructions: `AGENTS.md`
- Third-party attribution log: `ATTRIBUTIONS.md`

## Local Setup

1. Install dependencies with `pnpm`.
2. Copy `.env.example` to `.env.local`.
3. Fill in the Sanity project configuration and any required secrets.
4. Run the local development server with `pnpm dev`.

This repo uses the package manager declared in `package.json`. If `pnpm` is not available locally, enable it through Corepack or install pnpm before running project scripts.

## Common Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm typegen
pnpm build
pnpm studio
```

The public scaffold is available at `http://localhost:3000/` during development. Sanity Studio is mounted at `http://localhost:3000/studio`.

## Sanity Presentation And Draft Preview

Sanity Studio includes the Presentation tool for visual page editing. Locally, set `SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3000`, run `pnpm dev`, open `http://localhost:3000/studio`, then use the Presentation tab to preview supported documents.

Draft preview uses `/api/draft-mode/enable` and Sanity's preview-secret flow. The app needs `SANITY_API_READ_TOKEN` for server-side draft reads. When Draft Mode is active, the public site shows a preview banner with an exit action.

Sanity Live is mounted in the root layout so published content updates can revalidate automatically. For draft-capable live updates inside Presentation, set `SANITY_API_BROWSER_READ_TOKEN` to a least-privilege Sanity viewer token. Leave it blank if you want draft preview reads to remain server-only; click-to-edit still works, but draft changes may require a preview refresh.

Supported preview locations include the homepage, pet index page, Standard Pages, system pages, pet detail pages, and owner detail pages. Unpublished Standard Pages, pets, and owners without public slugs use document-ID preview routes under `/preview/page/[documentId]`, `/preview/pet/[documentId]`, and `/preview/owner/[documentId]`.

Sanity Media Library is enabled in Studio. Leave `SANITY_STUDIO_MEDIA_LIBRARY_ID` blank to let Sanity auto-detect the connected library, or set it when a specific library should be used.

## Seed Data

Seed data lives under `sanity/seed/`. This directory is gitignored and not committed — once content has been written to Sanity, Sanity is the source of truth, and the local seed files are disposable scratch space for regenerating or reseeding on this machine. A fresh clone does not include a bootstrapped demo dataset. The recommended seed workflow is the wizard. It covers the full demo dataset, including site settings, homepage, pet index page, system pages, Standard Pages, pet types, owners, pets, testimonials, forms, and media prompts.

```bash
pnpm seed:wizard
```

The wizard validates required local environment values up front and then offers three workflow choices:

1. **Quickly replace the website without media**: choose the generated pet count, generate and approve the content preview, purge existing seeded documents, and write fresh content to Sanity while skipping media approval and local media upload.
2. **Quickly replace the website with approved local media**: choose the generated pet count, generate and approve the content preview, approve files already in `sanity/seed/media/`, purge existing seeded documents, and write fresh content/media references to Sanity.
3. **Wizard steps**: use the full guided workflow for detailed content approval, media prompt packages, optional human-run inline media generation, media approval, optional purge, and final Sanity write.
4. **Start fresh reset**: purge seeded Sanity documents without writing replacements, clear `sanity/seed/generated/`, and clear approved local media under `sanity/seed/media/`.

The quick replace paths are meant for normal reseeding when you want to generate X pets and all content pages with minimal prompts. They do not call AI media providers. The final Sanity write still requires explicit confirmation and `SANITY_API_WRITE_TOKEN`.

The start fresh reset path is intentionally destructive and requires a typed `RESET` confirmation. It preserves the local seed template files under `sanity/seed/data/` (gitignored, not committed).

The detailed wizard path asks for `y/N` confirmation before each step:

0. Validate required local environment values and print setup instructions for anything missing.
1. Choose the generated pet count, defaulting to 50.
2. Choose whether the media prompt package should cover all media or pet images only.
3. Generate data preview files.
4. Approve the full content preview.
5. Prepare the media generation package for the selected media scope.
6. Optionally generate preview or inline media from the prepared prompt package.
7. Copy reviewed generated media into `sanity/seed/media/` and approve those reviewed media files.
8. Optionally purge existing seeded Sanity documents.
9. Populate Sanity with progress output.

Choose the pet-only media scope when you want to skip owner portraits, page heroes, and marketing/background image prompts while keeping the full content dataset available for review and Sanity writes.

Dependent media steps are skipped when an upstream media step is skipped. For example, if you skip media package preparation, the wizard will not ask to generate or approve media. If you skip media generation, it will not ask to approve newly generated media in that run.

If Gemini returns a quota or rate-limit error during media generation, the wizard reports the model, retry hint, and quota details without recording media approval. Fix quota, billing, or model settings, or wait for the retry window, then rerun the wizard and choose the media generation step again.

Media generation is inline-only. Inline generation calls the provider one prompt at a time, writes each generated file immediately, and prints status for each request, response, parse, and write step.

Use the direct commands only when you need to run one seed step manually or debug the wizard.

The underlying Sanity seed command is dry-run by default:

```bash
pnpm seed:sanity
```

To write local preview files for review:

```bash
pnpm seed:sanity -- --preview
```

To preview a different number of generated pets:

```bash
pnpm seed:sanity -- --preview --pet-count 25
```

To preview a different owner count (clamped to the fixed 12-owner list) and a different generated testimonial count (authored testimonials are always included in full):

```bash
pnpm seed:sanity -- --preview --owner-count 6 --testimonial-count 10
```

To preview the full content dataset while preparing only pet image media prompts:

```bash
pnpm seed:sanity -- --preview --media-scope pets
```

To preview only the homepage document:

```bash
pnpm seed:sanity -- --preview --only homePage
```

To write seed content to the configured Sanity dataset, set `SANITY_API_WRITE_TOKEN` locally and run:

```bash
pnpm seed:sanity -- --confirm
```

Use the same `--pet-count`, `--owner-count`, and `--testimonial-count` values for preview and confirm when running direct commands manually.

To purge existing seeded documents before writing fresh seed content:

```bash
pnpm seed:sanity -- --confirm --purge
```

To purge existing seeded documents without writing replacement content:

```bash
pnpm seed:sanity -- --confirm --purge-only
```

To write content without uploading approved local media:

```bash
pnpm seed:sanity -- --confirm --skip-media-upload
```

To replace only the homepage in Sanity while preserving existing page media:

```bash
pnpm seed:sanity -- --confirm --only homePage --skip-media-upload
```

Normal seed replay does not call AI generation providers. It uses saved seed content and approved local media only. Preview and approval files are written under `sanity/seed/generated/`, which is ignored by Git.

For preview and review steps, the wizard requires `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION`. The final Sanity write step also requires `SANITY_API_WRITE_TOKEN`. Missing values are reported with setup instructions.

The media generation step requires `GEMINI_API_KEY` when confirmed provider calls are requested.

Sanity document writes and optional purges use chunked batch mutations where dependencies allow it. Approved media uploads run in small parallel batches (chunked `Promise.all`, no new dependency) because Sanity asset ingestion is separate from document mutations. All write steps print progress in `processed / total` format with the remaining count.

Seed wizard and seed command output uses color-coded success, warning, and error states. Set `NO_COLOR=1` before running a seed command if you need plain output for logs or terminals that do not handle ANSI colors.

## Seed Media Generation

Seed media generation is planned as a human-approved workflow. AI agents may help prepare prompts, review configuration, and inspect generated files after they exist, but AI agents must not run commands that call paid or metered AI generation providers.

Media generation commands must be run by a human.

The wizard can run media generation as part of the guided flow. Direct preview command:

```bash
pnpm seed:media -- --mode preview --pet pet-sir-nibbles --confirm
```

Expected full inline command after preview approval:

```bash
pnpm seed:media -- --mode inline --confirm
```

Optional override example:

```bash
pnpm seed:media -- --mode inline --provider gemini --model gemini-2.5-flash-image --count 5 --size 1024x1024 --confirm
```

Inline generation is easier to monitor and resumes through smaller selected runs. Use `--count`, `--pet`, `--model`, and `--size` to keep cost and quota use controlled.

If a Gemini image model has no available quota, retry with a small preview first after changing quota/billing/model settings:

```bash
pnpm seed:media -- --mode preview --count 1 --model gemini-2.5-flash-image --confirm
```

Generated review files should be written to `sanity/seed/generated/`, which is ignored by Git. Approved files must be copied into `sanity/seed/media/` before they are uploaded to Sanity. `sanity/seed/` in full is gitignored, so approved media stays local rather than committed. The wizard can copy reviewed generated media during the media approval step.

## Environment Variables

Keep `.env.example` updated whenever environment variables change. Real secrets belong in local or deployment environment configuration, not in Git.

Start local setup by copying `.env.example` to `.env.local` and filling in project-specific values.

The current Studio scaffold uses placeholder Sanity configuration until `NEXT_PUBLIC_SANITY_PROJECT_ID` and related values are set locally or in Vercel.

## Sanity Types And Queries

GROQ queries live under `sanity/queries/` and should be wrapped in `defineQuery` so Sanity TypeGen can generate result types.

When schemas or queries change, run:

```bash
pnpm typegen
```

This regenerates `sanity.types.ts`. The intermediate `schema.json` extraction file is ignored by Git.

## Attribution

Third-party libraries, copied or adapted code, design assets, icons, fonts, and tooling that require attribution should be documented in `ATTRIBUTIONS.md`.

## Agent Guidance

Shared AI agent instructions live in `AGENTS.md`. `CLAUDE.md`, `CODEX.md`, and `GEMINI.md` are symlinks to that file.

## Optional Agent Tooling

The following local tools can help AI agents work with the platform context, but they are not app dependencies and should not be added to `package.json`:

- Vercel plugin for deployment, environment, logs, and Vercel-specific project context.
- `sanity-best-practices` skill for Sanity schemas, GROQ, Studio structure, preview, TypeGen, Visual Editing, images, Portable Text, and Sanity/Next.js integration.

Install and manage these tools in the local agent environment, not in the Pet Share application.
