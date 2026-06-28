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
      petTypes.json
      owners.json
      pets.json
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
    media-manifest.json
```

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

Image references point to approved local media through `assetKey`. The matching file and Sanity upload state live in `media-manifest.json`.

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

## `petTypes.json`

Top-level shape:

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
      "customIconAssetKey": null,
      "summary": "Compact, judgmental, and faster than your lease agreement.",
      "sortOrder": 30,
      "featured": true
    }
  ]
}
```

Notes:

- `category` should use a controlled value from the content model grouping.
- `icon` should prefer a Lucide-compatible icon name when available.
- `customIconAssetKey` is only for project-owned SVG fallbacks.

## `owners.json`

Top-level shape:

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
        "alt": "A fictional medieval-adjacent caretaker holding a clipboard and looking concerned.",
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
              "text": "Brother Maynard has spent years cataloging tiny household risks, most of which fit in a picnic basket."
            }
          ]
        }
      ],
      "location": "A very drafty stone-adjacent townhouse",
      "ownerSince": "Several incidents ago",
      "testimonialSeedId": null,
      "seo": {
        "title": "Brother Maynard | Pet Share",
        "description": "Meet the fictional caretaker behind one of Pet Share's most compact liabilities.",
        "openGraphImageAssetKey": "owner-brother-maynard-portrait",
        "noIndex": false
      }
    }
  ]
}
```

## `pets.json`

Top-level shape:

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
      "breed": "Tiny white rabbit of disputed temperament",
      "age": "3 years, emotionally ancient",
      "ownerSeedId": "owner-brother-maynard",
      "submittedByOwnerSeedId": "owner-brother-maynard",
      "submissionStatus": "approved",
      "source": "demoSeed",
      "listingHeadline": "Small rabbit. Large waiver.",
      "listingSummary": "Ideal for borrowers who want a quiet weekend and have already made peace with their slippers.",
      "availabilityStatus": "available",
      "temperament": "regal",
      "pickupUrgency": "withinSevenDays",
      "cuddlePolicy": "consentRequired",
      "messRisk": 2.5,
      "chaosLevel": 4.5,
      "energyLevel": 3,
      "imageTargetCount": 8,
      "mediaPrompt": {
        "basePrompt": "A tiny white rabbit with suspiciously regal confidence, bright friendly modern marketplace photography, airy pastel interior, soft daylight, playful satirical danger cues, not scary, not violent.",
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
      "summary": "A compact guest with excellent posture and a strict interpretation of personal space.",
      "description": [
        {
          "_type": "block",
          "style": "normal",
          "children": [
            {
              "_type": "span",
              "text": "Sir Nibbles is a bright-eyed rabbit with soft fur, ceremonial confidence, and a surprising ability to make adults whisper near furniture."
            }
          ]
        }
      ],
      "personalityTraits": [
        { "label": "Regal", "value": "regal", "icon": "crown", "tone": "friendly" },
        { "label": "Suspicious", "value": "suspicious", "icon": "eye", "tone": "warning" }
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
          "description": "Additional opinions may incur a fictional processing fee.",
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
        "label": "Request temporary custody",
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
      "authorRole": "Borrower with surviving slippers",
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
      "title": "Request Temporary Custody",
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
          "helpText": "We will only use this to reply about your fictional pet inquiry.",
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
        "description": "Borrowable pets, questionable peace of mind.",
        "openGraphImageAssetKey": "page-default-og",
        "noIndex": false
      },
      "primaryNavigation": [
        { "label": "Pets", "link": { "type": "internalPath", "path": "/pets" } },
        { "label": "Process", "link": { "type": "internalPath", "path": "/process" } },
        { "label": "Pricing", "link": { "type": "internalPath", "path": "/pricing" } }
      ],
      "footerNavigation": [],
      "contactEmail": "hello@example.com"
    },
    "homePage": {
      "sanityId": "homePage",
      "type": "homePage",
      "seo": {
        "title": "Pet Share | Borrowable Pets",
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
          "cta": { "label": "Browse available chaos", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" }
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
        "description": "Browse temporary companions with permanent opinions.",
        "openGraphImageAssetKey": "pet-index-og",
        "noIndex": false
      },
      "hero": {
        "_type": "hero",
        "headline": "Browse available chaos.",
        "body": "Find a temporary roommate with strong opinions.",
        "imageAssetKey": "pet-index-hero",
        "ctaGroup": {
          "primary": { "label": "Start browsing", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" },
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
      "message": "The page you are looking for wandered off before we could attach the tiny bell. Try the available pets or head home.",
      "imageAssetKey": "system-not-found",
      "primaryCta": { "label": "Browse available pets", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" },
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
      "message": "Pet Share hit a problem while fetching the good stuff. Try again in a moment or browse pets that are behaving for now.",
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
      "message": "Something went wrong, but the site is still trying to look innocent. Try again or head back to the available pets.",
      "imageAssetKey": "system-generic-error",
      "primaryCta": { "label": "Browse pets", "link": { "type": "internalPath", "path": "/pets" }, "style": "primary" },
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
        "description": "Learn how Pet Share's fictional pet borrowing process works.",
        "openGraphImageAssetKey": "process-og",
        "noIndex": false
      },
      "hero": {
        "_type": "hero",
        "headline": "A simple process with several disclaimers.",
        "body": "Submit interest, await a highly fictional approval, and pick up the pet within seven days.",
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
        "label": "Browse pets",
        "link": { "type": "internalPath", "path": "/pets" },
        "style": "primary"
      },
      "showContactForm": false
    }
  ]
}
```

