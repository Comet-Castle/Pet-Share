const truthyValues = new Set(["1", "true", "yes", "on"]);

/**
 * Returns whether server diagnostics should include debug-level details.
 */
export function isAppDebugEnabled() {
  return truthyValues.has((process.env.APP_DEBUG ?? "").toLowerCase());
}

/**
 * Reads a required server-side environment variable at the boundary where it is used.
 */
export function requireServerEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-02-19"
} as const;
