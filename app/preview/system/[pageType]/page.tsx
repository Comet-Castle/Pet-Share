import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { SystemMessage } from "@/components/features/system/system-message";
import { loadSystemPageByType } from "@/sanity/lib/loaders";

type SystemPreviewPageProps = Readonly<{
  params: Promise<{
    pageType: string;
  }>;
}>;

/**
 * Renders CMS-authored system pages inside Draft Mode for Presentation.
 */
export default async function SystemPreviewPage({ params }: SystemPreviewPageProps) {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Preview unavailable"
        title="System preview needs Draft Mode."
        message="Open this page from Sanity Presentation to enable the authorized preview session."
        primaryHref="/studio"
        primaryLabel="Open Studio"
      />
    );
  }

  const { pageType } = await params;
  const page = await loadSystemPageByType(pageType, { preview: true });

  if (!page) {
    notFound();
  }

  return (
    <SystemMessage
      variant={pageType === "notFound" ? "empty" : "error"}
      eyebrow={page.eyebrow ?? "System page"}
      title={page.headline}
      message={page.message}
      primaryHref={page.primaryCta?.link?.path ?? page.primaryCta?.link?.url ?? "/"}
      primaryLabel={page.primaryCta?.label ?? "Go home"}
      secondaryHref={page.secondaryCta?.link?.path ?? page.secondaryCta?.link?.url ?? undefined}
      secondaryLabel={page.secondaryCta?.label ?? undefined}
    />
  );
}
