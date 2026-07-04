# Dependency Decision Log

This document records planned package, platform, and tooling choices for Pet Share before implementation. Use it to keep the project low-cost, license-aware, and focused.

Do not treat an entry here as permission to install a dependency automatically. Add packages only when the current milestone needs them, then update this log and `ATTRIBUTIONS.md` when attribution is required.

Before installing any package or enabling any service:

- Confirm the package is still maintained.
- Confirm license compatibility.
- Confirm pricing or free-tier limits when a service is involved.
- Confirm whether it is runtime, development-only, seed-only, or agent/tooling-only.
- Prefer first-party framework packages and simple code over unnecessary dependencies.

## Status Labels

- `Accepted`: planned for implementation when the relevant milestone starts.
- `Likely`: expected to be useful, but confirm during implementation.
- `Deferred`: intentionally not part of phase one.
- `Rejected`: considered and not planned.
- `Tooling only`: local agent or platform helper, not an app dependency.

## Decisions

| Name | Status | Kind | Cost | License / Terms | Used For | Reason | Alternatives / Notes | Attribution |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `pnpm` | Accepted | Package manager | Free | Open source | Dependency install and scripts | Faster installs, deterministic lockfile, good monorepo/workspace support if the project grows. | npm is simpler but less strict; Yarn PnP was avoided to reduce friction. | No project attribution expected. |
| Next.js | Accepted | Runtime framework | Free framework; Vercel hosting may have free-tier limits | Open source | App Router frontend, routes, metadata, server rendering, route handlers | Fits the Sanity demo goal and Vercel deployment target. | Remix, Astro, or plain React would work but are not the chosen stack. | Record package attribution if required by final license review. |
| React | Accepted | Runtime library | Free | Open source | UI component model | Required by Next.js and aligns with component-driven frontend goals. | None for this stack. | Record package attribution if required by final license review. |
| TypeScript | Accepted | Development language/tooling | Free | Open source | App, Sanity, tests, and scripts | Keeps Sanity schemas, query results, route params, and seed contracts safer. | Plain JavaScript was rejected for app code. | No project attribution expected unless license review requires it. |
| Sanity CMS packages | Accepted | Runtime and Studio dependencies | Sanity service free tier expected for demo usage; verify limits before launch | Open source packages plus Sanity service terms | Studio, schemas, content API, image assets, preview, TypeGen | Core CMS for the demo. | Keep Studio embedded at `/studio` for now; standalone Studio/subdomain is deferred. | Record package/service attribution if required. |
| `@sanity/client` and Sanity image helpers | Accepted | Runtime dependency | Free package; Sanity usage limits apply | Open source package plus Sanity service terms | Fetching content and building Sanity CDN image URLs | First-party way to query Sanity and transform Sanity asset references into URLs. | Sanity image helpers do not replace Next.js `next/image`; render Sanity CDN URLs with `next/image` where practical and configure `next.config` image `remotePatterns` for the Sanity CDN domain. | Record if required by final attribution review. |
| Sanity TypeGen | Likely | Development tooling | Free | Open source / Sanity tooling terms | Generated query/document types | Reduces hand-written duplicate Sanity types. | Hand-written types are acceptable for small temporary sections but should not drift. | No user-facing attribution expected. |
| Sanity Visual Editing / Presentation Tool | Deferred | Runtime/Studio capability | Verify current Sanity plan requirements before implementation | Sanity package and service terms | Future visual editing workflow | Strong post-launch goal, but Draft Mode comes first. | Basic Draft Mode is phase one. | Record if added. |
| Vercel | Accepted | Hosting platform | Free tier planned; verify limits before launch | Vercel platform terms | Deploy Next.js app, previews, logs, env vars | Best fit for Next.js deployment and low-friction previews. | Netlify or self-hosting not planned. | No app attribution expected. |
| Vercel local plugin/skills | Tooling only | Agent/platform tooling | Free local tooling | Tooling terms vary | Deployment/env/log guidance for agents | Helps agents use platform context correctly. | Do not add to `package.json`. | No app attribution; mention only in agent docs. |
| Tailwind CSS | Accepted | Styling dependency | Free | Open source | Utility-first styling, responsive layout, tokens | Chosen styling system; supports the bright, airy responsive design direction. | CSS Modules would work but slow down iteration. | Record if required by final license review. |
| Tailwind animation utilities | Deferred | Styling helper | Free if using open-source package or custom CSS | Verify package license before install | Entry animations and subtle hover motion | The scaffold starts with Tailwind CSS and custom CSS only to avoid unnecessary dependencies. | Consider `tailwindcss-animate` only when a real animation gap appears. | Record if a package is added. |
| Framer Motion / Motion | Deferred | Runtime animation dependency | Free package; verify current package and license before install | Open source; verify current package terms | Scroll-triggered animation, staggered choreography, and more complex UI motion if needed | Preferred escalation path if Tailwind/CSS animation becomes awkward or if scroll-triggered patterns become common. | Do not add day one. Avoid building a broad custom Intersection Observer animation framework before considering this. | Required if installed. |
| `next/font/google` | Accepted | Framework font integration | Free | Google Fonts licenses vary by font; verify per family | Nunito Sans and Quicksand loading | First-party Next.js font optimization without external runtime font requests. | Self-hosted fonts can be used later if needed. | Record font attribution if required by the font licenses. |
| Nunito Sans | Accepted | Font asset | Free | Verify Google Fonts license before implementation | Body, navigation, buttons, forms, utility UI | Rounded, friendly, readable baseline font. | Other rounded sans fonts are possible if readability suffers. | Add to `ATTRIBUTIONS.md` if license review requires. |
| Quicksand | Accepted | Font asset | Free | Verify Google Fonts license before implementation | Headings and brand-forward display moments | Friendly rounded display feel without feeling childish. | Could be replaced after visual testing. | Add to `ATTRIBUTIONS.md` if license review requires. |
| `lucide-react` | Accepted | Runtime icon dependency | Free | Open source | Interface icons and most pet type icons | Clean outline style matches the modern rounded design direction. | React Icons only if Lucide lacks a needed icon. | Add attribution if required by license review. |
| React Icons | Deferred | Runtime icon dependency | Free | Open source; verify icon-set licenses | Brand or specialty icons not available in Lucide | Useful fallback but should not be installed until a real icon gap exists. | Prefer Lucide and custom project-owned SVGs for pet type gaps. | Required if installed; individual icon-set licenses may matter. |
| Custom SVG pet icons | Likely | Project asset | Free if authored in project | Project-owned unless adapted from another source | Pet type icons that Lucide does not cover | Keeps pet filters visually complete while matching Lucide style. | Avoid copying third-party SVGs without license review. | No third-party attribution if original. |
| Vitest | Accepted | Development/testing dependency | Free | MIT | Unit and lightweight integration tests | Lightweight test runner for utilities, seed validation, route handlers, and logic. Installed in Milestone 2 with a minimal utility test. | Jest is heavier; Playwright is for browser checks later. | Added to `ATTRIBUTIONS.md`. |
| Testing Library | Likely | Development/testing dependency | Free | Open source | Component behavior tests | Useful for interactive client components, forms, drawers, and stateful UI. | Add only when components need it. | Record if required by final license review. |
| Playwright | Deferred | Development/testing dependency | Free | Open source | Browser smoke tests, responsive checks, accessibility-oriented interaction checks | Valuable once route skeletons exist; not needed during initial planning/scaffolding. | Manual screenshots may be enough early. | Record if added. |
| ESLint | Accepted | Development tooling | Free | MIT | Linting TypeScript, React, Next.js, Sanity, and scripts | Baseline code-quality gate. Installed in Milestone 2 using Next's flat `core-web-vitals` config. | Use Next.js defaults where possible. | Added to `ATTRIBUTIONS.md`. |
| Prettier | Likely | Development tooling | Free | Open source | Formatting if needed beyond framework defaults | Useful if formatting rules become noisy or inconsistent. | Can defer until scaffold shows a need. | No user-facing attribution expected. |
| Mailgun | Accepted | External service | Use existing/free account; verify current sending limits | Mailgun service terms | Phase-one acknowledgement email delivery to the form submitter, with an optional CC to an internal oversight address | User has a free Mailgun account; supports real email sending without building a mail server. | SendGrid was rejected because its free/trial constraints were not ideal. | No public attribution expected. |
| SendGrid | Rejected | External service | Free/trial limits may not fit | SendGrid service terms | Email sending | Replaced by Mailgun due to existing user account and cost preference. | Reopen only if Mailgun becomes unsuitable. | None. |
| Gemini image generation | Likely | Seed-only external service | Target low cost; verify model pricing immediately before generation | Google AI terms | Generate seed pet, owner, page, and banner images | Good candidate for low-cost batch image generation. Human must run generation commands. | Replicate, fal, or another provider can replace it if pricing/quality is better. | Store AI attribution metadata in media manifest; update `ATTRIBUTIONS.md` if required. |
| Gemini video generation | Deferred | Seed-only external service | Unknown; verify before use | Google AI terms | Future generated pet/page videos | Video generation is not phase one; keep prompts in seed data for later. | Do not generate video assets until frontend/schema support exists. | Store attribution if videos are generated. |
| Replicate image models | Deferred | Seed-only external service | Paid per usage; verify before use | Replicate/model-specific terms | Possible image generation fallback | Useful if Gemini quality or pricing is not acceptable. | Model licenses vary; review each model. | Required if used. |
| fal image generation | Deferred | Seed-only external service | Paid per usage; verify before use | fal/model-specific terms | Possible image generation fallback | Fast image generation option. | Model licenses vary; review each model. | Required if used. |
| Hosted error monitoring service | Deferred | External service | Prefer free tier if needed | Vendor terms vary | Production error reporting beyond Vercel logs | Not needed initially; use Vercel logs and `APP_DEBUG` first. | Consider Sentry or similar only if Vercel logs are insufficient. | Required if added. |
| Authentication provider | Deferred | External service/dependency | Prefer free tier if post-launch feature proceeds | Vendor terms vary | Future user registration, login, password reset | Post-launch backlog item; not needed for CMS demo foundation. | Clerk, Auth0, Descope, or custom auth can be evaluated later. | Required if added. |

## Attribution Rules

- `ATTRIBUTIONS.md` remains the project-facing attribution log.
- Add an attribution entry when a dependency, copied code, icon set, font, design asset, AI-generated media policy, or generated asset requires one.
- Package-manager dependencies should still be checked for license compatibility even when no visible attribution is required.
- Do not copy source, SVGs, images, prompts, or design assets from third-party repos without preserving required license notices.

## Open Questions

- Confirm whether Testing Library is needed when interactive Client Components are introduced.
- Confirm current Gemini image model, pricing, and terms immediately before any human-run media generation.

## Milestone 2 Installed Package Notes

- Runtime: `next`, `react`, `react-dom`, `sanity`, `next-sanity`, `@sanity/client`, `@sanity/image-url`, `@sanity/vision`, `styled-components`, and `lucide-react`.
- Development: `typescript`, `eslint`, `eslint-config-next`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `vitest`, and React/Node type packages.
- `styled-components` is included because current `next-sanity` declares it as a peer dependency for the embedded Studio integration.
- `@eslint/eslintrc` was tried during scaffold setup, then removed when the current `eslint-config-next/core-web-vitals` flat config export proved sufficient.
