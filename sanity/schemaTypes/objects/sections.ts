import {
  AlertTriangle,
  BadgeAlert,
  BarChart3,
  ClipboardList,
  HelpCircle,
  LayoutPanelTop,
  ListChecks,
  MessageSquareQuote,
  PanelTop,
  Rows3,
  ShieldAlert,
  Sparkles,
  Star
} from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { getLucideIcon } from "@/lib/icons/lucide-icons";
import { IconPickerInput } from "@/sanity/components/studio-string-inputs";
import { processPathSection } from "./sections/process";

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

export const sectionMembers = [
  defineArrayMember({ type: "hero" }),
  defineArrayMember({ type: "contentSection" }),
  defineArrayMember({ type: "calloutBlock" }),
  defineArrayMember({ type: "alertBlock" }),
  defineArrayMember({ type: "warningBlock" }),
  defineArrayMember({ type: "statBlock" }),
  defineArrayMember({ type: "testimonialBlock" }),
  defineArrayMember({ type: "featureList" }),
  defineArrayMember({ type: "accordion" }),
  defineArrayMember({ type: "pricingTier" }),
  defineArrayMember({ type: "pricingComparisonTable" }),
  defineArrayMember({ type: "processPathSection" }),
  defineArrayMember({ type: "videoEmbed" }),
  defineArrayMember({ type: "ctaGroup" })
];

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: LayoutPanelTop,
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(140)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      validation: (rule) => rule.max(360)
    }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({ name: "ctaGroup", title: "CTA group", type: "ctaGroup" })
  ],
  preview: {
    select: { title: "headline", subtitle: "eyebrow", media: "image.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Hero", subtitle, media: media || LayoutPanelTop };
    }
  }
});

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero slide",
  type: "object",
  icon: PanelTop,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(140)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(360)
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({
      name: "featuredPet",
      title: "Featured pet",
      type: "reference",
      to: [{ type: "pet" }]
    }),
    defineField({
      name: "featuredOwner",
      title: "Featured owner",
      type: "reference",
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
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "media", title: "Media", type: "imageWithAlt" }),
    defineField({ name: "ctaGroup", title: "CTA group", type: "ctaGroup" }),
    defineField({
      name: "layoutHint",
      title: "Layout hint",
      type: "string",
      options: {
        list: [
          { title: "Text only", value: "textOnly" },
          { title: "Media left", value: "mediaLeft" },
          { title: "Media right", value: "mediaRight" }
        ],
        layout: "radio"
      },
      initialValue: "textOnly"
    })
  ],
  preview: {
    select: { title: "header.headline", subtitle: "layoutHint", media: "media.image" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Content section", subtitle, media: media || Rows3 };
    }
  }
});

export const calloutBlock = defineType({
  name: "calloutBlock",
  title: "Callout block",
  type: "object",
  icon: Sparkles,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this callout block. Use the browser to search Lucide icons.",
      type: "string",
      components: { input: IconPickerInput }
    }),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Playful", value: "playful" },
          { title: "Friendly", value: "friendly" },
          { title: "Calm", value: "calm" }
        ],
        layout: "radio"
      },
      initialValue: "playful"
    })
  ],
  preview: {
    select: { title: "headline", subtitle: "tone" },
    prepare({ title, subtitle }) {
      return { title: title || "Callout", subtitle, media: Sparkles };
    }
  }
});

export const alertBlock = defineType({
  name: "alertBlock",
  title: "Alert block",
  type: "object",
  icon: BadgeAlert,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(100)
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Success", value: "success" },
          { title: "Warning", value: "warning" }
        ],
        layout: "radio"
      },
      initialValue: "info"
    }),
    defineField({ name: "cta", title: "CTA", type: "cta" })
  ],
  preview: {
    select: { title: "title", subtitle: "tone" },
    prepare({ title, subtitle }) {
      return { title: title || "Alert", subtitle, media: BadgeAlert };
    }
  }
});

export const warningBlock = defineType({
  name: "warningBlock",
  title: "Warning block",
  type: "object",
  icon: ShieldAlert,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(100)
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: {
        list: [
          { title: "Low", value: "low" },
          { title: "Medium", value: "medium" },
          { title: "High", value: "high" }
        ],
        layout: "radio"
      },
      initialValue: "medium"
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this warning block. Use the browser to search Lucide icons.",
      type: "string",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "title", subtitle: "severity" },
    prepare({ title, subtitle }) {
      return { title: title || "Warning", subtitle, media: ShieldAlert };
    }
  }
});

export const statBlock = defineType({
  name: "statBlock",
  title: "Stat block",
  type: "object",
  icon: BarChart3,
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (rule) => rule.required().max(40)
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this stat block. Use the browser to search Lucide icons.",
      type: "string",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "value", subtitle: "label" },
    prepare({ title, subtitle }) {
      return { title: title || "Stat", subtitle, media: BarChart3 };
    }
  }
});

