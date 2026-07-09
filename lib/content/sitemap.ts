import type { MetadataRoute } from "next";

type SlugEntry = Readonly<{
  slug: string | null;
  noIndex?: boolean | null;
  _updatedAt?: string | null;
}>;

type SitemapInput = Readonly<{
  siteUrl: string;
  pets: SlugEntry[];
  owners: SlugEntry[];
  marketingPages: SlugEntry[];
}>;

const staticRoutes = ["/", "/pets"] as const;

function toAbsoluteUrl(path: string, siteUrl: string): string {
  return new URL(path, siteUrl).toString();
}

function hasPublicSlug(entry: SlugEntry): entry is SlugEntry & { slug: string } {
  return Boolean(entry.slug?.trim()) && !entry.noIndex;
}

/** Builds sitemap entries from already-loaded public route slugs. */
export function buildSitemapEntries({ siteUrl, pets, owners, marketingPages }: SitemapInput): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: toAbsoluteUrl(path, siteUrl),
    changeFrequency: "daily",
    priority: path === "/" ? 1 : 0.8
  }));

  const petEntries: MetadataRoute.Sitemap = pets.filter(hasPublicSlug).map((pet) => ({
    url: toAbsoluteUrl(`/pets/${pet.slug}`, siteUrl),
    lastModified: pet._updatedAt ?? undefined,
    changeFrequency: "weekly",
    priority: 0.6
  }));

  const ownerEntries: MetadataRoute.Sitemap = owners.filter(hasPublicSlug).map((owner) => ({
    url: toAbsoluteUrl(`/owners/${owner.slug}`, siteUrl),
    lastModified: owner._updatedAt ?? undefined,
    changeFrequency: "weekly",
    priority: 0.5
  }));

  const marketingEntries: MetadataRoute.Sitemap = marketingPages.filter(hasPublicSlug).map((page) => ({
    url: toAbsoluteUrl(`/${page.slug}`, siteUrl),
    lastModified: page._updatedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.7
  }));

  return [...staticEntries, ...marketingEntries, ...petEntries, ...ownerEntries];
}
