import { defineLive } from "next-sanity/live";
import { sanityClient } from "./client";

const serverReadToken = process.env.SANITY_API_READ_TOKEN || false;
const browserReadToken = process.env.SANITY_API_BROWSER_READ_TOKEN || false;

/**
 * Connects Sanity queries to the Live Content API for Presentation and preview refreshes.
 */
export const { sanityFetch: liveSanityFetch, SanityLive } = defineLive({
  client: sanityClient.withConfig({
    stega: {
      studioUrl: "/studio"
    }
  }),
  serverToken: serverReadToken,
  browserToken: browserReadToken
});
