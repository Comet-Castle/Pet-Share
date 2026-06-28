import { sanityClient } from "./client";
import { getSanityReadToken } from "./token";

/**
 * Server-only Sanity client for draft and preview reads.
 */
export function createPreviewClient() {
  return sanityClient.withConfig({
    token: getSanityReadToken(),
    useCdn: false,
    perspective: "previewDrafts"
  });
}
