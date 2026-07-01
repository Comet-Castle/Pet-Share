# Content Model

This document is a first-pass planning model for Pet Share's Sanity content. It is not final. Use it to guide early schema, route, query, preview, and revalidation work, then update it as the product direction becomes clearer.

## Modeling Goals

- Demonstrate common website content patterns with Sanity CMS.
- Keep content semantic and editor-friendly rather than modeling every frontend layout detail.
- Support a modern marketing site with satirical marketplace content.
- Support strong relationships between owners, pets, testimonials, pages, and calls to action.
- Give webhook revalidation enough structure to update specific routes or cache tags.
- Keep room for future Sanity Visual Editing without implementing it immediately.

## Proposed Routes

```text
/
/about
/process
/pricing
/pets
/pets/[slug]
/owners/[slug]
/contact
/warranty
/studio
```

Route names can change, but these routes cover the main demo surfaces: generic marketing pages, marketplace-style pet listing pages, relationship-heavy detail pages, and form-driven contact and warranty flows.

There should not be a public owner directory. Owner detail pages can exist at direct URLs, but users should primarily reach them from pet listings or pet detail pages.

## Resolved Content Decisions

- A `pet` document is the public listing in phase one. Do not create a separate `listing` document.
- The `/pets` route should have a `petIndexPage` singleton for page-level CMS content.
- Pet types power filtering, labels, icons, and organization only. Do not create pet type landing pages in phase one.
- Starter `petType` documents should be seeded so the demo has useful filters immediately.
- Pricing tiers should be reusable objects embedded on the pricing page.
- Process steps should be reusable objects embedded in relevant page documents.
- Forms should submit email to a single master project email address in phase one through Mailgun.
- Owner contact should use a drawer UI.
- Pet records should include structured category fields such as temperament, pickup urgency, mess risk, chaos level, energy level, and cuddle policy.
- Testimonials should be reusable content for homepage and marketing sections. Do not create a standalone testimonials page in the first pass.
- Video embeds, alert blocks, and warning blocks should be part of the early reusable section set so pet pages and marketing pages can demonstrate richer CMS-authored content.
- Marketing pages should support a fairly open page-builder-style section array while keeping restricted content types such as pets, owners, pet types, and forms modeled separately.
- Portable Text should stay relatively simple. Use reusable section objects for rich layout, media, callouts, alerts, and warnings instead of allowing every layout pattern inside rich text.

## Initial Schema Scope

The first schema pass should build enough content structure to support the first usable site without implementing every planned object at once.

Initial documents:

- `siteSettings`
- `homePage`
- `petIndexPage`
- `systemPage`
- `marketingPage`
- `owner`
- `pet`
- `petType`
- `testimonial`
- `formDefinition`

Initial reusable objects:

- `imageWithAlt`
- `gallery`
- `videoEmbed`
- `portableText`
- `seo`
- `link`
- `cta`
- `ctaGroup`
- `navigationItem`
- `hero`
- `heroSlide`
- `sectionHeader`
- `contentSection`
- `calloutBlock`
- `alertBlock`
- `warningBlock`
- `statBlock`
- `testimonialBlock`
- `featureList`
- `accordion`
- `accordionItem`
- `pricingTier`
- `pricingFeature`
- `processStep`
- `petTrait`
- `petStat`
- `availabilityWindow`
- `borrowTerm`
- `careNote`
- `petWarning`
- `formField`
- `formOption`
- `formSuccessState`

Hold planned objects until a page or component needs them. Every implemented object should have a Sanity schema, editor preview, query projection, TypeScript type path, and frontend renderer.

## Core Documents

Core documents are editor-managed Sanity entries. Their fields should be authored in Sanity and rendered by the Next.js frontend through route components, query helpers, and reusable section components.

### `siteSettings`

Global site configuration. This should likely be a singleton document.

Suggested Sanity fields:

- `title`: site title.
- `description`: default site description.
- `defaultSeo`: reusable `seo` object.
- `logo`: reusable `imageWithAlt` object or Sanity image field.
- `primaryNavigation`: array of reusable `navigationItem` objects.
- `footerNavigation`: array of reusable `navigationItem` objects.
- `socialLinks`: array of reusable `socialLink` objects.
- `defaultCta`: reusable `cta` object.
- `contactEmail`: public contact email for display copy only. Server-side form delivery should use `CONTACT_TO_EMAIL`.

Used by:

- Root layout
- Navigation
- Footer
- SEO defaults

Revalidation:

- `/`
- All marketing pages
- Header/footer cache tag

### `homePage`

Homepage content. This should likely be a singleton document.

Suggested Sanity fields:

