# Milestones

This document breaks the first Pet Share build into reviewable implementation stages. It should keep work small enough to review while still moving toward a usable Sanity-powered Next.js demo.

Treat this file as the controlling scope for implementation. The other planning docs define standards and constraints, but they should be applied only to the parts of the product touched by the current milestone. Do not expand a milestone just because a supporting doc mentions related future work.

Supporting docs:

- Use `docs/implementation-conventions.md` for component-first React and Next.js implementation patterns.
- Use `docs/accessibility-checklist.md` as a milestone-relevant review checklist, not as an all-at-once audit.
- Use `docs/dependency-decision-log.md` before adding or rejecting packages, services, or tooling.
- Use `docs/testing-strategy.md` to decide which tests are worth adding for each milestone.
- Use `docs/content-model.md`, `docs/seed-json-contract.md`, and `docs/data-seeding-plan.md` to keep Sanity and seed work aligned.
- Use `docs/content-governance.md` when creating, seeding, reviewing, or publishing content.
- Use `docs/launch-checklist.md` during deployment readiness and post-launch verification.

Each milestone should follow the workflow in `AGENTS.md`:

- Complete the implementation work.
- Update relevant docs, `.env.example`, and `ATTRIBUTIONS.md` when needed.
- Suggest helpful packages when they materially reduce complexity or risk, but include the reason, milestone fit, license/attribution impact, and whether the dependency is runtime or development-only. Record the decision in `docs/dependency-decision-log.md` before adding the package.
- Provide a suggested conventional commit message only when the user asks for one.
- Do not stage or commit changes unless the user explicitly asks.
- Let the user review and request refinements.
- After approval, run the relevant lint, typecheck, tests, and build checks for that milestone.

Keep test and review scope proportional to the milestone. Avoid broad coverage or checklist work that does not protect a stable contract, user-visible behavior, accessibility requirement, or implementation convention touched by the milestone.

## Milestone Review Checklist

Before handing a milestone back for review:

- Confirm the milestone scope stayed focused.
- Confirm the milestone did not absorb deferred work from supporting planning docs.
- List changed files and the main behavior added.
- Note any new dependencies and why they were added, including the matching dependency decision log entry.
- Update `.env.example` for any changed environment variables.
- Update `ATTRIBUTIONS.md` when a dependency, asset, copied code, icon set, font, or tool requires attribution.
- Update relevant docs if setup, architecture, content modeling, or workflow changed.
- Confirm relevant implementation convention and accessibility checklist items for the touched surfaces.
- Note known gaps, tradeoffs, and any intentionally deferred work.
- Provide a suggested conventional commit message only when the user asks for one.
- Do not commit or stage changes unless explicitly asked.

After user approval:

- Run the relevant lint, typecheck, tests, and build checks for the milestone.
- Add or update tests proportional to the risk of the milestone.
- Report failures clearly and identify whether they appear related to the current milestone or pre-existing project state.

## Milestone 1: Seed JSON Shape And Sample Data Contract

Goal:

- Define the concrete saved seed data shape before scaffolding so schemas, routes, and seed scripts are built around the same contract.

Scope:

- Create a small representative seed sample, not the full production-sized demo seed set.
- Draft representative JSON files for `petTypes.json`, `owners.json`, `pets.json`, `testimonials.json`, `forms.json`, `pages.json`, and `media-manifest.json` under the planned `sanity/seed/` structure.
- Include two or three pet types, two owners, two or three realistic sample pets, one or two testimonials, three form definitions, starter singleton/page examples, and an empty or sample media manifest.
- Include sample pets with owner references, pet type references, media metadata, varied image targets, base prompts, image-level shot prompts, and planned video prompts.
- Confirm how seed IDs, slugs, references, image roles, video prompt metadata, and Sanity asset mapping should be represented.
- Keep generated media commands documented as human-run only.
- Update `docs/data-seeding-plan.md`, `docs/content-model.md`, or related docs if the JSON shape exposes schema gaps.

Exit criteria:

- The planned seed JSON shape is clear enough to implement schemas and seed scripts without guessing field names.
- Media metadata aligns with the approved generated/media approval workflow.
- Future video generation prompts are represented without requiring video binaries in phase one.
- The full 50-pet seed set remains deferred until after schemas and scaffolded seed tooling exist.
- Any unresolved schema or seed-data questions are documented before app scaffolding begins.

## Milestone 2: Scaffold App And Tooling

Goal:

- Create the initial Next.js, TypeScript, Tailwind, and Sanity project foundation.

Scope:

- Initialize package metadata and scripts using `pnpm`.
- Add Next.js App Router app structure.
- Add TypeScript-first source, test, Sanity, and script conventions.
- Add ESLint, formatting, and basic Vitest test tooling.
- Add Tailwind setup and base global styles.
- Add Sanity dependencies and baseline config.
- Add environment parsing or a clear env helper boundary.
- Add the initial server-only diagnostics boundary for `APP_DEBUG` and safe logging helpers if useful.
- Update `README.md`, `.env.example`, and `ATTRIBUTIONS.md`.

Exit criteria:

- The app starts locally.
- The project has clear scripts for dev, lint, typecheck, test, and build.
- No real secrets are committed.
- Dependency choices are documented.
- Basic project docs still match the scaffolded commands and structure.

## Milestone 3: Sanity Schema Foundation

Goal:

- Implement the first-pass Sanity content model from `docs/content-model.md`.

Scope:

- Add document schemas for site settings, home page, pet index page, system pages, marketing pages, owners, pets, pet types, testimonials, and form definitions.
- Add initial reusable object schemas.
- Add validation rules and editor previews.
- Add Studio structure groups for Settings, Pages, Marketplace, Reusable Content, and Forms.
- Keep singleton documents constrained through Studio structure.
- Consult `sanity-best-practices` before implementation.

Exit criteria:

- Studio loads with organized content groups.
- Core schemas can be created or edited without obvious validation dead ends.
- Schema names and field names align with the content model.

## Milestone 4: Sanity Client, Queries, And Types

Goal:

- Create the typed data access layer between Sanity and Next.js.

Scope:

- Add Sanity clients for published and preview data.
- Add image URL helpers.
- Add GROQ queries for global settings, home page, pet index, system pages, marketing pages, pet detail, owner detail, pet types, testimonials, and forms.
- Add TypeScript types or TypeGen workflow.
- Add server-only query helpers and draft-safe query helpers.

Exit criteria:

- Public query helpers do not require private tokens.
- Preview helpers are clearly separate from published helpers.
- Query projections return only the fields needed by route and component renderers.

## Milestone 5: Public Route Skeletons

Goal:

- Add the public route structure without final visual polish.

Scope:

- Add root layout, global metadata, navigation, and footer.
- Add routes for `/`, `/pets`, `/pets/[slug]`, `/owners/[slug]`, and marketing pages.
- Add loading, error, and not-found states where useful, including custom system page fallbacks for 404, server error, and generic error states.
- Fetch and render Sanity data through server components.
- Keep pages responsive from the start.

Exit criteria:

- All planned public route types render without hardcoded final content.
- Missing content produces useful not-found or empty states.
- Error boundaries render clear Pet Share copy without exposing technical details, even when CMS content cannot be fetched.
- Route-level metadata can be generated from Sanity content.

## Milestone 6: Section Renderers And Core UI

Goal:

- Implement reusable page-builder rendering and core site UI.

Scope:

- Add typed section renderer registry.
- Implement initial renderers for hero, hero slide, content section, callout, alert, warning, stats, testimonials, feature list, accordion, pricing tier, process step, video embed, and CTA groups.
- Add pet cards, owner summaries, galleries, and key fact panels.
- Add responsive behavior for every section.
- Add accessible focus states, labels, and semantic markup.

Exit criteria:

- Homepage and marketing pages can render CMS-authored section arrays.
- Sections do not break mobile layouts or create horizontal overflow.
- Client components are limited to interactive UI that needs browser behavior.

