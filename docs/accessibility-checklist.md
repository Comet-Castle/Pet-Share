# Accessibility Checklist

Use this checklist when building or reviewing Pet Share UI. It is intentionally practical and focused on the surfaces planned for this project.

Accessibility is part of the implementation scope, not a final polish pass. Every component and page should be usable with keyboard, screen reader, touch, and reduced-motion preferences in mind.

## Baseline Rules

- Use semantic HTML before custom roles.
- Use buttons for actions and links for navigation.
- Every interactive control has an accessible name.
- Every interactive control has a visible focus state.
- Keyboard users can reach, operate, and leave every interactive area.
- Text and controls maintain readable contrast against their background.
- Do not rely on color alone to communicate status.
- Do not rely on hover alone to reveal required actions or information.
- Respect `prefers-reduced-motion` for non-essential animation.
- Avoid horizontal overflow and clipped content at mobile widths.

## Page Structure

- Each page has one clear `h1`.
- Heading levels follow document order without skipping for visual size alone.
- Main content is wrapped in a `main` element.
- Repeated navigation is wrapped in `nav` with an accessible label where useful.
- Footer content is wrapped in `footer`.
- Landmark regions are not overused.
- Skip-link support should be considered once the main layout shell exists.
- Route loading, empty, error, and not-found states are announced clearly through visible text.

## Navigation

- Navigation links have clear labels.
- Active navigation state is visually clear and not color-only.
- Mobile navigation can be opened, used, and closed by keyboard.
- Icon-only navigation controls have `aria-label`.
- Menus do not trap focus unless they are implemented as modal/drawer experiences.
- Focus returns to the triggering control when a menu or drawer closes where practical.

## Buttons, Links, And CTAs

- Buttons use `button` elements unless they navigate.
- Navigation CTAs use links.
- Disabled buttons communicate disabled state visually and programmatically.
- Loading buttons do not lose their accessible label.
- Icon-only buttons have an accessible label and a visible focus style.
- Button text is specific enough to make sense out of context where practical.
- Hit targets are comfortable on touch devices.

## Forms

- Every input, textarea, select, toggle, radio, and checkbox has an associated label.
- Required fields are identified clearly.
- Field help text is associated with the field when it affects completion.
- Validation messages identify the field and the problem.
- Error messages are rendered in a way assistive technology can announce.
- Form-level error and success states are clear and not only humorous.
- Users can submit, correct errors, and resubmit without losing entered data unless there is a strong reason.
- Mailgun or server failure messages never expose raw provider errors or credentials.

## Pet Index Filters

- Filter groups have visible group labels.
- Multi-select pet type filters behave predictably with keyboard.
- Selected filters are visible as pills or chips and can be removed by keyboard.
- Boolean filters use accessible toggle, radio, or checkbox semantics.
- Rating-like icon filters have text labels and accessible values, such as `Mess risk: 2.5 out of 5`.
- Fillable icons are decorative unless they carry their own accessible label.
- Active filter count is visible in text.
- Clear-all filters action is keyboard reachable.
- URL-driven filter and pagination changes preserve usable browser back/forward behavior.
- Mobile filter drawers or collapsible panels do not block access to results.

## Pet Cards

- Card images have meaningful alt text when they identify the pet.
- Decorative visual flourishes use empty alt text or are hidden from assistive technology.
- Card links have clear accessible names, such as the pet name plus listing context.
- If the whole card is clickable, nested interactive controls do not create invalid or confusing interactions.
- Availability indicators include text, not only a colored dot.
- Badges and tags are readable and wrap cleanly.
- Optional card videos do not autoplay with sound.
- Low-frame-rate video previews have a still-image fallback.

## Pet Detail And Owner Pages

- Image galleries have keyboard-operable controls when interactive.
- Thumbnail controls have accessible names.
- Current gallery state is clear to screen reader users where practical.
- Pet fact icons have visible labels or accessible labels.
- Rating-like stats expose the numeric value in text.
- Owner links and contact CTAs are clear.
- Back-to-results behavior preserves useful filter context when implemented.
- Embedded videos include titles and do not trap keyboard focus.

## Drawers And Modals

- Use a drawer for owner contact as planned.
- Focus moves into the drawer when it opens.
- Focus is trapped only while the drawer is open.
- Focus returns to the trigger when the drawer closes.
- The drawer has an accessible name.
- The close control is keyboard reachable and labelled.
- Escape closes the drawer unless a nested control has a strong reason to handle Escape.
- Body scroll behavior is intentional on mobile and desktop.
- Drawer content remains usable at narrow widths and with larger text.

## Carousels

- Carousels do not auto-advance so quickly that content becomes hard to read.
- Users can pause, navigate, or ignore carousel motion.
- Controls are keyboard reachable and have accessible labels.
- Current slide state is available in text or announced politely where practical.
- Slide content remains readable without relying on animation.
- Hero carousel copy does not overlap pet imagery at mobile or desktop sizes.
- Reduced-motion users receive simplified transitions.

## Page-Builder Sections

- Every reusable section renderer has a semantic wrapper appropriate to its content.
- Section headings fit into the page heading hierarchy.
- Callouts, alerts, and warnings communicate tone with text and icon, not color alone.
- Accordions use button controls and expose expanded/collapsed state.
- Pricing tiers remain readable and navigable on small screens.
- Stats include labels and context, not just large numbers.
- Section images have meaningful alt text or are marked decorative.

## Media And Images

- Use `next/image` where practical for optimized rendering.
- Configure `next.config` for Sanity image CDN domains before rendering Sanity-hosted images through `next/image`.
- Meaningful images have alt text.
- Decorative images use empty alt text.
- Image crops should not remove the important subject.
- Media containers use stable aspect ratios to prevent layout shift.
- Videos have titles or labels.
- Autoplaying video, if used, is muted and non-essential.
- Users are not forced to watch motion to understand content.

## System And Error Pages

- 404, 500, and generic error pages clearly state the problem.
- Satirical copy does not hide the actual error state.
- Recovery links are visible and keyboard reachable.
- Error pages do not expose stack traces, raw exception messages, provider responses, or secrets.
- Error pages work with static fallback copy if CMS content is unavailable.
- System pages default to no-index metadata where applicable.

## Motion

- Motion is decorative or supportive, not required for understanding.
- Respect `prefers-reduced-motion`.
- Avoid constant bouncing, large rotations, and distracting loops.
- Hover motion has an equivalent visible focus style.
- Scroll-triggered animation does not hide content until JavaScript runs.
- If Framer Motion is added later, keep reduced-motion handling and keyboard usability in scope.

## Sanity-Authored Content

- Meaningful Sanity images require alt text in schema validation.
- Editors should have clear fields for accessible labels when icons, videos, or embeds need them.
- CMS-authored links should have clear labels.
- Page-builder sections should not allow content structures that break heading order or hide required labels.
- Seed content should include realistic alt text, labels, empty states, and error states.

## Testing And Review

Minimum manual checks when a relevant surface exists:

- Keyboard-only navigation through the page.
- Mobile viewport check.
- Desktop viewport check.
- Focus visibility check.
- Screen-reader-friendly label check for icon controls, filters, forms, and drawers.
- Reduced-motion check for animated pages or components.
- No horizontal overflow check.

Automated or semi-automated checks when tooling exists:

- Linting for accessibility rules where configured.
- Component tests for drawers, filters, carousels, and forms when useful.
- Playwright smoke checks for key routes once public route skeletons exist.
- Browser screenshots at representative mobile and desktop sizes for visually complex pages.
