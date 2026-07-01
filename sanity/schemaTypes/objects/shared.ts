import {
  AlignCenter,
  ExternalLink,
  FileText,
  Image,
  Link as LinkIcon,
  Megaphone,
  MousePointerClick,
  Navigation,
  Play
} from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { IconPickerInput, VisualStringOptionsInput } from "@/sanity/components/studio-string-inputs";
import { ctaStyleOptions } from "./studio-options";

const linkTargets = [
  { title: "Internal path", value: "internalPath" },
  { title: "External URL", value: "externalUrl" },
  { title: "Action", value: "action" }
];

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image with alt text",
  type: "object",
  icon: Image,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe meaningful images. Use an empty value only when the image is decorative.",
      validation: (rule) => rule.required().max(160)
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (rule) => rule.max(180)
    })
  ],
  preview: {
    select: {
      title: "alt",
      subtitle: "caption",
      media: "image"
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Image",
        subtitle,
        media
      };
    }
  }
});

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  type: "object",
  icon: Image,
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.min(1)
    }),
    defineField({
      name: "layoutHint",
      title: "Layout hint",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "Carousel", value: "carousel" },
          { title: "Feature first image", value: "featureFirst" }
        ],
        layout: "radio"
      },
      initialValue: "grid"
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string"
    })
  ],
  preview: {
    select: {
      images: "images",
      caption: "caption"
    },
    prepare({ images, caption }) {
      const count = Array.isArray(images) ? images.length : 0;
      return {
        title: caption || "Gallery",
        subtitle: `${count} image${count === 1 ? "" : "s"}`,
        media: Image
      };
    }
  }
});

export const videoEmbed = defineType({
  name: "videoEmbed",
  title: "Video embed",
  type: "object",
  icon: Play,
  fields: [
    defineField({
      name: "provider",
      title: "Provider",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "Local asset", value: "localAsset" },
          { title: "Other", value: "other" }
        ],
        layout: "radio"
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] })
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(120)
    }),
    defineField({
      name: "description",
      title: "Description or transcript",
      type: "text",
      rows: 3
    }),
    defineField({
      name: "posterImage",
      title: "Poster image",
      type: "imageWithAlt"
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "provider",
      media: "posterImage.image"
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Video",
        subtitle,
        media: media || Play
      };
    }
  }
});

export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  icon: FileText,
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" }
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" }
      ],
      marks: {
        annotations: [
          {
            name: "textLink",
            title: "Link",
            type: "object",
            icon: LinkIcon,
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({ scheme: ["http", "https", "mailto", "tel"] })
              })
            ]
          }
        ]
      }
    })
  ]
});

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: Megaphone,
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      validation: (rule) => rule.required().max(70)
    }),
    defineField({
      name: "description",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(160)
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph image",
      type: "imageWithAlt",
      description: "Optional social sharing image. Leave empty to fall back to route or site defaults."
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      initialValue: false
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      media: "openGraphImage.image"
    }
  }
});

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: { list: linkTargets, layout: "radio" },
      initialValue: "internalPath",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "path",
      title: "Internal path",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "internalPath",
      validation: (rule) =>
        rule.custom((path, context) => {
          if ((context.parent as { type?: string })?.type !== "internalPath") {
            return true;
          }
          return path?.startsWith("/") || "Internal paths must start with /";
        })
    }),
    defineField({
      name: "url",
      title: "External URL",
      type: "url",
      hidden: ({ parent }) => parent?.type !== "externalUrl",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https", "mailto", "tel"] })
    }),
    defineField({
      name: "action",
      title: "Action",
      type: "string",
      options: {
        list: [
          { title: "Open owner contact drawer", value: "openOwnerContactDrawer" },
          { title: "Open contact form", value: "openContactForm" }
        ]
      },
      hidden: ({ parent }) => parent?.type !== "action"
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
      hidden: ({ parent }) => parent?.type !== "externalUrl"
    })
  ],
  preview: {
    select: {
      title: "label",
      type: "type",
      path: "path",
      url: "url",
      action: "action"
    },
    prepare({ title, type, path, url, action }) {
      return {
        title: title || "Link",
        subtitle: path || url || action || type,
        media: type === "externalUrl" ? ExternalLink : LinkIcon
      };
    }
  }
});

export const cta = defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  icon: MousePointerClick,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().max(80)
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "style",
      title: "Style",
      description: "Controls the frontend button/link treatment.",
      type: "string",
      options: {
        list: ctaStyleOptions
      },
      components: { input: VisualStringOptionsInput },
      initialValue: "primary",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "icon",
      title: "Icon",
      description: "Optional icon metadata for components that render CTA icons. Use the browser to search Lucide icons.",
      type: "string",
      components: { input: IconPickerInput }
    })
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "style"
    },
    prepare({ title, subtitle }) {
      const styleLabel = ctaStyleOptions.find((option) => option.value === subtitle)?.title;

      return {
        title: title || "CTA",
        subtitle: styleLabel ? `${styleLabel} CTA` : subtitle,
        media: MousePointerClick
      };
    }
  }
});

export const ctaGroup = defineType({
  name: "ctaGroup",
  title: "CTA group",
  type: "object",
  icon: MousePointerClick,
  fields: [
    defineField({
      name: "primary",
      title: "Primary CTA",
      type: "cta"
    }),
    defineField({
      name: "secondary",
      title: "Secondary CTA",
      type: "cta"
    }),
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" }
        ],
        layout: "radio"
      },
      initialValue: "left"
    })
  ],
  preview: {
    select: {
      primary: "primary.label",
      secondary: "secondary.label",
      alignment: "alignment"
    },
    prepare({ primary, secondary, alignment }) {
      return {
        title: [primary, secondary].filter(Boolean).join(" + ") || "CTA group",
        subtitle: alignment,
        media: MousePointerClick
      };
    }
  }
});

export const navigationItem = defineType({
  name: "navigationItem",
  title: "Navigation item",
  type: "object",
  icon: Navigation,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required().max(60)
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "link",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "children",
      title: "Child links",
      type: "array",
      of: [defineArrayMember({ type: "navigationItem" })],
      validation: (rule) => rule.max(8)
    })
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "link.path"
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Navigation item",
        subtitle,
        media: Navigation
      };
    }
  }
});

export const sectionHeader = defineType({
  name: "sectionHeader",
  title: "Section header",
  type: "object",
  icon: AlignCenter,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (rule) => rule.max(80)
    }),
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
      rows: 3
    }),
    defineField({
      name: "alignment",
      title: "Alignment",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" }
        ],
        layout: "radio"
      },
      initialValue: "left"
    })
  ],
  preview: {
    select: {
      title: "headline",
      subtitle: "eyebrow"
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Section header",
        subtitle,
        media: AlignCenter
      };
    }
  }
});

export const sharedObjects = [
  imageWithAlt,
  gallery,
  videoEmbed,
  portableText,
  seo,
  link,
  cta,
  ctaGroup,
  navigationItem,
  sectionHeader
];
