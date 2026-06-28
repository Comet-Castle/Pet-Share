import type { HOME_PAGE_QUERY_RESULT, MARKETING_PAGE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type HomePageWithSections = Extract<NonNullable<HOME_PAGE_QUERY_RESULT>, { contentSections: Array<unknown> }>;
type HomePageWithHeroCarousel = Extract<NonNullable<HOME_PAGE_QUERY_RESULT>, { heroCarousel: Array<unknown> }>;
type MarketingPageWithSections = NonNullable<MARKETING_PAGE_BY_SLUG_QUERY_RESULT>;

export type PageSection =
  | HomePageWithSections["contentSections"][number]
  | HomePageWithHeroCarousel["heroCarousel"][number]
  | MarketingPageWithSections["sections"][number];

export type CtaLinkValue = Readonly<{
  type: "action" | "externalUrl" | "internalPath";
  label: string;
  path: string | null;
  url: string | null;
  action: "openContactForm" | "openOwnerContactDrawer" | null;
  openInNewTab: boolean | null;
}>;

export type CtaValue = Readonly<{
  label: string;
  style: "primary" | "secondary" | "text";
  icon: string | null;
  link: CtaLinkValue;
}> | null;

export type CtaGroupValue = Readonly<{
  primary: CtaValue;
  secondary: CtaValue;
  alignment: "center" | "left" | null;
}> | null;
