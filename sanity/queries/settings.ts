import { defineQuery } from "next-sanity";
import { ctaFields, imageWithAltFields, linkFields, seoFields } from "./fragments";

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{
    _id,
    title,
    description,
    defaultSeo{
      ${seoFields}
    },
    logo{
      ${imageWithAltFields}
    },
    primaryNavigation[]{
      _key,
      label,
      link{
        ${linkFields}
      },
      children[]{
        _key,
        label,
        link{
          ${linkFields}
        }
      }
    },
    footerNavigation[]{
      _key,
      label,
      link{
        ${linkFields}
      }
    },
    defaultCta{
      ${ctaFields}
    },
    contactEmail
  }
`);
