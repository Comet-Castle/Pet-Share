# Milestones

This document breaks the first Pet Share build into reviewable implementation stages. It should keep work small enough to review while still moving toward a usable Sanity-powered Next.js demo.

Treat this file as the controlling scope for implementation. The other planning docs define standards and constraints, but they should be applied only to the parts of the product touched by the current milestone. Do not expand a milestone just because a supporting doc mentions related future work.

Supporting docs:

- Use `docs/implementation-conventions.md` for component-first React and Next.js implementation patterns.
- Use `docs/accessibility-checklist.md` as a milestone-relevant review checklist, not as an all-at-once audit.
- Use `docs/dependency-decision-log.md` before adding or rejecting packages, services, or tooling.
- Use `docs/testing-strategy.md` to decide which tests are worth adding for each milestone.
- Use `docs/frontend-qa.md` for Playwright/browser verification notes, Sanity-backed visual QA, and stale-content debugging.
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

For rapid visual polish inside an active milestone, use `docs/frontend-qa.md` as the verification ladder. Small visual iterations can be handed back after targeted checks and a focused screenshot instead of repeating the full milestone lint/typecheck/test/build cycle every time. Reserve the full check suite for milestone approval, risky data/schema changes, broad refactors, or user-approved finalization.

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

## Milestone 8: Process And Pricing Page Builder Refinement

Goal:

- Refine the process and pricing marketing pages into the reference implementation for how Sanity page-builder blocks should behave and render.

Scope:

- Refine `/process` and `/pricing` page structure, copy, and frontend presentation.
- Improve Sanity page-builder schemas, Studio field grouping, initial values, previews, and custom inputs where they make editing clearer.
- Keep process-specific steps nested inside process sections rather than scattered as standalone page-builder blocks.
- Derive visible process step numbers from array order.
- Use rich text where page-builder copy needs links, emphasis, or short lists.
- Use `docs/sanity-studio-extensions.md` for Studio custom input conventions.
- Use `docs/page-builder-components.md` as the living reference for reusable page-builder blocks.
- Update seed data to match the refined schema shape for process and pricing content.

Exit criteria:

- `/process` and `/pricing` can be edited through Sanity without confusing field order or ambiguous blocks.
- Page-builder sections used by these pages have clear schema previews and grouped Studio fields.
- Frontend rendering matches the current approved direction for polished marketing pages.
- Seed data for these pages matches the current schema shape and does not rely on deprecated fields.

## Milestone 9: Sanity Visual Builder And Media Library

Goal:

- Add Sanity editorial tooling so the CMS experience supports visual page editing and better media management.

Scope:

- Implement the Sanity Presentation/Visual Editing workflow appropriate for this project.
- Add or finish Draft Mode enable and disable handlers as needed for Visual Editing.
- Confirm preview routes for home, pet index, system pages, marketing pages, pet detail, and owner detail.
- Add a preview banner and exit preview action if not already complete.
- Implement or configure Sanity Media Library support.
- Confirm Studio-origin preview links work for draft and published content.
- Keep Sanity-specific setup documented in README and relevant docs.

Exit criteria:

- Editors can open supported pages from Studio into a visual editing or presentation flow.
- Draft content can be previewed without exposing secrets.
- Media Library usage is documented and functional for the project workflow.
- Any remaining limitations of Visual Editing are clearly documented.

Implementation notes:

- Presentation resolves home, pet index, Standard Pages, system pages, pet detail pages, and owner detail pages through `sanity/presentation/resolve.ts`.
- Draft Mode uses `/api/draft-mode/enable` and `/api/draft-mode/disable`; active preview sessions show a public-site banner and mount `next-sanity` Visual Editing.
- Unpublished Standard Pages, pets, and owners without slugs use document-ID preview routes under `/preview/page/[documentId]`, `/preview/pet/[documentId]`, and `/preview/owner/[documentId]`.
- Sanity Media Library is enabled through Studio workspace configuration and documented in `docs/sanity-presentation-and-media.md`.

## Milestone 10: Pet Marketplace Page Refinement

Goal:

- Refine the pet index and pet detail experience into the reference implementation for structured marketplace content.

