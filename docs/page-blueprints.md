# Page Blueprints

This document defines implementation-facing page structure for Pet Share. It sits between the content model and the visual design guide: the content model defines available Sanity data, the design guide defines feel and tone, and this blueprint defines what each page should render and how it should behave.

Start with the pet surfaces because they drive the strongest Sanity relationships, filtering, card components, image handling, and contact flows.

## `/pets` Pet Index Page

Purpose:

- Present the marketplace-style list of borrowable pets.
- Let users filter pets by useful, funny, structured attributes.
- Demonstrate Sanity-driven page framing, pet type data, referenced pet records, reusable sections, and responsive listing UI.
- Route users into individual pet pages without exposing an owner directory.

Primary user actions:

- Browse available pets.
- Filter the listing.
- Open an individual pet detail page.
- Follow a page-level CTA such as "List your tiny landlord" or "Start your pet break."

## `/pets` Page Structure

### 1. Page Shell

Layout intent:

- Use the global site shell with visible white space near viewport edges on larger screens.
- Use Tailwind utilities or project container config for a wide content container around 1200px for the main pet index layout, instead of Tailwind's smaller default container width.
- The main page surface can use rounded edges and subtle glassmorphism where it does not hurt readability.
- Keep the page bright, airy, and pet-forward.

Responsive behavior:

- Edge whitespace and rounded page framing should compress or disappear on small mobile screens if it makes content feel squeezed.
- No horizontal overflow.
- All cards, filter controls, and CTA rows must wrap cleanly.

Data source:

- Global navigation and footer from `siteSettings`.
- Page-specific content from the `petIndexPage` singleton.

### 2. Hero

Content:

- CMS-authored hero from `petIndexPage.hero`.
- Short page summary from `petIndexPage.summary`.
- Primary CTA from `petIndexPage.primaryCta`.
- Optional featured pet or pet type visual if the hero component supports references later.

Visual direction:

- Bright hero area with rounded framing.
- Optional glass panel for copy if placed over imagery or color.
- Pet image or playful pet-type icon cluster should be visible early.
- The headline should quickly establish the joke.

Example copy direction:

- "Browse available chaos."
- "Find a temporary roommate with strong opinions."
- "Every pet is available for a short stay, a long stare, or a deeply questionable weekend."

Responsive behavior:

- Desktop: hero can use a two-column layout or layered image/copy treatment.
- Mobile: headline, summary, and CTA stack above or below the image; no text over busy imagery unless contrast is guaranteed.
- Motion should respect reduced-motion preferences.

### 3. Filter And Sort Area

Content:

- CMS-authored support copy from `petIndexPage.filterIntro`.
- Structured filters from pet and pet type fields.

Initial filters:

- Pet type: multi-select pills, such as dog, cat, rabbit, bird, reptile, or fish.
- Availability: rounded toggle or segmented controls.
- Chaos level: fillable icon scale, supporting whole and half-step values when useful.
- Mess risk: fillable icon scale, such as one to five mess icons with optional half-filled values.
- Energy level: fillable icon scale.
- Cuddle policy: selectable pills or rounded segmented controls depending on values.
- Pickup urgency: selectable pills or rounded segmented controls.

Optional later filters:

- Temperament.
- Location, if location becomes structured.
- Owner availability, if needed.

Sort options:

- Featured first.
- Newest.
- Lowest chaos.
- Highest chaos.
- Soonest pickup.

Behavior:

- Filtering should be URL and server driven from the first implementation.
- Filters should update URL search params so filtered views are shareable.
- Pagination should also use URL search params so result pages are shareable and restorable.
- Changing filters should reset pagination to the first page.
- Server-render the filtered results from the current URL state, then optionally enhance interactions on the client.
- Multi-select filters should render selected values as pills in the left rail and in the active filter summary.
- Boolean filters should use rounded toggle or radio-style controls.
- Rating-like filters should use fillable icons across the board, with support for half-filled values where the underlying data supports decimals.
- Rating-like filters should behave as minimum/range filters by default, such as "mess risk 3+" or "chaos level 2.5+," rather than exact-value filters.
- Allow users to clear all filters.
- Show the active filter count.
- Avoid filtering by fields that are not consistently populated in seed content.

