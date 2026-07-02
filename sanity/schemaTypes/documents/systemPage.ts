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
  groups: [
    { name: "settings", title: "Settings", default: true },
    { name: "content", title: "Content" },
    { name: "actions", title: "Actions" },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Editor title",
      type: "string",
      group: "settings",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "pageType",
      title: "Page type",
      type: "string",
      group: "settings",
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
      group: "seo",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "content" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      group: "content",
      rows: 4,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "image",
      title: "Image",
      description: "Optional system-page illustration shown beside the main error copy.",
      type: "imageWithAlt",
      group: "content"
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "cta",
      group: "actions",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "cta", group: "actions" }),
    defineField({ name: "supportCopy", title: "Support copy", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "contentSections",
      title: "Content sections",
      description: "Optional lower sections rendered below the main system message. Keep these brief so errors remain clear.",
      type: "array",
      group: "sections",
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
