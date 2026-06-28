# Architecture

This document captures the intended technical shape for Pet Share before the app is scaffolded. Treat it as a planning baseline, not a rigid contract. If the implementation later proves a different approach is better, update this file with the new decision and rationale.

## Goals

- Demonstrate a modern Next.js App Router frontend backed by Sanity CMS.
- Keep the public site fast, accessible, and mostly server-rendered.
- Keep the public experience fully responsive across mobile, tablet, laptop, and desktop viewports.
- Keep Sanity content modeling clean enough to show editorial flexibility.
- Keep preview, draft, and webhook behavior clearly separated from public published-content flows.
- Keep the project approachable for future AI agents and human contributors.
- Keep project costs low and prefer free, open-source dependencies and platform features where practical.

## Architecture Guardrails

- Avoid scope creep around preview tooling. Implement basic Draft Mode first, then evaluate Sanity Visual Editing after the core content model and pages exist.
- Treat animation as brand polish, not required structural behavior. Respect `prefers-reduced-motion` for all meaningful motion.
- Avoid dependency creep. Add libraries only when they are actively used, cost-free or clearly justified, license-compatible, and recorded in `ATTRIBUTIONS.md` when required.
- Design webhook revalidation around the content model. The hard part is mapping content changes to the correct paths or tags, not receiving the webhook.
- Keep Sanity schemas semantic and editor-friendly. Avoid modeling pages as visual layout fragments unless editors truly need that control.
- Protect the low-cost goal. Prefer embedded Studio, free/open-source libraries, and simple deployment choices unless there is a clear demo reason to add a paid service.

## Baseline Decisions

- Package manager: `pnpm`.
- Styling: Tailwind CSS.
- Fonts: `Nunito Sans` and `Quicksand` from Google Fonts via `next/font/google`.
- Icons: use `lucide-react` as the default app UI icon set; use React Icons only when a needed brand or specialty icon is not available in Lucide.
- Animation: start with Tailwind CSS utilities and small custom CSS. Framer Motion can be added later if scroll-triggered or more choreographed animation needs exceed what Tailwind/CSS can handle cleanly.
- Sanity Studio: embedded at `/studio`.
- Deployment: Vercel free tier for the Next.js app, with Sanity CMS as the content backend.
- Preview: basic Draft Mode first from Sanity Studio preview links only; Sanity Visual Editing is a strong post-launch goal.
- Caching: use cached/static public pages with Sanity webhook-driven revalidation.
- Email: use Mailgun for phase-one form delivery to a single master project inbox.
- Testing: keep the stack light with linting, type checking, targeted Vitest tests, and optional Playwright smoke tests later.
- Platform tooling: use the local Vercel plugin and `sanity-best-practices` skill when available for platform-specific implementation guidance; do not treat either as an app dependency.

## Application Boundaries

- `app/` owns routes, route handlers, layouts, metadata, loading states, error states, and not-found states.
- `components/` owns reusable React UI outside route files.
- `sanity/` owns Studio configuration, schemas, GROQ queries, Sanity clients, image helpers, and Sanity-specific types.
- `lib/` owns cross-cutting utilities that are not specific to Sanity or a single feature.
- `config/` or `lib/env/` owns environment parsing and validation.
- `docs/` owns planning, architecture, content modeling, and implementation notes.

Avoid mixing these concerns unless a framework convention requires it.

## Expected Folder Structure

```text
app/
  (site)/
    page.tsx
    [slug]/
      page.tsx
    pets/
      page.tsx
      [slug]/
        page.tsx
    owners/
      [slug]/
        page.tsx
    preview/
      home/
        page.tsx
      pets/
        page.tsx
      page/
        [documentId]/
          page.tsx
      pet/
        [documentId]/
          page.tsx
      owner/
        [documentId]/
          page.tsx
  api/
    draft/
      enable/
        route.ts
      disable/
        route.ts
    forms/
      route.ts
    revalidate/
      route.ts
  studio/[[...tool]]/
    page.tsx
components/
  features/
    forms/
    pets/
    sections/
  layout/
  ui/
config/
lib/
  env/
  utils/
sanity/
  lib/
    client.ts
    image.ts
    live.ts
  queries/
  schemaTypes/
    documents/
    objects/
  structure/
  types/
  seed/
styles/
types/
public/
```

This structure should be adjusted once real product needs are clearer, but avoid introducing multiple competing patterns.

## Routing

