import { PawPrint } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  availabilityStatusOptions,
  cuddlePolicyOptions,
  pickupUrgencyOptions,
  sourceOptions,
  submissionStatusOptions,
  temperamentOptions
} from "./constants";

const listingPlanOptions = [
  { title: "Porch Listing", value: "porch" },
  { title: "Neighbourhood Spotlight", value: "spotlight" },
  { title: "Couch Recovery Campaign", value: "couchRecovery" }
];

const hostPayoutUnitOptions = [
  { title: "Per day", value: "day" },
  { title: "Per stay", value: "stay" },
  { title: "Per weekend", value: "weekend" }
];

export const pet = defineType({
  name: "pet",
  title: "Pet",
  type: "document",
  icon: PawPrint,
  groups: [
    { name: "core", title: "Core listing", default: true },
    { name: "facts", title: "Structured facts" },
    { name: "media", title: "Media" },
    { name: "detail", title: "Detail modules" },
    { name: "owner", title: "Owner & CTA" },
    { name: "seo", title: "SEO" }
  ],
  fields: [
    defineField({
      name: "seedKey",
      title: "Seed key",
      type: "string",
      group: "core",
      readOnly: true,
      hidden: ({ value }) => value === undefined
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "core",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "core",
      options: { source: "name" },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return "Required";
          return /^[a-z0-9-]+$/.test(slug.current)
            ? true
            : "Slug must use lowercase letters, numbers, and hyphens.";
        })
    }),
    defineField({
      name: "petType",
      title: "Pet type",
      type: "reference",
      group: "core",
      to: [{ type: "petType" }],
      validation: (rule) => rule.required()
    }),
    defineField({ name: "breed", title: "Breed", type: "string", group: "facts" }),
    defineField({
      name: "visualIdentity",
      title: "Visual identity",
      type: "object",
      group: "media",
      description: "Stable visual details used to keep generated pet images consistent across shots.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "primaryColor", title: "Primary color", type: "string" }),
        defineField({ name: "secondaryColor", title: "Secondary detail", type: "string" }),
        defineField({ name: "markings", title: "Distinctive markings", type: "string" }),
        defineField({ name: "eyeColor", title: "Eye color", type: "string" })
      ]
    }),
    defineField({
      name: "ageYears",
      title: "Age in years",
      type: "number",
      group: "facts",
      description: "Whole-year public age shown in pet facts and the detail summary. Do not use exact birth dates for phase one.",
      validation: (rule) => rule.required().min(0).max(100).integer()
    }),
    defineField({
      name: "owner",
      title: "Owner",
      type: "reference",
      group: "owner",
      to: [{ type: "owner" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "submittedBy",
      title: "Submitted by",
      type: "reference",
      group: "owner",
      to: [{ type: "owner" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "submissionStatus",
      title: "Submission status",
      type: "string",
      group: "core",
      options: { list: submissionStatusOptions, layout: "radio" },
      initialValue: "approved",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      group: "core",
      options: { list: sourceOptions, layout: "radio" },
      initialValue: "editorial",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "listingHeadline",
      title: "Listing headline",
      type: "string",
      group: "core",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "listingSummary",
      title: "Listing summary",
      type: "text",
      group: "core",
      rows: 3,
      validation: (rule) => rule.required().max(260)
    }),
    defineField({
      name: "availabilityStatus",
      title: "Availability status",
      type: "string",
      group: "facts",
      options: { list: availabilityStatusOptions, layout: "radio" },
      initialValue: "available",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "distanceKilometers",
      title: "Distance from viewer (km)",
      type: "number",
      group: "core",
      description: "Seed/demo distance used for local listing cards until real geo search exists.",
      validation: (rule) => rule.min(0).precision(1)
    }),
    defineField({
      name: "listingPlan",
      title: "Listing plan",
      type: "string",
      group: "core",
      description: "Owner-paid listing plan attached to this pet listing.",
      options: { list: listingPlanOptions, layout: "radio" },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "hostPayoutAmount",
      title: "Host payout amount",
      type: "number",
      group: "core",
      description: "Amount the temporary host is paid for taking this pet for a short stay.",
      validation: (rule) => rule.required().min(0).precision(2)
    }),
    defineField({
      name: "hostPayoutCurrency",
      title: "Host payout currency",
      type: "string",
      group: "core",
      initialValue: "CAD",
      validation: (rule) =>
        rule.required().custom((currency) => {
          if (!currency) return "Required";
          return /^[A-Z]{3}$/.test(currency) ? true : "Use a three-letter uppercase currency code, such as CAD.";
        })
    }),
    defineField({
      name: "hostPayoutUnit",
      title: "Host payout unit",
      type: "string",
      group: "core",
      options: { list: hostPayoutUnitOptions, layout: "radio" },
      initialValue: "day",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "temperament",
      title: "Temperament",
      type: "string",
      group: "facts",
      options: { list: temperamentOptions },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "pickupUrgency",
      title: "Pickup urgency",
      type: "string",
      group: "facts",
      options: { list: pickupUrgencyOptions },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "messRisk",
      title: "Mess risk",
      type: "number",
      group: "facts",
      validation: (rule) => rule.required().min(0).max(5).precision(1)
    }),
    defineField({
      name: "chaosLevel",
      title: "Chaos level",
      type: "number",
      group: "facts",
      validation: (rule) => rule.required().min(0).max(5).precision(1)
    }),
    defineField({
      name: "energyLevel",
      title: "Energy level",
      type: "number",
      group: "facts",
      validation: (rule) => rule.required().min(0).max(5).precision(1)
    }),
    defineField({
      name: "cuddlePolicy",
      title: "Cuddle policy",
      type: "string",
      group: "facts",
      options: { list: cuddlePolicyOptions },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "cardMedia",
      title: "Card media",
      type: "object",
      group: "media",
      fields: [
        defineField({
          name: "image",
          title: "Image",
          type: "imageWithAlt",
          validation: (rule) => rule.required()
        }),
        defineField({
          name: "lowFrameRateVideo",
          title: "Optional low-frame-rate video",
          type: "videoEmbed",
          description: "Optional listing motion. Frontend should lazy load this."
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "heroImages",
      title: "Hero images",
      type: "array",
      group: "media",
      description: "Detail-page gallery images shown after the card image.",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({ name: "summary", title: "Short summary", type: "text", rows: 3, group: "detail" }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableText",
      group: "detail",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "personalityTraits",
      title: "Personality traits",
      type: "array",
      group: "detail",
      description: "Short chips shown below the pet description.",
      of: [defineArrayMember({ type: "petTrait" })],
      validation: (rule) => rule.max(8).warning("Prefer no more than 8 personality chips.")
    }),
    defineField({
      name: "vibeProfile",
      title: "Vibe profile",
      type: "array",
      group: "detail",
      description: "Optional detail-page personality rows with a label, descriptor, and 0-5 strength.",
      of: [defineArrayMember({ type: "petVibeItem" })],
      validation: (rule) => rule.max(4).warning("Prefer 2-4 vibe rows.")
    }),
    defineField({
      name: "fitGuidance",
      title: "Fit guidance",
      type: "petFitGuidance",
      group: "detail",
      description: "Optional good-fit and maybe-avoid guidance for the pet detail page.",
      options: { collapsible: true, collapsed: true }
    }),
    defineField({
      name: "careNotes",
      title: "Care notes",
      type: "array",
      group: "detail",
      description: "Day-to-day handling guidance. One to four notes is ideal.",
      of: [defineArrayMember({ type: "careNote" })],
      validation: (rule) => rule.max(4).warning("Prefer 1-4 care notes.")
    }),
    defineField({
      name: "availability",
      title: "Availability windows",
      type: "array",
      group: "facts",
      of: [defineArrayMember({ type: "availabilityWindow" })]
    }),
    defineField({
      name: "borrowTerms",
      title: "Borrow terms",
      type: "array",
      group: "detail",
      description: "Rules that come with the handoff. One to four terms is ideal.",
      of: [defineArrayMember({ type: "borrowTerm" })],
      validation: (rule) => rule.max(4).warning("Prefer 1-4 borrow terms.")
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      group: "facts",
      of: [defineArrayMember({ type: "petStat" })]
    }),
    defineField({
      name: "warnings",
      title: "Warnings",
      type: "array",
      group: "detail",
      description: "Important caution notes or mismatch risks. One to four warnings is ideal.",
      of: [defineArrayMember({ type: "petWarning" })],
      validation: (rule) => rule.max(4).warning("Prefer 1-4 warnings.")
    }),
    defineField({
      name: "dailySchedule",
      title: "Day with this pet",
      type: "array",
      group: "detail",
      description: "Optional time-based routine. Only use when the pet has a meaningful schedule worth showing.",
      of: [defineArrayMember({ type: "petScheduleItem" })],
      validation: (rule) => rule.max(6).warning("Prefer 3-6 schedule items.")
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      group: "media",
      description: "Optional detail-page media. Do not use card-loop media here unless it is intentionally promoted.",
      of: [defineArrayMember({ type: "videoEmbed" })],
      validation: (rule) => rule.max(1).warning("Phase one usually needs at most one detail video.")
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "reference",
      group: "detail",
      to: [{ type: "testimonial" }]
    }),
    defineField({
      name: "contactOwnerCta",
      title: "Contact owner CTA",
      type: "cta",
      group: "owner",
      description: "Primary borrowing CTA. Prefer clear copy like Borrow this pet."
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "listingHeadline",
      media: "cardMedia.image.image"
    },
    prepare({ title, subtitle, media }) {
      return { title: title || "Pet", subtitle, media: media || PawPrint };
    }
  }
});
