import type { QueryParams } from "@sanity/client";
import type {
  FEATURED_TESTIMONIALS_QUERY_RESULT,
  FORM_DEFINITION_BY_SLUG_QUERY_RESULT,
  HOME_PAGE_QUERY_RESULT,
  MARKETING_PAGE_BY_ID_QUERY_RESULT,
  MARKETING_PAGE_BY_SLUG_QUERY_RESULT,
  MARKETING_PAGE_SLUGS_QUERY_RESULT,
  OWNER_BY_ID_QUERY_RESULT,
  OWNER_BY_SLUG_QUERY_RESULT,
  OWNER_SLUGS_QUERY_RESULT,
  PET_BY_ID_QUERY_RESULT,
  PET_BY_SLUG_QUERY_RESULT,
  PET_INDEX_PAGE_QUERY_RESULT,
  PET_SLUGS_QUERY_RESULT,
  PET_TYPES_QUERY_RESULT,
  PETS_INDEX_COUNT_QUERY_RESULT,
  PETS_INDEX_QUERY_RESULT,
  RELATED_PETS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  SYSTEM_PAGE_BY_TYPE_QUERY_RESULT
} from "@/sanity.types";
import {
  FEATURED_TESTIMONIALS_QUERY,
  FORM_DEFINITION_BY_SLUG_QUERY,
  HOME_PAGE_QUERY,
  MARKETING_PAGE_BY_ID_QUERY,
  MARKETING_PAGE_BY_SLUG_QUERY,
  MARKETING_PAGE_SLUGS_QUERY,
  OWNER_BY_ID_QUERY,
  OWNER_BY_SLUG_QUERY,
  OWNER_SLUGS_QUERY,
  PET_BY_ID_QUERY,
  PET_BY_SLUG_QUERY,
  PET_INDEX_PAGE_QUERY,
  PET_SLUGS_QUERY,
  PET_TYPES_QUERY,
  PETS_INDEX_COUNT_QUERY,
  RELATED_PETS_QUERY,
  SITE_SETTINGS_QUERY,
  SYSTEM_PAGE_BY_TYPE_QUERY
} from "@/sanity/queries";
import { buildPetsIndexQuery, resolvePetIndexSort } from "@/sanity/queries/pets";
import type { PetIndexSort } from "@/sanity/queries/pets";
import { previewSanityFetch, sanityFetch } from "./fetch";
import { sanityTags } from "./tags";

type LoadOptions = Readonly<{
  preview?: boolean;
}>;

type PetIndexFilters = Readonly<{
  petNameQuery?: string;
  petTypeSlugs?: string[];
  availabilityStatuses?: string[];
  pickupUrgencies?: string[];
  minChaos?: number | null;
  minMess?: number | null;
  minEnergy?: number | null;
}>;

type QueryLoadOptions = LoadOptions &
  Readonly<{
    query: string;
    params?: QueryParams;
    tags?: string[];
    revalidate?: number | false;
    useCdn?: boolean;
  }>;

const defaultPageSize = 24;

async function loadQuery<Result>({
  preview = false,
  query,
  params,
  tags,
  revalidate,
  useCdn
}: QueryLoadOptions): Promise<Result> {
  if (preview) {
    return previewSanityFetch<Result>({ query, params, tags });
  }

  return sanityFetch<Result>({ query, params, tags, revalidate, useCdn });
}

/**
 * Loads global site settings for layout-level rendering.
 */
export function loadSiteSettings(options: LoadOptions = {}) {
  return loadQuery<SITE_SETTINGS_QUERY_RESULT>({
    ...options,
    query: SITE_SETTINGS_QUERY,
    tags: [sanityTags.siteSettings]
  });
}

/**
 * Loads the site-wide default SEO object, used by `metadataFromSeo()` as the
 * OG-image/description fallback when a route's own `seo` has no image of its own.
 * Reuses `loadSiteSettings`, which Next's fetch memoization already dedupes
 * against the identical call in `app/(site)/layout.tsx` within the same request.
 */
export async function loadSiteDefaultSeo(options: LoadOptions = {}) {
  const settings = await loadSiteSettings(options);
  return settings?.defaultSeo ?? null;
}

