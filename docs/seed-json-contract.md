# Seed JSON Contract

This document defines the saved JSON shape for Pet Share demo seed data. It should be used before scaffolding so Sanity schemas, seed scripts, generated media workflows, GROQ queries, and frontend types all share the same assumptions.

The seed JSON files are the durable source of truth for demo content. Normal seed runs should replay these files into Sanity rather than regenerating content or media.

## Goals

- Define stable seed file shapes before implementation.
- Keep relationships deterministic without relying on Sanity `_id` values for ordinary documents.
- Make generated media reviewable, repeatable, and attributable.
- Keep future video generation prompts available without generating video binaries in phase one.
- Make the seed data easy to validate before it is written to Sanity.

## File Layout

```text
sanity/
  seed/
    data/
      testimonials.json
      forms.json
      pages.json
    media/
      pets/
        pet-sir-nibbles/
          images/
          videos/
      owners/
      pages/
    generated/        # Gitignored review workspace; mirrors media/
```

**Pet types, owners, and pets are not stored as JSON files.** They are generated programmatically inside `scripts/seed-sanity.mjs` (`petTypeCategories`, `ownerSeeds`, and `buildPets()`/`petNameSeeds`) rather than loaded from disk. The shape references below for pet types, owners, and pets still describe the object shape the script must produce — they're just no longer file contracts, since there's no JSON file to load. `testimonials.json`, `forms.json`, and `pages.json` remain real files loaded by `loadSeedData()`.

## ID Strategy

Use `seedId` for deterministic references inside JSON. For ordinary Sanity documents, `seedId` should be stored as a field such as `seedKey` or another implementation-approved source key, while Sanity can generate the actual `_id`.

Singletons are the exception. They should use explicit Sanity document IDs because Studio structure, preview routes, and seed scripts need stable direct targets.

Explicit singleton IDs:

- `siteSettings`
- `homePage`
- `petIndexPage`
- `systemPage-notFound`
- `systemPage-serverError`
- `systemPage-genericError`

Reference rule:

- JSON files reference other seed records by `seedId`.
- The seed script resolves `seedId` to the created or existing Sanity document `_id`.
- Relationship patches use resolved Sanity `_id` values after dependencies are created.
- In Studio, the stored source key should be hidden or read-only. Editors should not need to manage seed identity during normal content editing.

## Shared Types

### `slug`

```json
{
  "current": "sir-nibbles"
}
```

### `seo`

```json
{
  "title": "Sir Nibbles | Pet Share",
  "description": "Borrow a tiny rabbit with large opinions and a suspiciously medieval warning label.",
  "openGraphImageAssetKey": "pet-sir-nibbles-og",
  "noIndex": false
}
```

### `imageRef`

Image references point to media through `assetKey`. The matching approved file is discovered by convention under `sanity/seed/media/` (see "Media discovery" below); there is no separate manifest file tracking generation status or Sanity upload state.

During Milestone 1, manifest entries may use `status: "planned"` before the actual local image files exist. Final seed replay should use approved local media files under `sanity/seed/media/`.

```json
{
  "assetKey": "pet-sir-nibbles-card-01",
  "alt": "Sir Nibbles sitting in a sunny room with a politely alarming expression.",
  "caption": "Small, soft, and statistically overconfident.",
  "role": "card"
}
```

### `plannedVideo`

Video prompts are stored now, but video files are not generated in phase one.

```json
{
  "id": "pet-sir-nibbles-card-loop",
  "status": "planned",
  "placement": "petCard",
  "sourceImageAssetKey": "pet-sir-nibbles-card-01",
  "fallbackImageAssetKey": "pet-sir-nibbles-card-01",
  "motionPrompt": "A very subtle low-frame-rate loop where the rabbit blinks once and the nearby warning tag shifts slightly in soft daylight.",
  "negativePrompt": "No violence, no fear, no sharp teeth, no dark horror tone, no official movie likeness.",
  "durationSeconds": 3,
  "aspectRatio": "1:1",
  "resolution": "1024x1024",
  "loop": true
}
```

