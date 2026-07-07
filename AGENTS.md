# Agent Instructions

## Project Overview

This repository is for a new Pet Share project built with Next.js on the frontend and Sanity CMS for structured content.

Treat this file as the shared source of truth for AI coding agents working in this repo. Keep `CLAUDE.md`, `CODEX.md`, and `GEMINI.md` linked to this file so all agents follow the same conventions.

Keep practical setup and usage instructions in `README.md`. Keep product concept, tone, visual direction, and content strategy in `docs/project-brief.md`.

Use `docs/milestones.md` as the controlling implementation scope. Supporting planning docs define standards and constraints, but do not expand a milestone just because a related future idea appears elsewhere.

Key planning references:

- `docs/architecture.md`: technical architecture and platform direction.
- `docs/content-model.md`: Sanity content model.
- `docs/seed-json-contract.md` and `docs/data-seeding-plan.md`: seed data and media workflow.
- `docs/implementation-conventions.md`: component-first React and Next.js conventions.
- `docs/accessibility-checklist.md`: accessibility review checklist.
- `docs/dependency-decision-log.md`: dependency, service, and tooling decisions.
- `docs/content-governance.md`: content review and publishing rules.
- `docs/launch-checklist.md`: deployment and launch readiness.

## Expected Stack

- Next.js with the App Router.
- TypeScript for application and Sanity code.
- Sanity Studio and schema definitions kept in the repo.
- Tailwind CSS for styling.
- pnpm for package management.
- React components organized by feature and shared UI concerns.
- Environment variables for Sanity project configuration and any API credentials.

## Project Shape

When the repo does not already define a stronger local pattern, follow common industry conventions for a modern Next.js App Router, React, TypeScript, and Sanity project. Prefer boring, well-documented defaults over novel architecture.

Until the app is scaffolded, prefer this structure when adding files:

```text
app/
  (site)/
  api/
  studio/[[...tool]]/
components/
  ui/
  layout/
  features/
config/
lib/
  env/
  utils/
sanity/
  lib/
  queries/
  schemaTypes/
  structure/
  types/
styles/
public/
types/
```

Use the repo's actual structure once it exists. Do not introduce a parallel organization if the project has already settled on a pattern.

## Industry Defaults

- Choose established React, Next.js, TypeScript, and Sanity patterns when requirements are unclear.
- Prefer simple vertical feature organization for product-specific UI under `components/features/`.
- Keep reusable primitives under `components/ui/` and layout-level shell components under `components/layout/`.
- Keep framework routes, route handlers, layouts, metadata, loading states, error states, and not-found states inside `app/`.
- Keep cross-cutting utilities in `lib/`, but avoid turning `lib/` into a dumping ground for feature-specific code.
- Keep environment parsing and validation isolated under `config/` or `lib/env/`.
- Keep global types in `types/` only when they are shared across multiple parts of the app.
- Prefer named exports for shared modules unless a framework convention requires a default export.
- Use path aliases only when configured in `tsconfig.json`; prefer `@/` for project-root imports if aliases are introduced.
- Keep files small enough to scan. Split a file when it mixes unrelated responsibilities or becomes difficult to test.

## Next.js Guidelines

- Prefer Server Components by default. Add `"use client"` only for browser-only state, effects, event handlers, or third-party client libraries.
- Keep data fetching close to the route or component that owns the data.
- Use typed route params, typed Sanity query results, and explicit return types where they clarify behavior.
- Avoid broad client-side state when URL state, server data, or local component state is enough.
- Keep metadata, loading, error, and not-found states in the relevant route segment when applicable.
- Use route groups such as `app/(site)/` to organize pages without changing public URLs.
- Use API route handlers under `app/api/` only for server-side integrations, webhooks, auth callbacks, or functionality that must not run in the browser.
- Keep Sanity Studio mounted under `app/studio/[[...tool]]/` unless the project chooses a different route.
- Use Next.js caching and revalidation intentionally. Document non-obvious cache, draft, preview, or webhook behavior.

## Sanity Guidelines

- Keep schema definitions small, explicit, and reusable.
- Put GROQ queries in dedicated files under `sanity/queries/` or the closest established local equivalent.
- Keep Sanity client setup, image helpers, live preview helpers, and fetch utilities under `sanity/lib/`.
- Keep desk structure customization under `sanity/structure/`.
- Keep generated or shared Sanity document/query types under `sanity/types/`.
- Type Sanity documents and query responses. If generated Sanity types are introduced, prefer generated types over hand-written duplicates.
- Do not hardcode project IDs, dataset names, API tokens, or preview secrets. Use environment variables.
- Keep draft/preview behavior separate from published-content fetching.
- Model content semantically in Sanity. Avoid leaking frontend layout concerns into schemas unless editors genuinely need layout control.
- Keep preview, draft mode, and live content helpers separate from public published-content queries.
- Document webhook and revalidation behavior when adding Sanity-driven cache invalidation.

