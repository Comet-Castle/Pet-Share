# Pet Detail Page Spec

Status:

- Approved design-direction spec for the flat-HTML pet detail prototype.
- Source prototype: `docs/in-progress/pet-detail/pet-detail.html`
- Intended retrofit target: `app/(site)/pets/[slug]/page.tsx` and related pet-detail components.

This document defines the approved structure, behaviors, enhancements, and retrofit
expectations for the Pet Share pet detail page. It is the implementation-facing spec for
moving the flat-HTML prototype into the Next.js app.

Primary prototype file:

- `docs/in-progress/pet-detail/pet-detail.html`

Sample content source:

- `sanity/seed/data/pets.json` (`Pip After Midnight`)
- `sanity/seed/data/owners.json` (`Dana Muffins`)

## Product Intent

The pet detail page should:

- Present one pet as a polished, image-forward marketplace listing.
- Make the pet feel specific, funny, and borrowable without obscuring useful facts.
- Support the primary action of contacting the owner through Pet Share.
- Reuse the Pet Share visual system and existing component patterns.
- Leave room for richer editorial modules without making the page feel bloated.

## In Scope

- One public pet detail experience for `/pets/[slug]`.
- Desktop and mobile responsive behavior.
- The approved seven enhancements listed below.
- A retrofit path that maps cleanly to the current Next.js + Sanity architecture.

## Out Of Scope

- Favorites or saved listings.
- Direct messaging or inbox features.
- Public owner directory browsing.
- Checkout or payment flows.
- Complex social sharing integrations beyond simple copy-link behavior.

## Canonical Page Structure

The page should render in this order:

1. Site shell header
2. Back link and status row
3. Hero gallery and sticky about panel
4. Key fact grid
5. Optional video section
6. About/description section
7. Vibe profile
8. Good fit / Maybe avoid
9. Care notes / Borrow terms / Warnings
10. A day with the pet timeline
11. Owner summary
12. Related pets
13. Site shell footer
14. Mobile sticky contact bar on small screens only

## Core Interaction Model

Primary user actions:

- Review pet photos and structured facts.
- Jump between major sections on longer pages.
- Open the contact owner drawer.
- Visit the owner block or owner page from pet context.
- Copy a link to the current listing.
- Browse related pets.

## Scope

Approved direction includes all seven enhancement ideas shown in the prototype:

1. Contact owner drawer
2. Vibe profile
3. Good fit / Maybe avoid
4. A day with Pip timeline
5. Owner trust strip
6. Mobile sticky contact bar
7. Contextual share / copy link

The flat HTML also includes a few light refinement passes to make review easier without
changing the intended architecture.

## Prototype Refinements

These are small UX/content polish items, not major new features:

### 1. Gallery photo-count chip

A compact chip in the gallery header shows the current image index, such as `1 of 4`.

Intended behavior:

- Updates when gallery arrows, dots, thumbnails, or swipe gestures change the image.
- Stays visually lightweight and glassy.
- Can be omitted in production if the image set is only one item.

### 2. Quick-jump pills in the about panel

Small anchor pills link to:

- `Facts`
- `About`
- `Care`
- `Owner`

Intended behavior:

- Helpful on long pet pages, especially mobile.
- Should remain optional and simple.
- Should use in-page anchors or scroll helpers, not a secondary sticky nav.

### 3. “Why Pip is listed” callout

A short, owner-voice callout inside the About section explains the immediate comedic reason
for the listing.

Intended behavior:

- Reads like compact marketplace context, not a large new section.
- Can be derived from the listing summary temporarily, or become its own authored field later.

## Enhancement Behavior Spec

## 1. Contact Owner Drawer

Status:

- Approved.
- Already mocked in `pet-detail.html`.
- Also aligns with `docs/page-blueprints.md` section 9.

Purpose:

- Keep the user on the pet page while opening a contact form.
- Make the primary CTA feel marketplace-like and contextual.

Trigger points:

- Main CTA in the about panel.
- CTA in the owner block.
- CTA in the mobile sticky bar.

CTA copy direction:

- Primary action should read as `Borrow this pet` or an equivalent direct borrowing CTA.
- Avoid overly pet-specific joke phrasing for the main action label when a clearer marketplace action is available.

