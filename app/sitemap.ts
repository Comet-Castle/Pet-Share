import type { MetadataRoute } from "next";
import { publicEnv } from "@/config/env";
import { buildSitemapEntries } from "@/lib/content/sitemap";
import { loadMarketingPageSlugs, loadOwnerSlugs, loadPetSlugs } from "@/sanity/lib/loaders";

/**
 * Generates the sitemap from the live Sanity dataset. Entries authored with
 * `seo.noIndex` are excluded, matching the `robots: noindex` emitted for those
 * routes by `metadataFromSeo()`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pets, owners, marketingPages] = await Promise.all([
    loadPetSlugs().catch(() => []),
    loadOwnerSlugs().catch(() => []),
    loadMarketingPageSlugs().catch(() => [])
  ]);

  return buildSitemapEntries({
    siteUrl: publicEnv.siteUrl,
    pets,
    owners,
    marketingPages
  });
}
