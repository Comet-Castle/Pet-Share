import { defineQuery } from "next-sanity";
import { ctaFields, imageWithAltFields, petCardFields, portableTextFields, seoFields } from "./fragments";

export const OWNER_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "owner" && slug.current == $slug][0]{
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
    },
    seo{
      ${seoFields}
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
    },
    "pets": *[
      _type == "pet" &&
      owner._ref == ^._id &&
      (
        submissionStatus == "approved" ||
        ($includeUnapproved == true && !(submissionStatus in ["rejected", "archived"]))
      ) &&
      defined(slug.current)
    ] | order(name asc){
      ${petCardFields}
    }
  }
`);

export const OWNER_BY_ID_QUERY = defineQuery(/* groq */ `
  *[_type == "owner" && _id == $id][0]{
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
    },
    seo{
      ${seoFields}
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
    },
    "pets": *[
      _type == "pet" &&
      owner._ref == ^._id &&
      (
        submissionStatus == "approved" ||
        ($includeUnapproved == true && !(submissionStatus in ["rejected", "archived"]))
      ) &&
      defined(slug.current)
    ] | order(name asc){
      ${petCardFields}
    }
  }
`);

export const OWNER_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "owner" && defined(slug.current)] | order(slug.current asc){
    "slug": slug.current
  }
`);