## Pet type object shape (generated in `scripts/seed-sanity.mjs`)

Per-item shape (one entry per `petTypeCategories` array item):

```json
{
  "version": 1,
  "items": [
    {
      "seedId": "petType-rabbit",
      "type": "petType",
      "name": "Rabbit",
      "slug": { "current": "rabbit" },
      "pluralName": "Rabbits",
      "filterLabel": "Rabbit",
      "category": "commonHouseholdPets",
      "icon": "rabbit",
      "customIconAssetKey": "petType-rabbit-icon",
      "summary": "Compact, judgmental, and faster than your lease agreement.",
      "sortOrder": 30,
      "featured": true
    }
  ]
}
```

Notes:

- `category` should use a controlled value from the content model grouping.
- `icon` should prefer a Lucide-compatible icon name for app UI fallbacks and editor-friendly selection.
- `customIconAssetKey` should reference a project-owned SVG icon for the seeded pet type. These SVGs should visually match Lucide's outline style.

## Owner object shape (generated in `scripts/seed-sanity.mjs`)

Per-item shape (one entry per `ownerSeeds` array item):

```json
{
  "version": 1,
  "items": [
    {
      "seedId": "owner-brother-maynard",
      "type": "owner",
      "name": "Brother Maynard",
      "slug": { "current": "brother-maynard" },
      "portrait": {
        "assetKey": "owner-brother-maynard-portrait",
        "alt": "A medieval-adjacent caretaker holding a clipboard and looking concerned.",
        "role": "ownerPortrait"
      },
      "tagline": "Caretaker of small problems with large warning labels.",
      "bio": [
        {
          "_type": "block",
          "style": "normal",
          "children": [
            {
              "_type": "span",
              "text": "Brother Maynard filled out this profile at 11:42 p.m. after deciding the pet situation had become more of a community opportunity."
            }
          ]
        }
      ],
      "location": "Hamilton, ON",
      "memberSince": "2020-04-18",
      "testimonialSeedId": null,
      "seo": {
        "title": "Brother Maynard | Pet Share",
        "description": "Meet the caretaker behind one of Pet Share's most compact liabilities.",
        "openGraphImageAssetKey": "owner-brother-maynard-portrait",
        "noIndex": false
      }
    }
  ]
}
```

## Pet object shape (generated in `scripts/seed-sanity.mjs`)

Per-item shape (curated `petNameSeeds` entries plus procedurally generated overflow up to the target pet count):

