# Implementation Conventions

This document defines day-to-day implementation conventions for Pet Share. It should be used when scaffolding the app, writing React components, creating Next.js routes, and deciding where code belongs.

Prefer the conventions here unless the scaffolded project or framework tooling creates a stronger local pattern.

## Core Principles

- Build component-first. Reusable UI should become a named, typed component before the same pattern appears in multiple places.
- Prefer Server Components by default. Add `"use client"` only for browser-only state, effects, event handlers, animation observers, drawers, carousels, form interactivity, or third-party client libraries.
- Keep Client Components small. Fetch Sanity data in Server Components or server-only helpers, then pass typed props into interactive components.
- Use semantic HTML first, then layer styling and behavior on top.
- Prefer simple, boring abstractions. Add shared utilities or components when they remove real duplication or make behavior safer.
- Keep every public UI responsive from the first implementation pass.

## Component-First Development

If a UI pattern will appear more than once, create a component for it instead of hand-writing separate versions.

Examples:

- `Button` with variants for primary, secondary, ghost, destructive, icon-only, loading, and disabled states.
- `LinkButton` or a button-compatible link wrapper for navigation CTAs.
- `Badge` or `Pill` for pet type filters, traits, and tags.
- `ToggleGroup` for boolean or mutually exclusive filter controls.
- `RatingIconGroup` for mess risk, chaos level, energy level, or similar fillable icon ratings.
- `CardMedia` for image/video card media with consistent aspect ratio, lazy loading, alt text, and optional low-frame-rate video behavior.
- `SectionHeader` for repeated page-builder section headings.
- `EmptyState`, `ErrorState`, and `Callout` for reusable status messaging.

Rules:

- Put reusable primitives in `components/ui/`.
- Put layout shell components in `components/layout/`.
- Put product-specific composed components in `components/features/`.
- Put page-builder section renderers in a dedicated feature area such as `components/features/sections/`.
- Do not create several one-off buttons, cards, badges, drawers, or form fields with duplicated classes.
- Component props should express intent, not arbitrary styling escape hatches.
- Accept `className` on shared UI primitives when useful, but do not rely on `className` to replace missing variants.

## Variants And Styling

Reusable UI components should expose controlled variants.

Good:

```tsx
<Button variant="primary" size="md">Browse pets</Button>
<Button variant="ghost" size="icon" aria-label="Close">...</Button>
```

Avoid:

```tsx
<button className="rounded-full bg-green-500 px-4 py-2">Browse pets</button>
<button className="rounded-xl bg-lime-400 px-6 py-3">Contact owner</button>
```

Variant guidance:

- Start with small typed variant maps inside the component.
- If component variants become complex or repeated across many primitives, consider a helper such as `class-variance-authority`, but record that decision in `docs/dependency-decision-log.md` before adding it.
- Use Tailwind utilities and project design tokens for color, spacing, radius, typography, shadows, and motion.
- Avoid hardcoded arbitrary values unless the design genuinely needs them.
- Keep the site width aligned with the project direction: wide Tailwind-based containers around 1200px for core content, with responsive constraints.

## File And Naming Conventions

Use PascalCase for React components and component files:

```text
components/ui/Button.tsx
components/features/pets/PetCard.tsx
components/features/sections/HeroSection.tsx
```

Use camelCase for utilities, hooks, and non-component modules:

```text
lib/utils/formatDate.ts
sanity/lib/imageUrl.ts
components/features/pets/usePetFilters.ts
```

Use route conventions from the Next.js App Router:

```text
app/(site)/page.tsx
app/(site)/pets/page.tsx
app/(site)/pets/[slug]/page.tsx
app/(site)/owners/[slug]/page.tsx
app/(site)/[slug]/page.tsx
app/api/revalidate/route.ts
app/studio/[[...tool]]/page.tsx
```

Special route files should stay near the route segment they support:

```text
loading.tsx
error.tsx
not-found.tsx
layout.tsx
template.tsx
```

## Exports And Imports

- Prefer named exports for shared modules and components.
- Use framework-required default exports for Next.js route files, pages, layouts, error boundaries, and not-found files.
- Prefer direct imports over broad barrel imports when bundle size or clarity matters.
- Use `@/` path aliases only after they are configured in `tsconfig.json`.
- Avoid importing server-only modules into Client Components.

## Next.js Route Conventions

- Use App Router patterns only. Do not use Pages Router APIs such as `getStaticProps`, `getServerSideProps`, `next/router`, `next/head`, or `NextApiRequest`.
- Use Server Components for route-level data fetching.
- Use route handlers under `app/api/` for webhooks, form submissions, preview/draft endpoints, and other server-only integrations.
- Use `generateMetadata` for Sanity-backed metadata.
- Use `notFound()` for missing documents outside preview mode.
- Keep route params and search params typed. Follow the current Next.js async API expectations when implementing routes.
- Use URL state for shareable pet index filters and pagination.

## Server And Client Boundaries

Server-side only:

- Sanity read/write tokens.
- Mailgun credentials and email delivery.
- Webhook validation.
- Draft Mode secrets.
- Seed and media upload scripts.
- Environment validation for server-only values.

Client-side only when needed:

- Drawers and menus.
- Carousel controls.
- Filter control interactions.
- Form field interactivity.
- Scroll-triggered or advanced motion if implemented.
- Browser APIs such as `window`, `document`, `localStorage`, `IntersectionObserver`, and media queries.

Boundary rules:

- Do not pass non-serializable props from Server Components to Client Components.
- Do not pass large unused Sanity payloads to Client Components.
- Normalize data at the server/helper boundary when it makes components simpler.
- Keep client state local unless it must be shareable through the URL or shared across distant components.

## Sanity Integration Conventions

- Keep Sanity schemas in `sanity/schemaTypes/`.
- Keep document schemas under `sanity/schemaTypes/documents/`.
- Keep reusable object schemas under `sanity/schemaTypes/objects/`, grouped by domain where useful.
- Keep GROQ queries in `sanity/queries/`.
- Keep clients, image URL builders, preview helpers, and fetch wrappers in `sanity/lib/`.
- Keep generated/shared Sanity types in `sanity/types/`.
- Use Sanity image helpers to build Sanity CDN URLs, then render with `next/image` where practical.
- Configure `next.config` image `remotePatterns` for the Sanity image CDN domain before using Sanity-hosted images with `next/image`.
- Keep public published queries separate from draft/preview queries.
- Remember that Sanity CDN caching and Next.js fetch caching are separate. If recently changed CMS content appears stale, verify the Sanity document directly before changing UI code.
- For fast-changing singleton pages during local visual work, it is acceptable to use the non-CDN Sanity client intentionally in that page loader. Document the reason in code or the handoff when doing so.
- Once webhook revalidation exists, prefer explicit tag/path revalidation over broad cache disabling.

## Page Composition Ownership

Not every page section is owned by the generic page-builder renderer.

- Generic marketing page sections should use `components/features/sections/page-sections.tsx` unless a page needs a bespoke experience.
- The homepage can use code-composed sections in `app/(site)/page.tsx` when fidelity to the approved design requires a custom marketplace-style layout.
- If a code-composed homepage section uses Sanity data, keep seed defaults in sync with the component so reseeding does not reintroduce old copy or structure.
- Before changing homepage copy or layout, check whether the visible content comes from `homePage`, related referenced documents such as testimonials, generated seed logic, or hardcoded fallback copy.
- For small homepage visual refinements, prefer direct component changes in `app/(site)/page.tsx` and a focused rendered screenshot. Do not push Sanity content unless the changed copy or data is actually CMS-authored.
- Keep the homepage marketplace cards visually simple and close to the approved references. Avoid adding extra labels, dividers, badges, buttons, or explanatory UI unless the user asks for them.
- Keep homepage process content focused. The current homepage explains the temporary host flow; the owner/listing flow belongs on `/how-it-works` and is linked from a CTA.

## Forms

- Build reusable form primitives for labels, inputs, textareas, select controls, validation messages, success states, and error states.
- Associate every input with a label.
- Render validation messages in a way assistive technology can announce.
- Keep form submission routes server-only.
- Send phase-one form acknowledgement emails through Mailgun to the submitter, with an optional CC to an internal oversight address. Do not send a separate internal notification email.
- Never expose Mailgun credentials or destination routing logic to Client Components.
- Keep satirical form copy clear enough that users still understand success and failure states.

## Images And Media

- Use `next/image` for content images where practical.
- Use meaningful alt text for content images.
- Use empty `alt=""` only for decorative images.
- Define stable aspect ratios for cards, hero media, galleries, and page-builder images.
- Lazy load non-critical media.
- Keep optional low-frame-rate card videos lazy and non-blocking.
- Respect reduced-motion preferences for animated media where applicable.

## Motion

- Start with Tailwind utilities and small CSS animation definitions.
- Respect `prefers-reduced-motion`.
- Do not add Framer Motion on day one.
- Do not build a broad custom scroll-animation framework with Intersection Observer.
- If scroll-triggered entry animation, staggered choreography, or animation state becomes common enough that Tailwind/CSS feels awkward, add Framer Motion as the preferred animation library and update the dependency decision log.

## Documentation And Comments

- Use clear names and types before adding comments.
- Add JSDoc when a component, function, hook, loader, action, or utility has non-obvious inputs, outputs, side effects, or lifecycle behavior.
- Add short inline comments for tricky React behavior, complex Sanity queries, cache behavior, preview behavior, webhook validation, or data normalization.
- Mark unfinished work with `//TODO:` exactly, followed by a concrete follow-up.
- Do not leave vague TODO comments.

## Testing Expectations

- Add tests for reusable utilities, data normalization, seed validation, webhook validation, and form handling.
- Add component tests for state-heavy client components such as drawers, carousels, filters, and complex form controls when testing tooling exists.
- Add route or integration tests for API handlers, preview, and revalidation where practical.
- Keep tests focused on user-visible behavior and stable contracts.
- Use the testing scope in `docs/testing-strategy.md` for milestone-specific decisions.

## Review Checklist

Before handing implementation work back for review:

- Repeated UI patterns are represented by reusable components.
- Shared UI components have typed variants instead of duplicated one-off classes.
- Server and Client Component boundaries are intentional.
- No secrets or server-only helpers are imported into Client Components.
- Responsive behavior is considered for mobile, tablet, and desktop.
- Accessible names, labels, focus states, and alt text are present where needed.
- Sanity queries return only the fields needed by renderers.
- New dependencies are justified in `docs/dependency-decision-log.md`.
- Attribution-relevant additions are reflected in `ATTRIBUTIONS.md`.
- Verification scope matches the change size. Use `docs/frontend-qa.md` to avoid over-testing small visual tweaks while still checking meaningful layout, responsive, CMS, or interaction risk.
