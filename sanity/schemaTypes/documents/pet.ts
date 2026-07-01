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
  fields: [
    defineField({
      name: "seedKey",
      title: "Seed key",
      type: "string",
      readOnly: true,
      hidden: ({ value }) => value === undefined
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
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
      to: [{ type: "petType" }],
      validation: (rule) => rule.required()
    }),
    defineField({ name: "breed", title: "Breed", type: "string" }),
    defineField({
      name: "visualIdentity",
      title: "Visual identity",
      type: "object",
      description: "Stable visual details used to keep generated pet images consistent across shots.",
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
      validation: (rule) => rule.min(0).max(100)
    }),
    defineField({
      name: "dateOfBirth",
      title: "Date of birth",
      type: "date",
      description: "Use this instead of age in years only if exact date matters."
    }),
    defineField({
      name: "owner",
      title: "Owner",
      type: "reference",
      to: [{ type: "owner" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "submittedBy",
      title: "Submitted by",
      type: "reference",
      to: [{ type: "owner" }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "submissionStatus",
      title: "Submission status",
      type: "string",
      options: { list: submissionStatusOptions, layout: "radio" },
      initialValue: "approved",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: { list: sourceOptions, layout: "radio" },
      initialValue: "editorial",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "listingHeadline",
      title: "Listing headline",
      type: "string",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "listingSummary",
      title: "Listing summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(260)
    }),
    defineField({
      name: "availabilityStatus",
      title: "Availability status",
      type: "string",
      options: { list: availabilityStatusOptions, layout: "radio" },
      initialValue: "available",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "distanceKilometers",
      title: "Distance from viewer (km)",
      type: "number",
      description: "Seed/demo distance used for local listing cards until real geo search exists.",
      validation: (rule) => rule.min(0).precision(1)
    }),
    defineField({
      name: "listingPlan",
      title: "Listing plan",
      type: "string",
      description: "Owner-paid listing plan attached to this pet listing.",
      options: { list: listingPlanOptions, layout: "radio" },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "hostPayoutAmount",
      title: "Host payout amount",
      type: "number",
      description: "Amount the temporary host is paid for taking this pet for a short stay.",
      validation: (rule) => rule.required().min(0).precision(2)
    }),
    defineField({
      name: "hostPayoutCurrency",
      title: "Host payout currency",
      type: "string",
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
      options: { list: hostPayoutUnitOptions, layout: "radio" },
      initialValue: "day",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "temperament",
      title: "Temperament",
      type: "string",
      options: { list: temperamentOptions },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "pickupUrgency",
      title: "Pickup urgency",
      type: "string",
      options: { list: pickupUrgencyOptions },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "messRisk",
      title: "Mess risk",
      type: "number",
      validation: (rule) => rule.required().min(0).max(5).precision(1)
    }),
    defineField({
      name: "chaosLevel",
      title: "Chaos level",
      type: "number",
      validation: (rule) => rule.required().min(0).max(5).precision(1)
    }),
    defineField({
      name: "energyLevel",
      title: "Energy level",
      type: "number",
      validation: (rule) => rule.required().min(0).max(5).precision(1)
    }),
    defineField({
      name: "cuddlePolicy",
      title: "Cuddle policy",
      type: "string",
      options: { list: cuddlePolicyOptions },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "cardMedia",
      title: "Card media",
      type: "object",
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
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({ name: "summary", title: "Short summary", type: "text", rows: 3 }),
    defineField({
      name: "description",
      title: "Description",
      type: "portableText",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "personalityTraits",
      title: "Personality traits",
      type: "array",
      of: [defineArrayMember({ type: "petTrait" })]
    }),
    defineField({
      name: "careNotes",
      title: "Care notes",
      type: "array",
      of: [defineArrayMember({ type: "careNote" })]
    }),
    defineField({
      name: "availability",
      title: "Availability windows",
      type: "array",
      of: [defineArrayMember({ type: "availabilityWindow" })]
    }),
    defineField({
      name: "borrowTerms",
      title: "Borrow terms",
      type: "array",
      of: [defineArrayMember({ type: "borrowTerm" })]
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [defineArrayMember({ type: "petStat" })]
    }),
    defineField({
      name: "warnings",
      title: "Warnings",
      type: "array",
      of: [defineArrayMember({ type: "petWarning" })]
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      of: [defineArrayMember({ type: "videoEmbed" })]
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "reference",
      to: [{ type: "testimonial" }]
    }),
    defineField({ name: "contactOwnerCta", title: "Contact owner CTA", type: "cta" }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      validation: (rule) => rule.required()
    })
  ],
  validation: (rule) =>
    rule.custom((document) => {
      if (!document?.ageYears && !document?.dateOfBirth) {
        return "Add either age in years or date of birth.";
      }
      return true;
    }),
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
