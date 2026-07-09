import { defineQuery } from "next-sanity";
import {
  ctaFields,
  imageWithAltFields,
  petCardFields,
  portableTextFields,
  seoFields,
  videoEmbedFields
} from "./fragments";

const publicPetFilter = /* groq */ `
  _type == "pet" &&
  defined(slug.current) &&
  (
    submissionStatus == "approved" ||
    ($includeUnapproved == true && !(submissionStatus in ["rejected", "archived"]))
  )
`;

export const petIndexFilters = /* groq */ `
  ${publicPetFilter} &&
  (!defined($petNameQueryMatch) || lower(name) match $petNameQueryMatch) &&
  (!defined($petTypeSlugs) || petType->slug.current in $petTypeSlugs) &&
  (!defined($availabilityStatuses) || availabilityStatus in $availabilityStatuses) &&
  (!defined($pickupUrgencies) || pickupUrgency in $pickupUrgencies) &&
  (!defined($minChaos) || chaosLevel >= $minChaos) &&
  (!defined($minMess) || messRisk >= $minMess) &&
  (!defined($minEnergy) || energyLevel >= $minEnergy)
`;

// GROQ in this Sanity version does not support `select()`, so the enum-based
// "featured first" sort ranks values with descending boolean comparisons instead.
// Each order clause falls back to a stable name/_id tiebreak. The distance sort
// pushes pets without a distance to the end via `defined(...) desc`.
export const petIndexSortOrders = {
  featured:
    '(listingPlan == "spotlight") desc, (listingPlan == "couchRecovery") desc, name asc, _id asc',
  newest: '_createdAt desc, name asc, _id asc',
  distance: 'defined(distanceKilometers) desc, distanceKilometers asc, name asc, _id asc',
  alphabetical: 'name asc, _id asc'
} as const;

export type PetIndexSort = keyof typeof petIndexSortOrders;

export function resolvePetIndexSort(sort: string | undefined): PetIndexSort {
  return sort && sort in petIndexSortOrders ? (sort as PetIndexSort) : "featured";
}

// The pet index query is built at runtime so the order clause can change with the
// `sort` URL param. The projection is identical to `PETS_INDEX_QUERY`, so results
// stay typed as `PETS_INDEX_QUERY_RESULT` (generated from the defineQuery below).
export function buildPetsIndexQuery(sort: PetIndexSort = "featured"): string {
  return /* groq */ `*[${petIndexFilters}] | order(${petIndexSortOrders[sort]})[$start...$end]{ ${petCardFields} }`;
}

export const PETS_INDEX_QUERY = defineQuery(/* groq */ `
  *[${petIndexFilters}]
  | order(${petIndexSortOrders.featured})[$start...$end]{
    ${petCardFields}
  }
`);

export const PETS_INDEX_COUNT_QUERY = defineQuery(/* groq */ `
  count(*[${petIndexFilters}])
`);

export const PET_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[${publicPetFilter} && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    breed,
    ageYears,
    listingHeadline,
    listingSummary,
    availabilityStatus,
    temperament,
    pickupUrgency,
    messRisk,
    chaosLevel,
    energyLevel,
    cuddlePolicy,
    cardMedia{
      image{
        ${imageWithAltFields}
      },
      lowFrameRateVideo{
        ${videoEmbedFields}
      }
    },
    heroImages[]{
      _key,
      ${imageWithAltFields}
    },
    summary,
    description[]{
      ${portableTextFields}
    },
    personalityTraits[],
    vibeProfile[],
    fitGuidance,
    careNotes[],
    availability[],
    borrowTerms[],
    stats[],
    warnings[],
    dailySchedule[],
    videos[]{
      _key,
      ${videoEmbedFields}
    },
    contactOwnerCta{
      ${ctaFields}
    },
    seo{
      ${seoFields}
    },
    petType->{
      _id,
      name,
      pluralName,
      "slug": slug.current,
      filterLabel,
      icon,
      category,
      summary
    },
    owner->{
      _id,
      name,
      "slug": slug.current,
      tagline,
      bio[]{
        ${portableTextFields}
      },
      location,
      memberSince,
      portrait{
        ${imageWithAltFields}
      },
      contactCta{
        ${ctaFields}
      }
    },
    testimonial->{
      _id,
      quote,
      authorName,
      authorRole,
      rating,
      tone,
      authorImage{
        ${imageWithAltFields}
      }
    }
  }
`);

export const PET_BY_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "pet" && _id == $id][0]{
    _id,
    name,
    "slug": slug.current,
    breed,
    ageYears,
    listingHeadline,
    listingSummary,
    availabilityStatus,
    temperament,
    pickupUrgency,
    messRisk,
    chaosLevel,
    energyLevel,
    cuddlePolicy,
    cardMedia{
      image{
        ${imageWithAltFields}
      },
      lowFrameRateVideo{
        ${videoEmbedFields}
      }
    },
    heroImages[]{
      _key,
      ${imageWithAltFields}
    },
    summary,
    description[]{
      ${portableTextFields}
    },
    personalityTraits[],
    vibeProfile[],
    fitGuidance,
    careNotes[],
    availability[],
    borrowTerms[],
    stats[],
    warnings[],
    dailySchedule[],
    videos[]{
      _key,
      ${videoEmbedFields}
    },
    contactOwnerCta{
      ${ctaFields}
    },
    seo{
      ${seoFields}
    },
    petType->{
      _id,
      name,
      pluralName,
      "slug": slug.current,
      filterLabel,
      icon,
      category,
      summary
    },
    owner->{
      _id,
      name,
      "slug": slug.current,
      tagline,
      bio[]{
        ${portableTextFields}
      },
      location,
      memberSince,
      portrait{
        ${imageWithAltFields}
      },
      contactCta{
        ${ctaFields}
      }
    },
    testimonial->{
      _id,
      quote,
      authorName,
      authorRole,
      rating,
      tone,
      authorImage{
        ${imageWithAltFields}
      }
    }
  }
`);

export const PET_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "pet" && defined(slug.current) && submissionStatus == "approved"] | order(slug.current asc){
    "slug": slug.current,
    "noIndex": seo.noIndex,
    _updatedAt
  }
`);

const relatedPetFilter = /* groq */ `
  ${publicPetFilter} &&
  _id != $petId &&
  (
    petType._ref == $petTypeId ||
    ($ownerId != null && owner._ref == $ownerId)
  )
`;

// Related pets surface the same pet type or the same owner, with same-owner pets
// promoted first. Capped for a compact related grid on the pet detail page.
export const RELATED_PETS_QUERY = defineQuery(/* groq */ `
  *[${relatedPetFilter}]
  | order(($ownerId != null && owner._ref == $ownerId) desc, name asc, _id asc)[0...6]{
    ${petCardFields}
  }
`);
