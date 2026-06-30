export const imageWithAltFields = /* groq */ `
  image{
    asset->{
      _id,
      url,
      metadata{
        lqip,
        dimensions{
          width,
          height,
          aspectRatio
        }
      }
    },
    crop,
    hotspot
  },
  alt,
  caption
`;

export const seoFields = /* groq */ `
  title,
  description,
  noIndex,
  openGraphImage{
    ${imageWithAltFields}
  }
`;

export const linkFields = /* groq */ `
  type,
  label,
  path,
  url,
  action,
  openInNewTab
`;

export const ctaFields = /* groq */ `
  label,
  style,
  icon,
  link{
    ${linkFields}
  }
`;

export const ctaGroupFields = /* groq */ `
  primary{
    ${ctaFields}
  },
  secondary{
    ${ctaFields}
  },
  alignment
`;

export const portableTextFields = /* groq */ `
  ...
`;

export const videoEmbedFields = /* groq */ `
  provider,
  url,
  title,
  description,
  posterImage{
    ${imageWithAltFields}
  }
`;

export const sectionFields = /* groq */ `
  _key,
  _type,
  _type == "hero" => {
    eyebrow,
    headline,
    body,
    image{
      ${imageWithAltFields}
    },
    ctaGroup{
      ${ctaGroupFields}
    }
  },
  _type == "heroSlide" => {
    headline,
    body,
    image{
      ${imageWithAltFields}
    },
    cta{
      ${ctaFields}
    },
    featuredPet->{
      _id,
      name,
      "slug": slug.current,
      listingHeadline
    },
    featuredOwner->{
      _id,
      name,
      "slug": slug.current,
      tagline
    }
  },
  _type == "contentSection" => {
    header,
    body[]{
      ${portableTextFields}
    },
    media{
      ${imageWithAltFields}
    },
    ctaGroup{
      ${ctaGroupFields}
    },
    layoutHint
  },
  _type == "calloutBlock" => {
    headline,
    body,
    icon,
    tone,
    cta{
      ${ctaFields}
    }
  },
  _type == "alertBlock" => {
    title,
    message,
    tone,
    cta{
      ${ctaFields}
    }
  },
  _type == "warningBlock" => {
    title,
    message,
    severity,
    icon
  },
  _type == "statBlock" => {
    value,
    label,
    description,
    icon
  },
  _type == "testimonialBlock" => {
    header,
    layoutHint,
    testimonials[]->{
      _id,
      quote,
      authorName,
      authorRole,
      rating,
      tone,
      authorImage{
        ${imageWithAltFields}
      }
    }
  },
  _type == "featureList" => {
    header,
    iconStyle,
    items[]{
      _key,
      title,
      description,
      icon,
      link{
        ${linkFields}
      }
    }
  },
  _type == "accordion" => {
    header,
    items[]{
      _key,
      title,
      body[]{
        ${portableTextFields}
      }
    }
  },
  _type == "pricingTier" => {
    name,
    price,
    billingNote,
    highlighted,
    features[]{
      _key,
      label,
      included,
      note
    },
    cta{
      ${ctaFields}
    }
  },
  _type == "pricingComparisonTable" => {
    header,
    plans[]{
      _key,
      name,
      price,
      note,
      highlighted
    },
    rows[]{
      _key,
      feature,
      description,
      values[]{
        _key,
        planKey,
        included,
        note
      }
    },
    cta{
      ${ctaFields}
    }
  },
  _type == "processStep" => {
    title,
    description,
    icon,
    order,
    cta{
      ${ctaFields}
    }
  },
  _type == "videoEmbed" => {
    ${videoEmbedFields}
  },
  _type == "ctaGroup" => {
    ${ctaGroupFields}
  }
`;

export const petCardFields = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  breed,
  listingHeadline,
  listingSummary,
  availabilityStatus,
  temperament,
  pickupUrgency,
  messRisk,
  chaosLevel,
  energyLevel,
  cuddlePolicy,
  cardMedia{
    image{
      ${imageWithAltFields}
    },
    lowFrameRateVideo{
      ${videoEmbedFields}
    }
  },
  petType->{
    _id,
    name,
    pluralName,
    "slug": slug.current,
    filterLabel,
    icon,
    category,
    sortOrder
  },
  owner->{
    _id,
    name,
    "slug": slug.current,
    tagline
  }
`;
