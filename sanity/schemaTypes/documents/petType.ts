import { PawPrint } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { petTypeCategoryOptions } from "./constants";

export const petType = defineType({
  name: "petType",
  title: "Pet type",
  type: "document",
  icon: PawPrint,
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
      name: "pluralName",
      title: "Plural name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "filterLabel",
      title: "Filter label",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: petTypeCategoryOptions },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "icon",
      title: "Lucide fallback icon name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "customIcon",
      title: "Custom SVG icon",
      type: "file",
      options: { accept: "image/svg+xml" }
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 2 }),
    defineField({ name: "description", title: "Description", type: "portableText" }),
    defineField({ name: "defaultImage", title: "Default image", type: "imageWithAlt" }),
    defineField({
      name: "traits",
      title: "Typical traits",
      type: "array",
      of: [defineArrayMember({ type: "petTrait" })]
    }),
    defineField({
      name: "careNotes",
      title: "Typical care notes",
      type: "array",
      of: [defineArrayMember({ type: "careNote" })]
    }),
    defineField({
      name: "warnings",
      title: "Typical warnings",
      type: "array",
      of: [defineArrayMember({ type: "petWarning" })]
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      validation: (rule) => rule.required().integer()
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "seo", title: "SEO", type: "seo" })
  ],
  preview: {
    select: { title: "name", subtitle: "category" },
    prepare({ title, subtitle }) {
      return { title: title || "Pet type", subtitle, media: PawPrint };
    }
  }
});
