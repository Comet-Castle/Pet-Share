import type { ReactNode } from "react";
import { Suspense } from "react";
import { draftMode } from "next/headers";
import { PreviewBanner } from "@/components/features/preview/preview-banner";
import { SiteShell } from "@/components/layout/site-shell";
import { logger } from "@/lib/diagnostics/logger";
import { loadSiteSettings } from "@/sanity/lib/loaders";

type PreviewLayoutProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Gives document-ID preview routes the same public shell as normal site pages.
 */
export default async function PreviewLayout({ children }: PreviewLayoutProps) {
  const { isEnabled } = await draftMode();
  let settings: Awaited<ReturnType<typeof loadSiteSettings>> | undefined;

  try {
    settings = await loadSiteSettings({ preview: isEnabled });
  } catch (error) {
    logger.error("Failed to load site settings for preview shell.", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  return (
    <>
      {isEnabled ? (
        <Suspense fallback={null}>
          <PreviewBanner />
        </Suspense>
      ) : null}
      <SiteShell settings={settings}>{children}</SiteShell>
    </>
  );
}