- `seo`
- `heroCarousel`: array of reusable `heroSlide` objects.
- `intro`: reusable `contentSection` object.
- `featuredPets`: references to `pet` documents.
- `featuredOwners`: references to `owner` documents, used only in curated homepage sections rather than an owner directory.
- `processSummary`: array of reusable `processStep` objects or a reusable `contentSection`.
- `testimonials`: references to `testimonial` documents or reusable `testimonialBlock`.
- `statBlocks`: array of reusable `statBlock` objects.
- `contentSections`: array of reusable page section objects.
- `primaryCta`

Notes:

- The hero should support multiple rotating banner slides.
- Each slide can use animation in the frontend, but the CMS should own the content, image, and CTA, not animation internals.
- Homepage sections should be CMS-authored reusable objects to demonstrate editorial control and content reuse.
- The goal is not to hardcode homepage sections in React. The frontend should render Sanity-authored sections through a constrained set of reusable section components.
- Homepage sections should use the same reusable section renderer strategy as marketing pages where practical, while preserving special homepage-only behavior such as the animated hero carousel.

Revalidation:

- `/`
- Home page cache tag

### `petIndexPage`

Pet listing page content for `/pets`. This should likely be a singleton document.

Suggested Sanity fields:

- `seo`: reusable `seo` object.
- `hero`: reusable `hero` object.
- `summary`: short listing page intro.
- `featuredPets`: references to `pet` documents.
- `filterIntro`: short copy near the left-side filter rail.
- `emptyState`: reusable `calloutBlock` or simple message for no filter results.
- `contentSections`: array of reusable page section objects.
- `primaryCta`: reusable `cta` object.

Notes:

- Pet cards and filter results should come from `pet` and `petType` queries, not manually authored card content.
- The CMS should control page framing, SEO, featured content, filter support copy, and empty-state copy.

Revalidation:

- `/pets`
- Pet index page cache tag

### `systemPage`

CMS-authored copy for static system states such as 404, 500, generic error, maintenance, and preview errors. These pages should feel like Pet Share, but they must still clearly explain what happened and give users a useful recovery path.

System pages are editorial enhancements, not hard runtime dependencies. The Next.js `not-found.tsx`, `error.tsx`, and related boundaries must include hardcoded fallback copy so the app can still render a clear message if Sanity or another dependency is unavailable.

Suggested Sanity fields:

- `title`: internal editor title.
- `pageType`: controlled value, such as `notFound`, `serverError`, `genericError`, `maintenance`, or `previewError`.
- `seo`: reusable `seo` object. Default `noIndex` should be true.
- `eyebrow`: short status label, such as `404` or `500`.
- `headline`: user-facing headline.
- `message`: clear user-facing explanation.
- `image`: optional reusable `imageWithAlt` object for a friendly illustration.
- `primaryCta`: reusable `cta` object for recovery, usually home or pet listings.
- `secondaryCta`: optional reusable `cta` object.
- `supportCopy`: optional short copy for persistent failures.
- `contentSections`: optional limited section array for alerts, callouts, accordions, or CTAs.

Used by:

- Global and route-level not-found boundaries
- Global and route-level error boundaries
- Optional maintenance or preview error pages

Revalidation:

- System routes and error boundary cache tag

### `marketingPage`

Flexible page type for mostly static pages such as About, Process, Pricing, and Contact.

Suggested Sanity fields:

- `title`: editor-facing and page-facing title.
- `slug`: public route slug.
- `seo`: reusable `seo` object.
- `hero`: reusable `hero` object.
- `summary`: short page summary.
- `sections`: array of curated reusable page section objects.
- `primaryCta`: reusable `cta` object.
- `showContactForm`: toggle for pages that should render the default contact or warranty form.

Initial section types:

- `hero`
- `contentSection`
- `calloutBlock`
- `alertBlock`
- `warningBlock`
- `statBlock`
- `testimonialBlock`
- `featureList`
- `accordion`
- `accordionItem`
- `pricingTier`
- `processStep`
- `videoEmbed`
- `ctaGroup`

Likely documents:

- About page
- Process page
- Pricing page
- Contact page

Revalidation:

- `/${slug}`
- Marketing page cache tag

Notes:

- Marketing pages should demonstrate CMS-authored reusable sections, not hardcoded route-specific page bodies.
- Keep section choices broad enough to demonstrate a page-builder workflow, but do not allow marketing pages to author restricted domain content such as pet records, owner records, pet types, or form internals inline.

### `owner`

Represents a fictional pet owner.

Suggested Sanity fields:

- `name`: owner display name.
- `slug`: direct owner page slug.
- `portrait`: reusable `imageWithAlt` object.
- `tagline`: short satirical owner summary.
- `bio`: portable text or constrained rich text.
- `location`: public owner location in `City, Province` format.
- `memberSince`: date field for when the owner joined Pet Share.
- `pets`: optional manual references to `pet` documents; prefer querying inverse relationship from `pet.owner` if possible.
- `testimonial`: optional reference to `testimonial`.
- `contactCta`: reusable `cta` object.
- `seo`: reusable `seo` object.