## `media-manifest.json`

The manifest maps approved local media files to seed records and, after upload, to Sanity asset IDs.

```json
{
  "version": 1,
  "generatedAt": "2026-06-27T00:00:00.000Z",
  "assets": [
    {
      "assetKey": "pet-sir-nibbles-card-01",
      "localPath": "sanity/seed/media/pets/pet-sir-nibbles/images/card-01.webp",
      "sourceGeneratedPath": "sanity/seed/generated/pets/pet-sir-nibbles/images/card-01.webp",
      "ownerType": "pet",
      "ownerSeedId": "pet-sir-nibbles",
      "ownerSlug": "sir-nibbles",
      "fieldPath": "cardMedia.image",
      "mediaRole": "card",
      "mimeType": "image/webp",
      "width": 1024,
      "height": 1024,
      "alt": "Sir Nibbles sitting in a sunny room with a politely alarming expression.",
      "caption": "Small, soft, and statistically overconfident.",
      "sanityAssetId": null,
      "sanityAssetRef": null,
      "status": "approved",
      "attribution": {
        "sourceType": "aiGenerated",
        "provider": "gemini",
        "model": "gemini-2.5-flash-image",
        "promptSummary": "Bright friendly marketplace pet portrait of a tiny white rabbit with playful danger cues.",
        "generatedAt": "2026-06-27T00:00:00.000Z",
        "reviewedBy": "project-owner",
        "usageNote": "Fictional AI-generated seed image for the Pet Share demo."
      }
    }
  ]
}
```

Rules:

- `assetKey` is the stable link between seed JSON and manifest entries.
- `localPath` must point to an approved committed file under `sanity/seed/media/`.
- `sourceGeneratedPath` is optional and must point only to the gitignored `sanity/seed/generated/` review workspace.
- `sanityAssetId` and `sanityAssetRef` are filled after upload.
- Only `approved` assets should be committed or uploaded.

## Validation Before Seeding

Before writing to Sanity:

- Every `seedId` is unique within its file.
- Every reference by `seedId` resolves.
- Every singleton has the expected explicit `sanityId`.
- Every pet has `imageTargetCount` between `5` and `10`.
- Every approved image reference has a matching `assetKey` in `media-manifest.json`.
- Every meaningful image has alt text.
- Every planned video has a fallback image.
- Every marketing page slug avoids reserved route segments.
- Every public pet has `submissionStatus: "approved"`.
- No generated review files from `sanity/seed/generated/` are referenced as approved `localPath` values.

## Open Questions

- None currently. Reopen this section as the seed scripts and Sanity schemas are implemented.
