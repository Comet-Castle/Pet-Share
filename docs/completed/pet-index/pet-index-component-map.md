# Pet Index Component Map And Data Sources

Status:

- Working inventory of the components expected on `/pets`.
- Maps each browse-page section to ownership, current data source, and likely implementation stage.

Route target:

- `app/(site)/pets/page.tsx`

Primary data sources:

- `loadPetIndexPage()`
- `loadPetsIndex()`
- `loadPetsIndexCount()`
- `loadPetTypes()`

## How To Use This Doc

For each browse-page component, this doc answers:

- what the component is
- whether it already exists or should be revised
- where its data comes from
- whether that data already exists in the route/query model
- whether the work belongs in the first UI pass or later cleanup

## Shared Field Alignment With Pet Detail

The browse page and detail page should share one canonical interpretation of the marketplace fields.

| Field | Browse usage | Detail usage | Notes |
| --- | --- | --- | --- |
| `petType.filterLabel` | filter + card context | type label | shared human-readable label |
| `availabilityStatus` | filter + cards | status row + fact grid | shared label set |
| `pickupUrgency` | filter | fact grid | shared label set |
| `chaosLevel` / `messRisk` / `energyLevel` | minimum emoji filters | emoji meters in fact grid | shared emoji language and text equivalents |
| `temperament` | secondary metadata only | fact grid | shared label set |
| `cuddlePolicy` | transitional hidden/removed browse field | fact grid | do not let hidden browse debt drift from detail labels |
| `breed` | card sublabel | fact grid / about panel | keep realistic plain-English values |

---

## 1. Page Route Composer

Purpose:

- Orchestrates section order, empty/error states, filter state derivation, result-grid rendering, and pagination.

Current file:

- `app/(site)/pets/page.tsx`

Expected responsibility:

- normalize URL params
- build `PetFilterState`
- load page chrome + pets + counts + pet types
- compose the page in the approved order

Data sources:

- `loadPetIndexPage({ preview })`
- `loadPetsIndex(...)`
- `loadPetsIndexCount(...)`
- `loadPetTypes(...)`

Status:

- already exists
- primary Stage 1 route-composition target

---

## 2. Removed Hero / Banner Section

Purpose:

- Previously framed the page with CMS-authored hero copy.

Current implementation:

- inline in `app/(site)/pets/page.tsx`

Current data source:

- `page?.hero`
- `page?.summary`
- `page?.hero?.ctaGroup`

Approved direction:

- remove from the page
- no top browse hero in the approved implementation direction

Status:

- currently exists
- should be removed in the first route simplification pass

---

## 3. Desktop Filter Rail

Purpose:

- Hosts the primary browse controls on large screens.

Current implementation:

- inline wrapper in `app/(site)/pets/page.tsx`
- inner filter controls rendered by `components/features/pets/pet-filters.tsx`

Expected sub-elements:

- rail heading with icon
- pet count / clear-all summary
- pet type control
- availability buttons
- pickup urgency buttons
- household impact emoji rows

Data source:

- `petFilters`
- `petTypes`
- `totalPets`
- `clearHref`

Status:

- already exists
- Stage 2 control-overhaul target

---

## 4. Mobile Filter Drawer

Purpose:

- Hosts the same filter controls on small screens inside a controlled drawer.

Current component:

- `components/features/pets/mobile-filter-drawer.tsx`

Expected sub-elements:

- open button with active-count badge
- drawer title
- close button
- filter content
- sticky result button

Data source:

- `activeCount`
- `resultCount`
- server-rendered filter children from the route

Status:

- already exists
- Stage 5 polish target after filter-control changes land

---

## 5. Pet Type Control

Purpose:

- Lets users browse by pet category using a searchable combobox + selected chips.

Current component:

- `components/features/pets/pet-type-filter-preview.tsx`

Expected sub-elements:

- input with search icon
- option listbox
- selected chips / fallback hint

Data source:

- `petTypes`
- `selectedSlugs`
- URL search params at runtime

Status:

- already exists
- visual reference for the `Sort by` control family

---

## 6. Availability Buttons

Purpose:

- Filters by current listing status in a clearer, more scannable way than loose pills.

Current implementation:

- stacked button links in `components/features/pets/pet-filters.tsx`

Approved direction:

- dedicated stacked button treatment
- clearer state styling
- optional counts beside each option

Data source:

- `filters.availabilityStatuses`
- `availabilityLabels`
- `petsPageHref(...)`
- optional future counts from server/query helpers

Status:

- revised in the current `/pets` implementation
- follow-up QA target only

---

## 7. Pickup Urgency Buttons

Purpose:

- Mirrors the availability control language for urgency-based filtering.

Current implementation:

- stacked button links in `components/features/pets/pet-filters.tsx`

Approved direction:

- same stacked-button treatment as availability

Data source:

- `filters.pickupUrgencies`
- `urgencyLabels`
- `petsPageHref(...)`

