import { ListFilter } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionMembers } from "../objects/sections";

export const petIndexPage = defineType({
  name: "petIndexPage",
  title: "Pet index page",
  type: "document",
  icon: ListFilter,
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "hero",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "filterIntro",
      title: "Filter intro",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "emptyState",
      title: "Empty state",
      type: "calloutBlock",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "featuredPets",
      title: "Featured pets",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "pet" }] })]
    }),
    defineField({
      name: "contentSections",
      title: "Content sections",
      type: "array",
      of: sectionMembers
    }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "cta" })
  ],
  preview: {
    prepare() {
      return { title: "Pet index page", media: ListFilter };
    }
  }
});