Notes:

- Owners should have a visible relationship to their pets.
- Owner pages should include a section of associated pets.
- Owner content should feel like user-generated profile content: casual, specific, and lightly satirical rather than polished marketing copy.

Revalidation:

- `/owners/[slug]`
- Related pet pages
- Owner cache tag

### `pet`

Represents an individual fictional pet available to borrow.

Suggested Sanity fields:

- `name`: pet display name.
- `slug`: public pet detail slug.
- `petType`: reference to a `petType` document.
- `breed`: open plain-English breed, species, or variety label. Use realistic values such as "Golden Retriever", "Holland Lop", "Ball python", or "Cherry shrimp"; do not use fake content-type-like labels here.
- `visualIdentity`: stable media-generation details for primary color, secondary color/detail, distinctive markings, and eye color. Use this to keep generated images of the same pet visually consistent across card, gallery, and future video prompts.
- `ageYears`: numeric age value for display and future filtering, or `dateOfBirth` if the project later needs exact age calculation. Do not store pet age as a prose string.
- `owner`: reference to the primary `owner` document.
- `submittedBy`: reference to `owner`, initially useful for editor-created content and later useful for authenticated user submissions.
- `submissionStatus`: status selector such as draft, pending, approved, rejected, or archived.
- `source`: source selector such as editorial, imported, user submitted, or demo seed.
- `listingHeadline`: short headline for pet cards and listing surfaces.
- `listingSummary`: short listing copy for index cards and featured sections.
- `availabilityStatus`: listing status such as available, temporarily unavailable, pending pickup, or retired.
- `distanceKilometers`: spoofed demo distance for local listing cards until real location search exists.
- `listingPlan`: owner-paid listing plan attached to the pet, such as Porch Listing, Neighbourhood Spotlight, or Couch Recovery Campaign.
- `hostPayoutAmount`, `hostPayoutCurrency`, `hostPayoutUnit`: owner-funded payout offered to the temporary host. Borrowers/hosts should be presented as being paid to take the pet for a short stay, not paying to rent the pet.
- `temperament`: structured category or selector for filtering and display.
- `pickupUrgency`: structured category or selector for filtering and display.
- `messRisk`: structured category or selector for filtering and display.
- `chaosLevel`: structured category or selector for filtering and display.
- `energyLevel`: structured category or selector for filtering and display.
- `cuddlePolicy`: structured category or selector for filtering and display.
- `cardMedia`: optional lightweight listing media object for the pet card, supporting an image-first fallback and optional lazy-loaded low-frame-rate video or animated media.
- `heroImages`: reusable `gallery` object or array of `imageWithAlt` objects.
- `summary`: short listing-card summary.
- `description`: portable text or constrained rich text, usually one or two short paragraphs for pet detail pages.
- `personalityTraits`: array of reusable `petTrait` objects.
- `careNotes`: array of reusable `careNote` objects.
- `availability`: array of reusable `availabilityWindow` objects.
- `borrowTerms`: array of reusable `borrowTerm` objects.
- `stats`: array of reusable `petStat` objects.
- `warnings`: array of reusable `petWarning` objects.
- `videos`: array of reusable `videoEmbed` objects for pet-specific media.
- `testimonial`: optional reference to `testimonial`.
- `contactOwnerCta`: reusable `cta` object that triggers the owner contact form.
- `seo`: reusable `seo` object.

Notes:

- Pet detail pages should lead with images and a right-side "About this pet" information panel on desktop.
- Use icons for key facts such as age, species, temperament, chaos level, nap reliability, snack requirements, and pickup expectations.
- Below the hero area, include a richer one- or two-paragraph description and a separate owner information block.
- Seeded pet descriptions and media prompts should include enough visual and personality detail to support AI-generated pet images during the seed operation.
- Pet image and video prompts must account for the `breed` value and `visualIdentity` so generated media visually matches the selected breed, species, variety, color, and markings.
- Pet pages should support embedded videos where useful, especially for playful pet-specific media.
- The contact owner action should open a drawer form in the frontend.
- Submission metadata should exist from day one so future user-submitted pet flows can extend the model without reshaping public pet pages.
- In phase one, `submittedBy` can reference a Sanity-managed `owner`. In a future auth phase, it can map to an owner profile connected to an external auth user.
- Do not create a separate `listing` document in phase one. A `pet` document is the listing and should include listing-specific display fields directly.

Revalidation:

- `/pets`
- `/pets/[slug]`
- Related owner page
- Home page if featured
- Pet cache tag

### Future User Submission Compatibility

The current model should not assume all pets are created directly by Sanity editors. Even before public accounts exist, pet documents should include enough metadata to support future user-generated submissions.

Recommended current fields:

- `submittedBy`: reference to `owner`.
- `submissionStatus`: `draft`, `pending`, `approved`, `rejected`, or `archived`.
- `source`: `editorial`, `demoSeed`, `userSubmitted`, or `imported`.

Future fields when auth is added:

- `externalUserId`: ID from the auth provider, likely stored on `owner` rather than directly on every `pet`.
- `submittedAt`: timestamp for user submission.
- `reviewedAt`: timestamp for moderation.
- `reviewedBy`: optional admin/editor identifier.
- `rejectionReason`: internal or user-facing moderation note.

Frontend rule:

- Public pet listings and detail pages should render from the same `pet` schema whether a pet is editor-created, demo-seeded, or user-submitted.
- Public queries should show only approved/published pets unless preview mode or Studio context explicitly requests drafts or pending content.

### `petType`

Represents a category of pet, such as dog, cat, bird, reptile, fish, or more unusual demo-friendly pet types. This should be a standalone document so editors can manage labels, descriptions, icons, filters, and type-specific page copy from Sanity.

Suggested Sanity fields:

- `name`: pet type display name.
- `slug`: pet type slug for filtering and stable references.
- `pluralName`: plural display label.
- `icon`: Lucide icon name or controlled icon selector for app UI fallbacks and editor-friendly selection.
- `customIcon`: project-owned SVG icon for the pet type, visually matched to Lucide's outline style.
- `summary`: short type description.
- `description`: richer type description.
- `defaultImage`: reusable `imageWithAlt` object.
- `traits`: array of reusable `petTrait` objects commonly associated with this type.
- `careNotes`: array of reusable `careNote` objects commonly associated with this type.
- `warnings`: array of reusable `petWarning` objects commonly associated with this type.
- `filterLabel`: label for filters or chips.
- `sortOrder`: numeric ordering field.
- `featured`: toggle for featured type groups.
- `seo`: reusable `seo` object only if type landing pages are added in a later phase.

Starter pet type categories should be broad enough to demonstrate filtering across common, unusual, indoor, outdoor, aquatic, reptile/amphibian, and invertebrate companion animals. Category labels are for organization; individual pet type documents should still use real, recognizable pet types.

Starter pet type examples:

- Common household pets:
  - Dog
  - Cat
  - Rabbit
  - Guinea pig
  - Hamster
  - Gerbil
  - Mouse
  - Rat
  - Ferret
  - Chinchilla
  - Hedgehog
- Birds:
  - Parrot
  - Parakeet
  - Cockatiel
  - Finch
  - Canary
  - Dove
- Aquatic pets:
  - Fish
  - Goldfish
  - Betta
  - Turtle
  - Axolotl
  - Hermit crab
- Reptiles and amphibians:
  - Lizard
  - Gecko
  - Bearded dragon
  - Snake
  - Tortoise
  - Frog
  - Salamander
- Farm and outdoor companion animals:
  - Chicken
  - Duck
  - Goat
  - Mini pig
  - Horse
  - Pony
  - Donkey
  - Alpaca
- Invertebrates:
  - Tarantula
  - Scorpion
  - Praying mantis
  - Stick insect

Notes:

- Keep pet types real and recognizable. Satire should come from individual pet copy, warnings, testimonials, and campaign content rather than fake pet type names.
- Pet type entries should power filtering and display labels on pet listing pages.
- Every seeded pet type should have a matching project-owned SVG icon that visually matches Lucide's outline style, plus a Lucide-compatible `icon` value for fallback and editor selection.
- A type should not replace pet-specific fields. Individual pets still own their own traits, warnings, images, and copy.

Revalidation:

- `/pets`
- Any pet detail pages referencing the type
- Home page if type data is shown in featured pet sections
- Pet type cache tag

### `testimonial`

Reusable social proof content.

Suggested Sanity fields:

- `quote`: testimonial body.
- `authorName`: fictional author display name.
- `authorImage`: reusable `imageWithAlt` object.
- `authorRole`: short display context.
- `relatedPet`: optional reference to `pet`.
- `relatedOwner`: optional reference to `owner`.
- `rating`: numeric or display rating.
- `tone`: tone selector for frontend styling.
- `featured`: toggle for curated testimonial lists.

Notes:

- Testimonials can appear on the homepage, pet pages, owner pages, pricing page, process page, and other marketing sections.
- Do not build a standalone testimonials page in the first pass unless the site direction changes.
- Keep them fictional and satirical, but formatted like believable customer proof.

Revalidation:

- Any page or document where the testimonial is featured
- Testimonial cache tag

### `formDefinition`

Reusable form configuration for demo forms.

Suggested Sanity fields:

- `title`: editor-facing and user-facing form title.
- `slug`: stable form identifier.
- `description`: form intro copy.
- `successMessage`: reusable `formSuccessState` object.
- `fields`: array of reusable `formField` objects.
- `submitLabel`: button label.
- `formType`: selector for frontend handling, such as contact, owner contact, warranty, or submit pet.