Status:

- revised in the current `/pets` implementation
- follow-up QA target only

---

## 8. Borrowing Rules / Cuddle Policy Filter

Purpose:

- Previously exposed `cuddlePolicy` as a visible filter group.

Current implementation:

- removed from `components/features/pets/pet-filters.tsx`
- removed from `PetFilterState`, active chips, and `/pets` query handling

Approved direction:

- keep this out of the visible approved browse direction

Status:

- browse-surface removal landed
- reintroduction would require explicit product approval

---

## 9. Household Impact Controls

Purpose:

- Filters by minimum chaos, mess, and energy levels.

Current implementation:

- full-width emoji-row controls in `components/features/pets/pet-filters.tsx`

Approved direction:

- full-width emoji rows
- minimum-filter behavior remains
- approved emoji set:
  - chaos: `😈`
  - mess: `💩`
  - energy: `⚡`

Current data source:

- `filters.minChaos`
- `filters.minMess`
- `filters.minEnergy`
- `petsPageHref(...)`
- `RATING_STEPS`

Status:

- revised in the current `/pets` implementation
- follow-up QA target only

---

## 10. Sort Control

Purpose:

- Changes result ordering while preserving the shareable URL state.

Current component:

- `components/features/pets/sort-control.tsx`

Current behavior:

- native select
- pushes updated URL params

Approved direction:

- keep native select behavior
- visually match the pet-type dropdown family

Data source:

- `currentSort`
- `petIndexSortOptions`
- `useSearchParams()` / `useRouter()` / `usePathname()`

Status:

- already exists
- Stage 2 styling-alignment target

---

## 11. Active Filter Chips

Purpose:

- Shows the currently active filters above results and provides one-click removal.

Current component:

- `components/features/pets/active-filter-chips.tsx`

Current chip sources:

- pet type
- availability
- pickup urgency
- chaos / mess / energy minimums

Approved direction implications:

- chip language should stay aligned with the visible browse controls only

Status:

- already aligned with the current visible filter model
- QA target only

---

## 12. Pet Result Grid

Purpose:

- Renders the main browse results.

Current route usage:

- `pets.map((pet) => <PetCard key={pet._id} pet={pet} />)`

Approved direction:

- align with homepage card design language
- stop maintaining a separate index-only card style

Data source:

- `loadPetsIndex(...)`

Status:

- aligned with the homepage card family in the current `/pets` implementation
- follow-up QA target only

---

## 13. Public Pet Card

Purpose:

- Renders one browseable pet card linking to the detail page.

Current component:

- `components/features/pets/pet-card.tsx`

Approved direction:

- visually align with homepage cards
- remain image-forward, rounded, and borderless

Current data source:

- `PETS_INDEX_QUERY_RESULT[number]`

Status:

- aligned with the homepage card family in the current `/pets` implementation
- follow-up QA target only

---

## 14. Empty State

Purpose:

- Handles no-results and no-content scenarios without breaking the browse flow.

Current implementation:

- `SystemMessage` usage inside `app/(site)/pets/page.tsx`

Current data source:

- `activeCount`
- `page?.emptyState`

Approved direction:

- keep current behavior
- ensure any simplified filter model still supports a clear `Clear filters` path

Status:

- already exists
- low-risk, mostly verification-only target

---

## 15. Pagination

Purpose:

- Moves across paginated result sets while preserving active filters and sort.

Current implementation:

- inline route-level pagination links using `petsPageHref(...)`

Data source:

- `currentPage`
- `totalPages`
- `petFilters`
- `sort`

Status:

- already exists
- verify only unless URL-state cleanup changes require updates

---

## 16. Supporting CMS Sections

Purpose:

- Renders lower-page sections from `petIndexPage.contentSections`.

Current implementation:

- `PageSections` in `app/(site)/pets/page.tsx`

Approved direction:

- may remain, but should not compete with the browsing surface
- keep spacing calmer after the hero removal

Status:

- already exists
- route-spacing review target only

## Current Data/State Coverage Summary

Already available and usable now:

- pet index page singleton data
- pet result cards
- pet types
- total count
- sort state
- availability status
- pickup urgency
- minimum chaos/mess/energy values

Likely requires no query changes for the first implementation slice:

- removing the hero from the route
- sort styling alignment
- availability / pickup button treatment
- household impact emoji-row redesign
- route/layout spacing cleanup

Likely requires product/state cleanup decisions later:

- whether to add server-side per-option counts for availability / pickup
- whether homepage and index should share one extracted card component or one updated `PetCard`

## Recommended Component Creation / Revision Order

1. revise `app/(site)/pets/page.tsx`
2. revise `components/features/pets/pet-filters.tsx`
3. revise `components/features/pets/sort-control.tsx`
4. revise or extract `components/features/pets/pet-card.tsx`
5. clean up `components/features/pets/active-filter-chips.tsx` and `pet-index-state.ts`
