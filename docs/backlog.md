# Backlog

This backlog captures future work that should influence today's architecture without blocking the first implementation.

## Post-Launch User Accounts And Pet Submissions

Goal:

- Allow visitors to register with email and password, reset their password, manage a simple account, and submit their own pets to Pet Share.

Status:

- Post-launch candidate.
- Should influence the content model now, but should not block the initial CMS-driven demo site.

Recommended direction:

- Use a dedicated auth provider such as Supabase Auth for public user accounts.
- Keep Sanity as the CMS and content backend, not as the public authentication system.
- Store public owner and pet content in Sanity.
- Create or update Sanity documents through server-only Next.js routes/actions using a server-only Sanity write token.
- Keep user-submitted pets pending moderation by default.

Current model preparation:

- `pet` should include `submittedBy`, `submissionStatus`, and `source` from day one.
- `owner` should remain a real Sanity document so future account profiles can connect to owner pages.
- Public pet pages should render from the same `pet` schema regardless of whether content is editor-created, demo-seeded, or user-submitted.
- Public queries should only show approved/published pets.
- Phase one owner contact forms acknowledge the submitter via Mailgun (with an optional `MAILGUN_CC_EMAIL` oversight CC) and are not routed to individual owners; this will need rework if authenticated owners later receive their own messages or dashboard notifications.

Likely future phases:

1. Add auth provider and environment variables.
2. Add register, login, logout, and password reset flows.
3. Add owner profile creation or linking.
4. Add protected submit-pet form.
5. Add Sanity mutation route/action for creating pending pet documents.
6. Add image upload handling with validation.
7. Add moderation fields and Studio workflow.
8. Add optional user dashboard for submitted pets.

## Future Engagement Features

These features appeared in early wireframe exploration but are not part of the phase-one CMS demo scope.

### Saved Or Favorite Pets

Goal:

- Let authenticated users save pets for later comparison or follow-up.

Status:

- Backlog candidate.
- Requires user accounts or a deliberate anonymous-session design.

Notes:

- Do not add favorite buttons to phase-one pet cards or owner pages unless the feature is intentionally scoped.
- If added later, saved pets should use authenticated user data outside Sanity or a carefully modeled user/account layer, not anonymous CMS content.

### Direct Messaging

Goal:

- Let users message pet owners directly or maintain conversation history.

Status:

- Backlog candidate.
- Out of scope for phase one.

Notes:

- Phase one uses contact forms that acknowledge the submitter through Mailgun (with an optional oversight CC), not direct owner messaging.
- Direct owner messaging would require authentication, authorization, spam controls, notification rules, and a privacy model.
- Do not add chat or direct message UI to phase-one pet, owner, or listing pages.

### AI-Generated Fictional Owner Replies

Goal:

- Send playful, clearly disclosed AI-generated replies to form submissions, written in the voice of the relevant fictional pet owner or Pet Share support persona.
- Make replies satirical and context-aware based on the pet, owner, inquiry type, and any parody-friendly pop-culture framing attached to the pet.

Status:

- Backlog candidate.
- Builds on phase-one Mailgun form delivery, but should not block the initial CMS demo.

Notes:

- Phase one should still send real form acknowledgement emails to the submitter through Mailgun (with an optional oversight CC).
- A later phase could process incoming form context, selected pet, owner profile, and site voice rules to draft or send a silly reply.
- If a pet is inspired by a pop-culture archetype, the reply can echo that same parody direction without using official copyrighted dialogue, exact character likenesses, franchise marks, or implying endorsement.
- Replies should reference pet-specific details such as warnings, care notes, mess risk, chaos level, cuddle policy, and owner bio when useful.
- Replies must clearly disclose that they are automated/AI-generated and fictional.
- Do not impersonate real people, real owners, or actual customer support staff.
- Keep the feature opt-in or clearly expected by the demo experience.
- Add guardrails so replies do not provide legal, medical, financial, emergency, or real animal-care advice.
- Consider a review-before-send mode before enabling automatic sending.

Constraints:

- Keep costs low.
- Keep validation lightweight but real enough to protect data shape and server-only credentials.
- Do not expose Sanity write tokens to the browser.
- Do not require this flow for the initial CMS demo launch.

