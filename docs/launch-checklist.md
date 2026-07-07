# Launch Checklist

This checklist tracks readiness for a public Pet Share demo launch on Vercel with Sanity CMS. It should be applied near the end of the milestone plan, not used to expand early milestones.

Use this with `docs/environment-and-deployment.md`, `docs/testing-strategy.md`, `docs/accessibility-checklist.md`, and `docs/milestones.md`.

## Scope Rule

Launch readiness does not mean every backlog item is complete.

Explicitly out of phase-one launch unless later reprioritized:

- Public user registration.
- User-submitted pet flow.
- Saved/favorite pets.
- Direct messaging.
- AI-generated owner email replies.
- Generated video binaries.
- Owner directory.
- Pet type landing pages.

## Pre-Scaffold Readiness

- Planning docs are present and linked from `README.md`.
- `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, and `GEMINI.md` share the same agent instructions through symlinks.
- `.gitignore` excludes secrets, build outputs, dependency folders, generated review media, and local environment files.
- `.env.example` lists planned public and server-only variables.
- Milestones define the controlling implementation scope.
- Dependency decision log captures accepted, likely, deferred, rejected, and tooling-only choices.
- Seed JSON contract is clear enough to start schema and seed script implementation.

## App And Tooling Readiness

- Next.js App Router app is scaffolded.
- TypeScript is configured for app, Sanity, tests, and scripts.
- pnpm scripts exist for expected local workflows.
- ESLint is configured.
- Formatting approach is defined.
- Tailwind CSS is configured.
- Global styles and design tokens are established enough for first implementation.
- Sanity Studio route exists at `/studio`.
- `next.config` allows Sanity image CDN domains through image `remotePatterns`.
- `next/image` is used for Sanity-hosted content images where practical.
- Lucide icons are available for UI icons.
- Initial test tooling exists.

## Environment Readiness

- `.env.example` is current.
- `.env.local` exists locally and is not committed.
- Required public Sanity variables are set locally:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET`
  - `NEXT_PUBLIC_SANITY_API_VERSION`
- Required preview variables are set where preview is tested:
  - `SANITY_API_READ_TOKEN`
- Optional draft live-update variable is set where live draft streaming is required:
  - `SANITY_API_BROWSER_READ_TOKEN`
- Required revalidation variables are set where webhooks are tested:
  - `SANITY_REVALIDATE_SECRET`
- Required seed/upload variables are available only where needed:
  - `SANITY_API_WRITE_TOKEN`
- Required Mailgun variables are set for real form testing:
  - `MAILGUN_API_KEY`
  - `MAILGUN_DOMAIN`
  - `MAILGUN_FROM_EMAIL`
- `GEMINI_API_KEY` is local-only by default and not configured in Vercel unless a later workflow genuinely requires it.
- `APP_DEBUG` defaults to false outside intentional debugging.
- No real secrets are committed.

## Sanity Readiness

- Project ID and dataset are confirmed.
- Dataset name matches environment configuration.
- Studio loads locally.
- Studio loads in deployed environments where expected.
- Studio structure groups content into Settings, Pages, Marketplace, Reusable Content, and Forms.
- Singleton documents are constrained through Studio structure.
- Schema validation covers required fields.
- Editor previews exist for implemented documents and objects.
- Public and preview query helpers are separate.
- Sanity CORS includes local and deployed app origins.
- Sanity preview links point to the correct app origin.
- Sanity webhook target points to the deployed revalidation route.
- Webhook secret validation is implemented before revalidation logic runs.
- Sanity write token uses least privilege and is server-only.

## Seed Data Readiness

- Representative seed JSON passes validation.
- Final seed data is generated, reviewed, and saved before production seeding.
- Full seed set includes planned pages, system pages, pet types, owners, pets, testimonials, and forms.
- Full pet count target is satisfied when the full seed pass is in scope.
- References resolve across seed files.
- Slugs are unique and route-safe.
- Singleton IDs match the documented explicit IDs.
- Public pet visibility fields are correct.
- Generated media has been reviewed before being moved into `sanity/seed/media/`.
- No files under `sanity/seed/generated/` are treated as approved (all of `sanity/seed/` is gitignored and not committed).
- Media manifest points approved assets to local media paths under `sanity/seed/media/`.
- Media manifest includes provenance and review metadata.
- Normal `pnpm seed` does not call AI providers.
- Seed upload can upload approved local media to Sanity assets.

## Public Route Readiness

- `/` renders seeded homepage content.
- `/pets` renders pet index content and server-driven filters.
- `/pets` filter and pagination state is URL-driven and shareable.
- `/pets/[slug]` renders approved/published pets.
- `/owners/[slug]` renders owner pages reachable from pet context or direct URL.
- Marketing pages render from Sanity content.
- Owner directory route does not exist.
- Pet type landing pages do not exist.
- Missing or unavailable content returns a useful not-found state.
- Custom 404, 500, and generic error states render clear Pet Share copy.
- Error pages have static fallback copy if Sanity is unavailable.
- Route metadata is generated from Sanity content where applicable.
- OG/Twitter tags render on all public pages with a branded `.png` OG image and canonical URLs (implemented in M12).
- `robots.txt`/`robots.ts`, a `sitemap.xml`/`sitemap.ts`, and a branded favicon/app-icon set exist. (Deferred out of M12 — add during launch readiness.)
- Structured data (JSON-LD: Organization on home, product-like markup on pet detail) considered. (Deferred out of M12.)

