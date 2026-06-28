"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

/**
 * Loads the Sanity Studio client bundle without evaluating Studio plugins in a Server Component.
 */
export function Studio() {
  return <NextStudio config={config} />;
}
