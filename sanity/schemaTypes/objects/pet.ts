import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  HeartHandshake,
  ListChecks,
  ShieldAlert,
  Sparkle,
  Star
} from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { getLucideIcon } from "@/lib/icons/lucide-icons";
import { IconPickerInput, VisualStringOptionsInput } from "@/sanity/components/studio-string-inputs";
import type { VisualStringOption } from "./studio-options";

const severityOptions = [
  {
    title: "Low",
    value: "low",
    description: "Useful note, low urgency.",
    color: "#26343b",
    background: "#dff5ec",
    border: "#a9dfca"
  },
  {
    title: "Medium",
    value: "medium",
    description: "Important handling context.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  },
  {
    title: "High",
    value: "high",
    description: "Real mismatch or safety concern.",
    color: "#26343b",
    background: "#ffe4dd",
    border: "#ffb49f"
  }
] satisfies VisualStringOption[];

const detailToneOptions = [
  {
    title: "Supportive mint",
    value: "mint",
    description: "Helpful, safe, approved, or good-fit guidance.",
    color: "#26343b",
    background: "#dff5ec",
    border: "#a9dfca"
  },
  {
    title: "Caution coral",
    value: "coral",
    description: "Warnings, mismatch risks, or extra-attention details.",
    color: "#26343b",
    background: "#ffe4dd",
    border: "#ffb49f"
  },
  {
    title: "Editorial blue",
    value: "blue",
    description: "Neutral contrast for personality/editorial notes.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  },
  {
    title: "Neutral cream",
    value: "cream",
    description: "Quiet support copy or routine timeline moments.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#efe7dc"
  }
] satisfies VisualStringOption[];

const traitToneOptions = [
  {
    title: "Friendly",
    value: "friendly",
    description: "Warm, useful personality chip.",
    color: "#26343b",
    background: "#dff5ec",
    border: "#a9dfca"
  },
  {
    title: "Warning",
    value: "warning",
    description: "Playful warning or boundary trait.",
    color: "#26343b",
    background: "#ffe4dd",
    border: "#ffb49f"
  },
  {
    title: "Playful",
    value: "playful",
    description: "Silly, high-character trait.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#efe7dc"
  }
] satisfies VisualStringOption[];

function excerpt(text: string | undefined, fallback: string) {
  if (!text) return fallback;
  return text.length > 72 ? `${text.slice(0, 69)}...` : text;
}

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
      description: "The chip text shown on pet detail pages.",
      validation: (rule) => rule.required().max(48)
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional Lucide icon shown with this trait when a renderer supports it.",
      components: { input: IconPickerInput }
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: { list: traitToneOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "friendly"
    })
  ],
  preview: {
    select: { title: "label", tone: "tone", icon: "icon" },
    prepare({ title, tone, icon }) {
      const toneLabel = traitToneOptions.find((option) => option.value === tone)?.title ?? tone;
      return { title: title || "Pet trait", subtitle: toneLabel, media: icon ? getLucideIcon(icon) : Sparkle };
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
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional Lucide icon used when this stat is rendered.",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "label", subtitle: "value", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: title || "Pet stat", subtitle, media: icon ? getLucideIcon(icon) : Star };
    }
  }
});

export const petVibeItem = defineType({
  name: "petVibeItem",
  title: "Pet vibe item",
  type: "object",
  icon: Sparkle,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Short personality label, such as Cuddle energy or Rule flexibility.",
      validation: (rule) => rule.required().max(40)
    }),
    defineField({
      name: "descriptor",
      title: "Descriptor",
      type: "string",
      description: "Funny-but-useful editor note shown beside the label.",
      validation: (rule) => rule.max(90)
    }),
    defineField({
      name: "strength",
      title: "Strength",
      type: "number",
      description: "0 to 5 display value for the detail-page meter.",
      initialValue: 3,
      validation: (rule) => rule.required().min(0).max(5).precision(1)
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: { list: detailToneOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "blue"
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional Lucide icon for this vibe row.",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "label", subtitle: "descriptor", strength: "strength", icon: "icon" },
    prepare({ title, subtitle, strength, icon }) {
      const meter = typeof strength === "number" ? ` · ${strength}/5` : "";
      return { title: title || "Vibe item", subtitle: `${subtitle || "No descriptor"}${meter}`, media: icon ? getLucideIcon(icon) : Sparkle };
    }
  }
});

