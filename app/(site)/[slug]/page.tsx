import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageSections } from "@/components/features/sections/page-sections";
import { SystemMessage } from "@/components/features/system/system-message";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadMarketingPageBySlug, loadMarketingPageSlugs } from "@/sanity/lib/loaders";

type MarketingSlugPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

function MarketingFormPlaceholder({ pageSlug }: Readonly<{ pageSlug: string }>) {
  const isWarranty = pageSlug === "warranty";
  const formId = isWarranty ? "claim-form" : "contact-form";
  const eyebrow = isWarranty ? "Warranty desk" : "Contact form";
  const title = isWarranty ? "The warranty desk is still training." : "Send us a message.";
  const message = isWarranty
    ? "This claim form is not taking claims yet. Please keep the evidence somewhere the pet cannot improve it."
    : "Tell us what you need, and the Pet Share desk will route it to the person least likely to be distracted by a small face in the hallway.";
  const submitLabel = isWarranty ? "File claim" : "Send message";
  const textAreaLabel = isWarranty ? "Incident summary" : "Message";

  return (
    <section className="mx-auto mt-8 w-full max-w-[1440px] px-5 sm:px-8 lg:px-10" id={formId}>
      <div className="grid gap-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-pet-ink sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-8 text-pet-muted">{message}</p>
        </div>
        <form className="grid gap-4" aria-label={eyebrow}>
          <label className="grid gap-2 text-sm font-bold text-pet-ink">
            Name
            <input
              className="min-h-12 rounded-2xl border-0 bg-white/85 px-4 text-base font-normal text-pet-ink shadow-inner outline-none ring-1 ring-pet-blue/20 transition focus:ring-2 focus:ring-pet-coral"
              name="name"
              placeholder="Your name"
              type="text"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-pet-ink">
            Email
            <input
              className="min-h-12 rounded-2xl border-0 bg-white/85 px-4 text-base font-normal text-pet-ink shadow-inner outline-none ring-1 ring-pet-blue/20 transition focus:ring-2 focus:ring-pet-coral"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-pet-ink">
            {textAreaLabel}
            <textarea
              className="min-h-36 rounded-2xl border-0 bg-white/85 px-4 py-3 text-base font-normal leading-7 text-pet-ink shadow-inner outline-none ring-1 ring-pet-blue/20 transition focus:ring-2 focus:ring-pet-coral"
              name="message"
              placeholder={isWarranty ? "Please describe what the pet allegedly did." : "How can we help?"}
            />
          </label>
          <button
            className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-full bg-pet-coral/70 px-6 py-3 text-center font-bold text-white shadow-soft"
            disabled
            type="button"
          >
            {submitLabel}
          </button>
        </form>
      </div>
    </section>
  );
}

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
    fallbackDescription: `${page.title} from Pet Share.`
  });
}

/**
 * Renders CMS-authored Standard Pages through shared page-builder sections.
 */
export default async function MarketingSlugPage({ params }: MarketingSlugPageProps) {
  const { slug } = await params;
  let page: Awaited<ReturnType<typeof loadMarketingPageBySlug>> | null = null;

  try {
    page = await loadMarketingPageBySlug(slug);
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

  return (
    <article>
      <PageSections sections={page.sections} />

      {page.showContactForm ? <MarketingFormPlaceholder pageSlug={page.slug} /> : null}
    </article>
  );
}
