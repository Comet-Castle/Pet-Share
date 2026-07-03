# Pet Index Revision Spec

Status:

- Approved revision spec for the `/pets` browse/index experience.
- Applies to the pet index direction, not the pet detail page.
- Overrides portions of the current `/pets` blueprint where noted below.

Related references:

- `docs/page-blueprints.md` (`/pets` sections)
- `app/(site)/pets/page.tsx`
- `components/features/pets/pet-filters.tsx`
- `components/features/pets/sort-control.tsx`
- `components/features/pets/pet-card.tsx`
- `app/(site)/page.tsx` (homepage card direction)

## Intent

The `/pets` page should feel like a clean, practical browse surface first.
The current direction should be simplified so the filters and listings do the work,
without an extra banner competing for attention.

This revision keeps the page bright and playful, but removes unnecessary framing and
aligns more of the index with the stronger homepage card treatment.

## Approved Changes

### 1. Remove the hero banner from `/pets`

Decision:

- Remove the top hero/banner area from the pet index page.
- The listing UI should begin much sooner.

Effect on page structure:

Old direction:

1. Hero/banner
2. Filter + results layout
3. Listings
4. Supporting sections

New direction:

1. Filter + results layout
2. Listings
3. No extra bottom promo CTA in the approved prototype direction

Implementation notes:

- Remove the current top banner section from `app/(site)/pets/page.tsx`.
- The result count, filters, and sort controls become the first main scanning surface.

Blueprint override:

- This supersedes the current `/pets` “Hero” section in `docs/page-blueprints.md` for the approved direction.
- The approved prototype direction also removes the extra bottom promo CTA block so the page stays focused on filtering and browsing.

## 2. Use the homepage pet cards for the index

Decision:

- Remove the alternate pet-card treatment for the index.
- Use the homepage card design language as the standard card pattern.
- In the flat prototype, replace custom index cards with placeholders that explicitly reference the homepage card component.

Expected card direction:

- Same overall visual treatment as homepage featured pet cards.
- Image-forward.
- Rounded.
- Borderless.
- Friendly badges.
- Stable scan-friendly layout.

Prototype expectation:

- The prototype does not need to preserve a second full card implementation.
- Placeholder cards are acceptable if they clearly indicate:
  - the homepage card pattern should be reused
  - the custom index-only card treatment is being removed

Implementation notes:

- Do not maintain two divergent public pet card designs if the homepage card pattern works for both.
- Either:
  1. update `components/features/pets/pet-card.tsx` to match the homepage card presentation, or
  2. extract the homepage version into a shared reusable card component and use it in both places.

Recommendation:

- Prefer a shared pet card component with minor props for density/summary differences.

Blueprint override:

- This tightens the existing “Pet Listing Results / Card content / Visual direction” sections toward the homepage card pattern.

## 3. Remove the separate pet-card redesign direction

Decision:

- Any alternate card treatment introduced only for the index should be dropped.
- Homepage-style cards become the default public browse card language.

Acceptance criteria:

- Index and homepage cards feel like the same family.
- No separate index-only card style remains unless there is a very strong layout reason.

## 4. Sort by should use the same dropdown style as Pet type

Decision:

- The `Sort by` control should visually match the `Pet type` dropdown pattern.
- It should not feel like a different control family.

Expected behavior:

- Same rounded shell.
- Same icon/chevron treatment if appropriate.
- Same spacing, height, and input framing language.
- Native select behavior remains acceptable and preferred.

Implementation notes:

- Update `components/features/pets/sort-control.tsx` so it uses the same visual pattern as the pet-type selector.
- This is a style/pattern alignment change, not a new interaction model.

Accessibility:

- Keep it as a real `select`.
- Keep the existing accessible label behavior.

## 5. Fix the availability buttons

Decision:

- Keep availability as buttons, but improve the control treatment.
- The buttons should feel clearer, more deliberate, and easier to scan than the looser pill cluster.

Expected behavior:

- Each availability option should read as a distinct selectable button.
- States should remain visually obvious.
- The control should still support URL-driven filtering.
- A small count per option is acceptable in the prototype.

Implementation notes:

- This is a presentation/clarity fix, not a data-model change.
- The buttons should remain accessible and keyboard usable.
- Avoid making availability feel like the same control as borrowing rules or pet type.

## 6. Household impact icons should span the full filter width and be slightly larger

Decision:

- The `Household impact` visual row(s) should stretch across the available filter width.
- The icon treatment should feel more obvious and playful.
- Icons should be slightly larger than the current rating-bar treatment.

Expected behavior:

- Replace the current minimal segmented bars with a full-width icon scale treatment.
- Each scale should read clearly as a row of icons across the filter group.
- The user should still understand this as a minimum filter (for example `3+`).

Implementation notes:

- Update the `Household impact` controls in `components/features/pets/pet-filters.tsx`.
- The current `FilterScaleControl` segmented bars should be revised to support icon-based rows.
- Keep text labels like `Chaos`, `Mess`, and `Energy` visible.

Accessibility:

- Must still expose text equivalents such as:
  - `Mess 3 or higher`
  - `Chaos 4 or higher`
