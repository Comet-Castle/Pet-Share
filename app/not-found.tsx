import { SystemMessage } from "@/components/features/system/system-message";
import { logger } from "@/lib/diagnostics/logger";
import { loadSystemPageByType } from "@/sanity/lib/loaders";

/**
 * Renders the global 404 page with optional CMS-authored system copy.
 */
export default async function NotFoundPage() {
  let page: Awaited<ReturnType<typeof loadSystemPageByType>> | null = null;

  try {
    page = await loadSystemPageByType("notFound");
  } catch (error) {
    logger.error("Failed to load not-found system page.", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  if (page) {
    return (
      <SystemMessage
        variant="notFound"
        eyebrow={page.eyebrow ?? "404"}
        title={page.headline}
        message={page.message}
        supportCopy={page.supportCopy}
        primaryHref={page.primaryCta?.link.path ?? "/"}
        primaryLabel={page.primaryCta?.label ?? "Go home"}
        secondaryHref={page.secondaryCta?.link.path ?? "/pets"}
        secondaryLabel={page.secondaryCta?.label ?? "Find a temporary pet"}
        image={page.image}
        sections={page.contentSections}
      />
    );
  }

  return (
    <SystemMessage
      variant="notFound"
      eyebrow="404"
      title="This page wandered off during handoff."
      message="We checked under the couch and behind the treat jar. Nothing."
      primaryHref="/"
      primaryLabel="Go home"
      secondaryHref="/pets"
      secondaryLabel="Find a temporary pet"
    />
  );
}