```json
{
  "version": 1,
  "items": [
    {
      "seedId": "pet-sir-nibbles",
      "type": "pet",
      "name": "Sir Nibbles",
      "slug": { "current": "sir-nibbles" },
      "petTypeSeedId": "petType-rabbit",
      "breed": "Holland Lop",
      "ageYears": 3,
      "ownerSeedId": "owner-brother-maynard",
      "submittedByOwnerSeedId": "owner-brother-maynard",
      "submissionStatus": "approved",
      "source": "userSubmitted",
      "listingHeadline": "Small rabbit. Large waiver.",
      "listingSummary": "Brother Mynrd here: Sir Nibbles is tiny, white, smug, swift, soft, & weirdly keen on cords.",
      "availabilityStatus": "available",
      "distanceKilometers": 2.8,
      "listingPlan": "spotlight",
      "hostPayoutAmount": 28,
      "hostPayoutCurrency": "CAD",
      "hostPayoutUnit": "day",
      "temperament": "regal",
      "pickupUrgency": "withinSevenDays",
      "cuddlePolicy": "consentRequired",
      "messRisk": 2.5,
      "chaosLevel": 4.5,
      "energyLevel": 3,
      "imageTargetCount": 8,
      "mediaPrompt": {
        "basePrompt": "A Holland Lop rabbit with suspiciously regal confidence, accurate lop ears and compact rabbit proportions, bright friendly modern marketplace photography, airy pastel interior, soft daylight, playful satirical danger cues, not scary, not violent.",
        "globalNegativePrompt": "No blood, no weapons, no fear, no animal distress, no official movie stills, no exact copyrighted character likeness.",
        "imagePrompts": [
          {
            "assetKey": "pet-sir-nibbles-card-01",
            "role": "card",
            "shotPrompt": "Front-facing seated portrait, full body visible, clean background, strong eye contact, centered composition."
          },
          {
            "assetKey": "pet-sir-nibbles-gallery-01",
            "role": "gallery",
            "shotPrompt": "Three-quarter angle on a rounded sofa, one slipper nearby, cozy home setting, playful expression."
          }
        ],
        "plannedVideos": [
          {
            "id": "pet-sir-nibbles-card-loop",
            "status": "planned",
            "placement": "petCard",
            "sourceImageAssetKey": "pet-sir-nibbles-card-01",
            "fallbackImageAssetKey": "pet-sir-nibbles-card-01",
            "motionPrompt": "A subtle loop where the rabbit blinks once and the nearby warning tag shifts slightly.",
            "negativePrompt": "No violence, no horror tone, no official movie likeness.",
            "durationSeconds": 3,
            "aspectRatio": "1:1",
            "resolution": "1024x1024",
            "loop": true
          }
        ]
      },
      "cardMedia": {
        "image": {
          "assetKey": "pet-sir-nibbles-card-01",
          "alt": "Sir Nibbles sitting in a sunny room with a politely alarming expression.",
          "role": "card"
        },
        "plannedVideoId": "pet-sir-nibbles-card-loop"
      },
      "heroImages": [
        {
          "assetKey": "pet-sir-nibbles-gallery-01",
          "alt": "Sir Nibbles on a rounded sofa beside one unattended slipper.",
          "role": "gallery"
        }
      ],
      "description": [
        {
          "_type": "block",
          "style": "normal",
          "children": [
            {
              "_type": "span",
              "text": "Brother Mynrd here: Sir Nibbles is tiny, white, smug, swift, soft, & weirdly keen on cords."
            }
          ]
        },
        {
          "_type": "block",
          "style": "normal",
          "children": [
            {
              "_type": "span",
              "text": "Translation from the office: he chewed the A key, then sat beside the keyboard with the calm confidence of a rabbit who had improved the document. Please borrow him before the next warning label has to be handwritten."
            }
          ]
        }
      ],
      "personalityTraits": [
        { "label": "Regal", "value": "regal", "icon": "crown", "tone": "friendly" },
        { "label": "Suspicious", "value": "suspicious", "icon": "eye", "tone": "warning" }
      ],
      "vibeProfile": [
        { "label": "Charming", "descriptor": "Disarmingly so", "strength": 4.5, "tone": "coral", "icon": "sparkles" },
        { "label": "Rule-bound", "descriptor": "The card is the law", "strength": 5, "tone": "blue", "icon": "listChecks" }
      ],
      "fitGuidance": {
        "goodFitTitle": "A great fit if you",
        "goodFitItems": [
          { "text": "Like quiet companionship and specific instructions." },
          { "text": "Can follow feeding rules without improvising." }
        ],
        "avoidTitle": "Maybe avoid if you",
        "avoidItems": [
          { "text": "Treat printed pet rules as casual suggestions." },
          { "text": "Need instant affection from every animal you meet." }
        ]
      },
      "dailySchedule": [
        { "timeLabel": "07:30", "title": "Snack window opens", "description": "Read the card first. The card outranks optimism.", "tone": "mint" },
        { "timeLabel": "22:00", "title": "Pantry inspection", "description": "Final check of the cupboards and your resolve.", "tone": "cream" }
      ],
      "videos": [
        {
          "provider": "youtube",
          "url": "https://example.com/pip-blinks-once",
          "title": "Pip blinks once",
          "description": "A gentle three-second loop for the detail page.",
          "posterImage": {
            "assetKey": "pet-sir-nibbles-gallery-01",
            "alt": "Sir Nibbles pausing mid-judgment on a sofa.",
            "role": "videoPoster"
          }
        }
      ],
      "careNotes": [
        {
          "title": "Compliments before breakfast",
          "description": "Begin the morning with one sincere compliment and one neutral vegetable.",
          "severity": "low"
        }
      ],
      "borrowTerms": [
        {
          "title": "Return with the same number of opinions",
          "description": "Additional opinions may incur a processing fee and one stern follow-up note.",
          "icon": "clipboardCheck"
        }
      ],
      "warnings": [
        {
          "title": "Do not underestimate due to size",
          "description": "Several slippers have made this mistake.",
          "severity": "medium",
          "icon": "triangleAlert"
        }
      ],
      "testimonialSeedId": "testimonial-sir-nibbles-neighbor",
      "contactOwnerCta": {
        "label": "Ask about this pet",
        "link": { "type": "action", "action": "openOwnerContactDrawer" },
        "style": "primary",
        "icon": "send"
      },
      "seo": {
        "title": "Sir Nibbles | Pet Share",
        "description": "Borrow a tiny rabbit with large opinions and a suspiciously medieval warning label.",
        "openGraphImageAssetKey": "pet-sir-nibbles-card-01",
        "noIndex": false
      }
    }
  ]
}
```

