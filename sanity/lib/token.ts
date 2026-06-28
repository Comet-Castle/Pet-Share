import { requireServerEnv } from "@/config/env";

/**
 * Reads the server-only Sanity token used for draft and preview requests.
 */
export function getSanityReadToken() {
  return requireServerEnv("SANITY_API_READ_TOKEN");
}