## Platform Skills And Local Agent Tooling

- Use the `sanity-best-practices` skill when working on Sanity schemas, GROQ, Studio structure, preview, Visual Editing, TypeGen, images, Portable Text, page-builder content, or Sanity/Next.js integration.
- Use the Vercel plugin or Vercel-related skills when working on Vercel deployment, environment variables, project configuration, logs, cache behavior, edge/platform behavior, or production troubleshooting.
- Treat platform skills and plugins as local agent tooling. Do not add them to `package.json`, app runtime dependencies, or project build scripts.
- If a platform skill is unavailable, fall back to official platform documentation and note the gap before making platform-specific decisions.

## React Component Standards

- Build component-first. Shared UI patterns should become named, typed components with controlled variants before the same pattern is duplicated across the site.
- Create reusable primitives such as `Button`, `Badge`, `Pill`, `ToggleGroup`, `CardMedia`, `SectionHeader`, `EmptyState`, and `ErrorState` when those patterns appear across features.
- Prefer typed variants for repeated UI states, such as button `variant` and `size`, instead of many one-off class strings.
- Components should be focused, typed, and named after the UI or behavior they own.
- Keep server-only components free of browser APIs, state hooks, and event handlers.
- Keep client components as small as practical and pass server-fetched data into them as typed props.
- Co-locate component-specific helpers, tests, and styles when that makes ownership clearer.
- Prefer composition over large prop-heavy components.
- Use accessible HTML first. Add ARIA only when native semantics are not enough.
- Handle loading, empty, error, and success states explicitly for user-facing data views.

## Accessibility Standards

- Use semantic HTML elements before adding custom roles.
- Ensure interactive elements are keyboard accessible and have visible focus states.
- Provide accessible names for buttons, links, inputs, and controls.
- Associate form fields with labels and render validation messages in a way assistive technology can announce.
- Use meaningful `alt` text for content images. Use empty `alt=""` only for decorative images.
- Maintain reasonable color contrast for text, controls, and focus indicators.
- Do not trap focus unless implementing a modal, drawer, or similar managed interaction.

## Responsive UI Standards

- Build every public page, Studio-adjacent frontend surface, and reusable component to work across mobile, tablet, laptop, and desktop viewports.
- Treat responsive behavior as required functionality, not optional visual polish.
- Prefer fluid layouts, sensible `min/max` constraints, and Tailwind responsive utilities over fixed desktop-first dimensions.
- Ensure navigation, drawers, forms, cards, media galleries, carousels, filters, and page-builder sections have intentional small-screen behavior.
- Prevent horizontal overflow, clipped text, overlapping content, and tap targets that are too small on mobile.
- Use responsive image sizing and aspect-ratio constraints so Sanity-authored media does not cause layout shifts or broken crops.
- Verify meaningful UI changes at representative mobile and desktop viewport sizes before handoff when a browser or screenshot workflow is available.

## Environment And Secrets

- Keep real secrets out of Git. Do not commit `.env`, `.env.local`, production env files, API tokens, or private keys.
- Update `.env.example` whenever adding, renaming, or removing an environment variable.
- Document whether each variable is required, optional, public, or server-only.
- Prefix browser-exposed variables with `NEXT_PUBLIC_` only when the value is safe to expose publicly.
- Keep Sanity write tokens, preview secrets, webhook secrets, and authenticated API credentials server-only.
- Validate required environment variables at server startup or at the boundary where they are used.

## AI Media Generation

- Do not run commands that call paid, metered, or quota-limited AI media generation providers.
- Seed media generation commands, including `pnpm seed:media -- --mode preview` and `pnpm seed:media -- --mode batch`, must be run by a human.
- AI agents may help prepare prompts, review configuration, inspect generated files, update manifests, and process approved local assets after the human has run generation.
- Keep unreviewed generated files under `sanity/seed/generated/`, which is ignored by Git.
- Only approved files copied into `sanity/seed/media/` should be uploaded to Sanity. `sanity/seed/` in full is gitignored and not committed; once content is written to Sanity it is the source of truth, and local seed files are disposable per-machine scratch space.