Rules:

- `imageTargetCount` must be between `5` and `10`.
- Every `imagePrompts[]` item should have a unique `assetKey` and `shotPrompt`.
- `ownerSeedId` and `submittedByOwnerSeedId` should match in phase one.
- `vibeProfile[]`, when present, should preserve authored order.
- `fitGuidance`, when present, should contain at least one valid item on each rendered side.
- `dailySchedule[]`, when present, should stay in authored chronological order.
- `videos[]`, when present, should be authored as detail-page media and should not be auto-derived from `cardMedia` loop data.
- Public queries should only show approved/published pets outside preview mode.

## `testimonials.json`

```json
{
  "version": 1,
  "items": [
    {
      "seedId": "testimonial-sir-nibbles-neighbor",
      "type": "testimonial",
      "quote": "A very quiet visitor, except for the part where everyone in the room began negotiating with a rabbit.",
      "authorName": "Gwen From Next Door",
      "authorRole": "Temporary host with surviving slippers",
      "authorImage": null,
      "relatedPetSeedId": "pet-sir-nibbles",
      "relatedOwnerSeedId": "owner-brother-maynard",
      "rating": 4.5,
      "tone": "playful",
      "featured": true
    }
  ]
}
```

## `forms.json`

```json
{
  "version": 1,
  "items": [
    {
      "seedId": "form-owner-contact",
      "type": "formDefinition",
      "title": "Ask About This Pet",
      "slug": { "current": "owner-contact" },
      "description": "Tell us why you are prepared for this very specific responsibility.",
      "formType": "ownerContact",
      "submitLabel": "Send request",
      "successMessage": {
        "headline": "Request sent",
        "message": "Your message made it through the chew-proof tunnel.",
        "cta": null
      },
      "fields": [
        {
          "name": "name",
          "label": "Your name",
          "type": "text",
          "required": true,
          "helpText": null,
          "options": []
        },
        {
          "name": "email",
          "label": "Email",
          "type": "email",
          "required": true,
          "helpText": "We will only use this to reply about your pet inquiry.",
          "options": []
        },
        {
          "name": "message",
          "label": "Message",
          "type": "textarea",
          "required": true,
          "helpText": "Mention any relevant slipper insurance.",
          "options": []
        }
      ]
    }
  ]
}
```

## `pages.json`

Use `pages.json` for singletons and marketing pages so the page-builder seed shape is easy to review in one file. Page section arrays should use Sanity-like objects with stable `_key` values once schemas exist. This keeps seeded page-builder content close to Sanity's stored shape and reduces translation work in seed scripts.

