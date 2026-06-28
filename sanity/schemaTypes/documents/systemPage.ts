import { ShieldQuestion } from "lucide-react";
import { defineField, defineType } from "sanity";
import { sectionMembers } from "../objects/sections";

export const systemPage = defineType({
  name: "systemPage",
  title: "System page",
  type: "document",
  icon: ShieldQuestion,
  initialValue: {
    seo: { noIndex: true }
  },
  fields: [
    defineField({
      name: "title",
      title: "Editor title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "pageType",
      title: "Page type",
      type: "string",
      options: {
        list: [
          { title: "Not found", value: "notFound" },
          { title: "Server error", value: "serverError" },
          { title: "Generic error", value: "genericError" },
          { title: "Maintenance", value: "maintenance" },
          { title: "Preview error", value: "previewError" }
        ],
        layout: "radio"
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required()
    }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "cta" }),
    defineField({ name: "supportCopy", title: "Support copy", type: "text", rows: 3 }),
    defineField({
      name: "contentSections",
      title: "Content sections",
      type: "array",
      of: sectionMembers
    })
  ],
  preview: {
    select: { title: "headline", subtitle: "pageType" },
    prepare({ title, subtitle }) {
      return { title: title || "System page", subtitle, media: ShieldQuestion };
    }
  }
});