Scope:

- Refine `/pets` layout, filters, sorting, pagination, URL state, empty states, and pet card presentation.
- Refine `/pets/[slug]` layout, gallery behavior, pet facts, owner summary, availability/status display, care notes, CTA surfaces, and optional pet video support.
- Treat pet detail video as authored `videos[]` content only; do not auto-promote `cardMedia.lowFrameRateVideo` into the detail-page video section.
- Keep the pet index and pet detail pages more structured than Standard Pages; do not turn pet records into generic page-builder content.
- Improve Sanity schemas, Studio previews, field grouping, and validation for pet, pet type, owner, and pet index content where the editing workflow is unclear.
- Align pet cards, galleries, status indicators, owner summaries, and marketplace CTA components with the polished component patterns established in milestones 8 and 9.
- Update saved seed data and seed normalization for pet marketplace fields when schema or renderer expectations change.
- Preserve the rule that owner pages are reachable from pet listings, pet detail pages, or direct URLs, but there is no public owner directory.
- Document any marketplace surfaces that intentionally stay bespoke instead of generic page-builder driven.

Exit criteria:

- `/pets` feels like a polished, responsive marketplace index with shareable server-driven filters and pagination.
- `/pets/[slug]` presents the selected pet, gallery, structured facts, owner context, and contact CTA clearly on mobile and desktop.
- If the dedicated pet detail video renderer is not completed in this milestone, the schema/query/seed contract remains documented and the renderer is explicitly carried into Milestone 12 polish rather than treated as missing scope.
- Pet marketplace schemas are editor-friendly, with clear previews, validation, grouping, and reusable objects where appropriate.
- Seeded pet, owner, pet type, and pet index content matches the current schema and renderer contracts.
- No marketplace page depends on deprecated page-builder or legacy pet fields unless it is explicitly in a compatibility fallback.

## Milestone 11: Forms And Mailgun

Goal:

- Add phase-one form submission behavior.

Scope:

- Add server-only form route handler or server action.
- Validate form payloads.
- Send a branded do-not-reply acknowledgement email through Mailgun to the person who submitted the form, with an optional server-only `MAILGUN_CC_EMAIL` address CC'd for internal oversight. There is no separate internal notification email or master project inbox.
- Preserve pet and owner context for owner contact drawer submissions.
- Add friendly success and error handling.
- Log server-side failures with safe, non-sensitive context.
- Add lightweight tests for form validation and email boundary behavior.

Exit criteria:

- No Mailgun credentials are exposed to the browser.
- Form failures return usable error messages.
- Owner contact submissions are not routed to individual owner addresses; only the submitter and the optional CC oversight address receive email.
- Contact and warranty forms work with the current page/content structure.

## Milestone 12: Full Visual QA, Responsive Polish, And Animation

Goal:

- Bring the complete demo up to the intended bright, friendly, polished product feel.

Scope:

- Run a visual pass across all public pages.
- Run responsive checks across representative mobile, tablet, laptop, and desktop widths.
- Fix horizontal overflow, clipped content, awkward spacing, overlapping content, and desktop-only interactions.
- Add entry animations and subtle hover motion.
- Respect `prefers-reduced-motion`.
- Keep Framer Motion deferred unless Tailwind/CSS animation becomes awkward enough to justify it.
- Polish pet index filters, carousels, galleries, drawer behavior, video embeds, forms, and page-builder sections.
- Add or finalize the dedicated `/pets/[slug]` video renderer for authored `videos[]` content if it was deferred from Milestone 10; render the first usable detail video and keep card-loop media separate.

Exit criteria:

- No known horizontal overflow, clipped content, overlapping content, or desktop-only interaction patterns.
- Motion feels restrained and does not block content usability.
- The site visually matches `docs/project-brief.md` and approved design references.

## Milestone 13: Seeding Workflow Refactor

Goal:

- Refine seed tooling so content generation, content upload, and media generation/upload are clear separate phases.

Scope:

- Update seed scripts and README docs around three distinct phases:
  1. Generate or refresh all saved content and media prompts.
  2. Upload content to Sanity.
  3. Generate approved media and upload media to Sanity.
