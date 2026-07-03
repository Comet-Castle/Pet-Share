import type { PetIndexSort } from "@/sanity/queries/pets";

export const PET_PAGE_SIZE = 12;
export const RATING_STEPS = [1, 2, 3, 4, 5] as const;

export const petIndexSortOptions: ReadonlyArray<{ value: PetIndexSort; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "chaosLow", label: "Chaos: low to high" },
  { value: "chaosHigh", label: "Chaos: high to low" },
  { value: "pickup", label: "Soonest pickup" }
];

export type PetFilterState = Readonly<{
  petNameQuery: string;
  petTypeSlugs: string[];
  availabilityStatuses: string[];
  pickupUrgencies: string[];
  minChaos: number | null;
  minMess: number | null;
  minEnergy: number | null;
}>;

export const emptyPetFilters: PetFilterState = {
  petNameQuery: "",
  petTypeSlugs: [],
  availabilityStatuses: [],
  pickupUrgencies: [],
  minChaos: null,
  minMess: null,
  minEnergy: null
};

export function toggleListValue(values: readonly string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

/**
 * Counts active filters for the rail header and mobile trigger badges.
 */
export function countActiveFilters(filters: PetFilterState) {
  return (
    (filters.petNameQuery ? 1 : 0) +
    filters.petTypeSlugs.length +
    filters.availabilityStatuses.length +
    filters.pickupUrgencies.length +
    (filters.minChaos ? 1 : 0) +
    (filters.minMess ? 1 : 0) +
    (filters.minEnergy ? 1 : 0)
  );
}

type PetsPageHrefOptions = Readonly<{
  page?: number;
  sort?: PetIndexSort;
}>;

/**
 * Builds a shareable `/pets` URL from the filter state. Filter changes intentionally
 * omit `page` so the listing resets to the first page; pagination and sort pass through.
 */
export function petsPageHref(filters: PetFilterState, options: PetsPageHrefOptions = {}) {
  const params = new URLSearchParams();

  if (options.sort && options.sort !== "featured") {
    params.set("sort", options.sort);
  }

  if (options.page && options.page > 1) {
    params.set("page", String(options.page));
  }

  if (filters.petNameQuery.trim()) {
    params.set("name", filters.petNameQuery.trim());
  }

  filters.petTypeSlugs.forEach((slug) => params.append("type", slug));
  filters.availabilityStatuses.forEach((status) => params.append("availability", status));
  filters.pickupUrgencies.forEach((value) => params.append("urgency", value));

  if (filters.minChaos) params.set("chaos", String(filters.minChaos));
  if (filters.minMess) params.set("mess", String(filters.minMess));
  if (filters.minEnergy) params.set("energy", String(filters.minEnergy));

  const query = params.toString();

  return query ? `/pets?${query}` : "/pets";
}

export function normalizeMinimumRating(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) {
    return null;
  }

  return parsed;
}

export function normalizeStringList(value: string | string[] | undefined, allowedValues: readonly string[]) {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return Array.from(new Set(values.filter((item) => allowedValues.includes(item))));
}

export function normalizePetNameQuery(value: string | undefined) {
  return value?.trim() ?? "";
}