## Preview And Revalidation Readiness

- Preview links originate from Sanity Studio.
- Preview uses Sanity Presentation preview URL validation with `SANITY_API_READ_TOKEN`.
- Draft-capable browser live updates use `SANITY_API_BROWSER_READ_TOKEN` when configured.
- Preview supports all content-backed routes planned for phase one.
- Unpublished drafts can be previewed by document ID where planned.
- Preview mode shows a visible banner.
- Exit preview action works.
- Published content queries exclude drafts and pending content.
- Preview queries can include authorized drafts and pending content.
- Sanity publish events revalidate targeted paths or tags.
- Invalid webhook requests are rejected.
- Revalidation failures log safe diagnostic context.

## Forms And Email Readiness

- Contact, owner contact, and warranty-style forms render from planned form definitions.
- Owner contact drawer preserves pet and owner context.
- Form validation prevents malformed payloads at the server boundary.
- Mailgun sends real email to the master inbox in the intended environments.
- Mailgun credentials are server-only.
- Form success states are clear and satirical.
- Form error states are clear, satirical, and do not expose provider errors.
- Automated tests mock Mailgun rather than sending real email.

## Responsive And Accessibility Readiness

- Navigation works on mobile, tablet, laptop, and desktop.
- Pet index filters work on desktop and mobile.
- Drawers work on desktop and mobile.
- Forms work on desktop and mobile.
- Cards, galleries, carousels, videos, page-builder sections, and error pages do not overflow horizontally.
- Touch targets are comfortable on mobile.
- Keyboard navigation works for routes and key interactive components.
- Focus states are visible.
- Drawer focus is trapped only while open and restored on close.
- Meaningful images have alt text.
- Icon-only controls have accessible labels.
- Fillable rating icons expose text values.
- Color is not the only indicator of status.
- Reduced-motion preferences are respected.
- Accessibility checklist has been applied to the surfaces completed for launch.

## Performance Readiness

- Public pages use Server Components by default.
- Client Components are limited to interactive behavior.
- Sanity queries project only fields needed by renderers.
- No broad unused CMS payloads are passed to Client Components.
- Images use stable aspect ratios.
- Important images use appropriate priority and sizes.
- Non-critical media is lazy loaded.
- Optional low-frame-rate card videos are lazy and non-blocking.
- Large client-only components are dynamically imported where useful.
- Third-party scripts are not loaded globally unless needed globally.
- Cache and revalidation behavior is intentional and documented.

## Security Readiness

- Sanity tokens are never exposed to Client Components.
- Mailgun credentials are server-only.
- Preview and webhook secrets are server-only.
- Form inputs are validated and sanitized at the server boundary.
- Webhooks are validated before side effects.
- Logs do not include secrets, raw provider errors, or full submitted message bodies.
- Error pages do not expose stack traces.
- `APP_DEBUG=true` is not enabled in production unless intentionally debugging.
- Dependency licenses and costs have been reviewed.

## Vercel Readiness

- Vercel project is linked to the repository.
- Required Vercel Preview environment variables are set.
- Required Vercel Production environment variables are set.
- `NEXT_PUBLIC_SITE_URL` is set for preview-link testing and launch.
- Production domain can remain undecided until ready, but deployment URLs must be reflected where preview links require them.
- Build command and install command match pnpm setup.
- Vercel build succeeds.
- Vercel logs are available for review.
- Vercel free-tier limits are acceptable for demo traffic and build usage.

## Final Verification

Before launch:

- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes.
- `pnpm build` passes.
- Seed replay has been tested against the intended dataset.
- Preview has been tested from Studio.
- Revalidation has been tested from a Sanity publish event or representative webhook request.
- Mailgun sending has been tested manually in the intended environment.
- Key pages have been checked at representative mobile and desktop widths.
- Key forms, filters, drawers, and carousels have been checked with keyboard.
- `ATTRIBUTIONS.md` is current.
- `README.md` setup instructions are current.
- Known launch caveats are documented.

## Post-Launch Checks

After launch:

- Open the production URL and verify homepage render.
- Verify `/pets` filter URLs work when shared.
- Verify a pet detail page.
- Verify an owner page from a pet.
- Verify a marketing page.
- Verify a missing route shows the custom 404.
- Submit a test form and confirm the master inbox receives it.
- Publish a small Sanity copy edit and confirm revalidation updates the page.
- Review Vercel logs for errors.
- Review Sanity usage and Vercel usage against free-tier expectations.
- Record any follow-up issues in `docs/backlog.md` or the active milestone notes.

## Open Questions

- Final production domain is not chosen yet.
- Exact Sanity plan and Vercel usage limits should be rechecked before public launch.
