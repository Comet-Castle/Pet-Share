import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Circle, Clock, MapPin, PawPrint, Quote, Search, ShieldCheck, Users } from "lucide-react";
import { HomeHeroCarousel } from "@/components/features/home/home-hero-carousel";
import type { HomeHeroSlide } from "@/components/features/home/home-hero-carousel";
import { availabilityLabels, cuddlePolicyLabels, temperamentLabels } from "@/components/features/pets/status";
import { Button } from "@/components/ui/button";
import { SanityImage } from "@/components/ui/sanity-image";
import { logger } from "@/lib/diagnostics/logger";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadHomePage } from "@/sanity/lib/loaders";

const homepageLocationLabel = "Near you in Hamilton, ON";

const fallbackDistances = [2.4, 4.8, 6.7, 9.3, 12.5, 16.1] as const;

const fallbackPayouts = [24, 28, 32, 21, 36, 30] as const;

const hostPayoutUnitLabels = {
  day: "day",
  stay: "stay",
  weekend: "weekend"
} as const;

type HomePageData = NonNullable<Awaited<ReturnType<typeof loadHomePage>>>;
type FeaturedPet = NonNullable<HomePageData["featuredPets"]>[number] & {
  distanceKilometers?: number | null;
  listingPlan?: "porch" | "spotlight" | "couchRecovery" | null;
  hostPayoutAmount?: number | null;
  hostPayoutCurrency?: string | null;
  hostPayoutUnit?: keyof typeof hostPayoutUnitLabels | null;
};
type FeaturedTestimonial = NonNullable<HomePageData["testimonials"]>[number];

function getAvailabilityTone(status: keyof typeof availabilityLabels) {
  return status === "available" ? "fill-pet-mint text-pet-mint" : "fill-pet-coral text-pet-coral";
}

function getPetChips(pet: FeaturedPet) {
  return [
    pet.temperament ? temperamentLabels[pet.temperament] : null,
    pet.cuddlePolicy ? cuddlePolicyLabels[pet.cuddlePolicy] : null,
    pet.energyLevel >= 4 ? "High energy" : null
  ].filter((chip): chip is string => Boolean(chip)).slice(0, 3);
}

function getDistanceLabel(pet: FeaturedPet, index: number) {
  const distance = typeof pet.distanceKilometers === "number" ? pet.distanceKilometers : fallbackDistances[index % fallbackDistances.length];
  const formattedDistance = Number.isInteger(distance) ? distance.toFixed(0) : distance.toFixed(1);

  return `${formattedDistance} km away`;
}

function getHostPayoutLabel(pet: FeaturedPet, index: number) {
  const amount = typeof pet.hostPayoutAmount === "number" ? pet.hostPayoutAmount : fallbackPayouts[index % fallbackPayouts.length];
  const unit = pet.hostPayoutUnit ? hostPayoutUnitLabels[pet.hostPayoutUnit] : "day";
  const currency = pet.hostPayoutCurrency ?? "CAD";
  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount);

  return `${formattedAmount} / ${unit}`;
}

function getHeroMediaFallback(slide: HomeHeroSlide, featuredPets: FeaturedPet[], index: number) {
  if (slide.image) {
    return slide.image;
  }

  const slideText = `${slide.headline} ${slide.body ?? ""}`.toLowerCase();
  const matchingPet = featuredPets.find((pet) => {
    const petType = pet.petType?.slug?.toLowerCase() ?? "";

    return (slideText.includes("dog") && petType === "dog") || (slideText.includes("cat") && petType === "cat") || (slideText.includes("rabbit") && petType === "rabbit");
  });

  return matchingPet?.cardMedia?.image ?? featuredPets[index % Math.max(featuredPets.length, 1)]?.cardMedia?.image ?? null;
}

const homepageProcessSteps = [
  {
    icon: Search,
    title: "Find the right fit",
    body: "Browse pets near you and choose a temporary companion that matches your weekend, your couch, and your snack boundaries."
  },
  {
    icon: CalendarCheck,
    title: "Request & connect",
    body: "Send a request, confirm the timing, and make sure the handoff details feel less mysterious than the pet's motives."
  },
  {
    icon: PawPrint,
    title: "Enjoy the stay",
    body: "Pick up your temporary companion, follow the care notes, collect the good stories, and accept the lint as character."
  },
  {
    icon: ShieldCheck,
    title: "Return & review",
    body: "Reunite pet and owner, leave a practical review, and pretend everyone handled the goodbye with dignity."
  }
] as const;

