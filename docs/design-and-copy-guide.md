# Design And Copy Guide

This guide defines the practical visual and writing direction for Pet Share. Use it when designing components, writing seed content, creating Sanity-authored sections, or reviewing whether a page feels on-brand.

The project brief stays high level. This document is the working reference for how the site should look, move, and sound.

## Visual References

Approved mockups live in `docs/design-references/`.

- `homepage-clean-marketplace-reference.png`: use as the primary homepage and marketing-page direction. Marketing pages should feel clean, bright, airy, and polished, with fewer competing modules and more white space.
- `catalog-browsing-reference.png`: use as the primary pet catalog/index direction. The catalog can be busier because filtering, sorting, and comparison benefit from a denser interface.
- `process-clean-spacious-reference.png`: use as the primary process page direction. Keep the page calm and spacious, with a clear text-first hero, restrained timeline/checklist sections, and generous separation between navigation, hero, and content.
- `pricing-clean-spacious-reference.png`: use as the primary pricing page direction. Keep the page centered, airy, and calm, with compact pricing tiers, a simple FAQ preview, and restrained CTA sections.
- `warranty-header-cards-reference.png` and `warranty-form-lower-reference.png`: use together as the warranty page direction. Use the second warranty reference for the header and the `Covered-ish`, `Not covered`, and `Please do not send` boxes; use the third warranty reference for the claim form and lower-page flow.

Generated mockups may include extra interface ideas that are not in scope. Do not implement favorites, saved items, messaging, account controls, notifications, or other unapproved features just because they appear in a reference image.

### How To Use These References

- Treat the PNGs as directional design targets, not exact production screenshots.
- Match the spacing, hierarchy, mood, and component relationships before matching small generated details.
- Keep marketing pages spacious and calm. Increase white space between navigation, hero/banner areas, and content sections.
- Let the catalog page stay denser than marketing pages because filtering, sorting, and browsing need more controls.
- Adapt layouts responsively instead of forcing desktop mockup proportions onto mobile.
- Replace generated placeholder copy, icons, and incidental UI with scoped project content and approved features.

## Brand Position

Pet Share should feel like a polished consumer marketplace built around an obviously ridiculous premise: lending out pets when their owners need a break.

The site should be:

- Bright, friendly, and modern.
- Satirical, but not cruel.
- Believable as a real marketplace at first glance.
- Silly in the copy, not sloppy in the interface.
- Built to demonstrate Sanity editorial flexibility and Next.js frontend polish.

## Visual Personality

The visual design should feel airy, rounded, and pet-forward.

Use:

- Generous white space.
- White space at the edges of the screen, with major page surfaces using rounded edges where the layout allows.
- Soft but confident color.
- Rounded typography.
- Friendly, frequent iconography.
- Glassmorphism treatments for selected surfaces, especially navigation, overlays, hero content panels, drawers, and featured cards.
- Clear section rhythm.
- Pet images as primary visual anchors.
- Subtle motion that makes the site feel alive.

Avoid:

- Dark, heavy, cynical, or overly dramatic presentation.
- Corporate SaaS density.
- Stock-photo blandness.
- Overly glossy gradients.
- Glass effects that reduce readability or contrast.
- Busy novelty styling that makes content hard to scan.
- Visual jokes that make the UI harder to use.

## Typography

Use Google Fonts unless a better free source is chosen later.

Primary font direction:

- `Nunito Sans`: default body, navigation, buttons, forms, cards, and utility UI.
- `Quicksand`: expressive headings, hero headlines, large section titles, and brand-forward display moments.

Typography rules:

- Keep body text comfortable and readable.
- Use rounded display type for warmth, not for every small label.
- Avoid negative letter spacing.
- Do not scale font size directly with viewport width.
- Keep button and card text sized to fit small screens without clipping.
- Use short headings when possible. Let supporting copy carry nuance.

## Logo Direction

Use a simple placeholder wordmark for now. The final logo is not approved yet.

Logo rules:

- Keep placeholder usage simple and easy to replace.
- Use the rounded typography direction from the site, with `Quicksand` preferred for the wordmark and `Nunito Sans` as fallback.
- Avoid investing implementation effort in detailed logo artwork until the brand direction is settled.
- When final logo work resumes, prefer SVG so the mark stays editable and crisp.
- Plan for at least two final variants: a colored logo and a black/white knockout logo.

## Color Direction

Use a bright matte palette. The colors should feel cheerful and modern without becoming neon or childish.

Recommended starting palette roles:

- Background: warm white or very pale mint.
- Primary: friendly teal or grass green.
- Secondary: sunny yellow or marigold.
- Accent: coral or soft raspberry.
- Support: sky blue or lavender, used sparingly.
- Text: warm charcoal, not pure black.
- Muted text: soft gray with accessible contrast.
- Warning: warm amber.
- Error: coral red.
- Success: fresh green.