/**
 * Loads the CMS-authored homepage singleton.
 */
export function loadHomePage(options: LoadOptions = {}) {
  return loadQuery<HOME_PAGE_QUERY_RESULT>({
    ...options,
    query: HOME_PAGE_QUERY,
    tags: [sanityTags.homePage],
    revalidate: process.env.NODE_ENV === "development" ? 0 : undefined,
    useCdn: false
  });
}

/**
 * Loads the CMS-authored pet index singleton.
 */
export function loadPetIndexPage(options: LoadOptions = {}) {
  return loadQuery<PET_INDEX_PAGE_QUERY_RESULT>({
    ...options,
    query: PET_INDEX_PAGE_QUERY,
    tags: [sanityTags.petIndex]
  });
}

/**
 * Loads one marketing page by route slug.
 */
export function loadMarketingPageBySlug(slug: string, options: LoadOptions = {}) {
  return loadQuery<MARKETING_PAGE_BY_SLUG_QUERY_RESULT>({
    ...options,
    query: MARKETING_PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: [sanityTags.marketingPage(slug)],
    revalidate: process.env.NODE_ENV === "development" ? 0 : undefined,
    useCdn: false
  });
}

/**
 * Loads one Standard Page by document ID for unpublished draft previews.
 */
export function loadMarketingPageById(id: string, options: LoadOptions = {}) {
  return loadQuery<MARKETING_PAGE_BY_ID_QUERY_RESULT>({
    ...options,
    query: MARKETING_PAGE_BY_ID_QUERY,
    params: { id },
    tags: [sanityTags.marketingPage(id)]
  });
}

/**
 * Loads marketing page slugs for static route generation.
 */
export function loadMarketingPageSlugs(options: LoadOptions = {}) {
  return loadQuery<MARKETING_PAGE_SLUGS_QUERY_RESULT>({
    ...options,
    query: MARKETING_PAGE_SLUGS_QUERY,
    tags: ["marketing-pages"],
    useCdn: false
  });
}

/**
 * Loads CMS copy for one system state, such as 404 or generic error.
 */
export function loadSystemPageByType(pageType: string, options: LoadOptions = {}) {
  return loadQuery<SYSTEM_PAGE_BY_TYPE_QUERY_RESULT>({
    ...options,
    query: SYSTEM_PAGE_BY_TYPE_QUERY,
    params: { pageType },
    tags: [sanityTags.systemPage(pageType)]
  });
}

/**
 * Loads paginated approved pets for the pet index page.
 */
export function loadPetsIndex(
  page = 1,
  pageSize = defaultPageSize,
  filters: PetIndexFilters = {},
  sort: PetIndexSort | string | undefined = "featured",
  options: LoadOptions = {}
) {
  const start = Math.max(page - 1, 0) * pageSize;
  const end = start + pageSize;
  const queryFilters = normalizePetIndexFilters(filters);
  const resolvedSort = resolvePetIndexSort(sort);

  return loadQuery<PETS_INDEX_QUERY_RESULT>({
    ...options,
    // Built per-request so the order clause can follow the `sort` URL param.
    query: buildPetsIndexQuery(resolvedSort),
    params: { start, end, ...queryFilters, includeUnapproved: options.preview === true },
    tags: [sanityTags.petIndex]
  });
}

/**
 * Loads the total count of approved public pets.
 */
export function loadPetsIndexCount(filters: PetIndexFilters = {}, options: LoadOptions = {}) {
  const queryFilters = normalizePetIndexFilters(filters);

  return loadQuery<PETS_INDEX_COUNT_QUERY_RESULT>({
    ...options,
    query: PETS_INDEX_COUNT_QUERY,
    params: { ...queryFilters, includeUnapproved: options.preview === true },
    tags: [sanityTags.petIndex]
  });
}

function normalizePetIndexFilters(filters: PetIndexFilters) {
  const petNameQuery = filters.petNameQuery?.trim().toLowerCase() ?? "";

  return {
    petNameQueryMatch: petNameQuery ? `*${petNameQuery}*` : null,
    petTypeSlugs: filters.petTypeSlugs?.length ? filters.petTypeSlugs : null,
    availabilityStatuses: filters.availabilityStatuses?.length ? filters.availabilityStatuses : null,
    pickupUrgencies: filters.pickupUrgencies?.length ? filters.pickupUrgencies : null,
    minChaos: filters.minChaos ?? null,
    minMess: filters.minMess ?? null,
    minEnergy: filters.minEnergy ?? null
  };
}