const homepageProcessBenefits = [
  {
    icon: ShieldCheck,
    title: "Safety first",
    body: "Clear owner notes, agreed pickup details, and fewer surprises pretending to be policy."
  },
  {
    icon: Clock,
    title: "Limited stays",
    body: "Temporary companionship, maximum story value, and a scheduled return before attachment gets ambitious."
  },
  {
    icon: PawPrint,
    title: "Happy pets",
    body: "New rooms, new smells, new admirers, and the same care routine written down for everyone."
  },
  {
    icon: Users,
    title: "Trusted people",
    body: "Real profiles, useful reviews, and hosts who understand that every pet arrives with terms."
  }
] as const;

function HomepageProcessSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] min-w-0 px-5 pb-20 pt-8 sm:px-8 lg:px-10">
      <div className="rounded-[2rem] bg-white/82 px-6 py-10 shadow-soft backdrop-blur sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">How Pet Share works</h2>
          <p className="mt-3 text-base leading-7 text-pet-muted sm:text-lg">A better way to care, connect, and share.</p>
        </div>

        <div className="relative mt-12">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] right-[12%] top-14 hidden h-12 w-[76%] text-pet-mint/55 xl:block"
            viewBox="0 0 900 70"
            preserveAspectRatio="none"
          >
            <path
              d="M10 36 C130 4 250 66 370 36 S610 4 730 36 850 64 890 36"
              fill="none"
              stroke="currentColor"
              strokeDasharray="8 12"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>

          <ol className="relative z-10 grid min-w-0 gap-10 sm:grid-cols-2 xl:grid-cols-4">
            {homepageProcessSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <li key={step.title} className="min-w-0 text-center">
                  <span className="mx-auto flex size-28 items-center justify-center rounded-full bg-pet-cream text-pet-ink shadow-sm">
                    <Icon aria-hidden="true" size={42} strokeWidth={2.25} />
                  </span>
                  <span className="mx-auto mt-4 flex size-8 items-center justify-center rounded-full bg-pet-coral/10 font-display text-sm font-bold text-pet-coral">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold leading-tight text-pet-ink">{step.title}</h3>
                  <p className="mx-auto mt-3 max-w-56 text-sm leading-6 text-pet-muted">{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-14 rounded-[1.75rem] bg-pet-mint/25 px-5 py-6 shadow-sm sm:px-7 sm:py-7">
          <div className="grid min-w-0 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {homepageProcessBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article key={benefit.title} className="flex min-w-0 gap-4 text-left">
                  <span className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-white/90 text-pet-ink shadow-sm">
                    <Icon aria-hidden="true" size={27} strokeWidth={2.25} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold leading-tight text-pet-ink">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-pet-muted">{benefit.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <Button href="/pets">Find pets near you</Button>
          <Button href="/process" variant="secondary">Learn more about sharing your pet</Button>
        </div>
      </div>
    </section>
  );
}

function HomepageReliefSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] min-w-0 px-5 pb-20 sm:px-8 lg:px-10">
      <div className="grid min-w-0 gap-8 rounded-[2rem] bg-pet-mint/20 p-6 shadow-soft sm:p-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:p-12">
        <div className="min-w-0 self-center">
          <p className="font-bold text-pet-coral">Temporary pet relief</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink">
            Keep the stories. Return the responsibility.
          </h2>
          <p className="mt-5 text-lg leading-8 text-pet-muted">
            Pet Share is for short stays, honest expectations, and the kind of weekend plan that ends with someone saying,
            &quot;Actually, the tiny instructions were helpful.&quot;
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/pets">Find a temporary pet</Button>
            <Button href="/pricing" variant="secondary">List your pet</Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["For owners", "Take a break without writing a dramatic group chat asking who wants to watch the pet."],
            ["For hosts", "Enjoy the walks, photos, couch negotiations, and the scheduled return."],
            ["For the pets", "New windows, new smells, familiar care notes, and a mildly expanded social calendar."],
            ["For everyone", "Clear timing, practical details, and fewer surprises pretending to be personality."]
          ].map(([title, body]) => (
            <article key={title} className="rounded-[1.5rem] bg-white/75 p-5 shadow-sm backdrop-blur">
              <h3 className="font-display text-xl font-bold text-pet-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-pet-muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageTestimonialsSection({ testimonials }: Readonly<{ testimonials: FeaturedTestimonial[] }>) {
  if (!testimonials.length) {
    return null;
  }

  const [featured, ...supporting] = testimonials;

  return (
    <section className="mx-auto w-full max-w-[1440px] min-w-0 px-5 pb-20 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-4xl font-bold text-pet-ink">Reports from temporary hosts</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-pet-muted">
            Lightly professional feedback from people who accepted a short stay and lived to recommend a lint roller.
          </p>
        </div>
        <Link
          href="/pets"
          className="inline-flex items-center gap-2 font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
        >
          Browse listings
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <figure className="min-w-0 rounded-[2rem] bg-white p-7 shadow-soft sm:p-9">
          <Quote aria-hidden="true" className="text-pet-coral" size={34} />
          <blockquote className="mt-5 font-display text-3xl font-bold leading-tight text-pet-ink">
            {featured.quote}
          </blockquote>
          <figcaption className="mt-7">
            <p className="font-display text-xl font-bold text-pet-ink">{featured.authorName}</p>
            {featured.authorRole ? <p className="mt-1 text-sm font-bold text-pet-muted">{featured.authorRole}</p> : null}
          </figcaption>
        </figure>
        <div className="grid gap-5">
          {supporting.slice(0, 3).map((testimonial) => (
            <figure key={testimonial._id} className="min-w-0 rounded-[1.5rem] bg-pet-cream/70 p-5">
              <blockquote className="text-base leading-7 text-pet-ink">&quot;{testimonial.quote}&quot;</blockquote>
              <figcaption className="mt-4 text-sm font-bold text-pet-muted">
                {testimonial.authorName}
                {testimonial.authorRole ? `, ${testimonial.authorRole}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

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

  const heroSlides: HomeHeroSlide[] = page?.heroCarousel?.length
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
  const featuredPets = (page?.featuredPets ?? []) as FeaturedPet[];
  const heroSlidesWithPetMedia = heroSlides.map((slide, index) => ({
    ...slide,
    image: getHeroMediaFallback(slide, featuredPets, index)
  }));
  const featuredTestimonials = page?.testimonials ?? [];

  return (
    <main>
      <HomeHeroCarousel slides={heroSlidesWithPetMedia} />

      <section className="mx-auto w-full max-w-[1440px] min-w-0 px-5 pb-16 pt-2 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-wrap font-display text-4xl font-bold text-pet-ink">Pets near you</h2>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-pet-muted">
              <MapPin aria-hidden="true" size={17} className="text-pet-coral" />
              {homepageLocationLabel}
            </p>
          </div>
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
          >
            View all pets
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        {featuredPets.length ? (
          <div className="grid min-w-0 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {featuredPets.map((pet, index) => (
              <Link
                key={pet._id}
                href={`/pets/${pet.slug}`}
                aria-label={`View ${pet.name}`}
                className="group block min-w-0 cursor-pointer rounded-[1.75rem] focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-4"
              >
                <article className="min-w-0 overflow-hidden rounded-[1.75rem] bg-white shadow-soft transition duration-200 group-hover:-translate-y-1">
                  <div className="relative">
                    <SanityImage
                      image={pet.cardMedia?.image ?? null}
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
                      className="aspect-[4/3]"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-pet-ink shadow-sm backdrop-blur">
                      <Circle aria-hidden="true" size={9} className={getAvailabilityTone(pet.availabilityStatus)} />
                      {availabilityLabels[pet.availabilityStatus]}
                    </span>
                    <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                      {getPetChips(pet).map((chip) => (
                        <span key={`${pet._id}-${chip}`} className="rounded-full bg-pet-mint/80 px-3 py-1 text-xs font-bold text-pet-ink shadow-sm backdrop-blur">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0 p-5 sm:p-6">
                    <h3 className="font-display text-[1.45rem] font-bold leading-[1.08] text-pet-ink">{pet.name}</h3>
                    <p className="mt-1.5 text-[0.9rem] font-bold leading-5 text-pet-muted">{pet.breed ?? pet.petType?.filterLabel ?? "Pet"}</p>
                    <p className="mt-3 text-[0.95rem] leading-6 text-pet-muted">{pet.listingHeadline}</p>
                    <div className="mt-7 flex items-center justify-between gap-4">
                      <div className="inline-flex min-w-0 items-center gap-1.5 text-sm font-bold text-pet-muted">
                        <MapPin aria-hidden="true" size={17} className="shrink-0 text-pet-coral" />
                        <span className="truncate">{getDistanceLabel(pet, index)}</span>
                      </div>
                      <p className="shrink-0 font-display text-lg font-bold leading-none text-pet-ink">{getHostPayoutLabel(pet, index)}</p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white/65 p-6 text-sm font-bold text-pet-muted shadow-soft backdrop-blur">
            Featured pets are being coaxed into position.
          </div>
        )}
      </section>

      <HomepageProcessSection />
      <HomepageReliefSection />
      <HomepageTestimonialsSection testimonials={featuredTestimonials} />
    </main>
  );
}