Color rules:

- Maintain accessible text contrast.
- Do not let the UI become dominated by one color family.
- Use color to organize content and state, not just decoration.
- Warning and error colors should still fit the friendly brand, but they must remain clear.
- Validate the palette in real components before treating it as final.

## Layout Principles

The site should feel like a modern consumer marketplace, not a landing page template.

Use:

- Full-width sections with constrained inner content.
- A fairly wide site container around 1200px for core content, implemented with Tailwind max-width utilities or a project container config rather than Tailwind's smaller default container width.
- Responsive side padding outside the main container so wide pages still keep visible white space near the viewport edges.
- Page shells that leave visible breathing room near viewport edges on larger screens.
- Rounded main surfaces or section containers when the page benefits from a polished app-like frame.
- Clear responsive grids.
- Stable card dimensions where repeated content appears.
- Strong image aspect ratios for pets and galleries.
- Space between major sections so the page can breathe.
- Cards for repeated items such as pets, testimonials, pricing tiers, and form panels.

Avoid:

- Cards inside cards.
- Floating section wrappers where a full-width band is clearer.
- Desktop-only layouts.
- Fixed-width elements that cause horizontal overflow.
- Narrow default container choices that make listing pages, page-builder sections, or pet detail layouts feel cramped.
- Text overlapping images or controls.
- Edge framing that wastes too much space on mobile or makes content feel squeezed.

## Responsive Standards

Every public page and reusable component must work intentionally across mobile, tablet, laptop, and desktop viewports.

Responsive expectations:

- Navigation should collapse cleanly on small screens.
- Drawers and forms should be usable on mobile.
- Pet cards should remain scannable on narrow screens.
- Hero carousel content should not overlap pet imagery.
- Filters should wrap or collapse without clipping labels.
- Image galleries should maintain stable aspect ratios.
- CTAs should remain easy to tap.
- No horizontal overflow.

When browser testing is available, verify meaningful UI changes at representative mobile and desktop sizes before handoff.

## Motion And Animation

Motion should add liveliness without making the site feel chaotic.

Use:

- Soft entry animations for major sections.
- Slight hover movement on interactive cards.
- Gentle button hover effects, including a small playful twist where appropriate.
- Staggered hero carousel animation: background, pet image, text, CTA.
- Reduced-motion support for users who request it.

Avoid:

- Constant bouncing.
- Large rotations.
- Motion that delays basic reading or navigation.
- Animations that hide important content.
- Hover-only affordances for mobile users.

Suggested motion defaults:

- Entry duration: 180-350ms.
- Hero slide sequence: 400-700ms total per slide entrance.
- Hover duration: 120-180ms.
- Easing: smooth, friendly, and quick.

Implementation direction:

- Start with Tailwind utilities and small CSS animation definitions.
- Do not add Framer Motion on day one.
- Do not build a broad custom scroll-animation framework with Intersection Observer.
- If scroll-triggered entry animation, staggered choreography, or animation state becomes common enough that Tailwind/CSS feels awkward, add Framer Motion as the preferred animation library.

## Image Direction

Images should make the pet the first visual signal wherever possible.

Use:

- Clear, bright pet photography or generated pet imagery.
- AI-generated seed images for fictional pets when real images are not available.
- Realistic image crops that show the animal well.
- Playful but inspectable listing images.
- Consistent aspect ratios across cards.
- Meaningful alt text for content images.

Avoid:

- Dark, blurred, or atmospheric images.
- Crops where the pet is hard to identify.
- Generic stock images that do not support the joke.
- Images implying animal harm, neglect, distress, or danger.

## Icon Direction

Use free icons consistently. Lucide should be the preferred baseline for interface icons because its stroke style fits the clean, modern direction. React Icons remains acceptable if a needed icon is not available in Lucide.

Icon rules:

- Use icons heavily enough that pet types, pet facts, process steps, warnings, stats, filters, and CTAs feel visually scannable.
- Every seeded pet type should have an icon.
- Prefer Lucide icons where a matching icon exists.
- If a pet type needs a custom icon, generate or author an SVG that visually matches Lucide's outline style, stroke weight, rounded joins, and simple geometry.
- Keep custom SVG icons in the project so they can be versioned, reviewed, and reused consistently.
- Pair unfamiliar icons with text labels.
- Keep icon stroke/weight visually consistent.
- Do not rely on icon-only controls unless they have accessible labels and tooltips where helpful.

## Glassmorphism Rules

Glassmorphism can be a signature part of the Pet Share interface, but it should be applied deliberately.

Good uses:

- Sticky or floating navigation.
- Hero carousel copy panels.
- Pet fact panels.
- Drawers and overlays.
- Featured cards layered over colorful imagery.
- Status badges where contrast remains clear.

Implementation rules:

- Maintain readable contrast over all backgrounds.
- Use subtle blur and translucency rather than heavy frosted effects everywhere.
- Pair translucent surfaces with borders or shadows so edges remain visible.
- Provide solid fallbacks where backdrop blur is unsupported or visually weak.
- Do not place long body copy on busy glass backgrounds.

## Copy Voice

The voice should be friendly, specific, and confidently absurd.

Write like:

- A polished startup taking a bad idea very seriously.
- A marketplace that has invented process around nonsense.
- A customer service team that is oddly calm about pet chaos.

The humor should come from:

- Owner exhaustion.
- Pet inconvenience.
- Overly formal process language applied to silly situations.
- Believable marketplace patterns used for ridiculous content.
- Pop-culture pet references and archetypes used as parody or inspiration.

Avoid:

- Mean-spirited pet shaming.
- Animal harm or neglect.
- Gross-out copy that dominates the page.
- Jokes that require too much explanation.
- Copy that makes forms, errors, or navigation unclear.

## Copy Safety Boundaries

Pet Share can joke about pets being annoying, dramatic, messy, clingy, loud, judgmental, suspicious, or inconvenient.

Do not imply:

- Real animal abuse.
- Abandonment.
- Unsafe handling.
- Medical neglect.
- Pet theft.
- Dangerous borrowing arrangements.
- Harmful advice.

If a joke touches on safety, frame the UI as responsible and the copy as absurdly overprepared.

Pop-culture references are welcome when they support the satire, but use them carefully. Prefer parody, homage, or "inspired by" fictional listings over exact official reproductions. Avoid official logos, direct still recreations, or AI images that look like copyrighted production assets.

## Core Copy Patterns

Headlines:

- Short, direct, and joke-forward.
- Make the premise obvious quickly.
- Avoid vague marketing filler.

Examples:

- "Need a break from your tiny roommate?"
- "Borrow a pet. Return with stories."
- "For pets who need a second audience."
- "Has your dog ruined breakfast again?"
- "A suspiciously heroic rabbit with a spotless record and several unexplained helmets."
- "Adorable after midnight, provided everyone follows the care instructions exactly."

Supporting copy:

- Explain the fake service clearly enough that the demo feels coherent.
- Keep paragraphs short.
- Use specific pet behaviors rather than generic silliness.

CTA labels:

- "Browse pets"
- "Find a temporary roommate"
- "List your pet"
- "Borrow responsibly"
- "Start a warranty claim"
- "Contact the owner"
- "Meet the chaos"

Microcopy:

- "No refunds for emotional manipulation."
- "Pickup windows are approximate because pets cannot read calendars."
- "Some shedding may occur. Emotionally and physically."

## Page-Level Copy Guidance

### Home Page

The home page should establish the premise immediately.

Priorities:

- Big hero joke.
- Fast route to pet listings.
- Clear explanation of the fake process.
- Featured pet carousel.
- Testimonials or stats that sound like real marketplace proof.

Good direction:

- "Has your dog thrown up in the bed recently? Lend him out for a couple days."
- "Pet Share helps overwhelmed owners find temporary fans for pets with too much personality."

### Pet Index Page

The pet index should feel like a real listing marketplace with absurd filters and card copy.

Useful filters:

- Pet type.
- Chaos level.
- Mess risk.
- Energy level.
- Cuddle policy.
- Pickup urgency.
- Availability.

Card copy should be quick to scan and funny without hiding important information.

### Pet Detail Pages

Pet pages should make each pet feel specific.

Useful content:

- Hero gallery.
- About this pet panel.
- Personality traits.
- Care notes.
- Warnings.
- Borrowing terms.
- Owner block.
- Contact owner drawer.

Example detail copy:

- "Milo is available for short-term emotional negotiations and light couch occupation."
- "Requires three compliments before breakfast and one apology after dinner."
- "This small white rabbit appears harmless from a distance, which is exactly how he prefers to begin negotiations."
- "Pip is sweet, wide-eyed, and extremely clear about his snack schedule. The care sheet includes several rules that sound decorative until 12:01 a.m."

Detail descriptions should usually be longer than listing copy. Aim for one or two short paragraphs written in first person from the owner's perspective as the person trying to lend out the pet. Listing summaries should feel like compact excerpts of those descriptions, not unrelated taglines. They should describe the pet's personality, habits, borrowability, why the pet is being listed, and the specific comedic household problem. Keep breed/species detail in structured fields and media prompts instead of making it a default sentence in the description, unless it directly supports a joke. Vary the structure heavily between pets so the seed content does not feel templated; occasional pet-specific gimmicks are fine when they are readable and not overused. These descriptions should be rich enough to support both the page content and AI image generation during seeding.

### Owner Pages

Owner pages should provide context, but they should not become a public owner directory.

Tone:

- Lightly exhausted.
- Trustworthy enough for the fictional marketplace.
- Specific to the pets they own.

Example:

- "Dana has shared two pets, one couch, and several warnings about unattended muffins."

### Process Page

The process page should explain the fake workflow with too much confidence.

Possible steps:

- Submit your pet.
- Wait for a deeply questionable approval process.
- Browse available companions.
- Contact the owner.
- Pick up within seven days.
- Return the pet with the same number of legs and opinions.

### Pricing Page

Pricing should demonstrate reusable pricing content while leaning into the joke.

Possible tier names:

- "Just Visiting"
- "Weekend Problem"
- "Full Drama Trial"

Pricing copy should stay readable and structured like a normal pricing page.

### Contact Or Warranty Page

Forms should be clear first and silly second.

Useful framing:

- Contact us.
- Pet warranty claim.
- Report suspicious charm.
- Ask whether your pet qualifies.

Error example:

- "The dog ate the email. Please try again."

Success example:

- "Your message made it through the chew-proof tunnel."

### System And Error Pages

System pages should be funny, but clarity wins.

Required copy pattern:

- Status label when useful, such as `404` or `500`.
- Plain-language headline.
- One short explanation of what happened.
- One practical recovery action.

Tone rules:

- Use pet-related satire without making the user decode the actual problem.
- Do not blame the user.
- Do not expose technical details, stack traces, secrets, provider names, or raw API errors.
- Keep 404 copy playful and directional.
- Keep 500 copy apologetic enough to be clear, but still in brand.

Good direction:

- "This pet has slipped its collar."
- "Something chewed through the server cable."
- "The page wandered off before we could attach the tiny bell."
- "Try again in a moment, or browse pets that are currently behaving."

Avoid:

- Jokes that obscure the status.
- Long novelty explanations.
- Error pages with no route back to useful content.

## Component Guidance

### Hero Carousel

The hero carousel should be content-rich and CMS-driven.

Each slide should support:

- Background image or color treatment.
- Pet image.
- Headline.
- Supporting copy.
- CTA.
- Optional featured pet reference.

Animation should be playful but controlled. Text and CTAs must remain readable on mobile.

### Pet Cards

Pet cards should show:

- Pet image.
- Name.
- Pet type.
- Listing headline.
- Short summary.
- Key badges such as chaos level, mess risk, or cuddle policy.
- Availability state.
- Primary CTA.

Cards should have stable dimensions in grids and carousels.

### Warning And Alert Blocks

Warnings and alerts should be useful content blocks, not just jokes.

Examples:

- "High snack surveillance required."
- "May bark at clouds with unusual confidence."
- "Do not leave near unlocked muffins."

These blocks should remain accessible, readable, and visually distinct.

### Forms

Forms should feel trustworthy and easy to complete.

Requirements:

- Clear labels.
- Helpful validation messages.
- Accessible error states.
- Mobile-friendly drawer behavior for owner contact.
- Satirical success and error copy where it does not reduce clarity.

### Testimonials

Testimonials should sound like plausible customer proof with a strange premise.

Examples:

- "Borrowed a dog for two days. My steps went up and my sandwich awareness improved."
- "Pet Share gave our cat the fresh audience she clearly believed she deserved."

### Pricing Tiers

Pricing tiers should use normal comparison patterns:

- Tier name.
- Price or pricing joke.
- Billing note.
- Feature list.
- CTA.
- Highlight state.

The joke should not make the tiers hard to compare.

## Editorial Guidance For Sanity

Sanity-authored fields should give editors enough control to demonstrate CMS flexibility without forcing frontend layout internals into content.

Good CMS controls:

- Headline.
- Body copy.
- Image.
- CTA.
- Tone.
- Featured references.
- Section order.
- Visibility toggles.
- Alert or warning severity.

Avoid CMS controls for:

- Exact pixel spacing.
- Raw CSS classes.
- Animation timing internals.
- Complex layout rules that editors cannot preview or reason about.

## Good Vs Too Far

Good:

- "Lend your dog to someone with fresh blankets and unrealistic optimism."
- "Pickup required within seven days, unless the pet has hidden your keys."
- "Mild shedding, heavy opinions."

Too far:

- Copy implying an owner wants to abandon a pet.
- Copy implying a pet is unsafe or should be mistreated.
- Gross copy that would make the page feel unpleasant.
- Jokes that make checkout, contact, or form behavior unclear.

## Review Checklist

Before treating a page or component as on-brand, check:

- The premise is clear.
- The UI feels polished enough to contrast with the absurd copy.
- The page works on mobile and desktop.
- Pet imagery is visible and friendly.
- Copy is funny without implying harm.
- CTAs are understandable.
- Motion respects reduced-motion preferences.
- Sanity-authored content has clear fields and previews.
- Reusable sections still feel cohesive together.
