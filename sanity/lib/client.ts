import { createClient } from "@sanity/client";
import { publicEnv } from "@/config/env";

/**
 * Public Sanity client for published, browser-safe reads.
 */
export const sanityClient = createClient({
  projectId: publicEnv.sanityProjectId || "placeholder",
  dataset: publicEnv.sanityDataset,
  apiVersion: publicEnv.sanityApiVersion,
  useCdn: true,
  perspective: "published"
});
