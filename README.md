# Pet Share

Pet Share is a demo website built with a Next.js frontend and Sanity CMS for structured content.

## Project Status

The project has a scaffolded Next.js App Router application with embedded Sanity Studio routing, TypeScript, Tailwind CSS, ESLint, and Vitest. Public route skeletons are wired for the homepage, pet index, pet detail pages, direct owner pages, marketing pages, and friendly system states. Initial page-builder section rendering is underway for CMS-authored marketing content.

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

## Seed Data

Representative Milestone 1 seed data lives under `sanity/seed/`. These files define the sample JSON shape for future Sanity schemas and seed scripts; they are not the final 50-pet demo seed set.

## Seed Media Generation

Seed media generation is planned as a human-approved workflow. AI agents may help prepare prompts, review configuration, and inspect generated files after they exist, but AI agents must not run commands that call paid or metered AI generation providers.

Media generation commands must be run by a human.

Expected preview command:

```bash
pnpm seed:media -- --mode preview --pet pet-sir-nibbles
```

Expected full batch command after preview approval:

```bash
pnpm seed:media -- --mode batch --confirm
```

Optional override example:

```bash
pnpm seed:media -- --mode batch --provider gemini --model gemini-2.5-flash-image --count 5 --size 1024x1024 --confirm
```

Generated review files should be written to `sanity/seed/generated/`, which is ignored by Git. Approved files should be copied into `sanity/seed/media/` before they are committed or uploaded to Sanity.

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