- Reduce the scope of the wizard so it guides phase selection without becoming an opaque all-purpose flow.
- Keep direct commands documented as manual/debug alternatives.
- Ensure the seed data shape matches the current Sanity schemas and page-builder configuration.
- Review how approved seed media is stored in Git and document options or follow-up decisions.
- Keep AI media provider calls human-run only.

Exit criteria:

- Seed tooling clearly separates content/prompt generation, content upload, and media generation/upload.
- README points users to the preferred seed workflow.
- Seed scripts do not unexpectedly call paid or quota-limited AI providers.
- The media storage approach is documented, including any remaining production deployment concerns.

## Milestone 14: Final Seed Dataset

Goal:

- Produce the final full demo dataset for launch.

Scope:

- Clean up all saved seed JSON files.
- Ensure owners, pets, pet types, testimonials, forms, system pages, homepage, marketing pages, and media manifests match the final schemas.
- Generate or refresh the full content set using the refined seed workflow.
- Generate approved media prompts and media assets through the human-run media workflow.
- Upload final content and approved media to Sanity.
- Confirm relationships, slugs, references, image roles, and page-builder sections resolve correctly.

Exit criteria:

- A clean Sanity dataset can be populated from the saved seed data.
- The full demo site has enough final content to feel complete.
- Final seed data is committed where appropriate, while unapproved/generated working files remain ignored.

## Milestone 15: Final Content And UI Review

Goal:

- Do one complete review of the launched-content candidate before deployment.

Scope:

- Review all public pages with the final Sanity dataset.
- Review copy for tone, clarity, satire, and consistency.
- Review UI and content together, not only component states.
- Confirm SEO metadata and social images are present where expected.
- Confirm forms, preview, Visual Editing, media, seed content, and CMS relationships still work after final data loading.
- Fix any final launch-blocking content or UI issues.

Exit criteria:

- The final content and UI are approved for launch.
- Known non-launch-blocking issues are documented in backlog.
- No obvious placeholder copy, broken references, or missing critical images remain.

## Milestone 16: Deployment Readiness And Go Live

Goal:

- Prepare the site for Vercel deployment and Sanity production usage, then launch.

Scope:

- Confirm Vercel environment variables.
- Confirm Sanity CORS, dataset, tokens, Visual Editing, Media Library, and webhook configuration.
- Confirm Mailgun env configuration.
- Run lint, typecheck, tests, and build.
- Update README setup and deployment instructions with real commands.
- Review attribution and dependency notes.
- Use `docs/launch-checklist.md` for final readiness verification.
- Deploy to Vercel and perform post-deployment smoke checks.

Exit criteria:

- Build succeeds locally.
- Required deployment environment variables are documented but not exposed.
- Production deployment renders the expected Sanity-backed content.
- Known limitations and post-launch backlog items are documented.
- Launch checklist items that are in scope for phase one are complete or explicitly documented as caveats.

## Deferred Work

These items should stay out of the first build unless priorities change:

- Public user registration and authenticated pet submissions.
- Direct owner messaging or owner dashboards.
- Saved/favorite pets.
- AI-generated owner email replies.
- Pet type landing pages.
- Standalone testimonials page.
- Generated video binaries.
- Framer Motion unless needed for animation complexity.
- Heavy end-to-end test coverage beyond critical smoke checks.
- Migrate the Sanity data layer to the idiomatic `next-sanity` `defineLive` auto-resolve pattern (and evaluate `strict: true`) instead of the current manual `draftMode()` branching plus separate published/preview fetch helpers. Considered because it collapses the "published works, draft breaks" stega blind spot that hid the M9 currency bug and adds compile-time draft-safety. Deferred because the current manual pattern is functionally correct, the change is broad (~15 loaders and every page), and this project still needs explicit `draftMode()` checks for non-perspective reasons (the `includeUnapproved` pet/owner preview filter and published-perspective `generateMetadata` reads), so it would not fully eliminate manual branching. Revisit as a dedicated change with a full Studio-to-Presentation verification pass, not as part of an active milestone.