Responsive behavior:

- Desktop: use a left-side filter rail beside the listing grid.
- Desktop filter rail may be sticky within the results section if it does not create awkward scroll traps.
- Mobile: prefer a filter drawer or collapsible filter panel so the pet grid remains the main surface.
- Selected filters should remain visible as chips above the results.

Accessibility:

- Filter controls must be keyboard accessible.
- Use real buttons, checkboxes, radio groups, or selects rather than clickable divs.
- Fillable icon filters need text labels and accessible values, such as "Mess risk: 2.5 out of 5."
- Announce result count changes where practical.

Filter data source:

- `petType.name`
- `petType.pluralName`
- `petType.slug`
- `petType.icon`
- `petType.customIcon`
- `petType.filterLabel`
- `petType.sortOrder`
- Structured pet category fields such as `chaosLevel`, `messRisk`, `energyLevel`, `cuddlePolicy`, `pickupUrgency`, and `availabilityStatus`.

### 4. Featured Pets

Content:

- Curated references from `petIndexPage.featuredPets`.
- If no featured pets are selected, this section can be omitted.

Visual direction:

- Small carousel, wide featured row, or editorial highlight grid.
- Cards can use stronger image treatment than the main grid.
- Use glassmorphism sparingly for badges or overlay facts when contrast is strong.

Behavior:

- Featured pet cards link to `/pets/[slug]`.
- Cards should still show availability and key facts.

Responsive behavior:

- Desktop: 2-4 featured cards depending on layout.
- Mobile: horizontal carousel or stacked cards with stable image ratios.

### 5. Pet Listing Results

Content:

- Query approved and published `pet` documents.
- Exclude rejected, archived, pending, and unpublished pets unless preview mode is active.

Card content:

- Primary card media: image by default, with optional low-frame-rate video or animated media when available.
- Pet name.
- Pet type with icon.
- Listing headline.
- Brief listing summary.
- Availability status with a clear visual indicator, such as a green dot for available pets and a muted indicator for unavailable pets.
- Relevant tags, such as chaos level, mess risk, energy level, cuddle policy, or pickup urgency.
- Owner name only if it helps context; do not link to an owner directory.
- CTA to view details.

Visual direction:

- Cards should be friendly, image-forward, borderless, and easy to scan.
- Avoid borders across the listing design. Use spacing, subtle shadows, image shape, background contrast, or glass effects to define card groups instead.
- Use stable card dimensions across the grid.
- Hover can include a gentle lift or playful twist.
- Badges and icons should make the grid visually scannable.
- Card media should have a consistent aspect ratio and rounded corners.
- Low-frame-rate video should feel playful but should not autoplay with sound.

Behavior:

- Entire card can link to the detail page if accessible, with a clear nested CTA if needed.
- Pet owner links, if shown, should link directly to `/owners/[slug]`.
- Do not expose a route to browse all owners.
- If video media is used, respect reduced-motion preferences and provide an image fallback.

Responsive behavior:

- Mobile: one column.
- Tablet: two columns.
- Desktop: three or four columns, depending on card density and page width.
- Avoid masonry layouts for the first pass because they complicate stable scanning and responsive behavior.

Pagination:

- Use server-driven pagination based on URL search params.
- Keep pagination controls near the bottom of the listing results.
- Preserve active filters when moving between pages.
- Show enough result context for users to understand where they are, such as total results or current page when practical.

### 6. Empty State

Content:

- CMS-authored empty state from `petIndexPage.emptyState` when available.
- Fallback copy should use the Pet Share voice.

Example copy:

- "No pets match those filters. They may be hiding."
- "That combination is too specific, even for us."

Behavior:

- Show active filters.
- Provide a "Clear filters" action.
- Optionally suggest popular pet types.

Responsive behavior:

- Empty state should be centered or comfortably framed, not stretched full width with sparse text.

### 7. Supporting CMS Sections

