import { defineQuery } from "next-sanity";
import { ctaFields, imageWithAltFields, sectionFields, seoFields } from "./fragments";

export const HOME_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "homePage"][0]{
    _id,
    seo{
      ${seoFields}
    },
    heroCarousel[]{
      _key,
      _type,
      headline,
      body,
      image{
        ${imageWithAltFields}
      },
      cta{
        ${ctaFields}
      },
      featuredPet->{
        _id,
        name,
        "slug": slug.current,
        listingHeadline
      },
      featuredOwner->{
        _id,
        name,
        "slug": slug.current,
        tagline
      }
    },
    intro{
      ${sectionFields}
    },
    featuredPets[]->{
      _id,
      name,
      "slug": slug.current,
      listingHeadline,
      listingSummary,
      availabilityStatus,
      cardMedia{
        image{
          ${imageWithAltFields}
        }
      },
      petType->{name, "slug": slug.current, icon, filterLabel}
    },
    featuredOwners[]->{
      _id,
      name,
      "slug": slug.current,
      tagline,
      portrait{
        ${imageWithAltFields}
      }
    },
    processSummary[]{
      _key,
      title,
      description,
      icon,
      order,
      cta{
        ${ctaFields}
      }
    },
    testimonials[]->{
      _id,
      quote,
      authorName,
      authorRole,
      rating,
      tone,
      authorImage{
        ${imageWithAltFields}
      }
    },
    statBlocks[]{
      _key,
      value,
      label,
      description,
      icon
    },
    contentSections[]{
      ${sectionFields}
    },
    primaryCta{
      ${ctaFields}
    }
  }
`);

export const PET_INDEX_PAGE_QUERY = defineQuery(/* groq */ `
  *[_id == "petIndexPage"][0]{
    _id,
    seo{
      ${seoFields}
    },
    hero{
      ${sectionFields}
    },
    summary,
    filterIntro,
    emptyState{
      ${sectionFields}
    },
    featuredPets[]->{
      _id,
      name,
      "slug": slug.current,
      listingHeadline,
      listingSummary,
      availabilityStatus,
      cardMedia{
        image{
          ${imageWithAltFields}
        }
      },
      petType->{name, "slug": slug.current, icon, filterLabel}
    },
    contentSections[]{
      ${sectionFields}
    },
    primaryCta{
      ${ctaFields}
    }
  }
`);

export const MARKETING_PAGE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "marketingPage" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    seo{
      ${seoFields}
    },
    sections[]{
      ${sectionFields}
    },
    showContactForm
  }
`);

export const MARKETING_PAGE_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "marketingPage" && defined(slug.current)] | order(slug.current asc){
    "slug": slug.current
  }
`);

export const SYSTEM_PAGE_BY_TYPE_QUERY = defineQuery(/* groq */ `
  *[_type == "systemPage" && pageType == $pageType][0]{
    _id,
    title,
    pageType,
    seo{
      ${seoFields}
    },
    eyebrow,
    headline,
    message,
    image{
      ${imageWithAltFields}
    },
    primaryCta{
      ${ctaFields}
    },
    secondaryCta{
      ${ctaFields}
    },
    supportCopy,
    contentSections[]{
      ${sectionFields}
    }
  }
`);
