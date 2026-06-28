import { Cog } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: Cog,
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      title: "Default description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(180)
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt" }),
    defineField({
      name: "primaryNavigation",
      title: "Primary navigation",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer navigation",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })],
      validation: (rule) => rule.required()
    }),
    defineField({ name: "defaultCta", title: "Default CTA", type: "cta" }),
    defineField({
      name: "contactEmail",
      title: "Public contact email",
      type: "string",
      description: "Display-only email. Server delivery uses CONTACT_TO_EMAIL.",
      validation: (rule) => rule.required().email()
    })
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "logo.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Site settings", subtitle, media: media || Cog };
    }
  }
});
