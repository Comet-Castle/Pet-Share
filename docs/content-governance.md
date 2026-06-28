# Content Governance

This document defines how Pet Share content should be created, reviewed, seeded, edited, and published. It keeps the demo useful without letting seeded content, CMS edits, parody references, or generated media drift into unmanaged behavior.

Use this alongside `docs/content-model.md`, `docs/data-seeding-plan.md`, `docs/seed-json-contract.md`, and `docs/design-and-copy-guide.md`.

## Governance Goals

- Keep public content fictional, satirical, animal-safe, and clearly demo-oriented.
- Preserve Sanity as the editorial source of truth after content is seeded.
- Keep seed data deterministic and replayable without regenerating content every run.
- Keep generated media reviewed before it is committed or uploaded.
- Avoid copyright, trademark, endorsement, privacy, and animal-harm problems.
- Make editor responsibilities clear without overbuilding workflow for phase one.

## Content Sources

Content can come from:

- Seed JSON committed under the planned `sanity/seed/data/` directory.
- Approved media committed under the planned `sanity/seed/media/` directory.
- Sanity Studio editorial edits.
- Future user-submitted content, only after the post-launch account/submission flow is implemented.

Phase one public content should be either demo-seeded or editor-created in Sanity.

## Editorial Ownership

The project owner is the final approver for:

- Public page copy.
- Pet, owner, and testimonial seed content.
- AI-generated or manually created seed media.
- Pop-culture-inspired parody references.
- Form success and error copy.
- System/error page copy.
- Final launch readiness.

AI agents may draft content and seed data, but generated content should be treated as proposed material until reviewed.

## Seed Content Rules

- Normal `pnpm seed` should replay saved seed data and approved media only.
- Normal seed runs must not call AI text, image, or video providers.
- Full seed generation should be a deliberate workflow, not part of app startup or routine seeding.
- The representative Milestone 1 seed set is not the final 50-pet seed set.
- The final seed pass should be generated once, reviewed, saved, and replayed from committed seed artifacts.
- Do not delete editor-created Sanity content during normal seed runs.
- Destructive seed reset commands, if implemented, must be explicitly named and limited to known seed documents.

## Generated Media Rules

- A human must run AI media generation commands.
- AI agents must not run paid or provider-calling media generation commands.
- Generated review files belong under `sanity/seed/generated/`, which is ignored by Git.
- Approved media belongs under `sanity/seed/media/` and may be committed.
- Approved media should keep the same logical folder structure as generated review files.
- Media manifest entries must identify provenance, prompt summary, provider, model, review status, and intended usage.
- Do not commit rejected, draft, or unreviewed generated media.
- Do not upload unreviewed media to Sanity.

## Sanity Publishing Rules

- Public pet queries should show only approved and published pets outside preview mode.
- Pending, rejected, archived, draft, and unpublished pets should not appear publicly outside authorized preview.
- Owner pages may exist, but there should be no owner directory in phase one.
- Pet type documents power filtering and labels only; no pet type landing pages in phase one.
- Preview should originate from Sanity Studio links only.
- Preview must show a visible banner and exit action.
- Unpublished draft pages should be previewable by document ID where planned.

## Page Builder Rules

- Marketing pages should be flexible enough to demonstrate CMS capability.
- Pet detail, pet index, and owner pages should stay more structured than marketing pages.
- Page-builder sections should use reusable section objects and typed renderers.
- Do not expose frontend implementation details to editors unless the editor genuinely controls that behavior.
- Avoid allowing content structures that break heading hierarchy, required labels, responsive behavior, or accessibility.
- Every implemented object should have a schema, editor preview, query projection, TypeScript type path, and frontend renderer.

## Voice And Satire Rules

- Satirical copy should still be clear.
- Avoid real animal harm, neglect, abandonment, or unsafe handling.
- Avoid jokes that make forms, errors, prices, or navigation unclear.
- Pet descriptions can be absurd, but should remain believable enough to demonstrate real CMS content.
- Form errors can be playful, but users should still understand what failed.
- System pages can be funny, but must clearly describe the 404, 500, or generic error state.

## Pop-Culture And Parody Rules

- Pop-culture-inspired pets are allowed as parody-friendly archetypes.
- Do not recreate official character likenesses, official images, film stills, logos, franchise marks, or exact copyrighted dialogue.
- Avoid implying endorsement, sponsorship, or affiliation.
- Pair parody-inspired pets with owners, warnings, testimonials, and care notes that echo the joke without copying protected expression.
- If a reference feels too close to the source material, rewrite it as a broader archetype before publishing.

## Accessibility Content Rules

- Meaningful images require alt text.
- Decorative images should be clearly decorative in implementation or use empty alt text.
- Icon-driven facts and filters need accessible labels or visible text.
- Links and CTAs need clear labels.
- Error, success, empty, warning, and alert states need direct text, not only color or icon treatment.
- Seed data should include realistic alt text, empty states, and error states so accessibility is testable early.

## SEO And Indexing Rules

- Public content pages should include useful SEO fields.
- System/error pages should default to no-index metadata.
- Draft, preview, unpublished, and internal routes should not be indexed.
- SEO copy should describe the fictional demo site without implying a real pet rental service.
- Open graph images should use approved local media uploaded to Sanity or project-owned assets.

## Form Content Rules

- Phase one form submissions go to the master project inbox through Mailgun.
- Form copy should not imply messages go directly to a real owner.
- Pet contact forms should preserve pet and owner context in the submitted payload.
- Form success and error states should be clear, satirical, and user-safe.
- Future AI-generated email replies are a backlog item and must include clear disclosure if implemented.

## Review Checklist

Before content is treated as approved:

- Copy matches the Pet Share voice and is understandable.
- Pet, owner, and testimonial relationships make sense.
- Pop-culture references are parody-friendly and not too close to protected source material.
- No content implies real animal harm or unsafe handling.
- Required Sanity fields are complete.
- Meaningful images have alt text.
- Generated media has provenance metadata.
- Public visibility status is correct.
- SEO/no-index settings are appropriate.
- Forms and errors remain clear despite humorous copy.

## Open Questions

- Final owner/editor roles in Sanity can be defined after the Studio is scaffolded.
- Final moderation workflow for future user-submitted pets belongs with the post-launch account/submission backlog item.
