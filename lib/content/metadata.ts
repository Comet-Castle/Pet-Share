import type { Metadata } from "next";

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
}>;

/**
 * Builds Next.js route metadata from a Sanity SEO object with fallbacks.
 */
export function metadataFromSeo({
  seo,
  fallbackTitle,
  fallbackDescription
}: MetadataInput): Metadata {
  const title = seo?.title ?? fallbackTitle;
  const description = seo?.description ?? fallbackDescription;
  const imageUrl = seo?.openGraphImage?.image?.asset?.url;

  return {
    title,
    description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: seo?.openGraphImage?.alt ?? title
            }
          ]
        : undefined
    }
  };
}
