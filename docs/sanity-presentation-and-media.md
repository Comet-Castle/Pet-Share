# Sanity Presentation And Media Library

This document captures the Milestone 9 editorial workflow for Sanity Presentation, Draft Mode, and Media Library usage.

## Environment

Required for Draft Mode preview:

- `SANITY_API_READ_TOKEN`: server-only token used for draft-aware reads.
- `SANITY_STUDIO_PREVIEW_ORIGIN`: public origin loaded inside Sanity Presentation, such as `http://localhost:3000` locally or the Vercel deployment URL in hosted environments.

Optional:

- `SANITY_API_BROWSER_READ_TOKEN`: least-privilege browser-readable viewer token for draft-capable Sanity Live updates in Presentation.
- `SANITY_STUDIO_MEDIA_LIBRARY_ID`: use only when the Studio should target a specific Media Library instead of Sanity auto-detection.

## Studio Tools

The Studio includes:

- `structureTool` for the curated content desk.
- `presentationTool` for visual editing and Studio-origin preview navigation.
- `visionTool` for GROQ inspection.
- Built-in Sanity Media Library asset source support through the Studio workspace `mediaLibrary` config.

## Preview Routes

Studio Presentation resolves documents to these frontend locations:

- Home page: `/`
- Pet index page: `/pets`
- Standard Page with slug: `/{slug}`
- Standard Page without slug: `/preview/page/[documentId]`
- Pet with slug: `/pets/[slug]`
- Pet without slug: `/preview/pet/[documentId]`
- Owner with slug: `/owners/[slug]`
- Owner without slug: `/preview/owner/[documentId]`
- System page: `/preview/system/[pageType]`

Draft Mode is enabled through `/api/draft-mode/enable`, which uses Sanity's preview URL validation helper. Draft Mode is disabled through `/api/draft-mode/disable`.

## Frontend Behavior

When Draft Mode is active:

- Public route loaders call the preview-aware Sanity fetch helper.
- Sanity Live is mounted in the root layout so Sanity content-change events can refresh affected frontend data.
- Preview fetches enable Sanity stega/source-map encoding so rendered strings and Portable Text can be mapped back to Studio fields for click-to-edit overlays.
- The preview banner appears on public site routes.
- `next-sanity` Visual Editing overlays are mounted from the root layout.
- Pet listing queries may include draft, pending, or otherwise unapproved pets, but rejected and archived pets remain hidden from preview index results.

Published metadata remains based on published reads so draft or stega content does not leak into SEO output.

Draft live updates require `SANITY_API_BROWSER_READ_TOKEN`. Without that token, draft reads still work through server-side preview fetching, but browser live events are limited to non-draft content and editors may need to refresh the preview to see some draft changes.

## Editing Model

Sanity Presentation is not a true inline text editor inside the frontend iframe. Editors should expect this workflow:

1. Open Presentation from Studio.
2. Enable edit mode.
3. Click highlighted frontend content to select the matching document field or page-builder item.
4. Edit the text, Portable Text, image, or settings in the Studio document form pane.
5. Watch the preview update from draft content.

If clicking a frontend element opens the correct document but not the exact field, check whether the rendered value is a transformed or fallback value rather than the raw Sanity field. If the Studio field itself is disabled, check schema `readOnly` rules, document permissions, and whether the selected value is an internal seed/config field.

## Media Library

Sanity Media Library is enabled as a Studio asset source. If a project-level library is connected, image and file fields can use that library from the asset picker. If no library is provisioned for the Sanity organization, Studio will show Sanity's built-in Media Library provisioning/connection message.

Seed media files remain controlled by the repo workflow:

- Unreviewed generated media stays under `sanity/seed/generated/`.
- Approved seed media stays under `sanity/seed/media/`.
- Sanity Media Library manages editor-selected CMS assets inside the Sanity project.

## Current Limitations

- Live overlay annotations depend on Sanity's Visual Editing mappings and may need more refinement per component as page-builder sections mature.
- The document-ID pet and owner preview routes use a focused preview layout for unpublished drafts. Slugged previews redirect back to the full public route.
- Media Library availability depends on the Sanity organization/project configuration, not only repo code.