- Use the Next.js App Router.
- Use `app/(site)/` for public marketing and marketplace routes without adding `(site)` to URLs.
- Use `/pets` for the pet index singleton content plus queried pet cards.
- Use `/pets/[slug]` for pet detail pages and `/owners/[slug]` for owner detail pages.
- Use `app/(site)/[slug]/page.tsx` for Sanity-authored marketing pages such as About, Process, Pricing, and Contact.
- Do not add a public owner directory route in phase one.
- Mount Sanity Studio at `app/studio/[[...tool]]/`.
- Use `app/api/` only for server-side endpoints such as revalidation, preview mode, webhooks, or integrations that must not run in the browser.
- Keep route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` files near the routes they support.
- Use CMS-authored `systemPage` content for custom 404, 500, and generic error pages where available, but keep static fallback copy in code so error boundaries do not depend on Sanity being available.

## Rendering Model

- Prefer Server Components by default.
- Add `"use client"` only for components that need browser APIs, event handlers, local interactive state, effects, or client-only libraries.
- Keep Client Components small and pass server-fetched data into them as typed props.
- Fetch page-level Sanity data in route-level Server Components or dedicated server-only data helpers.
- Use `generateMetadata` for route metadata that depends on Sanity content.
- Render CMS-authored page sections through typed section renderers. Keep section components server-rendered unless they need browser-only behavior such as carousel controls, drawer state, or animation observers.

## Sanity Integration

- Keep schemas in `sanity/schemaTypes/`.
- Group document schemas under `sanity/schemaTypes/documents/` and reusable objects under `sanity/schemaTypes/objects/` when scaffolding.
- Consult the `sanity-best-practices` skill before implementing Sanity schemas, GROQ queries, Studio structure, preview, TypeGen, Visual Editing, image handling, Portable Text, or page-builder behavior.
- Keep GROQ queries in `sanity/queries/`.
- Keep Sanity client setup, image URL helpers, live preview helpers, and fetch wrappers in `sanity/lib/`.
- Use Sanity image helpers to build Sanity CDN asset URLs, then render those URLs with Next.js `next/image` where practical.
- Configure `next.config` image `remotePatterns` for the Sanity image CDN domain before rendering Sanity-hosted images through `next/image`.
- Keep desk structure customization in `sanity/structure/`.
- Keep generated or shared Sanity types in `sanity/types/`.
- Model content by editorial meaning first. Avoid putting frontend layout details into schemas unless editors need that control.
- First-pass document schemas should match `docs/content-model.md`: site settings, home page, pet index page, marketing pages, owners, pets, pet types, testimonials, and form definitions.
- First-pass reusable object schemas should be limited to the initial schema scope in `docs/content-model.md`. Add planned objects later when a page or component actually needs them.
- Use Sanity Studio structure customization for singleton editing and task-based groups: Settings, Pages, Marketplace, Reusable Content, and Forms.

## Data Fetching

- Public pages should query published Sanity content by default.
- Draft and preview queries should use separate helpers from published-content queries.
- Query functions should return typed data and normalize only where it improves route/component simplicity.
- Keep GROQ projections close to the query file that owns them.
- Avoid exposing tokens or private dataset access in Client Components.
- Prefer fetching related server data together at the route or server helper level to avoid route-level waterfalls.
- Keep Sanity projections aligned with the component data actually rendered so Client Components do not receive large unused CMS payloads.

## Caching And Revalidation

- Use static rendering and cached Sanity fetches for stable public content when practical.
- Use explicit revalidation settings for content that changes predictably.
- Implement on-demand revalidation for Sanity publish events. This is important for cache busting when editors publish page or listing changes.
- Document any `no-store`, draft-mode, live-preview, or webhook-driven cache behavior near the implementation.
- Keep webhook secrets server-only and verify incoming webhook requests before revalidating content.
- Prefer Sanity's webhook signature tooling over hand-rolled signature validation when possible.
- Design webhook payloads with enough document type, slug, and route information to revalidate specific paths or tags instead of always revalidating the entire site.
- Use the document-to-path mapping in `docs/content-model.md` as the starting revalidation contract.
- Start with predictable cache tags such as `site-settings`, `home-page`, `pet-index`, `marketing-page:${slug}`, `pet:${slug}`, `owner:${slug}`, `pet-type:${slug}`, `testimonial:${id}`, and `form:${slug}`.
- Prefer targeted path/tag revalidation. Full-site revalidation should be a fallback for unknown relationships, not the default.

## Preview And Draft Mode

- Preview mode should be opt-in and clearly separated from the public published-content path.
- Preview links should originate from Sanity Studio only. Do not add a public/manual preview URL unless the project direction changes.
- Draft preview should support all content-backed pages.
- Unpublished draft pages should be previewable before they have a public route, using a draft-safe preview path or document identifier fallback.
- Draft mode route handlers should validate a shared secret before enabling preview behavior.
- Preview helpers should not be imported into ordinary public data-fetching helpers unless the code explicitly branches by draft mode.
- The UI should make preview state obvious when preview mode is active and include an exit preview button.
- Keep the implementation compatible with a future Sanity Visual Editing or Presentation Tool phase. Treat Visual Editing as a strong post-launch goal, but do not implement that complexity until the core content model and pages exist.

Starting preview routes:

- `/preview/home`
- `/preview/pets`
- `/preview/page/[documentId]`
- `/preview/pet/[documentId]`
- `/preview/owner/[documentId]`

Slugged published preview links can target their eventual public route when the slug exists.

## Styling And UI

- The visual direction lives in `docs/project-brief.md`.
- Prefer global design tokens for colors, spacing, typography, radius, and shadows once styling is scaffolded.
- Use Tailwind CSS for styling.
- Use `Nunito Sans` and `Quicksand` from Google Fonts via `next/font/google`.
- Use a bright, modern, friendly visual style with matte color treatment instead of glossy or overly saturated colors.
- Design and implement mobile-first responsive layouts for every page and reusable section.
- Avoid fixed-width assumptions. Use fluid grids, responsive spacing, container constraints, and stable aspect ratios for Sanity-authored media.
- Ensure page-builder sections have defined responsive behavior before they are exposed broadly to editors.
- Check navigation, drawers, forms, pet cards, filter controls, carousels, galleries, and embedded videos at representative mobile and desktop widths.
- Use animation deliberately for friendly, playful UI moments. Page sections and key content can animate in on entry, while hover states should use subtle motion such as lift, scale, soft rotation, or button twist effects.
- Keep motion restrained and responsive. Avoid animations that feel loud, slow, or distracting.
- Respect `prefers-reduced-motion` through Tailwind motion variants or equivalent CSS.
- Avoid building a large custom animation framework around Intersection Observer. Use simple browser APIs only for small needs; if scroll-triggered animation becomes a meaningful pattern, add Framer Motion rather than growing complex custom code.
- Use `lucide-react` icons for interface actions, navigation, empty states, and small decorative UI details when an appropriate icon exists.
- Keep icon usage accessible. Decorative icons should be hidden from assistive technology, while icon-only controls need an accessible label.
- Keep reusable primitives in `components/ui/`.
- Keep product-specific composed UI in `components/features/`.
- Keep layout shell components in `components/layout/`.
- Keep CMS section renderers in a dedicated feature area such as `components/features/sections/` so page-builder behavior is consistent across the homepage and marketing pages.

## Forms And Email

- Form submissions should flow through server-only route handlers or server actions.
- Use Mailgun for phase-one delivery to a single master project inbox.
- Do not route owner contact forms to individual owners in phase one.
- Keep Mailgun credentials, destination emails, and any anti-abuse checks server-only.
- Preserve page context for owner contact submissions so emails can identify the source pet and owner.
- Validate form payload shape at the server boundary before calling Mailgun.
- Return friendly, CMS-compatible success and error states where practical.

## Environment And Secrets

- Keep `.env.example` updated as the source of truth for required variables.
- Browser-safe variables must use the `NEXT_PUBLIC_` prefix.
- Sanity write tokens, preview secrets, webhook secrets, and authenticated API credentials must remain server-only.
- Mailgun credentials and destination inbox settings must remain server-only.
- Use Vercel platform tooling when available to inspect or configure deployment environment variables, but never copy secret values into docs or chat.
- Validate required env vars at startup or before first use.

## Testing Strategy

- Add unit tests for utilities, query helpers, data normalization, and non-trivial business logic.
- Add route or integration tests for API handlers, preview mode, and webhook revalidation once those exist.
- Add component tests for complex interactive Client Components when testing tooling is available.
- Keep smoke checks around build, lint, typecheck, and critical page rendering once the app is scaffolded.
- Use responsive browser checks or screenshots for meaningful frontend layout changes when browser tooling is available.
- Avoid building a heavy test harness before the app needs it.

## Open Decisions

- Sanity project ID and dataset strategy have not been selected.
- Preview/live content strategy has not been implemented.
- Sanity webhook validation and revalidation have not been implemented.
- Mailgun form delivery has not been implemented.
- No Tailwind animation add-on is installed in the scaffold. Framer Motion remains deferred as the preferred future solution if Tailwind/CSS becomes awkward for scroll-triggered or choreographed animation.
- Exact design token values have not been selected.
- Any supplemental React Icons usage has not been selected.
- Exact Vitest and optional Playwright setup has not been implemented.