## Milestone 7: Seed Content

Goal:

- Make the demo useful without relying on manual content entry.

Scope:

- Add seed content for site settings, homepage, pet index page, system pages, marketing pages, pet types, owners, pets, testimonials, and forms.
- Include the approved starter pet type list.
- Use the saved seed data and approved local media workflow from `docs/data-seeding-plan.md`.
- Keep content fictional, satirical, and animal-safe.
- Document the wizard-first seed process for the full demo dataset, with direct commands available only as manual/debug alternatives.

Exit criteria:

- A fresh dataset can be populated enough to browse the site.
- Seed data covers the major schema relationships and section renderers.
- Seed content is easy to revise later.
- The recommended seed command is `pnpm seed:wizard`, and it is documented as covering the full demo dataset rather than only pet listings.
- Normal seed replay does not call AI generation providers.

## Milestone 8: Forms And Mailgun

Goal:

- Add phase-one form submission behavior.

Scope:

- Add server-only form route handler or server action.
- Validate form payloads.
- Send email through Mailgun to the master project inbox.
- Preserve pet and owner context for owner contact drawer submissions.
- Add friendly success and error handling.
- Log server-side failures with safe, non-sensitive context.
- Add lightweight tests for form validation and email boundary behavior.

Exit criteria:

- No Mailgun credentials are exposed to the browser.
- Form failures return usable error messages.
- Owner contact still routes to the master inbox, not individual owners.

## Milestone 9: Preview And Revalidation

Goal:

- Add editorial preview and cache busting for Sanity content changes.

Scope:

- Add Draft Mode enable and disable handlers.
- Add preview routes for home, pet index, system pages, marketing pages, pet detail, and owner detail.
- Add preview banner and exit preview action.
- Add Sanity webhook route with validation.
- Add document-type to path/tag revalidation mapping.
- Add targeted tests for preview and revalidation helpers.

Exit criteria:

- Preview links originate from Studio and require a secret.
- Unpublished drafts can be previewed by document ID.
- Published content changes can revalidate the correct pages or tags.

## Milestone 10: Responsive Polish And Animation

Goal:

- Bring the demo up to the intended bright, friendly, polished product feel.

Scope:

- Finalize Tailwind design tokens for color, typography, spacing, radius, and shadows.
- Add entry animations and subtle hover motion.
- Respect `prefers-reduced-motion`.
- Keep Framer Motion deferred unless Tailwind/CSS animation has become awkward enough to justify it.
- Polish pet index filters, carousels, galleries, drawer behavior, video embeds, and forms.
- Run responsive browser checks across representative mobile and desktop widths.

Exit criteria:

- No known horizontal overflow, clipped content, overlapping content, or desktop-only interaction patterns.
- Motion feels restrained and does not block content usability.
- The site visually matches `docs/project-brief.md`.

## Milestone 11: Deployment Readiness

Goal:

- Prepare the site for Vercel deployment and Sanity production usage.

Scope:

- Confirm Vercel environment variables.
- Confirm Sanity CORS, dataset, tokens, and webhook configuration.
- Confirm Mailgun env configuration.
- Run lint, typecheck, tests, and build.
- Update README setup instructions with real commands.
- Review attribution and dependency notes.
- Use `docs/launch-checklist.md` for final readiness verification.

Exit criteria:

- Build succeeds locally.
- Required deployment environment variables are documented but not exposed.
- Known limitations and post-launch backlog items are documented.
- Launch checklist items that are in scope for phase one are complete or explicitly documented as caveats.

## Deferred Work

These items should stay out of the first build unless priorities change:

- Public user registration and authenticated pet submissions.
- Direct owner messaging or owner dashboards.
- Saved/favorite pets.
- AI-generated owner email replies.
- Sanity Visual Editing or Presentation Tool implementation.
- Pet type landing pages.
- Standalone testimonials page.
- Generated video binaries.
- Framer Motion unless needed for animation complexity.
- Heavy end-to-end test coverage beyond critical smoke checks.