Content:

- `petIndexPage.contentSections`.

Allowed section examples:

- Callout block.
- Alert or warning block.
- Testimonial block.
- Process summary.
- CTA group.
- Accordion for pet borrowing questions.

Visual direction:

- These sections should support the page without overwhelming the pet grid.
- Use them below the main listing or between featured pets and results only when they help the page flow.

Implementation rule:

- Render these through the same reusable section renderer strategy used by marketing pages where practical.

### 8. Final CTA

Content:

- A bottom CTA block from `petIndexPage.primaryCta` or a dedicated reusable CTA/callout section.
- The first implementation should point to a contact or warranty-style compatibility inquiry, not a real public pet submission flow.

Recommended seed copy:

- Headline: "Not seeing the exact problem you hoped to borrow?"
- Body: "Tell us what kind of temporary roommate you are looking for. Our fictional matching team will check under the couch."
- CTA label: "Start a compatibility inquiry."

Behavior:

- Route to the contact/warranty form page or open a form experience that acknowledges the submitter through Mailgun (with an optional oversight CC).
- Avoid implying the user can submit or list a pet directly until the future account/submission flow exists.

## `/pets` Sanity Query Needs

The page should fetch:

- `petIndexPage` singleton by explicit ID.
- `siteSettings` for global shell.
- Seeded and active `petType` documents sorted by `sortOrder`.
- Approved/published `pet` documents for the listing.
- Referenced featured pets from `petIndexPage.featuredPets`.
- Any referenced testimonials or reusable section content from `petIndexPage.contentSections`.

Pet listing query projection should include:

- `_id`
- `name`
- `slug`
- `petType` label, slug, and icon fields
- `owner` name and slug when needed
- `listingHeadline`
- `listingSummary`
- `availabilityStatus`
- `temperament`
- `pickupUrgency`
- `messRisk`
- `chaosLevel`
- `energyLevel`
- `cuddlePolicy`
- primary card image or card video fallback with alt text
- SEO fields only if needed for structured data or previews

## `/pets` States

Required states:

- Loading state, if any part of the route is streamed or client-filtered.
- Empty state when no pets exist.
- Empty filtered state when filters produce no results.
- Error state for failed client-side filter enhancement, if applicable.
- Draft preview state when preview mode is active.

Preview behavior:

- Preview mode should show draft `petIndexPage` content.
- Preview mode should be able to show draft or pending pets when coming from Studio.
- A visible preview banner and exit preview action should remain available.

## `/pets` Decisions

- Filtering should be URL and server driven.
- Filter and pagination state should update the URL so listing views are shareable.
- Desktop filters should use a left-side rail.
- Listing cards should be borderless.
- Cards should support image media first, with optional low-frame-rate video or animated media when available.
- Low-frame-rate card video should be optional, lazy-loaded, and image-fallback first.
- Availability should have a clear visual indicator, such as a green dot for available pets.
- The final CTA should point to a contact or warranty-style compatibility inquiry in phase one.
- Favorite/save actions and direct messaging are out of scope for phase one.

## `/pets/[slug]` Pet Detail Page

Purpose:

- Present one pet as a polished, relationship-rich listing.
- Show the strongest connection between Sanity content, generated pet imagery, owner references, reusable objects, and frontend layout.
- Give users enough context to decide whether to contact the owner.
- Keep owner discovery contextual, not directory-based.

Primary user actions:

- Review the pet's images, facts, warnings, and owner context.
- Open the owner contact drawer.
- Navigate back to the pet index.
- Visit the referenced owner page only from pet-related context.

## `/pets/[slug]` Page Structure

### 1. Page Shell

Layout intent:

- Use the same wide Tailwind-based container direction as the pet index, around 1200px for core content.
- Preserve visible edge whitespace on larger screens.
- Use rounded page surfaces where they support the polished app-like feel.
- Keep the page image-forward and easy to scan.

Responsive behavior:

- Desktop should feel spacious and editorial.
- Mobile should stack content in a clear order with no sticky panels that block reading.
- Avoid horizontal overflow from galleries, fact panels, drawers, or embedded videos.