## Security Standards

- Validate and sanitize input at server boundaries, including route handlers, forms, webhook payloads, and CMS-driven params.
- Keep authentication, authorization, and token handling on the server unless a provider explicitly requires browser code.
- Never expose Sanity write tokens, private datasets, preview secrets, or webhook secrets to client components.
- Verify webhook signatures or shared secrets before processing webhook payloads.
- Avoid rendering raw HTML. If rich text or HTML is required, sanitize it and document why it is safe.
- Use least-privilege API tokens and document required scopes.

## Performance Standards

- Use `next/image` for local and remote images when practical, with configured remote image patterns for Sanity assets.
- Keep Client Components small and intentional to reduce browser JavaScript.
- Avoid loading large third-party scripts globally unless every page needs them.
- Use dynamic imports for heavy client-only UI when it materially improves initial load.
- Choose cache, revalidation, and no-store behavior deliberately for each data path.
- Avoid unnecessary waterfalls by fetching related server data together when ownership is clear.

## Testing Standards

- Add tests for reusable utilities, non-trivial business logic, data normalization, and bug fixes.
- Add component tests for complex interactive UI or state-heavy Client Components when testing tooling exists.
- Add route or integration tests for API handlers, webhooks, preview behavior, and data-fetching boundaries when practical.
- Keep tests focused on user-visible behavior and stable contracts instead of implementation details.
- Do not skip relevant tests without leaving a clear reason in the final response.

## Code Quality

- Follow existing formatting, linting, and naming conventions once tooling is added.
- Prefer small, focused modules over large catch-all files.
- Do not add dependencies unless they clearly reduce implementation risk or complexity.
- When adding a library or asset from an external repo, record proper attribution for that project.
- Keep user-facing copy clear and specific to the product.
- Avoid unrelated refactors while implementing a requested change.

## Third-Party Attribution

- Track third-party libraries, copied code, design assets, icons, fonts, and tooling that require attribution.
- Prefer package-manager dependencies over copied source. If code is copied or adapted, preserve required license notices and document the source repo.
- Add or update `ATTRIBUTIONS.md` when introducing an external dependency that is intended for project use.
- Attribution entries should include the package or project name, source repository or website, license, and a short note explaining how it is used.
- Do not add libraries with unclear, incompatible, or missing license terms without raising the issue first.
- Keep generated lockfiles and package metadata consistent with the added dependency.

## Code Documentation

- Document methods, functions, components, hooks, loaders, actions, and utilities according to React and TypeScript standards.
- Prefer clear names and types first, then add JSDoc or brief comments when the purpose, inputs, outputs, side effects, or lifecycle behavior are not obvious.
- Add short inline comments for tricky code paths, non-obvious React behavior, complex Sanity queries, cache behavior, data normalization, or important tradeoffs.
- Keep comments accurate and useful. Do not restate what the code already says.
- Mark unfinished work that must be revisited with `//TODO:` exactly, followed by a concise description of what remains.
- Do not leave vague TODO comments. Every `//TODO:` should identify the missing work, blocker, or follow-up decision.

## Verification

When tooling exists, run the narrowest useful checks before handing work back:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

If a check is unavailable, blocked, or too broad for the change, say so in the final response.

## Iteration Workflow

- Complete the requested implementation first, then hand it back for review. Do not `git add` or `git commit` until the user has reviewed the work and explicitly asked you to commit. Never `git push` — the user owns all pushes.
- Before handoff, summarize changed files, main behavior changes, known tradeoffs, and anything left unfinished so the user can review before authorizing a commit.
- When the user approves and asks you to commit, use a strong conventional commit message. Leave the work staged/uncommitted until then.
- Cheap checks may run before review; the formal lint/typecheck/test pass happens after the user approves the direction. Add or update tests then, scoped proportional to the change.
- If checks fail, say whether the failure relates to the current change or pre-existing state. If blocked (credentials, network, installs, unclear product decisions, external services), state exactly what is blocked and what input is needed.
- In the same stage, update `ATTRIBUTIONS.md` (when attribution is required), `.env.example` (noting public vs server-only), and any docs affected by setup/architecture/content-model/workflow changes.

## Git And Collaboration

- Assume the worktree may contain user changes; do not overwrite or revert them without instruction. Keep commits and diffs focused on the requested task.
- Use conventional commit style (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `build:`) with a clear, specific message. Commit only after the user has reviewed the work and asked you to commit; pushing is never allowed — never run `git push`.
- Never commit secrets, generated build output, or local machine-specific files.
