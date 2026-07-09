# Attributions

Track third-party libraries, copied or adapted code, design assets, icons, fonts, and tooling that require attribution.

## Format

Use this format when adding entries:

```text
Name:
Source:
License:
Used for:
Notes:
```

## Entries

Name: Next.js
Source: https://github.com/vercel/next.js
License: MIT
Used for: App Router frontend, routing, rendering, metadata, image/font optimization, and build tooling.
Notes: Installed as a runtime framework dependency.

Name: React and React DOM
Source: https://github.com/facebook/react
License: MIT
Used for: UI component model and DOM rendering through Next.js.
Notes: Installed as runtime dependencies.

Name: Sanity packages
Source: https://github.com/sanity-io/sanity, https://github.com/sanity-io/ui, https://github.com/sanity-io/client, https://github.com/sanity-io/image-url, https://github.com/sanity-io/next-sanity
License: MIT package licenses; Sanity service usage is governed by Sanity terms.
Used for: Embedded Studio, Studio UI components, content API client, image URL helpers, Vision tool, and Next.js Studio integration.
Notes: `styled-components` is also installed because `next-sanity` requires it as a peer dependency.

Name: styled-components
Source: https://github.com/styled-components/styled-components
License: MIT
Used for: Peer dependency required by the embedded Sanity Studio integration.
Notes: Not intended as the app styling system; Tailwind CSS remains the public frontend styling baseline.

Name: Tailwind CSS and PostCSS integration
Source: https://github.com/tailwindlabs/tailwindcss, https://github.com/postcss/postcss
License: MIT
Used for: Utility-first styling, design tokens, global styles, and CSS processing.
Notes: No Tailwind animation add-on is installed in the scaffold.

Name: lucide-react
Source: https://github.com/lucide-icons/lucide
License: ISC
Used for: Interface icons in the scaffolded homepage, layout shell, and future UI components.
Notes: Custom project-owned SVGs remain preferred for pet type icons that Lucide does not cover.

Name: TypeScript
Source: https://github.com/microsoft/TypeScript
License: Apache-2.0
Used for: Type checking app, Sanity, utility, and test code.
Notes: Installed as development tooling.

Name: ESLint and eslint-config-next
Source: https://github.com/eslint/eslint, https://github.com/vercel/next.js
License: MIT
Used for: Linting TypeScript, React, and Next.js conventions.
Notes: Uses the current flat `eslint-config-next/core-web-vitals` export.

Name: Vitest
Source: https://github.com/vitest-dev/vitest
License: MIT
Used for: Unit and lightweight integration tests.
Notes: Installed with a minimal utility test during scaffolding.

Name: Playwright
Source: https://github.com/microsoft/playwright
License: Apache-2.0
Used for: Targeted browser smoke, responsive, and interaction checks.
Notes: Installed as development tooling; broad E2E coverage remains deferred unless future work needs it.

Name: Nunito Sans
Source: https://fonts.google.com/specimen/Nunito+Sans
License: SIL Open Font License 1.1
Used for: Primary body and UI font through `next/font/google`.
Notes: Loaded through Next.js font optimization.

Name: Quicksand
Source: https://fonts.google.com/specimen/Quicksand
License: SIL Open Font License 1.1
Used for: Display and brand-forward typography through `next/font/google`.
Notes: Loaded through Next.js font optimization.
