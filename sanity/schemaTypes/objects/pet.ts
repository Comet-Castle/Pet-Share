import {
  CalendarClock,
  ClipboardCheck,
  HeartHandshake,
  ShieldAlert,
  Sparkle,
  Star
} from "lucide-react";
import { defineField, defineType } from "sanity";

const severityOptions = [
  { title: "Low", value: "low" },
  { title: "Medium", value: "medium" },
  { title: "High", value: "high" }
];

export const petTrait = defineType({
  name: "petTrait",
  title: "Pet trait",
  type: "object",
  icon: Sparkle,
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
      validation: (rule) => rule.required()
    }),
    defineField({ name: "icon", title: "Icon name", type: "string" }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Friendly", value: "friendly" },
          { title: "Warning", value: "warning" },
          { title: "Playful", value: "playful" }
        ],
        layout: "radio"
      },
      initialValue: "friendly"
    })
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
    prepare({ title, subtitle }) {
      return { title: title || "Pet trait", subtitle, media: Sparkle };
    }
  }
});

export const petStat = defineType({
  name: "petStat",
  title: "Pet stat",
  type: "object",
  icon: Star,
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
      validation: (rule) => rule.required()
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({ name: "icon", title: "Icon name", type: "string" })
  ],
  preview: {
    select: { title: "label", subtitle: "value" },
    prepare({ title, subtitle }) {
      return { title: title || "Pet stat", subtitle, media: Star };
    }
  }
});

export const availabilityWindow = defineType({
  name: "availabilityWindow",
  title: "Availability window",
  type: "object",
  icon: CalendarClock,
  fields: [
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = (context.parent as { startDate?: string })?.startDate;
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return "End date must be after start date";
          }
          return true;
        })
    }),
    defineField({ name: "note", title: "Note", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Temporarily unavailable", value: "temporarilyUnavailable" },
          { title: "Pending pickup", value: "pendingPickup" }
        ],
        layout: "radio"
      },
      initialValue: "available"
    })
  ],
  preview: {
    select: { start: "startDate", end: "endDate", subtitle: "status" },
    prepare({ start, end, subtitle }) {
      return {
        title: [start, end].filter(Boolean).join(" to ") || "Availability window",
        subtitle,
        media: CalendarClock
      };
    }
  }
});

export const borrowTerm = defineType({
  name: "borrowTerm",
  title: "Borrow term",
  type: "object",
  icon: ClipboardCheck,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({ name: "icon", title: "Icon name", type: "string" })
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
    prepare({ title, subtitle }) {
      return { title: title || "Borrow term", subtitle, media: ClipboardCheck };
    }
  }
});

export const careNote = defineType({
  name: "careNote",
  title: "Care note",
  type: "object",
  icon: HeartHandshake,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: { list: severityOptions, layout: "radio" },
      initialValue: "low"
    })
  ],
  preview: {
    select: { title: "title", subtitle: "severity" },
    prepare({ title, subtitle }) {
      return { title: title || "Care note", subtitle, media: HeartHandshake };
    }
  }
});

export const petWarning = defineType({
  name: "petWarning",
  title: "Pet warning",
  type: "object",
  icon: ShieldAlert,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: { list: severityOptions, layout: "radio" },
      initialValue: "medium"
    }),
    defineField({ name: "icon", title: "Icon name", type: "string" })
  ],
  preview: {
    select: { title: "title", subtitle: "severity" },
    prepare({ title, subtitle }) {
      return { title: title || "Pet warning", subtitle, media: ShieldAlert };
    }
  }
});

export const petObjects = [
  petTrait,
  petStat,
  availabilityWindow,
  borrowTerm,
  careNote,
  petWarning
];
