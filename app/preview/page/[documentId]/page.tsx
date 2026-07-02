import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PageSections } from "@/components/features/sections/page-sections";
import { SystemMessage } from "@/components/features/system/system-message";
import { loadMarketingPageById } from "@/sanity/lib/loaders";

type MarketingDocumentPreviewPageProps = Readonly<{
  params: Promise<{
    documentId: string;
  }>;
}>;

/**
 * Renders an unpublished Standard Page draft by Sanity document ID.
 */
export default async function MarketingDocumentPreviewPage({ params }: MarketingDocumentPreviewPageProps) {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Preview unavailable"
        title="Draft preview needs a Studio invitation."
        message="Open this page from Sanity Presentation so the preview secret can enable Draft Mode first."
        primaryHref="/studio"
        primaryLabel="Open Studio"
      />
    );
  }

  const { documentId } = await params;
  const page = await loadMarketingPageById(decodeURIComponent(documentId), { preview: true });

  if (!page) {
    notFound();
  }

  if (page.slug) {
    redirect(`/${page.slug}`);
  }

  return (
    <article>
      <PageSections sections={page.sections} />
    </article>
  );
}
