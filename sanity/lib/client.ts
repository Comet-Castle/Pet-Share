import { createClient } from "@sanity/client";
import { publicEnv } from "@/config/env";

export const sanityApiVersion = publicEnv.sanityApiVersion;

/**
 * Public Sanity client for published, browser-safe reads.
 */
export const sanityClient = createClient({
  projectId: publicEnv.sanityProjectId || "placeholder",
  dataset: publicEnv.sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  perspective: "published"
});

/**
 * Non-CDN public client for build-time route generation and webhook-adjacent reads.
 */
export const uncachedSanityClient = sanityClient.withConfig({
  useCdn: false
});
