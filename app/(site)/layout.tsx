import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { logger } from "@/lib/diagnostics/logger";
import { loadSiteSettings } from "@/sanity/lib/loaders";

type SiteLayoutProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Wraps public pages in the shared responsive shell and tolerates CMS downtime.
 */
export default async function SiteLayout({ children }: SiteLayoutProps) {
  let settings: Awaited<ReturnType<typeof loadSiteSettings>> | undefined;

  try {
    settings = await loadSiteSettings();
  } catch (error) {
    logger.error("Failed to load site settings for public shell.", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  return <SiteShell settings={settings}>{children}</SiteShell>;
}