```json
{
  "version": 1,
  "singletons": {
    "siteSettings": {
      "sanityId": "siteSettings",
      "type": "siteSettings",
      "title": "Pet Share",
      "description": "A satirical pet-sharing marketplace for people who need a very temporary break.",
      "defaultSeo": {
        "title": "Pet Share",
        "description": "Temporary pets, questionable peace of mind.",
        "openGraphImageAssetKey": "page-default-og",
        "noIndex": false
      },
      "primaryNavigation": [
        { "label": "Pets", "link": { "type": "internalPath", "path": "/pets" } },
        { "label": "How It Works", "link": { "type": "internalPath", "path": "/how-it-works" } },
        { "label": "Pricing", "link": { "type": "internalPath", "path": "/pricing" } }
      ],
      "footerNavigation": [],
      "contactEmail": "hello@petshare.dev"
    },
    "homePage": {
      "sanityId": "homePage",
      "type": "homePage",
      "seo": {
        "title": "Pet Share | Temporary Pets",
        "description": "A bright, friendly, deeply unserious marketplace for temporary pet relief.",
        "openGraphImageAssetKey": "home-og",
        "noIndex": false
      },
      "heroCarousel": [
        {
          "_type": "heroSlide",
          "headline": "Has your dog thrown up in the bed recently?",
          "body": "Lend him out for a couple days. Someone else deserves character development.",
          "imageAssetKey": "home-hero-dog-01",
          "cta": { "label": "Find a temporary pet", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" }
        }
      ],
      "featuredPetSeedIds": ["pet-sir-nibbles"],
      "featuredOwnerSeedIds": ["owner-brother-maynard"],
      "testimonialSeedIds": ["testimonial-sir-nibbles-neighbor"],
      "contentSections": []
    },
    "petIndexPage": {
      "sanityId": "petIndexPage",
      "type": "petIndexPage",
      "seo": {
        "title": "Available Pets | Pet Share",
        "description": "Find temporary companions with permanent opinions.",
        "openGraphImageAssetKey": "pet-index-og",
        "noIndex": false
      },
      "hero": {
        "_type": "hero",
        "headline": "Find pets near you.",
        "body": "Find a temporary roommate with strong opinions.",
        "imageAssetKey": "pet-index-hero",
        "ctaGroup": {
          "primary": { "label": "Find a temporary pet", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" },
          "secondary": null
        }
      },
      "filterIntro": "Narrow the field by species, mess risk, cuddle policy, and other warning signs.",
      "emptyState": {
        "_type": "calloutBlock",
        "headline": "No pets match those filters.",
        "body": "They may be hiding.",
        "tone": "playful"
      },
      "featuredPetSeedIds": ["pet-sir-nibbles"],
      "contentSections": []
    },
    "systemPageNotFound": {
      "sanityId": "systemPage-notFound",
      "type": "systemPage",
      "pageType": "notFound",
      "seo": {
        "title": "Page Not Found | Pet Share",
        "description": "The requested Pet Share page could not be found.",
        "openGraphImageAssetKey": "system-not-found-og",
        "noIndex": true
      },
      "eyebrow": "404",
      "headline": "This pet has slipped its collar.",
      "message": "The page you are looking for wandered off before we could attach the tiny bell. Try the pet listings or head home.",
      "imageAssetKey": "system-not-found",
      "primaryCta": { "label": "Find a temporary pet", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" },
      "secondaryCta": { "label": "Go home", "link": { "type": "internalPath", "path": "/" }, "style": "secondary" },
      "supportCopy": null,
      "contentSections": []
    },
    "systemPageServerError": {
      "sanityId": "systemPage-serverError",
      "type": "systemPage",
      "pageType": "serverError",
      "seo": {
        "title": "Server Error | Pet Share",
        "description": "Pet Share hit a temporary problem.",
        "openGraphImageAssetKey": "system-server-error-og",
        "noIndex": true
      },
      "eyebrow": "500",
      "headline": "Something chewed through the server cable.",
      "message": "Pet Share hit a problem while fetching the good stuff. Try again in a moment or check the listings that are behaving for now.",
      "imageAssetKey": "system-server-error",
      "primaryCta": { "label": "Try the pet listings", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" },
      "secondaryCta": { "label": "Go home", "link": { "type": "internalPath", "path": "/" }, "style": "secondary" },
      "supportCopy": "If this keeps happening, the master inbox can receive a polite report.",
      "contentSections": []
    },
    "systemPageGenericError": {
      "sanityId": "systemPage-genericError",
      "type": "systemPage",
      "pageType": "genericError",
      "seo": {
        "title": "Something Went Wrong | Pet Share",
        "description": "Pet Share hit a temporary problem.",
        "openGraphImageAssetKey": "system-generic-error-og",
        "noIndex": true
      },
      "eyebrow": "Error",
      "headline": "The pets knocked something over.",
      "message": "Something went wrong, but the site is still trying to look innocent. Try again or head back to the pet listings.",
      "imageAssetKey": "system-generic-error",
      "primaryCta": { "label": "Find a temporary pet", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" },
      "secondaryCta": { "label": "Go home", "link": { "type": "internalPath", "path": "/" }, "style": "secondary" },
      "supportCopy": null,
      "contentSections": []
    }
  },
  "marketingPages": [
    {
      "seedId": "marketingPage-process",
      "type": "marketingPage",
      "title": "Process",
      "slug": { "current": "process" },
      "summary": "How temporary pet relief becomes somebody else's short-term problem.",
      "seo": {
        "title": "Process | Pet Share",
        "description": "Learn how Pet Share's temporary pet stay process works.",
        "openGraphImageAssetKey": "process-og",
        "noIndex": false
      },
      "hero": {
        "_type": "hero",
        "headline": "A simple process with several disclaimers.",
        "body": "Submit interest, await owner approval, and pick up the pet within seven days.",
        "imageAssetKey": "process-hero",
        "ctaGroup": null
      },
      "sections": [
        {
          "_key": "process-step-choose-a-pet",
          "_type": "processStep",
          "title": "Choose a pet",
          "description": "Find the listing that best matches your tolerance for noise, fur, and eye contact.",
          "icon": "search",
          "order": 1
        }
      ],
      "primaryCta": {
        "label": "Find a temporary pet",
        "link": { "type": "internalPath", "path": "/pets" },
        "style": "primary"
      },
      "showContactForm": false
    }
  ]
}
```

