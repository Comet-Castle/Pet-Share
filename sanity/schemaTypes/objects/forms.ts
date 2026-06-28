import { CheckCircle, ListChecks, MailQuestion } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const formOption = defineType({
  name: "formOption",
  title: "Form option",
  type: "object",
  icon: ListChecks,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (rule) =>
        rule.required().regex(/^[a-zA-Z0-9_-]+$/, {
          name: "machine-readable value"
        })
    })
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
    prepare({ title, subtitle }) {
      return { title: title || "Form option", subtitle, media: ListChecks };
    }
  }
});

export const formField = defineType({
  name: "formField",
  title: "Form field",
  type: "object",
  icon: MailQuestion,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "name",
      title: "Machine name",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z][a-zA-Z0-9_]*$/, {
            name: "camelCase field name"
          })
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Email", value: "email" },
          { title: "Textarea", value: "textarea" },
          { title: "Select", value: "select" },
          { title: "Checkbox", value: "checkbox" }
        ],
        layout: "radio"
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "required",
      title: "Required",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required()
    }),
    defineField({ name: "helpText", title: "Help text", type: "string" }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [defineArrayMember({ type: "formOption" })],
      hidden: ({ parent }) => !["select", "checkbox"].includes(parent?.type)
    })
  ],
  preview: {
    select: { title: "label", name: "name", type: "type", required: "required" },
    prepare({ title, name, type, required }) {
      return {
        title: title || "Form field",
        subtitle: [name, type, required ? "required" : ""].filter(Boolean).join(" - "),
        media: MailQuestion
      };
    }
  }
});

export const formSuccessState = defineType({
  name: "formSuccessState",
  title: "Form success state",
  type: "object",
  icon: CheckCircle,
  fields: [
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
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({ name: "cta", title: "CTA", type: "cta" })
  ],
  preview: {
    select: { title: "headline", subtitle: "message" },
    prepare({ title, subtitle }) {
      return { title: title || "Success state", subtitle, media: CheckCircle };
    }
  }
});

export const formObjects = [formOption, formField, formSuccessState];
