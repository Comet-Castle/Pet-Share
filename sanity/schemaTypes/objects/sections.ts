import {
  BarChart3,
  ClipboardList,
  HelpCircle,
  LayoutPanelTop,
  ListChecks,
  PanelTop,
  Rows3,
  Sparkles,
  Star
} from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { getLucideIcon } from "@/lib/icons/lucide-icons";
import { IconPickerInput, VisualStringOptionsInput } from "@/sanity/components/studio-string-inputs";
import {
  calloutToneOptions,
  contentLayoutOptions,
  featureIconStyleOptions,
  heroLayoutOptions
} from "./studio-options";
import { processPathSection } from "./sections/process";
import { pricingSectionObjects } from "./sections/pricing";
import { warrantySectionObjects } from "./sections/warranty";

const placeholderProcessStepBody = [
  {
    _type: "block",
    _key: "processStepBodyBlock",
    style: "normal",
    children: [
      {
        _type: "span",
        _key: "processStepBodyText",
        text: "Explain what happens in this step and what the editor should expect.",
        marks: []
      }
    ],
    markDefs: []
  }
];

export const sectionMembers = [
  defineArrayMember({ type: "hero" }),
  defineArrayMember({ type: "contentSection" }),
  defineArrayMember({ type: "calloutBlock" }),
  defineArrayMember({ type: "statBlock" }),
  defineArrayMember({ type: "featureList" }),
  defineArrayMember({ type: "accordion" }),
  defineArrayMember({ type: "pricingComparisonTable" }),
  defineArrayMember({ type: "pricingValueSection" }),
  defineArrayMember({ type: "pricingPackageGrid" }),
  defineArrayMember({ type: "pricingCtaBand" }),
  defineArrayMember({ type: "processPathSection" }),
  defineArrayMember({ type: "warrantyConditionGrid" }),
  defineArrayMember({ type: "warrantyNoticeSection" }),
  defineArrayMember({ type: "warrantyClaimPrep" }),
  defineArrayMember({ type: "ctaGroup" })
];

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: LayoutPanelTop,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "actions", title: "Actions" },
    { name: "display", title: "Display" }
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "content" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(140)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      group: "content",
      rows: 4,
      validation: (rule) => rule.max(360)
    }),
    defineField({
      name: "image",
      title: "Image",
      description: "Used by the media-card layout. Centered heroes can leave this empty.",
      type: "imageWithAlt",
      group: "media"
    }),
    defineField({ name: "ctaGroup", title: "CTA group", type: "ctaGroup", group: "actions" }),
    defineField({
      name: "layoutHint",
      title: "Layout",
      description: "Choose whether the hero uses a media card or the centered marketing hero treatment.",
      type: "string",
      group: "display",
      options: { list: heroLayoutOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "centered"
    })
  ],
  initialValue: {
    layoutHint: "centered"
  },
  preview: {
    select: { title: "headline", eyebrow: "eyebrow", layout: "layoutHint", media: "image.image" },
    prepare({ title, eyebrow, layout, media }) {
      const layoutLabel = heroLayoutOptions.find((option) => option.value === layout)?.title ?? "Hero";
      const subtitle = [eyebrow, layoutLabel].filter(Boolean).join(" - ");

      return { title: title || "Hero", subtitle, media: media || LayoutPanelTop };
    }
  }
});

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero slide",
  type: "object",
  icon: PanelTop,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "actions", title: "Actions" },
    { name: "relationships", title: "References" }
  ],
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(140)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      group: "content",
      rows: 4,
      validation: (rule) => rule.required().max(360)
    }),
    defineField({
      name: "image",
      title: "Image",
      description: "Full-bleed slide image. Use a wide banner crop with room for overlaid copy.",
      type: "imageWithAlt",
      group: "media",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "cta", title: "CTA", type: "cta", group: "actions" }),
    defineField({
      name: "featuredPet",
      title: "Featured pet",
      type: "reference",
      group: "relationships",
      to: [{ type: "pet" }]
    }),
    defineField({
      name: "featuredOwner",
      title: "Featured owner",
      type: "reference",
      group: "relationships",
      to: [{ type: "owner" }]
    })
  ],
  preview: {
    select: { title: "headline", subtitle: "cta.label", media: "image.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Hero slide", subtitle, media: media || PanelTop };
    }
  }
});

