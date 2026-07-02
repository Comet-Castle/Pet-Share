import { FileText } from "lucide-react";
import { defineField, defineType } from "sanity";
import { sectionMembers } from "../objects/sections";
import { reservedMarketingSlugs } from "./constants";

export const marketingPage = defineType({
  name: "marketingPage",
  title: "Standard Page",
  type: "document",
  icon: FileText,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
    { name: "settings", title: "Settings" }
  ],
  fields: [
    defineField({
      name: "seedKey",
      title: "Seed key",
      type: "string",
      group: "settings",
      readOnly: true,
      hidden: ({ value }) => value === undefined
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "settings",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return "Required";
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return "Slug must use lowercase letters, numbers, and hyphens.";
          }
          if (reservedMarketingSlugs.includes(slug.current)) {
            return "This slug is reserved for an application route.";
          }
          return true;
        })
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "sections",
      title: "Page builder",
      description: "Add, remove, and reorder page sections. Use a Hero block first when this page needs a top hero.",
      type: "array",
      group: "content",
      of: sectionMembers,
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "showContactForm",
      title: "Show contact form",
      type: "boolean",
      group: "settings",
      initialValue: false
    })
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare({ title, subtitle }) {
      return { title: title || "Standard Page", subtitle: subtitle ? `/${subtitle}` : undefined, media: FileText };
    }
  }
});
