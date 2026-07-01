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
- Phase one owner contact forms should send to the master project inbox, but this will need rework if authenticated owners later receive their own messages or dashboard notifications.

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

- Phase one uses contact forms that send to the master project inbox through Mailgun.
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

- Phase one should still send real form emails to the master project inbox through Mailgun.
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

## Production Seed Media Strategy

Goal:

- Keep approved seed media available in the repo for deterministic reseeding, while avoiding unnecessary media payload in production deployments.

Status:

- Backlog candidate.
- Should be resolved before deployment readiness if the committed media set grows materially beyond the current demo set.

Problem:

- Approved images under `sanity/seed/media/` are useful source assets for reseeding Sanity.
- Production Vercel deployments do not need to serve those source files directly once they have been uploaded to Sanity assets.
- Carrying large seed media directories into production builds can increase checkout size, upload time, cache pressure, and deployment noise.

Options to evaluate:

- Keep `sanity/seed/media/` committed, but exclude it from deployment output if Vercel/build tooling supports a clean project-level ignore path.
- Move approved seed media into a separate repository, release artifact, or storage bucket and document how to fetch it before reseeding.
- Keep lightweight manifests in Git and store binaries externally, with a script that verifies media availability before seed uploads.
- Keep only a smaller representative media set in Git and document a full-media seed package as optional.
- Use Git LFS only if the project accepts the hosting, bandwidth, cloning, and contributor workflow tradeoffs.

Acceptance notes:

- Normal website builds should not depend on local seed media after Sanity has been populated.
- Reseeding should remain possible from a clean checkout plus documented media retrieval steps.
- The chosen approach must not commit secrets, raw provider responses, or unreviewed generated files.
- Update `README.md`, `docs/data-seeding-plan.md`, and deployment docs when the strategy is chosen.

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