- Do not rely only on icon fill or emoji repetition.

## 7. Household impact meters should use emojis

Decision:

- Use emoji for all three household impact scales.

Approved emoji direction:

- Chaos: `😈`
- Mess: `💩`
- Energy: `⚡`

Purpose:

- Make the filter set feel more unified and more obviously playful.
- Lean into the satirical Pet Share tone in a scan-friendly way.

Constraints:

- Keep it funny, not gross.
- Keep it readable and aligned with the rest of the filter UI.
- Do not let the emoji treatment make the control feel visually broken or cheap.

Implementation notes:

- This applies to all three rows inside `Household impact`.
- The scale should still behave like a structured minimum filter.
- The selected minimum should visibly fill/activate the emoji row.

Accessibility:

- The control must still provide text values and accessible labels.
- Screen readers should not be forced to interpret repeated emoji without context.

## Canonical Filter Field Alignment

The index should remain aligned with the pet detail page on shared field meaning and labels.

| Field | Index role | Detail role | Alignment rule |
| --- | --- | --- | --- |
| `petType` | visible filter and card label | type/context label | Use the same `filterLabel` language. |
| `availabilityStatus` | visible stacked-button filter | status row + fact grid | Use the same canonical label set. |
| `pickupUrgency` | visible stacked-button filter | fact grid | Use the same canonical label set. |
| `chaosLevel` | minimum emoji filter | fact-grid emoji meter | Same emoji language: `😈`. |
| `messRisk` | minimum emoji filter | fact-grid emoji meter | Same emoji language: `💩`. |
| `energyLevel` | minimum emoji filter | fact-grid emoji meter | Same emoji language: `⚡`. |
| `temperament` | currently secondary/non-filter field | fact grid | Same label set when displayed. |
| `cuddlePolicy` | hidden/removed from approved browse UI | fact grid | Keep data/query compatibility until cleanup, but do not reintroduce it visually without approval. |
| `breed` | card sublabel | fact grid / about panel | Keep realistic plain-English breed naming. |

## Query And State Contract

The approved browse direction should treat these as the primary visible filter fields:

- `petType`
- `availabilityStatus`
- `pickupUrgency`
- `chaosLevel`
- `messRisk`
- `energyLevel`

Fields intentionally not visible in the approved browse rail:

- `cuddlePolicy`

State/query rule:

- If `cuddlePolicy` remains in the query/state model temporarily, document it as transitional technical debt rather than active product direction.
- The implementation plan must include follow-up work to remove `cuddlePolicy` from visible browse state, chips, URL handling, and `sanity/queries/pets.ts` once the approved filter rail is adopted.

## Filter Area Summary Direction

The filter rail should now follow this revised direction:

- Pet type: dropdown pattern
- Availability: clearer stacked button treatment
- Pickup urgency: same stacked button treatment as availability
- Sort by: same dropdown pattern as pet type
- Household impact:
  - full-width emoji rows
  - slightly larger visual scale
  - filled according to the selected minimum filter
  - chaos uses 😈
  - mess uses 💩
  - energy uses ⚡

## Interaction Rules

These remain true after the revisions:

- Filtering stays URL-driven.
- Pagination stays URL-driven.
- Changing filters should reset pagination to page 1.
- Sort changes should preserve compatible filter params.
- Mobile should still use a drawer or collapsible filter container.
- Active filters should still be visible above results.

## Responsive Expectations

- Removing the hero should make the first screen on mobile feel more useful.
- Filter controls must still fit narrow widths without clipping.
- Full-width household impact rows must not create horizontal overflow.
- Homepage-style pet cards must still stack cleanly across mobile, tablet, and desktop.

## Component Impact

Likely files to change when implementation starts:

- `app/(site)/pets/page.tsx`
  - remove hero/banner section
  - let the filter/results layout begin earlier
- `components/features/pets/pet-filters.tsx`
  - revise household impact controls
  - improve availability button treatment
  - align pickup urgency with the same stacked button treatment
- `components/features/pets/sort-control.tsx`
  - align visually with pet-type dropdown
- `components/features/pets/pet-card.tsx`
  - remove alternate index-specific card direction
  - align with homepage card pattern
- possibly shared extraction from homepage card logic/presentation

## Acceptance Criteria

This revision is satisfied when:

- The `/pets` page no longer shows the hero banner.
- The listing interface begins immediately with filters/results.
- The page does not end with the removed promo CTA block.
- `Sort by` and `Pet type` clearly look like the same control family.
- Availability uses clearer dedicated buttons.
- Pickup urgency uses the same dedicated button pattern as availability.
- `Household impact` uses a full-width icon-based scale.
- The chaos and energy icons visibly fill with the selected filter.
- The household impact scales visibly use the approved emoji set.
- The index uses the homepage pet card style rather than a separate redesign.
- The prototype grid uses placeholders that explicitly reference the homepage card pattern.
- No horizontal overflow or awkward wrapping is introduced by the larger icon scales.

## Notes

- This is an approved browse/index direction update.
- It should be treated as the current design direction for the pet index even if some older blueprint wording still references the removed hero or alternative card treatments.