export const contentSection = defineType({
  name: "contentSection",
  title: "Content section",
  type: "object",
  icon: Rows3,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "actions", title: "Actions" },
    { name: "display", title: "Display" }
  ],
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader", group: "content" }),
    defineField({
      name: "body",
      title: "Body",
      description: "Main rich text content for this section.",
      type: "portableText",
      group: "content",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "media", title: "Media", type: "imageWithAlt", group: "media" }),
    defineField({ name: "ctaGroup", title: "CTA group", type: "ctaGroup", group: "actions" }),
    defineField({
      name: "layoutHint",
      title: "Layout hint",
      type: "string",
      group: "display",
      options: { list: contentLayoutOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "textOnly"
    })
  ],
  initialValue: {
    layoutHint: "textOnly"
  },
  preview: {
    select: { title: "header.headline", subtitle: "layoutHint", media: "media.image" },
    prepare({ title, subtitle, media }) {
      const layoutLabel = contentLayoutOptions.find((option) => option.value === subtitle)?.title ?? subtitle;

      return { title: title || "Content section", subtitle: layoutLabel, media: media || Rows3 };
    }
  }
});

export const calloutBlock = defineType({
  name: "calloutBlock",
  title: "Callout block",
  type: "object",
  icon: Sparkles,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "actions", title: "Actions" },
    { name: "display", title: "Display" }
  ],
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
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
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this callout block. Use the browser to search Lucide icons.",
      type: "string",
      group: "display",
      components: { input: IconPickerInput }
    }),
    defineField({ name: "cta", title: "CTA", type: "cta", group: "actions" }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      group: "display",
      options: { list: calloutToneOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "playful"
    })
  ],
  initialValue: {
    tone: "friendly",
    icon: "Sparkles"
  },
  preview: {
    select: { title: "headline", tone: "tone", icon: "icon" },
    prepare({ title, tone, icon }) {
      const toneLabel = calloutToneOptions.find((option) => option.value === tone)?.title ?? tone;

      return { title: title || "Callout", subtitle: toneLabel, media: icon ? getLucideIcon(icon) : Sparkles };
    }
  }
});

export const statBlock = defineType({
  name: "statBlock",
  title: "Stat block",
  type: "object",
  icon: BarChart3,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" }
  ],
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      description: "Short metric value, such as 50, 3 days, or 98%.",
      group: "content",
      validation: (rule) => rule.required().max(40)
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2, group: "content" }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this stat block. Use the browser to search Lucide icons.",
      type: "string",
      group: "display",
      components: { input: IconPickerInput }
    })
  ],
  initialValue: {
    icon: "BarChart3"
  },
  preview: {
    select: { title: "value", subtitle: "label", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: title || "Stat", subtitle, media: icon ? getLucideIcon(icon) : BarChart3 };
    }
  }
});