Data source:

- Global navigation and footer from `siteSettings`.
- Pet document by slug, or by document ID in draft preview routes for unpublished drafts.

### 2. Back Link And Status Row

Content:

- Link back to `/pets`, preserving filter URL params when the user came from a filtered index when practical.
- Availability indicator.
- Pet type label and icon.
- Optional small owner/location context if available.

Visual direction:

- Keep this compact and functional.
- Availability can use the same green dot/muted indicator pattern from pet cards.

Responsive behavior:

- On mobile, wrap status items into readable chips.

### 3. Hero Gallery And About Panel

Content:

- `pet.heroImages`
- Pet name.
- `pet.listingHeadline`
- `pet.summary` or short intro copy.
- Availability status.
- Pet type, breed, age, and owner reference.
- Icon facts from structured fields and `pet.stats`.

Desktop layout:

- Left side: large image gallery.
- Right side: sticky or visually anchored "About this pet" glass panel.
- The panel should include key facts, availability, and the primary contact CTA.

Mobile layout:

- Gallery first.
- Name and headline below the gallery.
- About panel becomes a normal stacked section, not a sticky sidebar.

Visual direction:

- Images should have strong rounded corners and stable aspect ratios.
- The about panel can use glassmorphism if contrast and readability are strong.
- Facts should use icons heavily for scanning.

Behavior:

- Gallery should support multiple images.
- Gallery should support keyboard navigation if thumbnails or carousel controls are interactive.
- Avoid autoplaying video in the hero unless it is explicitly lightweight, muted, and has a still fallback.

### 4. Key Fact Grid

Content:

- Age.
- Pet type.
- Breed.
- Temperament.
- Chaos level.
- Mess risk.
- Energy level.
- Cuddle policy.
- Pickup urgency.
- Availability.

Visual direction:

- Use icon-heavy facts.
- Rating-like fields should use the same fillable icon language as filters where practical.
- No borders; use spacing, soft backgrounds, shadows, or glass surfaces to group facts.

Accessibility:

- Icon-only facts need visible labels or accessible labels.
- Fillable icons need text equivalents, such as "Chaos level: 4 out of 5."

### 5. Description

Content:

- `pet.description`

Copy direction:

- Usually one or two short paragraphs.
- Should describe the pet's look, personality, habits, borrowability, and specific comedic problem.
- Should be rich enough to support generated imagery and meaningful page content.

Layout:

- Keep line length comfortable.
- Avoid placing long body copy on busy glass backgrounds.

### 6. Warnings, Care Notes, And Borrow Terms

Content:

- `pet.warnings`
- `pet.careNotes`
- `pet.borrowTerms`
- `pet.availability`

Visual direction:

- Use reusable warning, alert, callout, and icon-label components.
- Make severity visually clear without making the page feel alarmist.
- Keep the satire useful: warnings should still communicate real page information.

Example warning direction:

- "Do not leave near unlocked muffins."
- "Requires compliments before breakfast."
- "Decorative helmets should be kept out of sight."

Responsive behavior:

- Desktop can use a two-column or card grid layout.
- Mobile should stack into readable blocks.

### 7. Pet Videos

Content:

- `pet.videos`

Behavior:

- Optional section; omit when no videos exist.
- Embed videos lazily.
- Do not block the main page render on third-party video embeds.
- Use a thumbnail or poster before loading the embed where practical.

Visual direction:

- Keep videos bright, pet-focused, and playful.
- Videos should not replace the image gallery as the primary first impression.

### 8. Owner Summary

Content:

- Referenced `owner` document.
- Owner name.
- Portrait.
- Tagline.
- Short bio excerpt.
- Member since date or city/province location when useful.
- Associated pets by inverse `pet.owner` query when practical.

Behavior:

- Link to `/owners/[slug]` from this contextual block.
- Do not provide a route or CTA to browse all owners.
- Include the contact owner CTA in or near this section if it was not already used in the hero panel.

Visual direction:

