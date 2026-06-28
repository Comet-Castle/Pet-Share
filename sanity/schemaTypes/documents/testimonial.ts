import { MessageSquareQuote } from "lucide-react";
import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: MessageSquareQuote,
  fields: [
    defineField({
      name: "seedKey",
      title: "Seed key",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => value === undefined
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "authorImage", title: "Author image", type: "imageWithAlt" }),
    defineField({ name: "authorRole", title: "Author role", type: "string" }),
    defineField({
      name: "relatedPet",
      title: "Related pet",
      type: "reference",
      to: [{ type: "pet" }]
    }),
    defineField({
      name: "relatedOwner",
      title: "Related owner",
      type: "reference",
      to: [{ type: "owner" }]
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.min(0).max(5).precision(1)
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Playful", value: "playful" },
          { title: "Trust", value: "trust" },
          { title: "Warning", value: "warning" }
        ],
        layout: "radio"
      },
      initialValue: "playful"
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false })
  ],
  preview: {
    select: { title: "authorName", subtitle: "quote", media: "authorImage.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Testimonial", subtitle, media: media || MessageSquareQuote };
    }
  }
});
