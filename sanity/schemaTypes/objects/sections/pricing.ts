import {
  BadgeDollarSign,
  ClipboardList,
  HelpCircle,
  Megaphone,
  MousePointerClick,
  PanelsTopLeft,
  Rows3
} from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { getLucideIcon } from "@/lib/icons/lucide-icons";
import { IconPickerInput, VisualStringOptionsInput } from "@/sanity/components/studio-string-inputs";

const pricingToneOptions = [
  {
    title: "Coral",
    value: "coral",
    description: "Warm featured treatment for the recommended package.",
    color: "#26343b",
    background: "#ffe4db",
    border: "#ffb49f"
  },
  {
    title: "Mint",
    value: "mint",
    description: "Friendly default treatment for practical packages.",
    color: "#26343b",
    background: "#dff5ec",
    border: "#a9dfca"
  },
  {
    title: "Blue",
    value: "blue",
    description: "Calm supporting treatment for longer plans.",
    color: "#26343b",
    background: "#e2f1fb",
    border: "#b8dff3"
  },
  {
    title: "Cream",
    value: "cream",
    description: "Soft premium treatment for playful high-touch plans.",
    color: "#26343b",
    background: "#fff7ef",
    border: "#ffd9ad"
  }
];

export const pricingValueItem = defineType({
  name: "pricingValueItem",
  title: "Pricing value item",
  type: "object",
  icon: HelpCircle,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" }
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      group: "content",
      rows: 3,
      validation: (rule) => rule.required().max(220)
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown with this value item. Use the browser to search Lucide icons.",
      type: "string",
      group: "display",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: { title: "title", subtitle: "body", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: title || "Pricing value item", subtitle, media: icon ? getLucideIcon(icon) : HelpCircle };
    }
  }
});

export const pricingValueSection = defineType({
  name: "pricingValueSection",
  title: "Pricing value strip",
  type: "object",
  icon: PanelsTopLeft,
  groups: [{ name: "content", title: "Content", default: true }],
  fields: [
    defineField({
      name: "valueItems",
      title: "Value items",
      description: "Short explanation cards that clarify the pricing model.",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "pricingValueItem" })],
      validation: (rule) => rule.min(1).max(4)
    })
  ],
  initialValue: {
    valueItems: [
      { _type: "pricingValueItem", title: "Owners list", body: "Pay once and publish the useful details.", icon: "BadgeDollarSign" },
      { _type: "pricingValueItem", title: "Hosts earn", body: "Temporary hosts are paid for helping with the stay.", icon: "WalletCards" },
      { _type: "pricingValueItem", title: "Everyone agrees", body: "Care notes and return timing stay clear.", icon: "ShieldCheck" }
    ]
  },
  preview: {
    select: { title: "headline", items: "valueItems" },
    prepare({ items }) {
      const count = Array.isArray(items) ? items.length : 0;

      return {
        title: "Pricing value strip",
        subtitle: `${count} value item${count === 1 ? "" : "s"}`,
        media: PanelsTopLeft
      };
    }
  }
});

export const pricingPlanFeatureItem = defineType({
  name: "pricingPlanFeatureItem",
  title: "Pricing plan feature",
  type: "object",
  icon: ClipboardList,
  groups: [{ name: "content", title: "Content", default: true }],
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(120)
    })
  ],
  preview: {
    select: { title: "label" },
    prepare({ title }) {
      return { title: title || "Pricing plan feature", media: ClipboardList };
    }
  }
});