Likely forms:

- Contact us
- Contact an owner
- Warranty claim
- Submit a pet

Notes:

- The site can include silly form framing, such as a pet warranty form or owner contact form.
- Form submissions can be mocked or handled by a lightweight route later. Avoid paid form services unless the project direction changes.
- Phase one forms should submit by email to a single master project email address through Mailgun rather than individual owners.
- The master form destination should come from the server-only `CONTACT_TO_EMAIL` environment variable, not from CMS-authored `siteSettings.contactEmail`.
- Form failures should support friendly, satirical error copy, such as "The dog ate the email."

Revalidation:

- Pages that render the form
- Form cache tag

## Required Field Defaults

Use these as starting rules for Sanity validation. If a rule makes editing awkward during implementation, revise it with a clear reason.

Singletons:

- `siteSettings`: require title, description, default SEO, primary navigation, footer navigation, and public contact email.
- `homePage`: require SEO, at least one hero slide, and at least one CTA or featured content section.
- `petIndexPage`: require SEO, hero, filter intro, and empty-state copy.
- `systemPage`: require page type, headline, message, SEO, and primary CTA. Default SEO `noIndex` to true.

Marketing pages:

- Require title, slug, SEO, hero, and at least one section.
- Require slugs to be unique among marketing pages.
- Keep `showContactForm` optional and false by default.

Owners:

- Require name, slug, portrait with alt text, tagline, and bio.
- Keep testimonial and contact CTA optional.
- Prefer inverse pet queries over required manual pet references.

Pets:

- Require name, slug, pet type, owner, listing headline, listing summary, availability status, hero image or gallery, and SEO.
- Require `submissionStatus` and `source`.
- Require structured category fields used for filtering and display.
- Keep videos, testimonials, warnings, care notes, and borrow terms optional.

Pet types:

- Require name, slug, plural name, filter label, sort order, and icon selector.
- Keep SEO optional while pet type landing pages are out of scope.

Testimonials:

- Require quote and author name.
- Keep author image, rating, pet reference, and owner reference optional.

Forms:

- Require title, slug, form type, submit label, success message, and at least one field.
- Require each field to have a stable name, label, type, and required flag.

Reusable objects:

- Require alt text for meaningful images in `imageWithAlt`.
- Require provider, URL, and title for `videoEmbed`.
- Require labels for links and CTAs.
- Require title and message/body fields for alerts, warnings, callouts, and accordion items.

## Validation Rules

Use typical Sanity validation rules to protect the public site and keep editor mistakes easy to catch.

- Slugs should be required, URL-safe, and unique within their document type.
- Marketing page slugs should reject reserved route segments such as `pets`, `owners`, `preview`, `studio`, `api`, `_next`, and any future top-level route names.
- Singleton documents should be enforced through Studio structure and validation helpers where practical.
- Meaningful images should require alt text; decorative images should be explicitly marked or handled by the frontend.
- Internal references should only allow the intended target document types.
- Pet documents should require an owner and pet type.
- Public pet queries should exclude rejected, archived, pending, and unpublished content unless draft preview is active.
- Form field names should be stable machine-readable identifiers.
- Email fields should validate email-like input at the form-handler boundary as well as in any CMS-authored form definitions.
- External URLs should validate as URLs and should expose an editor-controlled new-tab option.
- Arrays used for repeatable page sections should set reasonable minimums where a page would otherwise render empty.
- Date or availability fields should validate obvious ordering mistakes where possible.
- Numeric order fields should be optional only when the frontend can fall back to a stable sort.

## Singleton ID Strategy

Use explicit Sanity document IDs for singleton documents so Studio structure, queries, preview links, revalidation handlers, and seed scripts all target the same records.

Starting singleton IDs:

- `siteSettings`
- `homePage`
- `petIndexPage`
- `systemPage-notFound`
- `systemPage-serverError`
- `systemPage-genericError`

Do not derive singleton IDs from slugs or titles. Studio structure should expose these as direct edit entries, and seed scripts should create or patch these exact IDs rather than creating duplicates.

## Reusable Objects

These are embedded schema objects reused across documents.

Reusable objects are the main way the CMS demonstrates flexibility. They should be Sanity-authored content structures rendered by reusable React components, not hardcoded one-off page fields.

Sanity supports organizing these object schemas in the codebase. We can group files by folder, such as `sanity/schemaTypes/objects/pet/`, `sanity/schemaTypes/objects/page/`, `sanity/schemaTypes/objects/forms/`, and `sanity/schemaTypes/objects/shared/`, then export them into the Studio schema. In the Studio UI, object types appear where they are used as fields or array members rather than as top-level document lists.

