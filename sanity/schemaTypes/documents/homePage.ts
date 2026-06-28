import { Home } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionMembers } from "../objects/sections";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: Home,
  fields: [
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "heroCarousel",
      title: "Hero carousel",
      type: "array",
      of: [defineArrayMember({ type: "heroSlide" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({ name: "intro", title: "Intro", type: "contentSection" }),
    defineField({
      name: "featuredPets",
      title: "Featured pets",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "pet" }] })]
    }),
    defineField({
      name: "featuredOwners",
      title: "Featured owners",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "owner" }] })]
    }),
    defineField({
      name: "processSummary",
      title: "Process summary",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })]
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })]
    }),
    defineField({
      name: "statBlocks",
      title: "Stat blocks",
      type: "array",
      of: [defineArrayMember({ type: "statBlock" })]
    }),
    defineField({
      name: "contentSections",
      title: "Content sections",
      type: "array",
      of: sectionMembers
    }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "cta" })
  ],
  validation: (rule) =>
    rule.custom((document) => {
      const hasCta = Boolean(document?.primaryCta);
      const hasFeaturedPets = Array.isArray(document?.featuredPets) && document.featuredPets.length > 0;
      const hasSections = Array.isArray(document?.contentSections) && document.contentSections.length > 0;
      return hasCta || hasFeaturedPets || hasSections
        ? true
        : "Add a CTA, featured pet, or content section.";
    }),
  preview: {
    prepare() {
      return { title: "Home page", media: Home };
    }
  }
});