Desktop behavior:

- Opens as a right-side drawer.
- Page context remains visible behind a scrim.

Mobile behavior:

- Full-height or near-full-height panel from the bottom/right.
- Large close control.
- Inputs remain easy to reach and scroll.

Accessibility:

- `role="dialog"`
- `aria-modal="true"`
- Focus moves into the drawer when opened.
- Focus is trapped while open.
- `Escape` closes the drawer.
- Focus returns to the trigger on close.

Submission behavior:

- Reuse the contact/warranty form approach where practical.
- Hidden/server-side context should include:
  - pet id
  - pet name
  - owner id
  - owner name
  - current URL
- Preferred pickup window should use the same visual control family as the pet-index dropdown/select surfaces.
- Success copy direction:
  - `Your request made it through the chew-proof tunnel.`
- Error copy direction:
  - `The dog ate the email. Please try again.`

Retrofit recommendation:

- Build as a reusable client component, likely:
  - `components/features/pets/owner-contact-drawer.tsx`
- Use a shared form model or shared submission utility with contact/warranty flows.

Data/CMS impact:

- Current CTA label can come from `pet.contactOwnerCta`.
- Form structure should likely reuse an existing shared model.
- No new visual CMS fields required for the drawer shell itself.

## 2. Vibe Profile

Status:

- Approved.
- Should move from prototype-only editorial shorthand to a clearly CMS-powered module.

Purpose:

- Give the pet more personality without turning the facts grid into a joke wall.
- Add one more highly scannable module on detail pages.

Content shape:

- trait label
- short descriptor
- strength value
- optional icon or tone

Prototype examples:

- Charming
- Rule-bound
- Snack discipline
- Shelf supervision

Fact-grid household impact treatment:

- Chaos, Mess risk, and Energy should use the same emoji-row language approved on the pet index.
- Approved emoji set:
  - Chaos: `😈`
  - Mess risk: `💩`
  - Energy: `⚡`
- Do not use the older segmented-bar treatment on detail if index uses emoji rows.

Behavior:

- Should render as a compact grid or list of meters.
- Should remain secondary to the fact grid.
- Should never replace the structured pet facts.

Accessibility:

- Every meter needs visible text and a text equivalent.
- For household impact in the fact grid, keep visible labels plus a text equivalent such as `Chaos level 4.5 out of 5`.
- Do not rely only on bar length, color, or repeated emoji.

Retrofit recommendation:

- Server component output is fine unless animated.
- Could become a small reusable component such as:
  - `components/features/pets/pet-vibe-profile.tsx`

Data/CMS impact:

Current model gap:

- `personalityTraits` exists, but it is better suited to chips than to authored strength-based vibe rows.

Recommended schema direction:

Add a dedicated authored array on `pet`, such as `vibeProfile`, with items shaped like:

| Field | Type | Notes |
| --- | --- | --- |
| `label` | string | Visible trait name, such as `Charming` or `Rule-bound`. |
| `descriptor` | string | Short supporting phrase, such as `Disarmingly so`. |
| `strength` | number | `1` to `5`, half-steps allowed if desired. |
| `tone` | string | Optional display tone such as `coral`, `blue`, or `mint`. |
| `icon` | string | Optional icon name if the UI needs it later. |

Authoring rules:

- Keep this to roughly 2-4 items.
- Labels should stay short and scannable.
- Descriptors can be funny, but should still clarify behavior.
- This should be authored, not inferred, once implemented.

Recommended approach:

- Do not derive this long-term.
- Add a dedicated schema object so editors control both wording and strength.

## 3. Good Fit / Maybe Avoid

Status:

- Approved.
- Should be treated as a CMS-powered editorial block rather than a derived rules engine.

Purpose:

- Helps the user decide quickly whether the pet fits their household.
- Turns the satire into useful browseability.

Content shape:

- Two side-by-side lists on desktop.
- One list for good-fit conditions.
- One list for avoid/mismatch conditions.

Behavior:

- Keep lists short, ideally 3-5 bullets each.
- Must remain readable on mobile.
- The “avoid” side should stay playful, not alarmist.

Accessibility:

- Use visible text labels.
- Avoid relying on icon color alone for meaning.

