import { ClipboardList } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { IconPickerInput, VisualStringOptionsInput } from "@/sanity/components/studio-string-inputs";
import { processToneOptions } from "../studio-options";

const placeholderProcessStepBody = [
  {
    _type: "block",
    style: "normal",
    children: [
      {
        _type: "span",
        text: "Explain what happens in this step and what the editor should expect.",
        marks: []
      }
    ],
    markDefs: []
  }
];

export const processPathSection = defineType({
  name: "processPathSection",
  title: "Process: Step path",
  type: "object",
  icon: ClipboardList,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" },
    { name: "steps", title: "Steps" },
    { name: "cta", title: "CTA" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      group: "content",
      rows: 3,
      validation: (rule) => rule.required().max(360)
    }),
    defineField({
      name: "tone",
      title: "Tone",
      description: "Controls the frontend color treatment for this process path.",
      type: "string",
      options: {
        list: processToneOptions
      },
      components: { input: VisualStringOptionsInput },
      group: "display",
      initialValue: "neutral",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional section icon shown in the process path header. Use the browser to search Lucide icons.",
      type: "string",
      group: "display",
      components: { input: IconPickerInput }
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      group: "steps",
      of: [defineArrayMember({ type: "processStep" })],
      validation: (rule) => rule.required().min(2).max(6)
    }),
    defineField({ name: "cta", title: "CTA", type: "cta", group: "cta" })
  ],
  initialValue: {
    tone: "neutral",
    steps: [
      { _type: "processStep", title: "First step", body: placeholderProcessStepBody, icon: "CircleDot" },
      { _type: "processStep", title: "Second step", body: placeholderProcessStepBody, icon: "CircleDot" },
      { _type: "processStep", title: "Third step", body: placeholderProcessStepBody, icon: "CircleDot" },
      { _type: "processStep", title: "Final step", body: placeholderProcessStepBody, icon: "CircleCheck" }
    ]
  },
  preview: {
    select: { title: "title", tone: "tone", steps: "steps" },
    prepare({ title, tone, steps }) {
      const count = Array.isArray(steps) ? steps.length : 0;
      const toneLabel = processToneOptions.find((option) => option.value === tone)?.title;

      return {
        title: title || "Process step path",
        subtitle: `Process: Step path${toneLabel ? ` - ${toneLabel}` : ""} - ${count} steps`,
        media: ClipboardList
      };
    }
  }
});