## Production Seed Media Strategy (Resolved)

Decision:

- `sanity/seed/` (data JSON, media manifest, and approved local media) is gitignored in full and never committed. Once content has been written to Sanity, Sanity is the source of truth for that content; the local seed files are disposable, per-machine scratch space used to generate and replay seed content, not a durable artifact of the repo.
- This removes the media-payload-in-production concern entirely, since none of `sanity/seed/` is ever committed or deployed.
- Trade-off accepted: a fresh clone of this repo does not include a bootstrapped demo dataset and cannot reseed from scratch without first regenerating (or otherwise separately obtaining) the local seed files. Reseeding from a clean checkout is intentionally not preserved.
- Updated: `README.md`, `CLAUDE.md`/`CODEX.md`/`GEMINI.md`, `docs/data-seeding-plan.md`, `docs/content-governance.md`, `docs/seed-json-contract.md`, and `sanity/seed/README.md` reflect this decision.

Options considered but not chosen:

- Keep `sanity/seed/media/` committed, but exclude it from deployment output if Vercel/build tooling supports a clean project-level ignore path.
- Move approved seed media into a separate repository, release artifact, or storage bucket and document how to fetch it before reseeding.
- Keep lightweight manifests in Git and store binaries externally, with a script that verifies media availability before seed uploads.
- Keep only a smaller representative media set in Git and document a full-media seed package as optional.
- Use Git LFS.

## Deferred Launch Scope

These items were explicitly deferred out of the first public build. Keep them out of launch-readiness work unless priorities change.

### Owner Dashboards

Goal:

- Give pet owners a protected dashboard to manage listings, messages, and account/profile details.

Status:

- Backlog candidate.
- Depends on public user accounts and an authorization model.

Notes:

- Phase one owner pages are CMS-authored profiles, not self-serve accounts.
- Do not add owner dashboard routes or dashboard navigation until authentication and direct owner workflows are intentionally scoped.

### Pet Type Landing Pages

Goal:

- Add browseable landing pages for each pet type, such as `/pets/types/dogs` or a similar route pattern.

Status:

- Backlog candidate.
- Useful for SEO and browsing once launch traffic or content strategy justifies it.

Notes:

- Phase one uses pet type filters on `/pets` instead of standalone pet type pages.
- If added later, confirm route shape, sitemap behavior, canonical/filter interactions, and authored SEO needs before implementation.

### Standalone Testimonials Page

Goal:

- Create a dedicated page for testimonial content beyond homepage/section embeds.

Status:

- Backlog candidate.

Notes:

- Phase one testimonials are reusable CMS content surfaced through homepage and page-builder sections.
- A standalone page should wait until there is enough curated testimonial content to justify the route and navigation placement.

### Generated Video Binaries

Goal:

- Support generated or hosted video assets as actual media files rather than only authored video URLs or lightweight card-loop references.

Status:

- Backlog candidate.

Notes:

- Phase one avoids committing or generating video binaries.
- Future work should define storage, moderation/review, transcodes, posters, captions, file-size limits, and cost controls before adding video generation or uploads.

### Framer Motion Or Heavier Animation Library

Goal:

- Add a dedicated animation dependency if CSS/Tailwind-level motion is no longer enough.

Status:

- Deferred dependency decision.

Notes:

- Current launch build uses lightweight CSS/reveal behavior instead of Framer Motion.
- Reconsider only if staggered choreography, complex scroll-triggered animation, or gesture-heavy UI outgrows the existing approach.
- Update `docs/dependency-decision-log.md` and `ATTRIBUTIONS.md` if a new animation library is added.

### Heavier End-To-End Test Coverage

Goal:

- Add broader Playwright-style E2E coverage beyond critical launch smoke checks.

Status:

- Backlog candidate.

Notes:

- Phase one relies on lint, typecheck, unit/integration tests, build checks, sitemap/metadata crawls, and manual browser QA.
- Future E2E coverage should prioritize critical flows first: pet browsing/filter URLs, form submissions with mocked email, draft preview, and deployment smoke checks.

### Sanity Data Layer `defineLive` Migration

Goal:

- Revisit the Sanity data layer and evaluate migrating to the idiomatic `next-sanity` `defineLive` auto-resolve pattern, potentially with `strict: true`.

Status:

- Backlog candidate.
- Broad architectural refactor; do not mix into deployment readiness.

Context:

- The current implementation uses manual `draftMode()` branching and separate published/preview fetch helpers.
- A `defineLive` migration could reduce published-vs-draft blind spots and improve compile-time draft-safety.
- The current manual pattern is functionally correct, and this project still needs explicit `draftMode()` checks for non-perspective behavior such as unapproved pet/owner preview filters and published-perspective metadata reads.

Acceptance notes:

- Treat this as a dedicated change with a full Studio-to-Presentation verification pass.
- Audit all loaders and public/preview routes before implementation.
- Confirm Visual Editing, preview routes, metadata reads, and unpublished document-ID previews still behave correctly.

## On-Demand Sanity Webhook Revalidation

Goal:

- Add a server-only route that validates Sanity webhook requests and revalidates affected pages/tags immediately after publish events.

Status:

- Backlog candidate.
- Not required for the current launch build unless immediate publish-to-production updates become a launch requirement.

Current state:

- The app has no custom `/api/revalidate` route.
- Deployment verification should test the current Sanity fetching/cache behavior rather than assume webhook revalidation exists.

Recommended direction:

- Add a server-only webhook route under `app/api/revalidate/route.ts` or a similarly explicit path.
- Require a server-only shared secret, such as `SANITY_REVALIDATE_SECRET`, only when the route is implemented.
- Validate the webhook before any side effects.
- Map Sanity document types to targeted paths or cache tags.
- Log safe diagnostic context on failures without exposing secrets or payload bodies.
- Add tests for secret validation and document-type-to-path/tag mapping.

## Prototyping Workflow Outline

Goal:

- Document a repeatable prototyping workflow that moves cleanly from design exploration into implementation planning and CMS build work.

Status:

- Backlog candidate.
- Useful for future page and feature planning so mockups, flat HTML, data planning, and CMS implementation stay aligned.

Proposed workflow to outline:

1. Design
2. Flat HTML
3. Planning of data
4. Consolidation
5. Connected mockup
6. CMS build

Questions to resolve:

- What artifacts are expected at each step?
- When should mockups stop changing before data planning begins?
- What counts as `consolidation` between prototype and connected mockup?
- Which docs should be updated at each stage?
- When should a prototype move from flat HTML into real CMS-backed implementation planning?

Acceptance notes:

- The workflow should be simple enough to reuse across homepage, pet index, pet detail, and future page-builder sections.
- Each step should name its inputs, outputs, and handoff docs.
- The outline should reduce drift between design mockups, flat prototypes, planning docs, and implementation.

## Targeted Seed Document Updates

Goal:

- Add safer direct seed commands for updating a narrow set of Sanity documents without running a full reseed or writing one-off mutation scripts.

Status:

- Backlog candidate.
- Useful before repeated content-polish passes, especially for testimonials and other referenced homepage content.

Problem:

- The existing targeted page write path supports commands such as `--only homePage`.
- Referenced documents, such as testimonials used by the homepage, are not updated by a homepage-only write.
- One-off Sanity mutations are easy to make too broad unless the script supports stable seed-key targeting.

Recommended direction:

- Add direct command support for document type and seed-key targeting.
- Keep destructive behavior explicit and separate from targeted patches.
- Preserve existing media unless a media update is intentionally requested.
- Print the selected document count before writing.
- Require `--confirm` for Sanity writes.

Candidate commands:

- `pnpm seed:sanity -- --confirm --only testimonial`
- `pnpm seed:sanity -- --confirm --seed-key testimonial-sir-nibbles-neighbor`
- `pnpm seed:sanity -- --confirm --seed-key testimonial-sir-nibbles-neighbor --seed-key testimonial-muffin-weekend`
- `pnpm seed:sanity -- --preview --only testimonial`

Acceptance notes:

- Type-targeted writes should update only documents represented by saved seed data or generated deterministic seed output.
- Seed-key writes should fail loudly when no matching seed document exists.
- Targeted writes should hydrate references before patching when referenced fields are included.
- The command output should list each updated seed key and Sanity document ID.