export const petFitGuidanceItem = defineType({
  name: "petFitGuidanceItem",
  title: "Pet fit guidance item",
  type: "object",
  icon: CheckCircle2,
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      description: "One concise fit or mismatch point.",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: { list: detailToneOptions },
      components: { input: VisualStringOptionsInput }
    })
  ],
  preview: {
    select: { title: "text", subtitle: "tone" },
    prepare({ title, subtitle }) {
      return { title: excerpt(title, "Fit guidance item"), subtitle, media: CheckCircle2 };
    }
  }
});

export const petFitGuidance = defineType({
  name: "petFitGuidance",
  title: "Pet fit guidance",
  type: "object",
  icon: ListChecks,
  fields: [
    defineField({
      name: "goodFitTitle",
      title: "Good-fit title",
      type: "string",
      initialValue: "Good fit if...",
      validation: (rule) => rule.max(60)
    }),
    defineField({
      name: "goodFitItems",
      title: "Good-fit items",
      type: "array",
      description: "Who should enjoy borrowing this pet. Three to five items is ideal.",
      of: [defineArrayMember({ type: "petFitGuidanceItem" })],
      validation: (rule) => rule.max(5).warning("Prefer 3-5 good-fit items.")
    }),
    defineField({
      name: "avoidTitle",
      title: "Maybe-avoid title",
      type: "string",
      initialValue: "Maybe avoid if...",
      validation: (rule) => rule.max(60)
    }),
    defineField({
      name: "avoidItems",
      title: "Maybe-avoid items",
      type: "array",
      description: "Mismatch risks or boundaries. Three to five items is ideal.",
      of: [defineArrayMember({ type: "petFitGuidanceItem" })],
      validation: (rule) => rule.max(5).warning("Prefer 3-5 maybe-avoid items.")
    })
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true;
      const goodFitCount = Array.isArray(value.goodFitItems) ? value.goodFitItems.length : 0;
      const avoidCount = Array.isArray(value.avoidItems) ? value.avoidItems.length : 0;

      if ((goodFitCount > 0 || avoidCount > 0) && (!goodFitCount || !avoidCount)) {
        return "Add both good-fit and maybe-avoid items so the guidance renders as a balanced pair.";
      }

      return true;
    }),
  preview: {
    select: { title: "goodFitTitle", goodFitItems: "goodFitItems", avoidItems: "avoidItems" },
    prepare({ title, goodFitItems, avoidItems }) {
      const goodFitCount = Array.isArray(goodFitItems) ? goodFitItems.length : 0;
      const avoidCount = Array.isArray(avoidItems) ? avoidItems.length : 0;
      return {
        title: title || "Fit guidance",
        subtitle: `${goodFitCount} good fit · ${avoidCount} maybe avoid`,
        media: ListChecks
      };
    }
  }
});

export const petScheduleItem = defineType({
  name: "petScheduleItem",
  title: "Pet schedule item",
  type: "object",
  icon: CalendarClock,
  fields: [
    defineField({
      name: "timeLabel",
      title: "Time label",
      type: "string",
      description: "Use a human label, such as 8:00 AM, After lunch, or Before bedtime.",
      validation: (rule) => rule.required().max(40)
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(180)
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: { list: detailToneOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "cream"
    })
  ],
  preview: {
    select: { timeLabel: "timeLabel", title: "title", subtitle: "description" },
    prepare({ timeLabel, title, subtitle }) {
      return {
        title: [timeLabel, title].filter(Boolean).join(" · ") || "Schedule item",
        subtitle: excerpt(subtitle, "Day-with-the-pet timeline"),
        media: CalendarClock
      };
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
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220)
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional Lucide icon for this borrowing term.",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "title", subtitle: "description", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: title || "Borrow term", subtitle: excerpt(subtitle, "No description"), media: icon ? getLucideIcon(icon) : ClipboardCheck };
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
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220)
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      description: "Use high only for genuinely important handling notes.",
      options: { list: severityOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "low"
    })
  ],
  preview: {
    select: { title: "title", subtitle: "severity" },
    prepare({ title, subtitle }) {
      return { title: title || "Care note", subtitle: subtitle ? `Severity: ${subtitle}` : undefined, media: HeartHandshake };
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
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220)
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      description: "High severity should be reserved for real mismatch or safety concerns.",
      options: { list: severityOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "medium"
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description: "Optional Lucide icon for this warning.",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "title", subtitle: "severity", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: title || "Pet warning", subtitle: subtitle ? `Severity: ${subtitle}` : undefined, media: icon ? getLucideIcon(icon) : ShieldAlert };
    }
  }
});

export const petObjects = [
  petTrait,
  petStat,
  petVibeItem,
  petFitGuidanceItem,
  petFitGuidance,
  petScheduleItem,
  availabilityWindow,
  borrowTerm,
  careNote,
  petWarning
];
