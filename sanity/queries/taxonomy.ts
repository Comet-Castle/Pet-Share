import { defineQuery } from "next-sanity";
import { imageWithAltFields } from "./fragments";

export const PET_TYPES_QUERY = defineQuery(/* groq */ `
  *[_type == "petType" && defined(slug.current)]
  | order(sortOrder asc, name asc){
    _id,
    name,
    pluralName,
    "slug": slug.current,
    filterLabel,
    category,
    icon,
    customIcon,
    summary,
    defaultImage{
      ${imageWithAltFields}
    },
    sortOrder,
    featured
  }
`);