Initial schema work should prioritize the reusable objects needed by the first build. Planned objects can stay documented, but every implemented object needs a Sanity schema, editor preview, query shape, and frontend renderer.

Early implementation objects:

- `imageWithAlt`
- `gallery`
- `videoEmbed`
- `portableText`
- `seo`
- `link`
- `cta`
- `ctaGroup`
- `navigationItem`
- `hero`
- `heroSlide`
- `sectionHeader`
- `contentSection`
- `calloutBlock`
- `alertBlock`
- `warningBlock`
- `statBlock`
- `testimonialBlock`
- `featureList`
- `accordion`
- `accordionItem`
- `pricingTier`
- `pricingFeature`
- `processStep`
- `petTrait`
- `petStat`
- `availabilityWindow`
- `borrowTerm`
- `careNote`
- `petWarning`
- `formField`
- `formOption`
- `formSuccessState`

Planned objects:

- `badge`
- `iconLabel`
- `themeTone`
- `socialLink`
- `breadcrumbItem`
- `featureItem`
- `toggleGroup`
- `toggleOption`
- `listBlock`
- `listItem`
- `timeline`
- `timelineItem`
- `petTypeSelector`
- `petFact`
- `petFilterOption`
- `petCategoryValue`
- `petTypeBadge`
- `petTypeRule`
- `ownerSummary`
- `formDisclaimer`
- `modalConfig`

### Shared Content And Media

- `imageWithAlt`: image, alt text, caption, focal metadata.
- `gallery`: images, layout hint, caption.
- `videoEmbed`: provider, URL, title, transcript or description.
- `portableText`: rich text content with supported marks, inline links, lists, and simple headings. Keep complex layout, media, alerts, warnings, and callouts as separate reusable section objects.
- `seo`: meta title, meta description, open graph image, no-index toggle.
- `badge`: label, tone, optional icon.
- `iconLabel`: icon name, label, value, accessible label.
- `themeTone`: reusable tone selector for section styling.

### Shared Navigation And Links

- `link`: internal reference, external URL, label, open-in-new-tab option.
- `cta`: label, link, style, optional icon.
- `ctaGroup`: primary CTA, secondary CTA, alignment.
- `navigationItem`: label, link, children.
- `socialLink`: platform, URL, label.
- `breadcrumbItem`: label, link.

### Page Sections

- `hero`: eyebrow, headline, body, image, CTA group.
- `heroSlide`: headline, body, image, CTA, optional featured pet or owner reference.
- `sectionHeader`: eyebrow, headline, body, alignment.
- `calloutBlock`: headline, body, icon, CTA, tone.
- `alertBlock`: title, message, tone, optional CTA.
- `warningBlock`: title, message, severity, optional icon.
- `statBlock`: value, label, description, icon.
- `testimonialBlock`: selected testimonials, layout hint.
- `featureList`: heading, items, icon style.
- `featureItem`: title, description, icon, optional link.
- `accordion`: heading, items.
- `accordionItem`: title, body.
- `toggleGroup`: title, options, default option.
- `toggleOption`: label, value, content.
- `listBlock`: heading, list style, items.
- `listItem`: label, body, icon.
- `pricingTier`: name, price, billing note, features, CTA, highlighted flag.
- `pricingFeature`: label, included flag, note.
- `processStep`: title, description, icon, order, optional CTA.
- `contentSection`: heading, body, media, CTA group, layout hint.
- `timeline`: heading, items.
- `timelineItem`: date or label, title, description, icon.

### Pet-Specific Objects

- `petTypeSelector`: reference or selector metadata for a `petType` document.
- `petTrait`: label, value, icon, tone.
- `petStat`: label, value, description, icon.
- `availabilityWindow`: start date, end date, note, status.
- `borrowTerm`: title, description, icon.
- `careNote`: title, description, severity.
- `petWarning`: title, description, severity, icon.
- `petFact`: label, value, icon, display priority.
- `petFilterOption`: label, value, description.
- `petCategoryValue`: category type, label, value, icon, tone, sort order.
- `petTypeBadge`: pet type label, icon, tone, optional reference to `petType`.
- `petTypeRule`: type-specific display rule or fallback copy.
- `ownerSummary`: selected owner fields for embedded owner blocks when a direct reference projection is not enough.

### Forms

- `formField`: label, name, type, required flag, help text, options.
- `formOption`: label, value.
- `formSuccessState`: headline, message, CTA.
- `formDisclaimer`: short legal, comedic, or trust text.
- `modalConfig`: title, description, size, close label.

## Page Concepts

### Home Page

Purpose:

- Introduce the joke quickly.
- Demonstrate rich, animated, Sanity-driven homepage content.
- Drive users to pet listings and process/pricing pages.

Likely sections:

- Animated hero carousel with multiple satirical banners.
- Process summary.
- Featured pet carousel.
- Testimonials or social proof.
- Stats block.
- Final CTA.