export const testimonialBlock = defineType({
  name: "testimonialBlock",
  title: "Testimonial block",
  type: "object",
  icon: MessageSquareQuote,
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }] })],
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: "layoutHint",
      title: "Layout hint",
      type: "string",
      options: {
        list: [
          { title: "Carousel", value: "carousel" },
          { title: "Grid", value: "grid" },
          { title: "Featured", value: "featured" }
        ],
        layout: "radio"
      },
      initialValue: "carousel"
    })
  ],
  preview: {
    select: { title: "header.headline", testimonials: "testimonials" },
    prepare({ title, testimonials }) {
      const count = Array.isArray(testimonials) ? testimonials.length : 0;
      return {
        title: title || "Testimonials",
        subtitle: `${count} selected`,
        media: MessageSquareQuote
      };
    }
  }
});

export const featureList = defineType({
  name: "featureList",
  title: "Feature list",
  type: "object",
  icon: ListChecks,
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        defineArrayMember({
          name: "featureItem",
          title: "Feature item",
          type: "object",
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
              rows: 3
            }),
            defineField({
              name: "icon",
              title: "Icon",
              description: "Optional icon shown with this feature item. Use the browser to search Lucide icons.",
              type: "string",
              components: { input: IconPickerInput }
            }),
            defineField({ name: "link", title: "Link", type: "link" })
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
            prepare({ title, subtitle }) {
              return { title: title || "Feature", subtitle, media: Star };
            }
          }
        })
      ],
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: "iconStyle",
      title: "Icon style",
      type: "string",
      options: {
        list: [
          { title: "Outline", value: "outline" },
          { title: "Filled badge", value: "filledBadge" }
        ],
        layout: "radio"
      },
      initialValue: "outline"
    })
  ],
  preview: {
    select: { title: "header.headline", items: "items" },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return { title: title || "Feature list", subtitle: `${count} features`, media: ListChecks };
    }
  }
});

export const accordionItem = defineType({
  name: "accordionItem",
  title: "Accordion item",
  type: "object",
  icon: HelpCircle,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
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
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
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

export const pricingFeature = defineType({
  name: "pricingFeature",
  title: "Pricing feature",
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
      name: "included",
      title: "Included",
      type: "boolean",
      initialValue: true
    }),
    defineField({ name: "note", title: "Note", type: "string" })
  ],
  preview: {
    select: { title: "label", included: "included", subtitle: "note" },
    prepare({ title, included, subtitle }) {
      return {
        title: title || "Pricing feature",
        subtitle: subtitle || (included ? "Included" : "Not included"),
        media: ListChecks
      };
    }
  }
});

export const pricingTier = defineType({
  name: "pricingTier",
  title: "Pricing tier",
  type: "object",
  icon: ClipboardList,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "price", title: "Price", type: "string" }),
    defineField({ name: "billingNote", title: "Billing note", type: "string" }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [defineArrayMember({ type: "pricingFeature" })],
      validation: (rule) => rule.min(1)
    }),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({ name: "highlighted", title: "Highlighted", type: "boolean", initialValue: false })
  ],
  preview: {
    select: { title: "name", subtitle: "price", highlighted: "highlighted" },
    prepare({ title, subtitle, highlighted }) {
      return {
        title: title || "Pricing tier",
        subtitle: [subtitle, highlighted ? "Highlighted" : ""].filter(Boolean).join(" - "),
        media: ClipboardList
      };
    }
  }
});

export const pricingComparisonTable = defineType({
  name: "pricingComparisonTable",
  title: "Pricing comparison table",
  type: "object",
  icon: Rows3,
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader" }),
    defineField({
      name: "plans",
      title: "Plans",
      type: "array",
      of: [
        defineArrayMember({
          name: "comparisonPlan",
          title: "Comparison plan",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "price", title: "Price", type: "string" }),
            defineField({ name: "note", title: "Note", type: "string" }),
            defineField({ name: "highlighted", title: "Highlighted", type: "boolean", initialValue: false })
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
      type: "array",
      of: [
        defineArrayMember({
          name: "comparisonRow",
          title: "Comparison row",
          type: "object",
          fields: [
            defineField({ name: "feature", title: "Feature", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
            defineField({
              name: "values",
              title: "Values",
              type: "array",
              of: [
                defineArrayMember({
                  name: "comparisonValue",
                  title: "Comparison value",
                  type: "object",
                  fields: [
                    defineField({ name: "planKey", title: "Plan key", type: "string", validation: (rule) => rule.required() }),
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
    defineField({ name: "cta", title: "CTA", type: "cta" })
  ],
  preview: {
    select: { title: "header.headline", rows: "rows" },
    prepare({ title, rows }) {
      const count = Array.isArray(rows) ? rows.length : 0;
      return { title: title || "Pricing comparison", subtitle: `${count} rows`, media: Rows3 };
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
  alertBlock,
  warningBlock,
  statBlock,
  testimonialBlock,
  featureList,
  accordion,
  accordionItem,
  pricingTier,
  pricingFeature,
  pricingComparisonTable,
  processPathSection,
  processStep
];
