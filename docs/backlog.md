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
