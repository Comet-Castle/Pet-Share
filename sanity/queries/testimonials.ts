import { defineQuery } from "next-sanity";
import { imageWithAltFields } from "./fragments";

export const FEATURED_TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial" && featured == true]
  | order(_updatedAt desc){
    _id,
    quote,
    authorName,
    authorRole,
    rating,
    tone,
    authorImage{
      ${imageWithAltFields}
    },
    relatedPet->{
      _id,
      name,
      "slug": slug.current
    },
    relatedOwner->{
      _id,
      name,
      "slug": slug.current
    }
  }
`);
