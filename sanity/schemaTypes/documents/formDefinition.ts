import { MailQuestion } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const formDefinition = defineType({
  name: "formDefinition",
  title: "Form definition",
  type: "document",
  icon: MailQuestion,
  fields: [
    defineField({
      name: "seedKey",
      title: "Seed key",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => value === undefined
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return "Required";
          return /^[a-z0-9-]+$/.test(slug.current)
            ? true
            : "Slug must use lowercase letters, numbers, and hyphens.";
        })
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "formSuccessState",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "fields",
      title: "Fields",
      type: "array",
      of: [defineArrayMember({ type: "formField" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "submitLabel",
      title: "Submit label",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "formType",
      title: "Form type",
      type: "string",
      options: {
        list: [
          { title: "Contact", value: "contact" },
          { title: "Owner contact", value: "ownerContact" },
          { title: "Warranty", value: "warranty" },
          { title: "Submit pet", value: "submitPet" }
        ],
        layout: "radio"
      },
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: { title: "title", subtitle: "formType" },
    prepare({ title, subtitle }) {
      return { title: title || "Form definition", subtitle, media: MailQuestion };
    }
  }
});