- Owner block should feel trustworthy but lightly exhausted.
- Use a rounded, image-forward layout without borders.

### 9. Contact Owner Drawer

Trigger:

- `pet.contactOwnerCta`
- Primary hero/about panel CTA.
- Optional owner block CTA.

Behavior:

- Opens a drawer, not a centered modal or separate route.
- Drawer should preserve pet page context.
- Reuse the same `formDefinition` model as the contact/warranty forms where practical, with an owner-contact `formType`.
- Form submission sends a branded acknowledgement to the submitter through Mailgun (with an optional oversight CC) in phase one.
- Include hidden/server-side context such as pet ID, pet name, owner ID, owner name, and current URL.
- Success and error states should use CMS-authored or product-voice copy where practical.

Recommended copy:

- CTA: "Ask about this pet."
- Success: "Your request made it through the chew-proof tunnel."
- Error: "The dog ate the email. Please try again."

Responsive behavior:

- Desktop: side drawer.
- Mobile: full-height or near-full-height drawer with clear close control and usable form spacing.

Accessibility:

- Trap focus only while the drawer is open.
- Restore focus to the trigger on close.
- Provide accessible labels, validation messages, and keyboard dismissal.

### 10. Related Pets

Content:

- Pets with the same `petType`.
- Pets from the same owner.
- Curated related pets if a relationship field is added later.

Behavior:

- Exclude the current pet.
- Link to `/pets/[slug]`.
- Show only approved/published pets unless preview mode is active.

Visual direction:

- Reuse the borderless pet card pattern from the index page.
- Keep this section secondary; it should not compete with the contact CTA.

### 11. SEO And Structured Metadata

Content:

- `pet.seo`
- Pet name, listing headline, and summary as fallbacks.
- Open graph image from `pet.seo.openGraphImage` or first hero image.

Behavior:

- Published slug route: `/pets/[slug]`.
- Unpublished draft preview route: `/preview/pet/[documentId]`.
- Public route should 404 for missing, unpublished, pending, rejected, or archived pets outside preview mode.

## `/pets/[slug]` Sanity Query Needs

The page should fetch:

- Pet by slug for published routes.
- Pet by document ID for unpublished draft preview routes.
- Referenced `petType`.
- Referenced `owner`.
- Related pets by owner and/or pet type.
- `siteSettings` for global shell.

Pet detail query projection should include:

- `_id`
- `name`
- `slug`
- `petType` label, slug, and icon fields
- `breed`
- `age`
- `owner` name, slug, portrait, tagline, and summary fields
- `submittedBy`
- `submissionStatus`
- `source`
- `listingHeadline`
- `listingSummary`
- `availabilityStatus`
- `temperament`
- `pickupUrgency`
- `messRisk`
- `chaosLevel`
- `energyLevel`
- `cuddlePolicy`
- `heroImages`
- `summary`
- `description`
- `personalityTraits`
- `careNotes`
- `availability`
- `borrowTerms`
- `stats`
- `warnings`
- `videos`
- `testimonial`
- `contactOwnerCta`
- `seo`

## `/pets/[slug]` States

Required states:

- Published pet state.
- Draft preview pet state.
- Unpublished draft preview state before slug exists.
- Not found state for missing or unavailable pets outside preview.
- Contact drawer idle, submitting, success, and error states.
- Empty optional-section states, where sections are omitted cleanly if data is missing.

Preview behavior:

- Preview links should originate from Sanity Studio.
- Draft preview should support unpublished pets before a public slug exists.
- Preview mode should show the preview banner and exit preview action.
- Preview queries may include draft, pending, or unpublished pets when the request is authorized.

## `/pets/[slug]` Decisions

- Desktop layout should use an image-led hero with a right-side "About this pet" panel.
- Mobile layout should stack gallery, title, facts, CTA, description, and secondary sections.
- Contact owner should use a drawer.
- Long description should be one or two short paragraphs.
- Owner pages are reachable from pet context but no owner directory should exist.
- Optional videos should lazy-load and should not replace the primary image gallery.
- Favorite/save actions and direct messaging are out of scope for phase one.

