import type { Metadata } from "next";
import { PawPrint, Sparkles } from "lucide-react";
import { SectionPlaceholders } from "@/components/features/sections/section-placeholders";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/diagnostics/logger";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadHomePage } from "@/sanity/lib/loaders";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await loadHomePage();

    return metadataFromSeo({
      seo: page?.seo,
      fallbackTitle: "Pet Share",
      fallbackDescription: "A bright Sanity and Next.js demo for satirical pet sharing."
    });
  } catch {
    return metadataFromSeo({
      fallbackTitle: "Pet Share",
      fallbackDescription: "A bright Sanity and Next.js demo for satirical pet sharing."
    });
  }
}

/**
 * Renders the CMS-backed homepage route with resilient starter sections.
 */
export default async function HomePage() {
  let page: Awaited<ReturnType<typeof loadHomePage>> | null = null;

  try {
    page = await loadHomePage();
  } catch (error) {
    logger.error("Failed to load homepage content.", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  const heroSlide = page?.heroCarousel?.[0];
  const headline = heroSlide?.headline ?? "Pet Share is warming up the leash.";
  const body =
    heroSlide?.body ??
    "A bright, responsive demo marketplace where fictional owners can lend out fictional pets with deeply questionable confidence.";
  const featuredPets = page?.featuredPets ?? [];

  return (
    <>
      <section className="mx-auto grid min-h-[calc(100vh-13rem)] w-full max-w-[1280px] items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-pet-muted shadow-soft backdrop-blur">
            <Sparkles aria-hidden="true" size={18} />
            Sanity-powered satire, temporarily housebroken
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight text-pet-ink sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-pet-muted">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/pets" icon={<PawPrint aria-hidden="true" size={20} />}>
              Browse pets
            </Button>
            <Button href="/studio" variant="secondary">
              Open Studio
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white/65 p-5 shadow-soft backdrop-blur sm:p-8">
          <div className="aspect-[4/3] rounded-[1.5rem] bg-[radial-gradient(circle_at_30%_20%,#ffcfbf,transparent_36%),radial-gradient(circle_at_80%_10%,#a8e6cf,transparent_34%),linear-gradient(135deg,#fff8ef,#d9f0ff)] p-6">
            <div className="flex h-full flex-col justify-end">
              <div className="max-w-sm rounded-3xl bg-white/80 p-5 text-pet-ink shadow-soft backdrop-blur">
                <p className="font-display text-2xl font-bold">Coming next</p>
                <p className="mt-2 text-sm leading-6 text-pet-muted">
                  CMS-authored sections render here now as placeholders. The
                  final page-builder UI lands in the next renderer milestone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Featured pets</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">Borrowable drama</h2>
          </div>
          <Button href="/pets" variant="secondary">
            See all pets
          </Button>
        </div>
        {featuredPets.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredPets.map((pet) => (
              <article key={pet._id} className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-pet-muted">
                  {pet.petType.filterLabel}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold text-pet-ink">{pet.name}</h3>
                <p className="mt-2 text-sm font-bold text-pet-muted">{pet.listingHeadline}</p>
                <p className="mt-3 text-sm leading-6 text-pet-muted">{pet.listingSummary}</p>
                <Button href={`/pets/${pet.slug}`} variant="secondary">
                  View listing
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <SectionPlaceholders
            sections={page?.contentSections}
            emptyLabel="Featured pets and homepage sections will appear after seed content is published."
          />
        )}
      </section>
    </>
  );
}
