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
    },
    layoutHint
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
  _type == "statBlock" => {
    value,
    label,
    description,
    icon
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
  _type == "pricingValueSection" => {
    valueItems[]{
      _key,
      title,
      body,
      icon
    }
  },
  _type == "pricingPackageGrid" => {
    header,
    packages[]{
      _key,
      name,
      price,
      duration,
      description,
      icon,
      tone,
      badge,
      highlighted,
      features[]{
        _key,
        label
      }
    }
  },
  _type == "pricingCtaBand" => {
    headline,
    body,
    icon,
    ctaGroup{
      ${ctaGroupFields}
    },
    proofItems[]{
      _key,
      label,
      icon
    }
  },
  _type == "processPathSection" => {
    header,
    title,
    body,
    tone,
    icon,
    steps[]{
      _key,
      title,
      body[]{
        ${portableTextFields}
      },
      description,
      icon,
      order,
      cta{
        ${ctaFields}
      }
    },
    cta{
      ${ctaFields}
    }
  },
  _type == "warrantyConditionGrid" => {
    header,
    items[]{
      _key,
      title,
      body,
      tone,
      icon
    }
  },
  _type == "warrantyNoticeSection" => {
    anchorId,
    header,
    body[]{
      ${portableTextFields}
    },
    badgeLabel
  },
  _type == "warrantyClaimPrep" => {
    anchorId,
    header,
    items[]{
      _key,
      title,
      body,
      icon
    },
    ctaGroup{
      ${ctaGroupFields}
    }
  },
  _type == "processStep" => {
    title,
    body[]{
      ${portableTextFields}
    },
    description,
    icon,
    order,
    cta{
      ${ctaFields}
    }
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
  distanceKilometers,
  listingPlan,
  hostPayoutAmount,
  hostPayoutCurrency,
  hostPayoutUnit,
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
