import type { QueryParams } from "@sanity/client";
import { uncachedSanityClient } from "./client";
import { liveSanityFetch } from "./live";

type SanityFetchOptions = Readonly<{
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
  perspective?: "published" | "drafts";
  useCdn?: boolean;
}>;

const defaultRevalidateSeconds = 3600;
const defaultSanityTimeoutMs = 15000;

function withSanityTimeout<Result>(promise: Promise<Result>, timeoutMs = defaultSanityTimeoutMs) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new Error(`Sanity fetch timed out after ${timeoutMs}ms.`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
}

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
  if (useCdn) {
    const result = await liveSanityFetch({
      query,
      params,
      perspective: "published",
      stega: false,
      tags
    });

    return result.data as Result;
  }

  return withSanityTimeout(
    uncachedSanityClient.fetch<Result>(query, params, {
      next: {
        revalidate,
        tags
      }
    })
  );
}

/**
 * Fetches draft-aware Sanity content with a server-only read token.
 */
export async function previewSanityFetch<Result>({
  query,
  params = {},
  tags = []
}: Omit<SanityFetchOptions, "perspective" | "revalidate" | "useCdn">): Promise<Result> {
  const result = await liveSanityFetch({
    query,
    params,
    perspective: "drafts",
    stega: true,
    tags
  });

  return result.data as Result;
}
