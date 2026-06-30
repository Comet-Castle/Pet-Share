import type { Metadata } from "next";
import { PawPrint } from "lucide-react";
import { PageSections } from "@/components/features/sections/page-sections";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/ui/sanity-image";
import { logger } from "@/lib/diagnostics/logger";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadHomePage } from "@/sanity/lib/loaders";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await loadHomePage();

    return metadataFromSeo({
      seo: page?.seo,
      fallbackTitle: "Pet Share",
      fallbackDescription: "A bright marketplace for temporary pet relief."
    });
  } catch {
    return metadataFromSeo({
      fallbackTitle: "Pet Share",
      fallbackDescription: "A bright marketplace for temporary pet relief."
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

  const heroSlides = page?.heroCarousel?.length
    ? page.heroCarousel
    : [
        {
          _key: "fallback-hero",
          headline: "Has your dog thrown up in the bed recently?",
          body: "Lend him out for a couple days. Someone else deserves character development.",
          image: null,
          cta: null
        }
      ];
  const featuredPets = page?.featuredPets ?? [];

  return (
    <>
      <section className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:thin]" aria-label="Pet Share highlights">
          {heroSlides.map((slide, index) => (
            <article
              key={slide._key ?? `hero-slide-${index}`}
              id={`home-hero-slide-${index + 1}`}
              className="grid min-h-[calc(100vh-13rem)] w-full min-w-full snap-start items-center gap-10 rounded-[2rem] bg-white/65 p-6 shadow-soft backdrop-blur sm:p-10 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="max-w-3xl">
                <h1 className="font-display text-5xl font-bold leading-tight text-pet-ink sm:text-6xl lg:text-7xl">
                  {slide.headline}
                </h1>
                {slide.body ? <p className="mt-6 max-w-2xl text-lg leading-8 text-pet-muted">{slide.body}</p> : null}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={slide.cta?.link?.path ?? "/pets"} icon={<PawPrint aria-hidden="true" size={20} />}>
                    {slide.cta?.label ?? "Find a temporary pet"}
                  </Button>
                  <Button href="/process" variant="secondary">
                    Lend your pet
                  </Button>
                </div>
              </div>

              <SanityImage
                image={slide.image ?? null}
                sizes="(min-width: 1024px) 42vw, 100vw"
                priority={index === 0}
                className="aspect-[4/3] rounded-[2rem] shadow-soft"
              />
            </article>
          ))}
        </div>
        {heroSlides.length > 1 ? (
          <div className="mt-4 flex justify-center gap-2" aria-label="Hero slide navigation">
            {heroSlides.map((slide, index) => (
              <a
                key={`${slide._key ?? "hero-dot"}-${index}`}
                href={`#home-hero-slide-${index + 1}`}
                className="size-3 rounded-full bg-pet-ink/25 transition hover:scale-125 hover:bg-pet-coral focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              >
                <span className="sr-only">Go to hero slide {index + 1}</span>
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Pets near you</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">Available for short-term emotional support</h2>
          </div>
          <Button href="/pets" variant="secondary">
            See all pets
          </Button>
        </div>
        {featuredPets.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredPets.map((pet) => (
              <article key={pet._id} className="overflow-hidden rounded-[2rem] bg-white/70 shadow-soft backdrop-blur">
                <SanityImage
                  image={pet.cardMedia?.image ?? null}
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/3]"
                />
                <div className="p-6">
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-pet-muted">
                    {pet.breed ?? pet.petType?.filterLabel ?? "Pet"}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold text-pet-ink">{pet.name}</h3>
                  <p className="mt-2 text-sm font-bold text-pet-muted">{pet.listingHeadline}</p>
                  <div className="mt-5">
                    <Button href={`/pets/${pet.slug}`} variant="secondary">
                      View listing
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white/65 p-6 text-sm font-bold text-pet-muted shadow-soft backdrop-blur">
            Featured pets are being coaxed into position.
          </div>
        )}
      </section>

      {page?.contentSections?.length ? <PageSections sections={page.contentSections} /> : null}
    </>
  );
}