export const featureList = defineType({
  name: "featureList",
  title: "Feature list",
  type: "object",
  icon: ListChecks,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" }
  ],
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader", group: "content" }),
    defineField({
      name: "items",
      title: "Items",
      description: "Reusable feature cards. Keep each item concise enough to scan in a grid.",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          name: "featureItem",
          title: "Feature item",
          type: "object",
          groups: [
            { name: "content", title: "Content", default: true },
            { name: "display", title: "Display" },
            { name: "actions", title: "Actions" }
          ],
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              group: "content",
              validation: (rule) => rule.required().max(90)
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              group: "content",
              rows: 3
            }),
            defineField({
              name: "icon",
              title: "Icon",
              description: "Optional icon shown with this feature item. Use the browser to search Lucide icons.",
              type: "string",
              group: "display",
              components: { input: IconPickerInput }
            }),
            defineField({ name: "link", title: "Link", type: "link", group: "actions" })
          ],
          preview: {
            select: { title: "title", subtitle: "description", icon: "icon" },
            prepare({ title, subtitle, icon }) {
              return { title: title || "Feature", subtitle, media: icon ? getLucideIcon(icon) : Star };
            }
          }
        })
      ],
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: "iconStyle",
      title: "Icon style",
      description: "Controls the icon badge treatment used across the feature list.",
      type: "string",
      group: "display",
      options: { list: featureIconStyleOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "outline"
    })
  ],
  preview: {
    select: { title: "header.headline", items: "items", iconStyle: "iconStyle" },
    prepare({ title, items, iconStyle }) {
      const count = Array.isArray(items) ? items.length : 0;
      const styleLabel = featureIconStyleOptions.find((option) => option.value === iconStyle)?.title ?? "Outline";
      return { title: title || "Feature list", subtitle: `${count} features - ${styleLabel}`, media: ListChecks };
    }
  }
});

export const accordionItem = defineType({
  name: "accordionItem",
  title: "Accordion item",
  type: "object",
  icon: HelpCircle,
  groups: [{ name: "content", title: "Content", default: true }],
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
      description: "Rich text answer revealed when the accordion item is opened.",
      type: "portableText",
      group: "content",
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Accordion item", media: HelpCircle };
    }
  }
});

export const accordion = defineType({
  name: "accordion",
  title: "Accordion",
  type: "object",
  icon: HelpCircle,
  groups: [{ name: "content", title: "Content", default: true }],
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader", group: "content" }),
    defineField({
      name: "items",
      title: "Items",
      description: "Questions or expandable notes shown in this accordion section.",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "accordionItem" })],
      validation: (rule) => rule.min(1)
    })
  ],
  preview: {
    select: { title: "header.headline", items: "items" },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return { title: title || "Accordion", subtitle: `${count} items`, media: HelpCircle };
    }
  }
});

export const pricingComparisonTable = defineType({
  name: "pricingComparisonTable",
  title: "Pricing comparison table",
  type: "object",
  icon: Rows3,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "plans", title: "Plans" },
    { name: "rows", title: "Rows" },
    { name: "actions", title: "Actions" }
  ],
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader", group: "content" }),
    defineField({
      name: "plans",
      title: "Plans",
      description: "Columns shown in the comparison table. Values in each row should reference these plan keys.",
      type: "array",
      group: "plans",
      of: [
        defineArrayMember({
          name: "comparisonPlan",
          title: "Comparison plan",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required().max(70) }),
            defineField({ name: "price", title: "Price", type: "string", validation: (rule) => rule.max(40) }),
            defineField({ name: "note", title: "Note", type: "string", validation: (rule) => rule.max(90) }),
            defineField({
              name: "highlighted",
              title: "Highlighted",
              description: "Marks this plan as the recommended or emphasized option.",
              type: "boolean",
              initialValue: false
            })
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
            prepare({ title, subtitle }) {
              return { title: title || "Plan", subtitle, media: ClipboardList };
            }
          }
        })
      ],
      validation: (rule) => rule.min(2)
    }),
    defineField({
      name: "rows",
      title: "Rows",
      description: "Feature rows compared across plans.",
      type: "array",
      group: "rows",
      of: [
        defineArrayMember({
          name: "comparisonRow",
          title: "Comparison row",
          type: "object",
          fields: [
            defineField({ name: "feature", title: "Feature", type: "string", validation: (rule) => rule.required().max(90) }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "values",
              title: "Values",
              description: "Add one value per plan. Use the exact plan name or key as the plan key.",
              type: "array",
              of: [
                defineArrayMember({
                  name: "comparisonValue",
                  title: "Comparison value",
                  type: "object",
                  fields: [
                    defineField({ name: "planKey", title: "Plan key", type: "string", validation: (rule) => rule.required().max(70) }),
                    defineField({ name: "included", title: "Included", type: "boolean", initialValue: true }),
                    defineField({ name: "note", title: "Note", type: "string" })
                  ],
                  preview: {
                    select: { title: "planKey", included: "included", subtitle: "note" },
                    prepare({ title, included, subtitle }) {
                      return { title: title || "Value", subtitle: subtitle || (included ? "Included" : "Not included") };
                    }
                  }
                })
              ],
              validation: (rule) => rule.min(1)
            })
          ],
          preview: {
            select: { title: "feature", subtitle: "description" },
            prepare({ title, subtitle }) {
              return { title: title || "Feature row", subtitle, media: ListChecks };
            }
          }
        })
      ],
      validation: (rule) => rule.min(1)
    }),
    defineField({ name: "cta", title: "CTA", type: "cta", group: "actions" })
  ],
  preview: {
    select: { title: "header.headline", plans: "plans", rows: "rows" },
    prepare({ title, plans, rows }) {
      const planCount = Array.isArray(plans) ? plans.length : 0;
      const count = Array.isArray(rows) ? rows.length : 0;
      return { title: title || "Pricing comparison", subtitle: `${planCount} plans - ${count} rows`, media: Rows3 };
    }
  }
});