export const pricingPackage = defineType({
  name: "pricingPackage",
  title: "Pricing package",
  type: "object",
  icon: BadgeDollarSign,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "display", title: "Display" },
    { name: "features", title: "Features" }
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(24)
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(60)
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(240)
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown on this package. Use the browser to search Lucide icons.",
      type: "string",
      group: "display",
      components: { input: IconPickerInput }
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      group: "display",
      options: { list: pricingToneOptions },
      components: { input: VisualStringOptionsInput },
      initialValue: "mint"
    }),
    defineField({
      name: "badge",
      title: "Badge",
      description: "Optional small badge, such as Most sensible.",
      type: "string",
      group: "display",
      validation: (rule) => rule.max(40)
    }),
    defineField({
      name: "highlighted",
      title: "Highlighted",
      type: "boolean",
      group: "display",
      initialValue: false
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      group: "features",
      of: [defineArrayMember({ type: "pricingPlanFeatureItem" })],
      validation: (rule) => rule.min(1).max(8)
    })
  ],
  preview: {
    select: { title: "name", price: "price", duration: "duration", icon: "icon", highlighted: "highlighted" },
    prepare({ title, price, duration, icon, highlighted }) {
      return {
        title: title || "Pricing package",
        subtitle: [price, duration, highlighted ? "Highlighted" : null].filter(Boolean).join(" - "),
        media: icon ? getLucideIcon(icon) : BadgeDollarSign
      };
    }
  }
});

export const pricingPackageGrid = defineType({
  name: "pricingPackageGrid",
  title: "Pricing package grid",
  type: "object",
  icon: Rows3,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "packages", title: "Packages" }
  ],
  fields: [
    defineField({ name: "header", title: "Header", type: "sectionHeader", group: "content" }),
    defineField({
      name: "packages",
      title: "Packages",
      description: "Listing packages shown as the main pricing cards.",
      type: "array",
      group: "packages",
      of: [defineArrayMember({ type: "pricingPackage" })],
      validation: (rule) => rule.min(1).max(6)
    })
  ],
  preview: {
    select: { title: "header.headline", packages: "packages" },
    prepare({ title, packages }) {
      const count = Array.isArray(packages) ? packages.length : 0;

      return {
        title: title || "Pricing package grid",
        subtitle: `${count} package${count === 1 ? "" : "s"}`,
        media: Rows3
      };
    }
  }
});

export const pricingCtaBand = defineType({
  name: "pricingCtaBand",
  title: "Pricing CTA band",
  type: "object",
  icon: Megaphone,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "actions", title: "Actions" },
    { name: "proof", title: "Proof items" },
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
      validation: (rule) => rule.required().max(320)
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon shown in the CTA band. Use the browser to search Lucide icons.",
      type: "string",
      group: "display",
      components: { input: IconPickerInput }
    }),
    defineField({ name: "ctaGroup", title: "CTA group", type: "ctaGroup", group: "actions" }),
    defineField({
      name: "proofItems",
      title: "Proof items",
      description: "Short trust or logistics notes shown beside the CTA.",
      type: "array",
      group: "proof",
      of: [
        defineArrayMember({
          name: "pricingCtaProofItem",
          title: "Proof item",
          type: "object",
          icon: MousePointerClick,
          groups: [
            { name: "content", title: "Content", default: true },
            { name: "display", title: "Display" }
          ],
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              group: "content",
              validation: (rule) => rule.required().max(80)
            }),
            defineField({
              name: "icon",
              title: "Icon",
              description: "Optional icon shown with this proof item. Use the browser to search Lucide icons.",
              type: "string",
              group: "display",
              components: { input: IconPickerInput }
            })
          ],
          preview: {
            select: { title: "label", icon: "icon" },
            prepare({ title, icon }) {
              return { title: title || "Proof item", media: icon ? getLucideIcon(icon) : MousePointerClick };
            }
          }
        })
      ],
      validation: (rule) => rule.max(4)
    })
  ],
  preview: {
    select: { title: "headline", subtitle: "body", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return {
        title: title || "Pricing CTA band",
        subtitle,
        media: icon ? getLucideIcon(icon) : Megaphone
      };
    }
  }
});

export const pricingSectionObjects = [
  pricingValueSection,
  pricingValueItem,
  pricingPackageGrid,
  pricingPackage,
  pricingPlanFeatureItem,
  pricingCtaBand
];
