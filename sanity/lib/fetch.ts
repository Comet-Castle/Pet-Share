import type { QueryParams } from "@sanity/client";
import { sanityClient, uncachedSanityClient } from "./client";
import { createPreviewClient } from "./preview-client";

type SanityFetchOptions = Readonly<{
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
  perspective?: "published" | "previewDrafts";
  useCdn?: boolean;
}>;

const defaultRevalidateSeconds = 3600;

/**
 * Fetches published Sanity content without requiring private tokens.
 */
export async function sanityFetch<Result>({
  query,
  params = {},
  tags = [],
  revalidate = defaultRevalidateSeconds,
  useCdn = true
}: SanityFetchOptions): Promise<Result> {
  const client = useCdn ? sanityClient : uncachedSanityClient;

  return client.fetch<Result>(query, params, {
    next: {
      revalidate,
      tags
    }
  });
}

/**
 * Fetches draft-aware Sanity content with a server-only read token.
 */
export async function previewSanityFetch<Result>({
  query,
  params = {},
  tags = []
}: Omit<SanityFetchOptions, "perspective" | "revalidate" | "useCdn">): Promise<Result> {
  return createPreviewClient().fetch<Result>(query, params, {
    cache: "no-store",
    next: {
      tags
    }
  });
}