## `/owners/[slug]` Owner Detail Page

Purpose:

- Provide context for a fictional pet owner when users arrive from a pet listing, pet detail page, or direct URL.
- Reinforce the relationship between owners and their pets without creating a browsable owner directory.
- Give users enough trust/context to return to the owner's pets or contact through pet-specific flows.

Primary user actions:

- Read owner context.
- Browse pets associated with the owner.
- Open a pet detail page.
- Navigate back to the pet context or pet index.

Non-goals:

- Do not create an owner index or owner discovery experience.
- Do not make owners the primary marketplace object.
- Do not let owner pages bypass pet-specific contact context when the user is trying to borrow a pet.
- Do not include favorite/save actions or direct messaging in phase one; those are backlog features.

## `/owners/[slug]` Page Structure

### 1. Page Shell

Layout intent:

- Use the same wide Tailwind-based container direction as the pet pages, around 1200px for core content.
- Keep visible edge whitespace on larger screens.
- Use rounded, borderless sections with optional glassmorphism where readability stays strong.

Responsive behavior:

- Desktop can use a two-column profile hero.
- Mobile should stack portrait, owner summary, bio, and associated pets.
- No horizontal overflow from pet card rows or profile media.

Data source:

- Global navigation and footer from `siteSettings`.
- Owner document by slug, or by document ID in draft preview routes for unpublished drafts.

### 2. Contextual Back Link

Content:

- Back link to the referring pet page when referrer context is available.
- Fallback link to `/pets`.

Behavior:

- Preserve useful `/pets` filter params when returning to the pet index from a filtered journey.
- Avoid linking to a non-existent owner directory.

### 3. Owner Hero

Content:

- `owner.portrait`
- `owner.name`
- `owner.tagline`
- `owner.location`
- `owner.memberSince`
- Optional trust/stat facts, if added later.

Visual direction:

- Portrait-forward and friendly.
- Owner should feel like a public user profile: casual, specific, lightly exhausted, and trustworthy.
- Use rounded image treatment and soft/glass surfaces rather than borders.

Example copy direction:

- "Dana has shared two pets, one couch, and several warnings about unattended muffins."
- "Member since March 2021, emotionally since the first rug incident."

Responsive behavior:

- Desktop: portrait and summary can sit side by side.
- Mobile: portrait first, then name, tagline, and facts.

### 4. Owner Bio

Content:

- `owner.bio`

Layout:

- Keep line length comfortable.
- Bio should be satirical but believable.
- Avoid overloading this page with marketing-page sections; the owner page should stay focused.

### 5. Associated Pets

Content:

- Pets where `pet.owner._ref == owner._id`.
- Optional manual `owner.pets` references only if inverse querying is insufficient later.

Behavior:

- Show only approved/published pets outside preview mode.
- Link each pet card to `/pets/[slug]`.
- Do not expose controls for browsing other owners.

Card content:

- Reuse the pet index card pattern.
- Pet image or card media fallback.
- Pet name.
- Listing headline or brief summary.
- Availability indicator.
- Key tags such as chaos level, mess risk, energy level, or cuddle policy.

Visual direction:

- Borderless, image-forward cards.
- Keep the grid smaller than the pet index page so this remains an owner context page.

Responsive behavior:

- Mobile: one column.
- Tablet: two columns.
- Desktop: two or three columns depending on available pets.

### 6. Testimonial Or Trust Block

Content:

- `owner.testimonial`, or testimonials that reference the owner.

Behavior:

- Optional section; omit cleanly if no testimonial exists.
- Testimonial should reinforce the owner's relationship to pets rather than become generic social proof.

Visual direction:

- Use a compact quote/card layout.
- Keep satire believable and not mean-spirited.

### 7. Contact Guidance

Content:

- `owner.contactCta`, if present.

Behavior:

- Prefer routing users into a pet-specific contact drawer from an associated pet.
- If a general owner contact CTA is shown, make clear it is a general inquiry that acknowledges the submitter via Mailgun and is not routed to individual owners.
- Do not imply direct owner email delivery in phase one.