Hero carousel notes:

- Background fades in.
- Pet image pops in.
- Text enters after media.
- CTA enters last.
- Carousel advances to the next Sanity-authored slide.
- Motion must respect reduced-motion preferences.

### About Page

Purpose:

- Explain the fictional company history and mission.
- Provide room for stats, timeline, and satire.

Likely sections:

- Hero.
- Company origin story.
- Timeline or history block.
- Stats.
- Testimonials.
- CTA.

### Process Page

Purpose:

- Explain the fake borrowing/lending process.

Example steps:

- Submit a pet.
- Wait for a deeply questionable approval process.
- Browse available pets.
- Contact the owner.
- Pick up the pet within seven days.
- Return the pet with the same number of legs and opinions.

Likely sections:

- Hero.
- Process steps.
- FAQ accordion.
- Warning or alert block.
- CTA.

### Pricing Page

Purpose:

- Demonstrate pricing-tier content and satirical product packaging.

Likely sections:

- Hero.
- Pricing tiers.
- Feature comparison.
- FAQ accordion.
- Testimonials.
- CTA.

### Pet Index Page

Purpose:

- Show available pets in a marketplace-style listing.

Likely sections:

- Hero.
- Filters or category chips.
- Pet cards.
- Featured owners or testimonials.
- CTA.

### Pet Detail Page

Purpose:

- Show the strongest relationship between Sanity content and frontend layout.

Likely sections:

- Image-forward hero area.
- Right-side "About this pet" panel with icon facts.
- Description.
- Embedded video section for playful pet media when available.
- Traits and stats.
- Care notes, warnings, and borrowing terms.
- Owner information block.
- Testimonials or related pets.
- Contact owner drawer CTA.

### Owner Detail Pages

Purpose:

- Demonstrate references and relationship-driven content.
- Provide owner context from a pet listing or direct owner URL without creating a browsable owner directory.

Owner detail pages should show:

- Owner profile.
- Bio and location.
- Pets owned by that owner.
- Testimonials or funny trust indicators.
- Contact CTA.

Navigation notes:

- Do not add a public owner index page.
- Owner pages should be linked from pet cards, pet detail pages, and owner references where contextually useful.

### Contact Or Warranty Page

Purpose:

- Demonstrate forms.

Possible framing:

- Contact us.
- Pet warranty claim.
- Report a suspiciously charming borrower.
- Ask whether your pet qualifies for temporary relocation.

Form behavior:

- Forms should send email to a single master project email address through Mailgun in phase one.
- Owner contact should use a drawer UI rather than a centered modal or dedicated route.
- Contact owner drawers should preserve pet page context while giving the form enough room on desktop and mobile.
- Form success and error states should be CMS-authored where practical.
- Error states can use satirical copy, such as "The dog ate the email."

### System Pages

Purpose:

- Provide custom user-facing pages for static system states such as 404, 500, generic errors, maintenance, and preview errors.

Content goals:

- Clearly identify the issue with a visible status label where useful.
- Use satirical pet-related copy without hiding what went wrong.
- Offer at least one practical recovery CTA, usually home, pet listings, or contact.
- Keep these pages responsive, accessible, and friendly rather than technical.
- Use no-index SEO defaults so search engines do not index error states.

Examples:

- 404 headline: "This pet has slipped its collar."
- 404 message: "The page you are looking for wandered out through a side gate. It may come back when snacks are involved."
- 500 headline: "Something chewed through the server cable."
- 500 message: "The site hit a problem while fetching the good stuff. Try again in a moment or head back to the available pets."

Implementation note:

- CMS-authored system page copy should be used when available, but every error boundary must have static fallback copy in code.

## Relationships

- `owner` owns many `pet` documents, but owner discovery should happen through pet-related surfaces rather than a public owner directory.
- A `pet` document acts as its own public listing in phase one. Do not create a separate `listing` document unless requirements become more complex later.
- `pet` references one primary `owner`.
- `pet.submittedBy` references the submitting `owner`; for normal submissions this should match `pet.owner`.
- Users should not be able to submit pets on behalf of other owners.
- `pet` references one primary `petType`.
- `petType` can be referenced by many `pet` documents.
- `testimonial` may reference a `pet`, an `owner`, both, or neither.
- `homePage` references featured pets, featured owners, and testimonials.
- `marketingPage` can reference testimonials, CTAs, process steps, pricing tiers, and reusable sections.
- `formDefinition` can be referenced by marketing pages and pet contact CTAs.

Implementation note:

- Prefer one canonical relationship direction in the schema, then query the inverse when needed. For example, if `pet.owner` is canonical, owner pages can query pets where `owner._ref == $ownerId`.

## Studio Organization

Use Sanity's common structure-builder approach to present the Studio around editor tasks rather than exposing every schema type as a flat list.

