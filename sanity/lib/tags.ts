export const sanityTags = {
  siteSettings: "site-settings",
  homePage: "home-page",
  petIndex: "pet-index",
  marketingPage: (slug: string) => `marketing-page:${slug}`,
  systemPage: (pageType: string) => `system-page:${pageType}`,
  pet: (slug: string) => `pet:${slug}`,
  owner: (slug: string) => `owner:${slug}`,
  petTypes: "pet-types",
  testimonials: "testimonials",
  form: (slug: string) => `form:${slug}`
} as const;