Retrofit recommendation:

- Reusable editorial block or pet-detail-only component.
- Likely:
  - `components/features/pets/pet-fit-guidance.tsx`

Data/CMS impact:

Current model gap:

- No direct fields exist for this block.

Recommended schema direction:

Add a reusable object or paired arrays on `pet`, with a preference for one grouped object such as `fitGuidance`:

| Field | Type | Notes |
| --- | --- | --- |
| `goodFitTitle` | string | Optional override, defaulting to `A great fit if you`. |
| `goodFitItems` | array of strings or objects | 3-5 concise bullets. |
| `avoidTitle` | string | Optional override, defaulting to `Maybe avoid if you`. |
| `avoidItems` | array of strings or objects | 3-5 concise bullets. |

Authoring rules:

- Keep items behavior-based, not demographic.
- Make them useful to a borrower, not just funny.
- Let the humor live in phrasing, not in vagueness.

Recommended approach:

- Do not derive this from structured fields except as temporary planning copy.
- Make it explicitly authored in Sanity.

## CMS plan for care notes, borrow terms, and warnings

Status:

- Existing arrays already exist in the model.
- They should be treated as intentional CMS-powered modules, not just leftover supporting fields.

Purpose:

- Give editors a reliable way to author practical constraints, handoff rules, and caution notes.
- Support both useful borrower guidance and Pet Share voice.

Current model coverage:

- `careNotes[]`
- `borrowTerms[]`
- `warnings[]`

Recommended editorial split:

| Module | What it should answer | Tone |
| --- | --- | --- |
| Care notes | How do I look after this pet day to day? | Mostly practical with a little personality. |
| Borrow terms | What rules come with the handoff? | Practical, policy-like, lightly silly. |
| Warnings | What can go wrong or what should I not underestimate? | Clear, playful, not alarming. |

Recommended field refinements:

| Array | Current shape | Recommended refinement |
| --- | --- | --- |
| `careNotes[]` | title, description, severity | Keep as-is, optionally add `icon`. |
| `borrowTerms[]` | title, description, icon | Keep as-is, optionally add `severity` or `priority` only if needed for ordering/emphasis. |
| `warnings[]` | title, description, severity, icon | Keep as-is. |

Authoring guidance:

- Keep cards short enough to scan in one pass.
- Prefer one idea per card.
- Use severity sparingly; not every note needs to feel urgent.
- Do not bury core operational rules inside joke copy.

Implementation note:

- These can stay as three separate arrays in Sanity.
- The frontend should render each group as a distinct section with shared card styling.
- If we later need richer control, add optional section intros or group headings before changing the card objects.

## 4. A Day With Pip Timeline

Status:

- Approved.

Purpose:

- Adds a very Pet Share-specific care rhythm block.
- Makes the listing feel lived-in and specific.

Behavior:

- Simple card grid or timeline.
- Time-first structure.
- Omit entirely when no schedule exists.

Content examples:

- `07:30 — Snack window opens.`
- `00:00 — Snack window closes.`

Accessibility:

- Use a real ordered list or semantic list structure.
- Time labels must remain text, not purely decorative badges.

Retrofit recommendation:

- Reusable detail-page component:
  - `components/features/pets/pet-day-timeline.tsx`

Data/CMS impact:

Current model gap:

- No dedicated schedule/timeline field exists.

Recommended schema direction:

Add a dedicated `dailySchedule[]` array on `pet`.

Recommended item shape:

| Field | Type | Notes |
| --- | --- | --- |
| `timeLabel` | string | Required visible time, such as `07:30` or `After sunset`. |
| `title` | string | Short event title. |
| `description` | text | One concise sentence or two short sentences. |
| `tone` | string | Optional display tone if the UI needs visual variation. |

Authoring rules:

- Keep entries in chronological order.
- Usually 3-6 items.
- Use this only when the pet genuinely benefits from a schedule-like story.
- Omit the whole section when no schedule exists.

Recommended approach:

- Treat this as a pet-specific authored array, not a generic page-builder timeline.
- Seeders should preserve the authored order exactly.

## 5. Owner Trust Strip

Status:

- Approved.

Purpose:

- Gives the owner block a little more marketplace confidence.
- Adds scannable trust signals without overbuilding a profile system.

Prototype examples:

- Verified owner
- Replies within a day
- Sharing since 2021

Behavior:

- Compact 2-3 item strip.
- Best near the hero/about panel or in the owner block.
- Should remain subtle and secondary.

Accessibility:

- Each item needs a visible label.
- Icons are supportive only.

Retrofit recommendation:

- Keep as a small presentational component.
- Could be built inline first, then extracted if reused.

Data/CMS impact:

Partially available now:

- `owner.memberSince`
- `owner.location`

Current model gap:

- No `verified` or `replyTime` fields yet.

Recommended approach:

- Use `memberSince` immediately.
- Keep `verified` and `reply time` as hardcoded demo/trust signals only if acceptable.
- Otherwise add optional owner fields later.

## 6. Mobile Sticky Contact Bar

Status:

- Approved.

Purpose:

- Preserve the primary CTA on small screens.
- Keep the price and status visible while scrolling.

Behavior:

- Mobile only.
- Fixed to the bottom.
- Shows price plus the main CTA.
- Should not cover important footer or form content.

Accessibility:

- Button label must remain explicit.
- CTA should open the same drawer as other contact triggers.

Retrofit recommendation:

- Small client component or inline route-level mobile-only block.
- Must coexist cleanly with safe-area insets.

Data/CMS impact:

- No content model changes required.
- Price/status fields already exist or can be derived from the pet.

## 7. Contextual Share / Copy Link

Status:

- Approved.

Purpose:

- Gives users a practical utility without introducing social features.
- Works well in demos and reviews.

Behavior:

- Small button in the status row.
- Copies the current page URL.
- Temporary confirmation state such as `Copied!`

Accessibility:

- Clear label.
- Works with keyboard.
- Confirmation text should not be color-only feedback.

Retrofit recommendation:

- Very small client-side enhancement.
- Good candidate to stay local to the route component.

Data/CMS impact:

- None.

## Structured Fact Value Guidance

The fact grid and about-panel summary should use tighter, more realistic public values for:

- age
- breed
- temperament
- availability
- pickup urgency
- cuddle policy

### Age and breed rules

- `age` should display as a plain, realistic value derived from `ageYears` or `dateOfBirth`, such as `2 years old` or `8 months old`.
- Do not use joke copy as the age value itself.
- `breed` should stay a real breed, species, or variety label such as `Domestic Shorthair`, `Holland Lop`, or `Bearded dragon`.
- Satire belongs in the headline, summary, warnings, and care notes rather than the breed field.

### Canonical label chart

| Field | Stored value | Public label | Guidance |
| --- | --- | --- | --- |
| Availability | `available` | Available | Realistic and straightforward. |
| Availability | `temporarilyUnavailable` | Taking a nap | Silly label is acceptable, but only if the pet is genuinely not currently available. |
| Availability | `pendingPickup` | Pending pickup | Practical marketplace wording. |
| Availability | `retired` | Retired | Use only when the listing remains visible for archival or demo reasons. |
| Pickup urgency | `anytime` | Anytime | Broad availability window; realistic default. |
| Pickup urgency | `withinSevenDays` | Within seven days | Clear and believable for normal listings. |
| Pickup urgency | `immediately` | Immediately if possible | Use for urgent owner relief situations only. |
| Pickup urgency | `appointmentOnly` | By appointment only | Good for pets with stricter handoff needs. |
| Temperament | `friendly` | Friendly | Straightforward and realistic. |
| Temperament | `independent` | Independent | Realistic, useful, and slightly dry. |
| Temperament | `suspicious` | Suspicious | Silly but believable for Pet Share. |
| Temperament | `dramatic` | Dramatic | Silly but believable for Pet Share. |
| Temperament | `regal` | Regal | Silly but believable for Pet Share. |
| Cuddle policy | `openEnrollment` | Open enrollment | Intentionally silly; use for very sociable pets. |
| Cuddle policy | `consentRequired` | Consent required | Best default for cats, rabbits, and pets with boundaries. |
| Cuddle policy | `afterSnacksOnly` | After snacks only | Good humorous option when food motivation is part of the pet's personality. |
| Cuddle policy | `lookDoNotCuddle` | Look, do not cuddle | Use for fish, reptiles, birds, or pets that should not be handled casually. |

