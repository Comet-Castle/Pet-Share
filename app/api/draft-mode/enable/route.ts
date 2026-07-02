import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/sanity/lib/client";

const readToken = process.env.SANITY_API_READ_TOKEN;

/**
 * Enables Next.js Draft Mode after Sanity validates the Studio preview secret.
 */
const draftModeHandler = readToken
  ? defineEnableDraftMode({
      client: sanityClient.withConfig({
        token: readToken,
        useCdn: false,
        perspective: "drafts"
      })
    })
  : null;

export async function GET(request: Request) {
  if (!draftModeHandler) {
    return new Response("Missing SANITY_API_READ_TOKEN. Add a server-only Sanity read token and restart Next.js.", {
      status: 500
    });
  }

  return draftModeHandler.GET(request);
}
