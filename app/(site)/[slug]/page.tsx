import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionPlaceholders } from "@/components/features/sections/section-placeholders";
import { SystemMessage } from "@/components/features/system/system-message";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadMarketingPageBySlug, loadMarketingPageSlugs } from "@/sanity/lib/loaders";

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
  const page = await loadMarketingPageBySlug(slug);

  if (!page) {
    return metadataFromSeo({
      fallbackTitle: "Page not found",
      fallbackDescription: "This marketing page is not available."
    });
  }

  return metadataFromSeo({
    seo: page.seo,
    fallbackTitle: page.title,
    fallbackDescription: `${page.title} from Pet Share.`
  });
}

/**
 * Renders CMS-authored marketing pages through starter section placeholders.
 */
export default async function MarketingSlugPage({ params }: MarketingSlugPageProps) {
  const { slug } = await params;
  const page = await loadMarketingPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10">
      <section className="mb-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Marketing page</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-6xl">
          {page.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-pet-muted">
          This page is powered by Sanity sections. Full visual section rendering is planned for the next milestone.
        </p>
      </section>

      <SectionPlaceholders sections={page.sections} />

      {page.showContactForm ? (
        <section className="mt-8">
          <SystemMessage
            variant="empty"
            eyebrow="Contact form placeholder"
            title="The warranty desk is still training."
            message="CMS-driven form rendering and Mailgun delivery are planned for the forms milestone."
            primaryHref="/pets"
            primaryLabel="Browse pets"
          />
        </section>
      ) : null}
    </article>
  );
}