### Recommended tone split

Use these as guardrails:

- `availability` and `pickup urgency` should stay mostly realistic and operational.
- `temperament` and `cuddle policy` can carry more of the Pet Share joke voice.
- Even the silly values should still help a user understand what interacting with the pet would feel like.

## Schema And Validation Decisions To Finalize

Use these as the intended implementation defaults unless schema work finds a stronger reason to change them.

| Area | Decision |
| --- | --- |
| `vibeProfile[].strength` | Number from `1` to `5`, half-steps allowed. |
| `vibeProfile[].tone` | Controlled UI tone value. Allowed starter set: `coral`, `blue`, `mint`, `cream`. Use for editorial styling, not warning semantics. |
| `vibeProfile[].icon` | Controlled icon-name string if exposed at all; avoid unconstrained arbitrary values. |
| `fitGuidance.goodFitItems[]` / `avoidItems[]` | Prefer object items with at least `text`, not bare strings, so future tone/emphasis can be added without a breaking shape change. |
| `dailySchedule[].tone` | Optional controlled UI tone value. Allowed starter set: `coral`, `mint`, `cream`, `blue`. Treat as decorative/editorial, not as safety severity. |
| `careNotes[].icon` | Optional future addition only; do not require it initially. |
| `borrowTerms[].priority` | Do not add initially. Preserve authored array order unless a stronger ranking need appears. |
| `videos[]` provider policy | Allow only the same provider set already supported by `videoEmbed`; do not introduce a detail-page-only provider model. |

## Tone Semantics

Lock these semantic tone rules for pet-detail planning:

| Surface | Preferred tone semantics |
| --- | --- |
| Care notes | `mint` / green |
| Borrow terms | `mint` / green |
| Warnings | `coral` / orange |
| Fit guidance: good fit | `mint` / green |
| Fit guidance: maybe avoid | `coral` / orange |
| Vibe profile | optional controlled tones for editorial contrast; not semantic warning states |
| Daily schedule | optional controlled tones for editorial contrast; not semantic warning states |
| Blue / cream | neutral/supporting/editorial only |

Use this rule of thumb:

- `mint` means safe, practical, supportive, or approved.
- `coral` means caution, mismatch, warning, or extra attention.
- `blue` and `cream` are non-semantic supporting tones.

## Query Coverage Required For Pet Detail

When the detail implementation moves forward, the detail query should explicitly cover these groups:

| Module | Required fields |
| --- | --- |
| Fact grid | `breed`, `ageYears`, `dateOfBirth`, `availabilityStatus`, `temperament`, `pickupUrgency`, `cuddlePolicy`, `chaosLevel`, `messRisk`, `energyLevel` |
| Vibe profile | `vibeProfile[]` |
| Fit guidance | `fitGuidance` |
| Care cluster | `careNotes[]`, `borrowTerms[]`, `warnings[]` |
| Timeline | `dailySchedule[]` |
| Video section | `videos[]` |
| Card/listing media | `cardMedia.image`, `cardMedia.lowFrameRateVideo` |
| Hero gallery | `heroImages[]` |
| CTA surfaces | `contactOwnerCta`, `owner.contactCta` |

## Fallback And Rendering Rules

Use these defaults so the route behaves predictably with partial data:

| Module | Fallback rule |
| --- | --- |
| `vibeProfile[]` | Omit the section when fewer than 1 valid items exist. |
| `fitGuidance` | Omit the whole section unless each side has at least 1 valid item. |
| `careNotes[]`, `borrowTerms[]`, `warnings[]` | Omit empty groups individually; do not render empty headings. |
| `dailySchedule[]` | Omit the section when empty or when items lack `timeLabel`. |
| `videos[]` | Render the first usable detail-page video item first. If more than one exists, either show a simple list/selector later or render only the first in the initial pass. |
| video poster | If no poster is present, use a safe branded fallback surface rather than auto-reusing unrelated gallery media unless explicitly approved. |
| `cardMedia.lowFrameRateVideo` | Never auto-promote into the dedicated detail-page video section. |

## Detail Video Policy