Recommended copy:

- "Ask about this owner's pets."
- "Start with a pet, then begin negotiations."

### 8. SEO And Structured Metadata

Content:

- `owner.seo`
- Owner name and tagline as fallbacks.
- Open graph image from owner portrait when no SEO image exists.

Behavior:

- Published slug route: `/owners/[slug]`.
- Unpublished draft preview route: `/preview/owner/[documentId]`.
- Public route should 404 for missing or unpublished owners outside preview mode.

## `/owners/[slug]` Sanity Query Needs

The page should fetch:

- Owner by slug for published routes.
- Owner by document ID for unpublished draft preview routes.
- Associated pets by inverse `pet.owner` query.
- Owner testimonial or testimonials referencing the owner.
- `siteSettings` for global shell.

Owner detail query projection should include:

- `_id`
- `name`
- `slug`
- `portrait`
- `tagline`
- `bio`
- `location`
- `memberSince`
- `testimonial`
- `contactCta`
- `seo`

Associated pet projection should include:

- `_id`
- `name`
- `slug`
- `petType` label, slug, and icon fields
- `listingHeadline`
- `listingSummary`
- `availabilityStatus`
- `messRisk`
- `chaosLevel`
- `energyLevel`
- `cuddlePolicy`
- primary card image or card video fallback with alt text

## `/owners/[slug]` States

Required states:

- Published owner state.
- Draft preview owner state.
- Unpublished draft preview state before slug exists.
- Not found state for missing or unpublished owners outside preview.
- Empty associated-pets state, if an owner temporarily has no approved pets.
- Optional testimonial/contact sections omitted cleanly when data is missing.

Preview behavior:

- Preview links should originate from Sanity Studio.
- Draft preview should support unpublished owners before a public slug exists.
- Preview mode should show the preview banner and exit preview action.
- Preview queries may include draft or unpublished owner/pet content when authorized.

## `/owners/[slug]` Decisions

- Owner detail pages can exist, but there should be no owner directory.
- Owner discovery should happen through pet-related surfaces or direct URLs.
- Associated pets should be queried from the canonical `pet.owner` relationship.
- Pet-specific contact remains the preferred contact path.
- Favorite/save actions and direct messaging are out of scope for phase one.
- The page should be profile-forward, borderless, bright, and responsive.

## System And Error Pages

System pages cover custom static states such as 404 not found, 500 server error, generic route errors, preview errors, and optional maintenance messaging.

Primary routes and boundaries:

- `app/not-found.tsx` for global 404 behavior.
- Route-level `not-found.tsx` files where a specific section needs stronger context.
- `app/error.tsx` or route-level `error.tsx` for recoverable runtime errors.
- `app/global-error.tsx` only if the app needs a root fallback beyond route-level error handling.

Content:

- CMS-authored `systemPage` document when available.
- Hardcoded fallback copy in code for each required state.
- Clear status label, headline, explanation, and at least one recovery CTA.
- Optional friendly image or illustration with meaningful alt text when it adds context.

Behavior:

- Error pages should never expose stack traces, raw exception messages, secrets, Sanity response bodies, Mailgun response details, or debug-only context to users.
- If Sanity fetching fails while rendering a system page, render the static fallback instead of failing the error page.
- 404 states for missing pets, missing owners, unpublished content outside preview, and missing marketing pages should all route to a clear not-found experience.
- Server error states should acknowledge the issue plainly and provide a retry or navigation path.
- System pages should default to no-index metadata.

Copy direction:

- 404 headline example: "This pet has slipped its collar."
- 404 body example: "The page you are looking for wandered off before we could clip on the tiny bell. Try the available pets or head home."
- 500 headline example: "Something chewed through the server cable."
- 500 body example: "Pet Share hit a problem while fetching the good stuff. Try again in a moment or browse pets that are behaving for now."

Testing notes:

- Verify system pages at mobile and desktop sizes.
- Verify recovery links are keyboard reachable.
- Verify user-facing error copy stays clear even when the joke is present.
