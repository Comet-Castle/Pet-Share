# Testing Strategy

This document defines a lightweight testing strategy for Pet Share. The goal is enough confidence for a Sanity-powered Next.js demo without letting testing work dominate the project.

## Goals

- Protect server-only boundaries, seed data contracts, and form/webhook behavior.
- Catch broken rendering, routing, and responsive layout issues before handoff.
- Keep tests focused on user-visible behavior and stable contracts.
- Avoid broad, brittle end-to-end coverage unless a flow is critical.
- Keep the test stack small and easy to run locally.
- Use TypeScript, not plain JavaScript, for app code, Sanity code, tests, and scripts unless a tool requires a JavaScript config file.
- Use ESLint as a required quality gate once scaffolding exists.

## Non-Goals

- Do not aim for exhaustive unit coverage.
- Do not snapshot large rendered pages as the main correctness signal.
- Do not test Sanity internals or Vercel internals.
- Do not mock every visual section when a simpler data-contract test is enough.
- Do not require heavy end-to-end tests for every marketing page.

## Proposed Test Stack

Final package choices should happen during scaffolding, but the likely light stack is:

- TypeScript type checking for structural correctness.
- ESLint for code quality, TypeScript, React, Next.js, and accessibility-oriented rules where practical.
- Vitest for unit and lightweight integration tests.
- React Testing Library for interactive client components when needed.
- Playwright for a small number of browser smoke and responsive checks, deferred until route skeletons exist.

Package decisions should be recorded in the future dependency decision log when dependencies are added.

## Command Expectations

Expected commands once scaffolding exists:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Tooling expectations:

- Prefer `.ts` and `.tsx` files for source, tests, Sanity schemas, seed scripts, and utility scripts.
- Avoid new plain `.js` files unless a package or framework config requires JavaScript.
- ESLint should run against application code, Sanity code, tests, and scripts where practical.
- TypeScript should run in strict enough mode to catch unsafe data-shape assumptions without creating excessive ceremony for the demo.

Optional later commands:

```bash
pnpm test:watch
pnpm test:e2e
pnpm test:seed
```

## Milestone Workflow

Before user review:

- Run cheap targeted checks when useful and available.
- Do not delay review with broad checks unless the change is risky.

After user approval:

- Add or update tests proportional to the milestone.
- Run relevant lint, typecheck, tests, and build checks.
- Report failures clearly and distinguish current-change failures from pre-existing project state.

## What To Test

### Seed JSON Contract

Test the contract before writing to Sanity.

Coverage:

- Every `seedId` is unique within its file.
- References resolve across seed files.
- Every pet has `imageTargetCount` between `5` and `10`.
- Every `assetKey` used by seed JSON has a matching approved file under `sanity/seed/media/` at the conventional path (see `docs/seed-json-contract.md`'s "Media discovery" section) — not `sanity/seed/generated/`.
- Planned videos have fallback image asset keys.
- Public pets use approved statuses.
- Marketing slugs avoid reserved route segments.

Recommended level:

- Unit or script-level validation tests.

### Environment And Secrets

Test env parsing and server-only boundaries.

Coverage:

- Required env vars fail clearly when missing at the server boundary where they are used.
- `NEXT_PUBLIC_` variables contain only public config.
- `APP_DEBUG` is server-only and never exposed through client bundles or rendered page data.
- Server-only helpers do not import into Client Components.
- Seed media generation scripts require explicit human-run mode and confirmation for batch generation.

Recommended level:

- Unit tests for env helper logic.
- Static review for client/server import boundaries.

### Error Handling And Logging

Test user-safe error behavior and debug logging boundaries.

Coverage:

- API handlers return stable user-safe error responses.
- Form failures show friendly messages without exposing internal details.
- Debug logging includes useful non-sensitive context when `APP_DEBUG=true`.
- Logs never include Sanity tokens, Mailgun keys, Gemini keys, preview secrets, webhook secrets, or full submitted message bodies.
- Route-level `error.tsx` and `not-found.tsx` states render useful recovery paths when they exist.
- Custom system pages render static fallback copy if CMS-backed error copy cannot be fetched.
- Error pages do not expose stack traces, raw provider errors, or debug-only context to users.

Recommended level:

- Unit tests for logger/redaction helpers if a helper is introduced.
- Route/action tests for expected error responses.
- Manual log review during integration testing.

### Sanity Schemas And Queries

Test schema and query contracts without overtesting Sanity itself.

Coverage:

- Schema field names align with `docs/content-model.md` and `docs/seed-json-contract.md`.
- Singleton IDs are used for singleton documents.
- Query projections include the fields required by route renderers.
- Published public queries exclude rejected, archived, pending, and unpublished pets.
- Preview queries are separate from published queries.

Recommended level:

- Type checks and query helper tests where practical.
- Seed validation against schema shape after schemas exist.

### Routes And Rendering

Test key page states, not every visual detail.

Coverage:

- `/`, `/pets`, `/pets/[slug]`, `/owners/[slug]`, and marketing pages render with seeded data.
- Missing documents produce useful not-found or empty states.
- 404 and server error states show clear Pet Share copy, recovery links, and no-index metadata where applicable.
- Route metadata can be generated from Sanity data.
- Pet index URL filters and pagination preserve shareable state.
- Owner pages are reachable contextually but no owner directory route exists.

Recommended level:

- Component or route-level tests for data normalization and state decisions.
- Small Playwright smoke checks after major route milestones.

### Forms And Mailgun

Test the server boundary carefully.

Coverage:

- Form payload validation.
- Required fields and email-like fields.
- Hidden context handling for pet ID, pet name, owner ID, source page, and form type.
- Mailgun adapter receives the expected sanitized payload.
- Failures return user-safe error messages.
- No Mailgun credentials are exposed to the browser.

Recommended level:

- Unit tests for validation.
- Route/action integration tests with Mailgun mocked.

### Preview And Revalidation

Test authorization and mapping.

Coverage:

- Draft Mode enable/disable requires the correct secret.
- Preview supports home, pet index, marketing pages, pet detail, and owner detail.
- Unpublished drafts can be previewed by document ID.
- Sanity webhook signature or shared secret validation rejects invalid requests.
- Document types map to the correct revalidation paths or tags.

Recommended level:

- Route handler tests.
- Unit tests for document-type to path/tag mapping.

### Responsive UI And Accessibility

Responsive behavior is required functionality.

Coverage:

- No horizontal overflow at representative mobile and desktop widths.
- Navigation, filters, drawers, forms, galleries, cards, carousels, and page sections work on small screens.
- Interactive elements have accessible names and visible focus states.
- Drawer focus is trapped only while open and restored on close.
- Reduced-motion preferences are respected for animation and media.

Recommended level:

- Playwright checks for key routes and interactions.
- Manual screenshot review during visual polish.
- Component tests for complex drawers, filter controls, and form states when useful.

## What Not To Test Early

- Do not build large end-to-end flows around every page-builder section.
- Do not test generated image quality with automated tests.
- Do not test real Mailgun sending in automated tests.
- Do not test real Gemini generation in automated tests.
- Do not test Vercel deployment behavior locally beyond documented build and env checks.

## Initial Test Priorities By Milestone

- Milestone 1: seed JSON validation script or tests once sample files exist.
- Milestone 2: lint, typecheck, build, and a minimal smoke test if tooling supports it.
- Milestone 3: schema shape checks and seed/schema alignment.
- Milestone 4: query helper tests and published-vs-preview separation.
- Milestone 5: route smoke tests, not-found/empty states, and basic custom error fallback behavior.
- Milestone 6: section renderer tests for supported block types and key responsive interactions.
- Milestone 7: seed replay validation and manifest consistency.
- Milestone 8: schema/typegen checks, targeted renderer checks for process and pricing sections, and focused browser QA for `/process` and `/pricing`.
- Milestone 9: preview secret, Draft Mode, Visual Editing, and Media Library checks.
- Milestone 10: pet index filter/pagination checks, pet detail gallery/contact-surface checks, and focused browser QA for `/pets` plus representative pet detail pages.
- Milestone 11: form validation and Mailgun adapter tests.
- Milestone 12: responsive Playwright checks and accessibility-focused interaction checks.
- Milestone 16: full lint, typecheck, test, and build before launch.

## Open Questions

- None currently. Use Vitest for the initial test runner, and defer Playwright until public route skeletons exist.