## Media discovery (no manifest file)

There is no `media-manifest.json` file. `scripts/seed-sanity.mjs`'s `discoverApprovedMediaAssets()` finds approved media by scanning the `sanity/seed/media/` directory tree directly and deriving the `assetKey` from the folder/file naming convention:

- `pets/<pet-slug>/images/<file>` → `pet-<pet-slug>-image-<file>`
- `owners/<owner-slug>/images/portrait.*` → `owner-<owner-slug>-portrait`
- `pages/home/images/<file>` → `home-<file>`
- `pages/<page-seed-id>/images/hero.*` → `<page-seed-id>-hero`

Only files present under `sanity/seed/media/` (not `sanity/seed/generated/`) are treated as approved and uploaded. There is no separate approval/attribution ledger — moving a reviewed file from `sanity/seed/generated/` into `sanity/seed/media/` at the conventional path *is* the approval step.

## Validation Before Seeding

Before writing to Sanity:

- Every `seedId` is unique within its file.
- Every reference by `seedId` resolves.
- Every singleton has the expected explicit `sanityId`.
- Every pet uses a numeric whole-year `ageYears` value, not an exact `dateOfBirth` or prose age string.
- Every pet has `imageTargetCount` between `5` and `10`.
- Every image reference has a matching approved file under `sanity/seed/media/` at the conventional path (see "Media discovery" above).
- Every meaningful image has alt text.
- Every planned video has a fallback image.
- Every marketing page slug avoids reserved route segments.
- Every public pet has `submissionStatus: "approved"`.
- No generated review files from `sanity/seed/generated/` are referenced as approved `localPath` values.

## Open Questions

- None currently. Reopen this section as the seed scripts and Sanity schemas are implemented.
