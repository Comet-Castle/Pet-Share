import { defineQuery } from "next-sanity";
import { ctaFields } from "./fragments";

export const FORM_DEFINITION_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "formDefinition" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    formType,
    submitLabel,
    successMessage{
      headline,
      message,
      cta{
        ${ctaFields}
      }
    },
    fields[]{
      _key,
      label,
      name,
      type,
      required,
      helpText,
      options[]{
        _key,
        label,
        value
      }
    }
  }
`);
