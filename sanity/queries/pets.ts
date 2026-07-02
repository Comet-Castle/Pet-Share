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

const petIndexFilters = /* groq */ `
  ${publicPetFilter} &&
  (!defined($petTypeSlugs) || petType->slug.current in $petTypeSlugs) &&
  (!defined($availabilityStatuses) || availabilityStatus in $availabilityStatuses) &&
  (!defined($cuddlePolicies) || cuddlePolicy in $cuddlePolicies) &&
  (!defined($minChaos) || chaosLevel >= $minChaos) &&
  (!defined($minMess) || messRisk >= $minMess) &&
  (!defined($minEnergy) || energyLevel >= $minEnergy)
`;

export const PETS_INDEX_QUERY = defineQuery(/* groq */ `
  *[${petIndexFilters}]
  | order(name asc, _id asc)[$start...$end]{
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
    dateOfBirth,
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
    careNotes[],
    availability[],
    borrowTerms[],
    stats[],
    warnings[],
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
    dateOfBirth,
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
    careNotes[],
    availability[],
    borrowTerms[],
    stats[],
    warnings[],
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
    "slug": slug.current
  }
`);
