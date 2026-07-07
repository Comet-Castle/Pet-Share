# Environment And Deployment

This document defines the environment variable, secret, and deployment expectations for Pet Share.

The planned deployment target is Vercel on the free tier, with Sanity CMS as the content backend. The current project decision is a single Next.js application with Sanity Studio available under `/studio`, not a separate Studio subdomain.

## Goals

- Keep public configuration separate from server-only secrets.
- Make local, Vercel Preview, and Vercel Production setup predictable.
- Prevent Sanity tokens, webhook secrets, Mailgun credentials, and Gemini keys from reaching the browser.
- Document which variables belong in `.env.example`, `.env.local`, and Vercel environment settings.
- Keep seed media generation human-run only.

## Environment Files

Use these conventions:

- `.env.example`: committed template with variable names and empty values.
- `.env.local`: local secrets and local overrides; never committed.
- Vercel Environment Variables: source of truth for Preview and Production deploys.

Do not commit `.env`, `.env.local`, production env files, API keys, or private tokens.

Vercel CLI can pull configured project variables into local development:

```bash
vercel env pull .env.local --yes
```

Be careful: `vercel env pull` replaces the target file. Keep local-only custom values somewhere safe if they are not managed in Vercel.

## Variable Matrix

| Variable | Scope | Browser exposed | Local | Vercel Preview | Vercel Production | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public app config | Yes | Optional | Required before launch | Required before launch | Canonical site origin for metadata, preview URLs, and absolute links. Leave blank until a Vercel URL or final production domain is chosen. |
| `APP_DEBUG` | Server-only diagnostics flag | No | Optional | Optional | Optional, default false | Enables more detailed server-side logging for debugging. Must not expose secrets, tokens, raw request bodies, or private user data. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Public Sanity config | Yes | Required | Required | Required | Safe to expose; not a secret. |
| `NEXT_PUBLIC_SANITY_DATASET` | Public Sanity config | Yes | Required | Required | Required | Defaults to `production` unless a separate dataset is introduced. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Public Sanity config | Yes | Required | Required | Required | Pin to a date string when implementation begins. |
| `SANITY_API_READ_TOKEN` | Server-only Sanity token | No | Required for preview/drafts | Required for preview/drafts | Required for preview/drafts | Use least privilege. Do not expose to Client Components. |
| `SANITY_API_WRITE_TOKEN` | Server-only Sanity token | No | Required for seed/upload scripts | Usually not needed | Usually not needed | Needed for local seed scripts and media upload. Avoid adding to Vercel unless a server route genuinely writes to Sanity. |
| `SANITY_API_BROWSER_READ_TOKEN` | Browser-readable Sanity viewer token | Yes, when Draft Mode includes live draft events | Optional | Optional | Optional | Enables draft-capable Sanity Live updates in Presentation. Use a least-privilege read token only; leave blank if click-to-edit can rely on route refreshes. |
| `SANITY_PREVIEW_SECRET` | Server-only preview secret | No | Optional | Optional | Optional | Reserved for a future manual preview fallback. Current Sanity Presentation preview uses Sanity's generated preview URL secret validated with `SANITY_API_READ_TOKEN`. |
| `SANITY_REVALIDATE_SECRET` | Server-only webhook secret | No | Optional | Required | Required | Used to validate Sanity webhook requests before cache revalidation. |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | Studio preview config | No | Required for Presentation | Required | Required | Origin loaded inside Sanity Presentation, such as local Next.js or a Vercel deployment URL. |
| `SANITY_STUDIO_MEDIA_LIBRARY_ID` | Studio media config | No | Optional | Optional | Optional | Specific Sanity Media Library ID. Leave blank to let Sanity auto-detect the connected library. |
| `MAILGUN_API_KEY` | Server-only Mailgun secret | No | Required for form testing | Required | Required | Sends the branded acknowledgement email to form submitters. |
| `MAILGUN_DOMAIN` | Server-only Mailgun config | No | Required for form testing | Required | Required | Mailgun sending domain. |
| `MAILGUN_FROM_EMAIL` | Server-only Mailgun config | No | Required for form testing | Required | Required | From address used by form submissions. |
| `MAILGUN_CC_EMAIL` | Server-only Mailgun config | No | Optional | Optional | Optional | Internal oversight address CC'd on outgoing form emails. Leave blank to disable. |
| `GEMINI_API_KEY` | Server-only local generation secret | No | Optional, human-run only | Do not set by default | Do not set by default | Used only by intentional local seed media generation commands run by a human. |

## Public Versus Server-Only

Public variables:

- Must start with `NEXT_PUBLIC_`.
- Are included in the browser bundle.
- Must never contain secrets.
- Should be limited to project IDs, dataset names, API versions, site URLs, and other safe public configuration.

Server-only variables:

- Must not start with `NEXT_PUBLIC_`.
- Can be used in Server Components, route handlers, server actions, and local scripts.
- Must not be passed to Client Components or rendered into HTML.

## Error Handling And Logging

Use a practical logging approach before adding a third-party observability service.

Default behavior:

- Render user-safe error messages in pages, forms, and drawers.
- Log server-side errors with enough context to debug the failing boundary.
- Avoid logging secrets, API tokens, raw email payloads, full request bodies, or private user data.
- Prefer structured log objects with fields such as `event`, `route`, `operation`, `status`, `documentType`, `seedId`, and `requestId` when available.
- Let Vercel capture server logs through normal deployment logs.

`APP_DEBUG=true` behavior:

- Increase server-side diagnostic detail for local development or temporary troubleshooting.
- Include non-sensitive context such as route params, query params, Sanity document type, seed file name, validation issue counts, and provider operation names.
- Never expose stack traces or internal details to end users in production UI.
- Never log Sanity tokens, Mailgun keys, Gemini keys, preview secrets, webhook secrets, or full submitted message bodies.
- Keep debug mode server-only; do not create a `NEXT_PUBLIC_` debug flag unless a separate safe client-debug feature is intentionally designed.

Suggested error boundaries:

- Route-level `error.tsx` and `not-found.tsx` files where appropriate.
- Form-level error states with Pet Share voice.
- API route handlers that return stable error codes and user-safe messages.
- Seed scripts that fail with actionable validation output.

Future option:

- If Vercel logs are not enough, evaluate a hosted error monitoring tool later and record the decision in the dependency decision log before adding it.

## Sanity Configuration

Current project context:

- Project: `test`
- Project ID: `u0596eb6`
- Dataset: `production`
- Framework: Next.js
- Studio route: `/studio`

Sanity setup rules:

- Use `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `NEXT_PUBLIC_SANITY_API_VERSION` for public client configuration.
- Use `SANITY_API_READ_TOKEN` only for draft/preview reads, authenticated preview helpers, or other server-only reads that require a token.
- Use `SANITY_API_BROWSER_READ_TOKEN` only when Draft Mode should receive draft live-update events in the browser. It must be a least-privilege viewer token and should not have write access.
- Use `SANITY_API_WRITE_TOKEN` only for local seed scripts, media uploads, or server-only write operations.
- Keep Sanity tokens out of Client Components.
- Configure Sanity CORS for local and deployed app origins.
- Preview links should originate from Studio and use Sanity's preview URL validation flow through `/api/draft-mode/enable`.
- Sanity webhooks should include `SANITY_REVALIDATE_SECRET` and should be validated before revalidating paths or tags.

Suggested CORS origins once URLs are known:

- `http://localhost:3000`
- Vercel Preview URL pattern or exact preview URLs as needed.
- Production domain.

## Vercel Environments

Use Vercel's environment scopes deliberately:

- Development: local `vercel dev` and `vercel env pull`.
- Preview: branch and pull request deployments.
- Production: production domain deployment.

Recommended scoping:

- Public Sanity config: all environments.
- Preview and revalidation secrets: Preview and Production, plus Development if preview is tested locally.
- Mailgun credentials: Preview and Production, plus Development if local form sending is tested. Preview deployments may send real emails to the configured master inbox.
- `SANITY_API_WRITE_TOKEN`: Development by default. Add to Preview or Production only if a deployed server route must write to Sanity.
- `GEMINI_API_KEY`: local `.env.local` only unless there is a later, explicit reason to run generation outside a human local workflow.

## Local Setup Flow

After the app is scaffolded:

1. Copy `.env.example` to `.env.local`.
2. Fill in public Sanity values.
3. Add server-only secrets needed for the feature being tested.
4. Pull from Vercel only after the project is linked and environment variables have been configured:

```bash
vercel link
vercel env pull .env.local --yes
```

5. Re-add any local-only values that are not stored in Vercel, such as `GEMINI_API_KEY`.

Standalone Node scripts do not automatically load `.env.local` unless the implementation adds dotenv loading. Seed and media scripts should load the required env file explicitly or document the wrapper command they require.

## Deployment Setup Checklist

Before the first Vercel deployment:

- Vercel project is linked to the repository.
- Required environment variables are set in Vercel Preview and Production.
- `NEXT_PUBLIC_SITE_URL` is set for each deployment environment before launch or preview-link testing.
- Sanity CORS includes local and deployed app origins.
- Sanity preview links point to the correct app origin.
- Sanity webhook target points to the deployed revalidation route.
- Mailgun sending domain and from address are verified.
- No server-only secrets are prefixed with `NEXT_PUBLIC_`.
- `.env.example` matches the variables expected by the app and scripts.

## Seed Media Generation

Seed media generation is intentionally separate from normal app runtime.

Rules:

- AI agents must not run paid, metered, or quota-limited media generation commands.
- A human should start with `pnpm seed:wizard` for seed preview, approval, media package preparation, and Sanity population.
- Provider-backed media commands such as `pnpm seed:media -- --mode preview` and `pnpm seed:media -- --mode batch` must be run by a human when they are implemented.
- `GEMINI_API_KEY` is for local human-run generation only by default.
- Generated review files go to `sanity/seed/generated/`, which is ignored by Git.
- Approved files are copied into `sanity/seed/media/` before Sanity upload. `sanity/seed/` in full is gitignored, so approved media stays local rather than committed.
- Normal Sanity seed replay should use saved seed data and approved media; it should not call Gemini or any other AI media provider.

## Open Questions

- None currently. `NEXT_PUBLIC_SITE_URL` can remain blank until a Vercel URL or final custom domain is chosen.