Recommended desk groups:

- Settings
  - Site settings singleton
- Pages
  - Home page singleton
  - Pet index page singleton
  - System pages
  - Marketing pages
- Marketplace
  - Pets
  - Owners
  - Pet types
- Reusable Content
  - Testimonials
- Forms
  - Form definitions

Studio notes:

- Singletons should appear as direct edit entries, not as document lists where editors can create duplicates.
- Object schemas should remain organized in code folders, but they should appear in the Studio only where used as fields or array members.
- Pet, owner, and pet type documents should remain top-level editable content because they are core marketplace entities.
- Marketing page sections should be editor-friendly, with previews that show the section type, title/headline, and key media or reference where practical.
- Keep desk structure customizations light. Avoid making a complex custom Studio before the content model proves it needs one.

## Seed Content Plan

Seed data is expected to change as the site is properly written and designed, but early seed content should make the demo usable immediately.

Initial seed content:

- Site settings with navigation, footer links, default SEO, and public contact email. Server-side form delivery still uses `CONTACT_TO_EMAIL`.
- Home page with multiple hero carousel slides, a process summary, featured pets, testimonials, stats, and CTA content.
- Pet index page with hero copy, filter intro, empty-state copy, featured pets, and a CTA.
- System pages for not found, server error, and generic error states with clear recovery CTAs.
- Marketing pages for About, Process, Pricing, and Contact.
- Starter `petType` documents from the approved real pet type list.
- Example owners with portraits, bios, locations, and satirical trust details.
- Example pets connected to owners and pet types, with listing copy, one- or two-paragraph detail descriptions, structured category fields, galleries, warnings, care notes, borrow terms, and optional videos.
- Testimonials connected to pets, owners, or general site sections.
- Form definitions for contact, owner contact, and warranty-style contact.

Seed constraints:

- Keep seed content fictional.
- Lean into parody-friendly pop-culture pet archetypes where useful, such as a tiny white rabbit with a medieval danger rating or a cute creature with strict after-midnight care rules, without recreating official copyrighted imagery or implying endorsement.
- Avoid implying real animal harm.
- Generate basic pet images during the seed operation from each pet's structured details and longer description when practical.
- Store generated image metadata, alt text, and attribution/provenance notes with the seeded content or project attribution records as appropriate.
- Prefer broad coverage of content blocks over final polished copy in the first seed pass.
- Revisit seed data after the visual design and page sections are implemented.

## Preview Requirements

- Preview links should originate from Sanity Studio only.
- Draft preview should support every content-backed route.
- Unpublished drafts should be previewable before a public slug exists.
- Preview mode should show a visible banner with an exit preview button.
- Preview helpers should stay separate from normal published-content queries.

Preview path ideas:

- Published or slugged pet: `/pets/[slug]`
- Unpublished pet without slug: `/preview/pet/[documentId]`
- Published or slugged owner: `/owners/[slug]`
- Unpublished owner without slug: `/preview/owner/[documentId]`
- Published or slugged marketing page: `/${slug}`
- Unpublished marketing page without slug: `/preview/page/[documentId]`
- Home page singleton: `/preview/home`
- Pet index singleton: `/preview/pets`
- System page singleton: `/preview/system/[pageType]`
- Site settings: preview through the affected page route rather than a dedicated settings route.

## Revalidation Strategy

Exact path and tag names should be finalized when schemas and routes are implemented, but the first pass should use a predictable mapping from document type to affected routes.

Starting direction:

- `siteSettings`: revalidate global layout/header/footer tags, `/`, `/pets`, and all known marketing routes.
- `homePage`: revalidate `/` and the home page cache tag.
- `petIndexPage`: revalidate `/pets` and the pet index cache tag.
- `systemPage`: revalidate the affected system page cache tag. Do not let CMS fetch failures prevent hardcoded error-page fallbacks from rendering.
- `marketingPage`: revalidate `/${slug}` and the marketing page cache tag.
- `pet`: revalidate `/pets`, `/pets/[slug]`, related owner page, home page if featured, and pet cache tags.
- `petType`: revalidate `/pets`, pet pages using that type, home page if type data appears in featured sections, and pet type cache tags.
- `owner`: revalidate `/owners/[slug]`, related pet pages, home page if featured, and owner cache tags.
- `testimonial`: revalidate any page or document route where the testimonial is featured.
- `formDefinition`: revalidate pages where the form appears.

Suggested cache tags:

- `site-settings`
- `home-page`
- `pet-index`
- `system-page:${pageType}`
- `marketing-page:${slug}`
- `pet:${slug}`
- `owner:${slug}`
- `pet-type:${slug}`
- `testimonial:${id}`
- `form:${slug}`

Prefer path or tag revalidation over full-site revalidation once the relationships are known.

## Open Questions

- None currently. Reopen this section as new content model decisions come up.
