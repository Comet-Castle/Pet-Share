# Frontend QA Notes

This document captures practical frontend verification lessons for Pet Share. Use it during visual polish, Sanity-backed page updates, and rendered UI debugging.

## Browser Verification

- First try the in-app browser only when it is actually callable in the current session. If it reports `No browser is available`, record that once for the task and use the Playwright fallback instead of retrying the same unavailable browser path.
- Use Playwright for local rendered verification when the in-app browser tooling is unavailable or unreliable.
- In this Windows workspace, the bundled Playwright browser may be missing and launching the installed local Chrome executable can require elevated execution.
- The known reliable fallback is Playwright with local Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`, saving screenshots to a temp directory outside the repo.
- Prefer section-level screenshots for long pages so visual regressions are easier to inspect.
- For CMS-backed copy changes, pair screenshots with text assertions. A screenshot can look current while stale cached content remains in part of the page.
- Check at least one desktop viewport and one mobile viewport for homepage, marketing page, pet index, pet detail, and gallery work.
- Capture console warnings and errors during visual QA. Treat framework overlays, hydration errors, image warnings, and runtime warnings as blockers unless clearly unrelated.

## Verification Ladder

Use the smallest useful check for the change. Do not turn every visual adjustment into a full milestone QA pass.

1. **Text-only or tiny class tweak**
   - Inspect the diff.
   - Run `.\node_modules\.bin\tsc.cmd --noEmit` only if TypeScript could be affected.
   - Run `.\node_modules\.bin\eslint.cmd . --max-warnings=0` only if imports, JSX structure, or lint-sensitive code changed.
   - Browser screenshots are optional unless the user asks or the change could visibly break layout.

2. **Single component or single section visual change**
   - Run typecheck and lint through local binaries.
   - Capture one section-level desktop screenshot.
   - Add one mobile screenshot when responsive wrapping, card grids, navigation, galleries, filters, forms, or CTA layout changed.
   - Record console warnings/errors from the screenshot pass.

3. **Interactive UI change**
   - Run typecheck and lint.
   - Exercise the interaction in Playwright or available browser tooling.
   - Verify the resulting state with text/DOM assertions and screenshots when useful.
   - Check keyboard/focus behavior when the interaction is a control, menu, form, drawer, carousel, or filter.

4. **CMS-backed data, schema, seed, or query change**
   - Validate local JSON when seed files changed.
   - Run Sanity TypeGen when schema/query fields changed.
   - Verify Sanity document content directly if the rendered page appears stale.
   - Explain whether the rendered app may need a dev-server restart, cache refresh, or revalidation.

5. **Milestone or broad page redesign**
   - Use desktop and mobile screenshots.
   - Check page identity, blank-page state, framework overlay absence, console health, responsive behavior, and at least one relevant interaction.
   - Summarize remaining visual differences against the accepted design reference.

## Local Command Notes

- `pnpm` can fail in this workspace because the package manager signature verification tries to fetch or verify `pnpm@10.0.0`. When that happens, use local binaries instead of spending time on the package-manager wrapper:
  - Typecheck: `.\node_modules\.bin\tsc.cmd --noEmit`
  - Lint: `.\node_modules\.bin\eslint.cmd . --max-warnings=0`
  - Sanity schema extract: `.\node_modules\.bin\sanity.cmd schema extract --enforce-required-fields`
  - Sanity type generation: `.\node_modules\.bin\sanity.cmd typegen generate`
- The Windows ESLint shim can choke on route paths with parentheses, such as `app\(site)\page.tsx`. Prefer linting the whole repo with `.\node_modules\.bin\eslint.cmd . --max-warnings=0` instead of passing a parenthesized route path.
- Do not save screenshots, traces, reports, or throwaway QA scripts inside the repo unless they are approved design references.

## Sanity-Backed Visual QA

When a page is backed by Sanity, verify three layers if content looks stale:

1. The local seed JSON has the intended content.
2. Sanity documents contain the intended content.
3. The rendered Next.js page is reading fresh enough data for the current task.

Sanity CDN caching and Next.js fetch caching are separate. Updating Sanity does not guarantee that the local page immediately shows the new content if the page fetch path is cached.

For fast-changing singleton pages during local visual work, using the non-CDN Sanity client can make iteration clearer. Keep this choice intentional and documented in the relevant loader.

## Homepage Composition

The homepage is partly code-composed from Sanity data rather than rendered only through the generic `PageSections` registry.

- Layout and section structure live primarily in `app/(site)/page.tsx`.
- Seed defaults still live in `sanity/seed/data/pages.json`.
- Related testimonial defaults live in both `sanity/seed/data/testimonials.json` and generated testimonial logic in `scripts/seed-sanity.mjs`.
- If homepage tone changes, check curated and generated testimonial sources before assuming one seed file controls all visible copy.
- Recent homepage marketplace polish has been code-first in `app/(site)/page.tsx`. Small copy/layout refinements there do not need Sanity pushes unless the visible content is CMS-authored or seed defaults must change for future reseeds.
- The homepage pet cards intentionally show a simplified marketplace footer: distance on the left and host payout on the right. Do not reintroduce labels such as `Distance`, `Host earns`, pricing-plan text, dividers, or explicit card buttons unless the design direction changes.
- The `How Pet Share works` homepage section is currently host-focused only. The owner/list-your-pet path is represented as a CTA to `/process`, not as a second parallel process panel on the homepage.

## QA Evidence

For meaningful visual work, report:

- URL checked.
- Viewports checked.
- Whether Playwright or browser tooling was used.
- Console warning/error status.
- Interaction exercised, such as carousel next/dot controls.
- Screenshots saved outside the repo.
- Any stale-cache behavior or Sanity content pushes required.

Do not commit screenshots unless they are approved design references or intentionally documented visual artifacts.
