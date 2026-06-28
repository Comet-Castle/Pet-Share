import { UserRound } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const owner = defineType({
  name: "owner",
  title: "Owner",
  type: "document",
  icon: UserRound,
  fields: [
    defineField({
      name: "seedKey",
      title: "Seed key",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => value === undefined
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return "Required";
          return /^[a-z0-9-]+$/.test(slug.current)
            ? true
            : "Slug must use lowercase letters, numbers, and hyphens.";
        })
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "imageWithAlt",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.required().max(140)
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "portableText",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "ownerSince", title: "Owner since", type: "string" }),
    defineField({
      name: "pets",
      title: "Manually featured pets",
      type: "array",
      description: "Optional curated pets. Owner pages can also query pets by inverse relationship.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "pet" }] })]
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "reference",
      to: [{ type: "testimonial" }]
    }),
    defineField({ name: "contactCta", title: "Contact CTA", type: "cta" }),
    defineField({ name: "seo", title: "SEO", type: "seo" })
  ],
  preview: {
    select: { title: "name", subtitle: "tagline", media: "portrait.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Owner", subtitle, media: media || UserRound };
    }
  }
});
