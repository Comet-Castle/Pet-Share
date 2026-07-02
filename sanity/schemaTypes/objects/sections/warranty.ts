import { ClipboardCheck, FileWarning, Inbox, PanelsTopLeft, Scale, ShieldQuestion } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { getLucideIcon } from "@/lib/icons/lucide-icons";
import { IconPickerInput } from "@/sanity/components/studio-string-inputs";

const warrantyToneOptions = [
  { title: "Covered-ish", value: "covered" },
  { title: "Not covered", value: "excluded" },
  { title: "Please do not send", value: "evidence" }
];

export const warrantyConditionItem = defineType({
  name: "warrantyConditionItem",
  title: "Warranty condition item",
  type: "object",
  icon: ShieldQuestion,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(300)
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: { list: warrantyToneOptions, layout: "radio" },
      initialValue: "covered",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this warranty condition. Use the browser to search Lucide icons.",
      type: "string",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "title", subtitle: "body", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: title || "Warranty condition", subtitle, media: icon ? getLucideIcon(icon) : ShieldQuestion };
    }
  }
});

export const warrantyConditionGrid = defineType({
  name: "warrantyConditionGrid",
  title: "Warranty condition cards",
  type: "object",
  icon: PanelsTopLeft,
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "items",
      title: "Condition cards",
      type: "array",
      of: [defineArrayMember({ type: "warrantyConditionItem" })],
      validation: (rule) => rule.required().min(3).max(3)
    })
  ],
  initialValue: {
    header: {
      _type: "sectionHeader",
      headline: "Before you file a deeply reasonable claim",
      body: "Most temporary companion incidents fit into one of these official-looking categories.",
      alignment: "center"
    },
    items: [
      { _type: "warrantyConditionItem", title: "Covered-ish", tone: "covered", icon: "ClipboardCheck" },
      { _type: "warrantyConditionItem", title: "Not covered", tone: "excluded", icon: "Scale" },
      { _type: "warrantyConditionItem", title: "Please do not send", tone: "evidence", icon: "Inbox" }
    ]
  },
  preview: {
    select: { title: "header.headline", items: "items" },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;

      return {
        title: title || "Warranty condition cards",
        subtitle: `${count} condition card${count === 1 ? "" : "s"}`,
        media: PanelsTopLeft
      };
    }
  }
});

export const warrantyNoticeSection = defineType({
  name: "warrantyNoticeSection",
  title: "Warranty legal notice",
  type: "object",
  icon: FileWarning,
  fields: [
    defineField({
      name: "anchorId",
      title: "Anchor ID",
      description: "Optional page anchor for CTA links. Use lowercase letters, numbers, and hyphens.",
      type: "string",
      validation: (rule) => rule.regex(/^[a-z0-9-]+$/).max(80)
    }),
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "body",
      title: "Notice body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "badgeLabel",
      title: "Badge label",
      type: "string",
      validation: (rule) => rule.max(60)
    })
  ],
  preview: {
    select: { title: "header.headline", subtitle: "badgeLabel" },
    prepare({ title, subtitle }) {
      return { title: title || "Warranty legal notice", subtitle, media: FileWarning };
    }
  }
});

export const warrantyClaimPrepItem = defineType({
  name: "warrantyClaimPrepItem",
  title: "Warranty claim prep item",
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
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220)
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this prep item. Use the browser to search Lucide icons.",
      type: "string",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "title", subtitle: "body", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: title || "Claim prep item", subtitle, media: icon ? getLucideIcon(icon) : ClipboardCheck };
    }
  }
});

export const warrantyClaimPrep = defineType({
  name: "warrantyClaimPrep",
  title: "Warranty claim prep",
  type: "object",
  icon: ClipboardCheck,
  fields: [
    defineField({
      name: "anchorId",
      title: "Anchor ID",
      description: "Optional page anchor for CTA links. Use lowercase letters, numbers, and hyphens.",
      type: "string",
      validation: (rule) => rule.regex(/^[a-z0-9-]+$/).max(80)
    }),
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "items",
      title: "Prep items",
      type: "array",
      of: [defineArrayMember({ type: "warrantyClaimPrepItem" })],
      validation: (rule) => rule.required().min(2).max(4)
    }),
    defineField({ name: "ctaGroup", title: "CTA group", type: "ctaGroup" })
  ],
  preview: {
    select: { title: "header.headline", items: "items" },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;

      return {
        title: title || "Warranty claim prep",
        subtitle: `${count} prep item${count === 1 ? "" : "s"}`,
        media: ClipboardCheck
      };
    }
  }
});

export const warrantySectionObjects = [
  warrantyConditionGrid,
  warrantyConditionItem,
  warrantyNoticeSection,
  warrantyClaimPrep,
  warrantyClaimPrepItem
];