export const processStep = defineType({
  name: "processStep",
  title: "Process step",
  type: "object",
  icon: ClipboardList,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" },
    { name: "cta", title: "CTA" },
    { name: "legacy", title: "Legacy" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(100)
    }),
    defineField({
      name: "body",
      title: "Description",
      description: "Rich text description rendered inside the process step card.",
      type: "portableText",
      group: "content",
      validation: (rule) =>
        rule.custom((body, context) => {
          const parent = context.parent as { description?: string } | undefined;
          const hasRichBody = Array.isArray(body) && body.length > 0;
          const hasLegacyDescription = Boolean(parent?.description);

          return hasRichBody || hasLegacyDescription ? true : "Add a rich description.";
        })
    }),
    defineField({
      name: "description",
      title: "Description (legacy)",
      description: "Deprecated plain-text description. Use the rich Description field instead.",
      type: "text",
      deprecated: {
        reason: "Use the rich Description field instead."
      },
      group: "legacy",
      hidden: ({ value }) => value === undefined,
      readOnly: true,
      rows: 3,
      initialValue: undefined
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown on this process step card. Use the browser to search Lucide icons.",
      type: "string",
      group: "display",
      components: { input: IconPickerInput }
    }),
    defineField({
      name: "order",
      title: "Order (legacy)",
      description: "Deprecated manual order. Step numbers now come from array order.",
      type: "number",
      deprecated: {
        reason: "Step numbers are derived from array order."
      },
      group: "legacy",
      hidden: ({ value }) => value === undefined,
      readOnly: true,
      initialValue: undefined
    }),
    defineField({ name: "cta", title: "CTA", type: "cta", group: "cta" })
  ],
  initialValue: {
    title: "New process step",
    body: placeholderProcessStepBody,
    icon: "CircleDot"
  },
  preview: {
    select: { title: "title", body: "body", description: "description", icon: "icon" },
    prepare({ title, body, description, icon }) {
      const bodyText = Array.isArray(body)
        ? body
            .flatMap((block) => (Array.isArray(block?.children) ? block.children : []))
            .map((child) => child?.text)
            .filter(Boolean)
            .join(" ")
        : "";
      const subtitle = bodyText || description;
      const media = icon ? getLucideIcon(icon) : ClipboardList;

      return {
        title: title || "Process step",
        subtitle: subtitle ? `${subtitle.slice(0, 72)}${subtitle.length > 72 ? "..." : ""}` : "No description yet",
        media
      };
    }
  }
});

export const sectionObjects = [
  hero,
  heroSlide,
  contentSection,
  calloutBlock,
  statBlock,
  featureList,
  accordion,
  accordionItem,
  pricingComparisonTable,
  ...pricingSectionObjects,
  processPathSection,
  processStep,
  ...warrantySectionObjects
];
