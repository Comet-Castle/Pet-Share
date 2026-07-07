import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CmsForm } from "@/components/features/forms/cms-form";
import { PageSections } from "@/components/features/sections/page-sections";
import { SystemMessage } from "@/components/features/system/system-message";
import { metadataFromSeo } from "@/lib/content/metadata";
import { logger } from "@/lib/diagnostics/logger";
import { loadFormDefinitionBySlug, loadMarketingPageBySlug, loadMarketingPageSlugs } from "@/sanity/lib/loaders";

type MarketingSlugPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export async function generateStaticParams() {
  const pages = await loadMarketingPageSlugs();

  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: MarketingSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  let page: Awaited<ReturnType<typeof loadMarketingPageBySlug>> | null = null;

  try {
    page = await loadMarketingPageBySlug(slug);
  } catch {
    return metadataFromSeo({
      fallbackTitle: "Pet Share",
      fallbackDescription: "This page is temporarily unavailable."
    });
  }

  if (!page) {
    return metadataFromSeo({
      fallbackTitle: "Page not found",
      fallbackDescription: "This marketing page is not available."
    });
  }

  return metadataFromSeo({
    seo: page.seo,
    fallbackTitle: page.title,
    fallbackDescription: `${page.title} from Pet Share.`,
    path: `/${slug}`
  });
}

/**
 * Renders CMS-authored Standard Pages through shared page-builder sections.
 */
export default async function MarketingSlugPage({ params }: MarketingSlugPageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  let page: Awaited<ReturnType<typeof loadMarketingPageBySlug>> | null = null;

  try {
    page = await loadMarketingPageBySlug(slug, { preview: isEnabled });
  } catch {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Page unavailable"
        title="This page is still chasing its own tail."
        message="This page could not be loaded right now. Try again after the pets stop stepping on the paperwork."
        primaryHref="/"
        primaryLabel="Go home"
        secondaryHref="/pets"
        secondaryLabel="Find a temporary pet"
      />
    );
  }

  if (!page) {
    notFound();
  }

  const formSlug = page.showContactForm ? (page.slug === "warranty" ? "warranty" : "contact") : null;
  let form: Awaited<ReturnType<typeof loadFormDefinitionBySlug>> | null = null;

  if (formSlug) {
    try {
      form = await loadFormDefinitionBySlug(formSlug, { preview: isEnabled });
    } catch (error) {
      logger.error("Failed to load form definition for marketing page.", {
        formSlug,
        pageSlug: page.slug,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  return (
    <article>
      <PageSections sections={page.sections} />

      {page.showContactForm ? (
        <section className="mx-auto mt-8 w-full max-w-[1440px] min-w-0 px-5 sm:px-8 lg:px-10" id={page.slug === "warranty" ? "claim-form" : "contact-form"}>
          {form ? (
            <CmsForm form={form} eyebrow={page.slug === "warranty" ? "Warranty desk" : "Contact form"} />
          ) : (
            <div className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Form unavailable</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-pet-ink">This form is chasing its own tail.</h2>
              <p className="mt-3 leading-7 text-pet-muted">Please try again shortly, or email the Pet Share team directly if this is urgent.</p>
            </div>
          )}
        </section>
      ) : null}
    </article>
  );
}