/**
 * Loads up to six related pets by shared pet type or owner for the pet detail page.
 */
export function loadRelatedPets(
  petId: string,
  petTypeId: string,
  ownerId: string | null,
  options: LoadOptions = {}
) {
  return loadQuery<RELATED_PETS_QUERY_RESULT>({
    ...options,
    query: RELATED_PETS_QUERY,
    params: { petId, petTypeId, ownerId, includeUnapproved: options.preview === true },
    tags: [sanityTags.petIndex]
  });
}

/**
 * Loads one approved public pet by slug.
 */
export function loadPetBySlug(slug: string, options: LoadOptions = {}) {
  return loadQuery<PET_BY_SLUG_QUERY_RESULT>({
    ...options,
    query: PET_BY_SLUG_QUERY,
    params: { slug, includeUnapproved: options.preview === true },
    tags: [sanityTags.pet(slug)]
  });
}

/**
 * Loads one pet by document ID for unpublished draft previews.
 */
export function loadPetById(id: string, options: LoadOptions = {}) {
  return loadQuery<PET_BY_ID_QUERY_RESULT>({
    ...options,
    query: PET_BY_ID_QUERY,
    params: { id },
    tags: [sanityTags.pet(id)]
  });
}

/**
 * Loads approved public pet slugs for static route generation.
 */
export function loadPetSlugs(options: LoadOptions = {}) {
  return loadQuery<PET_SLUGS_QUERY_RESULT>({
    ...options,
    query: PET_SLUGS_QUERY,
    tags: [sanityTags.petIndex],
    useCdn: false
  });
}

/**
 * Loads one owner by direct URL slug, including approved pets owned by that owner.
 */
export function loadOwnerBySlug(slug: string, options: LoadOptions = {}) {
  return loadQuery<OWNER_BY_SLUG_QUERY_RESULT>({
    ...options,
    query: OWNER_BY_SLUG_QUERY,
    params: { slug, includeUnapproved: options.preview === true },
    tags: [sanityTags.owner(slug)]
  });
}

/**
 * Loads one owner by document ID for unpublished draft previews.
 */
export function loadOwnerById(id: string, options: LoadOptions = {}) {
  return loadQuery<OWNER_BY_ID_QUERY_RESULT>({
    ...options,
    query: OWNER_BY_ID_QUERY,
    params: { id, includeUnapproved: options.preview === true },
    tags: [sanityTags.owner(id)]
  });
}

/**
 * Loads owner slugs for direct owner detail routes.
 */
export function loadOwnerSlugs(options: LoadOptions = {}) {
  return loadQuery<OWNER_SLUGS_QUERY_RESULT>({
    ...options,
    query: OWNER_SLUGS_QUERY,
    tags: ["owners"],
    useCdn: false
  });
}

/**
 * Loads pet types for listing filters and labels.
 */
export function loadPetTypes(options: LoadOptions = {}) {
  return loadQuery<PET_TYPES_QUERY_RESULT>({
    ...options,
    query: PET_TYPES_QUERY,
    tags: [sanityTags.petTypes]
  });
}

/**
 * Loads featured testimonials for reusable homepage and marketing sections.
 */
export function loadFeaturedTestimonials(options: LoadOptions = {}) {
  return loadQuery<FEATURED_TESTIMONIALS_QUERY_RESULT>({
    ...options,
    query: FEATURED_TESTIMONIALS_QUERY,
    tags: [sanityTags.testimonials]
  });
}

/**
 * Loads a CMS-authored form definition by slug.
 */
export function loadFormDefinitionBySlug(slug: string, options: LoadOptions = {}) {
  return loadQuery<FORM_DEFINITION_BY_SLUG_QUERY_RESULT>({
    ...options,
    query: FORM_DEFINITION_BY_SLUG_QUERY,
    params: { slug },
    tags: [sanityTags.form(slug)]
  });
}