- Prefer poster-first, click-to-play behavior.
- Do not autoplay with sound.
- If autoplay is ever used, it must be muted and clearly justified.
- Reuse the shared `videoEmbed` model rather than creating a detail-only media shape.
- If captions/transcripts are supported by the provider/model, include them or provide equivalent descriptive copy nearby.
- The section should remain optional and absent by default.

## Care Cluster Editorial Rules

Use these authoring defaults:

| Group | Ideal count | Ordering rule | Severity guidance |
| --- | --- | --- | --- |
| Care notes | 1-4 | Most practically important first | Use severity only when emphasis helps. |
| Borrow terms | 1-4 | Most binding handoff rule first | Prefer order over added priority fields. |
| Warnings | 1-4 | Most consequential or surprising first | Use severity sparingly and consistently. |

## Query And Implementation Catch-Up Notes

The current codebase is expected to lag behind this plan until implementation begins.

Known catch-up work to account for:

- `PET_BY_SLUG_QUERY` and `PET_BY_ID_QUERY` do not yet fetch `vibeProfile`, `fitGuidance`, or `dailySchedule`.
- Pet-detail rendering should be updated only after those query additions and schema changes are in place.
- Pet-index filter/query logic still contains `cuddlePolicy` handling in code; that is intentional transitional mismatch until browse cleanup is implemented.
- When implementation starts, update query code, loader code, generated types, and route/component usage together so docs and runtime behavior converge in one pass.

## Sanity Authoring Expectations

Use these defaults when the Studio experience is implemented:

| Area | Expectation |
| --- | --- |
| Pet document grouping | Keep `vibeProfile`, `fitGuidance`, `dailySchedule`, `videos`, and the care cluster in clearly labeled editorial groups below the core listing fields. |
| Default collapsed sections | Collapse optional editorial groups by default; keep core listing fields and structured facts expanded. |
| Editor descriptions | Add help text explaining when to use `vibeProfile`, when to omit `dailySchedule`, and that detail-page `videos[]` are different from card-loop media. |
| Array limits | Guide editors toward the preferred counts documented in the Sanity plan, even if hard validation remains soft. |
| Object previews | Use meaningful previews for each new object so arrays are scannable in Studio. |

See also:

- `docs/in-progress/pet-detail/pet-detail-sanity-plan.md`

## Seed Runner Update Checklist

When implementation starts, the seed runner should be updated in this order:

1. Parse new pet fields: `vibeProfile`, `fitGuidance`, `dailySchedule`.
2. Preserve authored order for `vibeProfile[]`, `dailySchedule[]`, `careNotes[]`, `borrowTerms[]`, and `warnings[]`.
3. Validate `vibeProfile[].strength` range and required labels/descriptors.
4. Validate `fitGuidance` item presence before writing grouped objects.
5. Validate `dailySchedule[].timeLabel` and omit/flag malformed items.
6. Keep `videos[]` separate from `cardMedia.lowFrameRateVideo`.
7. Fail loudly but specifically when new optional structures are malformed.
8. Preserve backwards compatibility by treating absent new fields as valid omission, not as seed failure.

## Index And Detail Field Alignment

The detail page should stay aligned with `/pets` on the shared marketplace fields.

| Field | Pet index usage | Pet detail usage | Alignment rule |
| --- | --- | --- | --- |
| `petType` / `filterLabel` | filter + card type label | type pill / context label | Same human-readable pet-type language. |
| `availabilityStatus` | visible filter + card/status label | status pill + fact grid | Same canonical label set. |
| `pickupUrgency` | visible filter | fact grid | Same canonical label set. |
| `chaosLevel` / `messRisk` / `energyLevel` | minimum filters using emoji rows | fact grid emoji meters | Same emoji set and text-equivalent rules. |
| `temperament` | card/supporting metadata only when used | fact grid | Same label set. |
| `cuddlePolicy` | hidden or removed from approved browse UI | fact grid | Keep canonical labels, but detail remains the primary visible surface. |
| `breed` | card sublabel | fact grid / about panel | Keep realistic plain-English breed naming. |

## Layout And Visual Rules

These should remain consistent with the approved prototype and current Pet Share visual system:

- Use the same wide route container direction as the pet index and homepage.
- Preserve visible edge whitespace on large screens.
- Use rounded surfaces and soft shadow groupings instead of hard borders.
- Keep the hero image-forward, with the about panel visually anchored on desktop.
- Keep long body copy on clean solid or near-solid surfaces, not busy glass.
- Use Quicksand for section/display moments and Nunito Sans for body/UI text.
- Keep the page bright, calm, and polished even when the copy gets more absurd.
- Let enhancement modules feel editorial and useful, not like unrelated feature boxes.

## Accessibility Expectations Across All Enhancements

These should remain true in the retrofit:

- Use semantic headings and list structures.
- Preserve visible focus states.
- Drawer focus must be managed correctly.
- Do not rely only on color or motion for meaning.
- Quick jumps should use real anchors or equivalent scroll targets.
- Reduced-motion behavior should remain aligned with `app/globals.css`.

## Responsive Expectations

- Hero stays image-first on desktop and stacks cleanly on mobile.
- Sticky mobile bar appears only on small screens.
- Quick-jump pills wrap naturally.
- Fit-guidance cards stack cleanly.
- Timeline cards should become a single readable column on narrow screens if needed.
- Drawer remains usable on mobile without clipping controls or submit actions.

## Data And CMS Impact Summary

### Can be built mostly from current data

- Contact owner drawer shell and CTA wiring
- Mobile sticky contact bar
- Contextual share / copy link
- Member-since portion of the owner trust strip
- Why listed callout, if temporarily derived from summary/description

### Likely needs authored fields or future schema decisions

- Vibe profile strength values
- Good fit / Maybe avoid lists
- Daily timeline / schedule
- Verified owner / response-time trust fields

## Acceptance Criteria

A retrofit should be considered directionally complete when:

- The page structure matches the canonical order in this spec.
- Desktop keeps a clear hero + about-panel relationship.
- Mobile stacks cleanly without overlap or blocked reading.
- The approved seven enhancements are either implemented or intentionally deferred with notes.
- The contact drawer is keyboard accessible and restores focus correctly.
- Every major enhancement has visible labels and clear text equivalents.
- The page remains coherent when optional sections are absent.
- Related pets remain secondary to the primary contact flow.
- The design still feels like Pet Share, not a separate microsite.

## Suggested Retrofit Order

### Pass 1: low-risk UI and route-level enhancements

- Share / copy link
- Mobile sticky contact bar
- Quick-jump pills
- Why listed callout
- Owner trust strip using currently available fields

### Pass 2: richer editorial modules

- Vibe profile
- Good fit / Maybe avoid
- A day with Pip timeline

### Pass 3: interactive form flow

- Contact owner drawer
- Shared form wiring
- Submission states and inbox integration

## Example Authoring Coverage

The planning set should support examples of:

- one pet with all optional editorial modules present
- one pet with no video and no schedule
- one pet with only care notes / warnings
- one pet with minimal authored enhancement content

This helps validate omission behavior before implementation.

## File And Component Mapping

Recommended retrofit mapping:

- Route shell:
  - `app/(site)/pets/[slug]/page.tsx`
- Existing reusable pieces:
  - `components/features/pets/pet-image-gallery.tsx`
  - `components/features/pets/pet-fact-grid.tsx`
  - `components/features/pets/rating-meter.tsx` or an updated emoji-based equivalent if the shared meter component is revised
  - `components/features/pets/pet-card.tsx`
  - `components/ui/button.tsx`
  - `components/layout/site-shell.tsx`
- Likely new pet-detail-focused components:
  - `components/features/pets/owner-contact-drawer.tsx`
  - `components/features/pets/pet-vibe-profile.tsx`
  - `components/features/pets/pet-fit-guidance.tsx`
  - `components/features/pets/pet-day-timeline.tsx`
  - `components/features/pets/pet-owner-trust-strip.tsx`
  - `components/features/pets/pet-share-link.tsx`
  - `components/features/pets/pet-mobile-contact-bar.tsx`

## Notes

- CSS placeholders are intentionally acceptable for the prototype and should not be treated as a blocker.
- The prototype is a design reference, not a production implementation.
- When retrofitting, prefer the existing Pet Share component patterns over introducing a parallel UI system.
