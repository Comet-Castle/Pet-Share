import type { Metadata } from "next";
import { publicEnv } from "@/config/env";

type SeoLike = Readonly<{
  title?: string | null;
  description?: string | null;
  noIndex?: boolean | null;
  openGraphImage?: {
    image?: {
      asset?: {
        url?: string | null;
      } | null;
    } | null;
    alt?: string | null;
  } | null;
}> | null;

type MetadataInput = Readonly<{
  seo?: SeoLike;
  fallbackTitle: string;
  fallbackDescription?: string;
  /**
   * Site-wide default SEO (from site settings) used when the page has no OG image
   * of its own. Same shape as a page `seo` object.
   */
  siteDefaultSeo?: SeoLike;
  /** Root-relative path for this page, used for the canonical URL and og:url. */
  path?: string;
  /** Optional stable ImageResponse route to use for composed social cards. */
  dynamicImagePath?: string;
}>;

// Standard Open Graph image dimensions. Kept as constants so the forced-PNG URL
// and the emitted width/height stay in sync.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Static branded fallback shipped in `public/`. Used when neither the page nor the
// site default authored an OG image. Already a correctly-sized PNG.
const SITE_NAME = "Pet Share";
const SITE_TITLE_SUFFIX = ` | ${SITE_NAME}`;
const STATIC_OG_FALLBACK = "/og-default.png";

/**
 * Forces a Sanity image URL to a correctly-sized PNG via the Sanity image API.
 * OG scrapers (Slack, iMessage, Facebook, X) are most reliable with PNG/JPEG at
 * 1200×630, and some reject webp/avif — so we normalize regardless of the asset's
 * original format. Non-Sanity URLs (e.g. the static fallback) are left unchanged.
 */
function toOgPng(rawUrl: string): string {
  if (!rawUrl.includes("cdn.sanity.io")) {
    return rawUrl;
  }

  const separator = rawUrl.includes("?") ? "&" : "?";
  return `${rawUrl}${separator}w=${OG_WIDTH}&h=${OG_HEIGHT}&fit=crop&auto=format&fm=png`;
}

function toMetadataTitle(title: string): Metadata["title"] {
  if (title === SITE_NAME || title.endsWith(SITE_TITLE_SUFFIX)) {
    return { absolute: title };
  }

  return title;
}

/** Resolves a root-relative path to an absolute URL against the site URL. */
function toAbsoluteUrl(path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  try {
    return new URL(path, publicEnv.siteUrl).toString();
  } catch {
    return undefined;
  }
}

/**
 * Builds Next.js route metadata from a Sanity SEO object with resilient fallbacks.
 *
 * OG image resolution order: dynamic route image → page `seo` image → site
 * `defaultSeo` image → static `public/og-default.png`. Sanity-hosted images are forced to a 1200×630
 * PNG (`fm=png`). Also emits a Twitter `summary_large_image` card and, when a
 * `path` is provided, a canonical URL and `og:url`. `metadataBase` (root layout)
 * makes the static fallback and any relative URLs absolute.
 */
export function metadataFromSeo({
  seo,
  fallbackTitle,
  fallbackDescription,
  siteDefaultSeo,
  path,
  dynamicImagePath
}: MetadataInput): Metadata {
  const title = seo?.title ?? fallbackTitle;
  const description = seo?.description ?? fallbackDescription ?? undefined;

  const pageImageUrl = seo?.openGraphImage?.image?.asset?.url;
  const siteImageUrl = siteDefaultSeo?.openGraphImage?.image?.asset?.url;
  const rawImageUrl = pageImageUrl ?? siteImageUrl;
  const imageUrl = dynamicImagePath ?? (rawImageUrl ? toOgPng(rawImageUrl) : STATIC_OG_FALLBACK);
  const imageAlt =
    seo?.openGraphImage?.alt ?? siteDefaultSeo?.openGraphImage?.alt ?? title;

  const canonical = toAbsoluteUrl(path);
  const ogImages = [
    {
      url: imageUrl,
      width: OG_WIDTH,
      height: OG_HEIGHT,
      alt: imageAlt,
      type: "image/png"
    }
  ];

  return {
    title: toMetadataTitle(title),
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
      images: ogImages
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    }
  };
}
