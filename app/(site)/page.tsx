import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { stegaClean } from "@sanity/client/stega";
import { ArrowRight, CalendarCheck, Clock, MapPin, PawPrint, Quote, Search, ShieldCheck, Users } from "lucide-react";
import { HomeHeroCarousel } from "@/components/features/home/home-hero-carousel";
import type { HomeHeroSlide } from "@/components/features/home/home-hero-carousel";
import { PetCard } from "@/components/features/pets/pet-card";
import type { CtaValue, PageSection } from "@/components/features/sections/section-types";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { RichText } from "@/components/ui/portable-text";
import { logger } from "@/lib/diagnostics/logger";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadHomePage, loadSiteDefaultSeo } from "@/sanity/lib/loaders";

const homepageLocationLabel = "Near you in Hamilton, ON";

type HomePageData = NonNullable<Awaited<ReturnType<typeof loadHomePage>>>;
type FeaturedPet = NonNullable<HomePageData["featuredPets"]>[number];
type FeaturedTestimonial = NonNullable<HomePageData["testimonials"]>[number];
type HomeProcessSection = Extract<PageSection, { _type: "processPathSection" }>;
type HomeCalloutSection = Extract<PageSection, { _type: "calloutBlock" }>;

function getHeroMediaFallback(slide: HomeHeroSlide, featuredPets: FeaturedPet[], index: number) {
  if (slide.image) {
    return slide.image;
  }

  const slideText = `${slide.headline} ${slide.body ?? ""}`.toLowerCase();
  const matchingPet = featuredPets.find((pet) => {
    const petType = stegaClean(pet.petType?.slug)?.toLowerCase() ?? "";

    return (slideText.includes("dog") && petType === "dog") || (slideText.includes("cat") && petType === "cat") || (slideText.includes("rabbit") && petType === "rabbit");
  });

  return matchingPet?.cardMedia?.image ?? featuredPets[index % Math.max(featuredPets.length, 1)]?.cardMedia?.image ?? null;
}

function getCtaHref(cta: CtaValue | null | undefined, fallbackHref: string) {
  return cta?.link?.path ?? cta?.link?.url ?? fallbackHref;
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

function HomepageProcessSection({ section }: Readonly<{ section?: HomeProcessSection | null }>) {
  const header = section?.header ?? {
    headline: section?.title ?? "How Pet Share works",
    body: section?.body ?? "A better way to care, connect, and share."
  };
  const primaryCta = section?.cta;

  return (
    <section className="mx-auto w-full max-w-[1440px] min-w-0 px-5 pb-20 pt-8 sm:px-8 lg:px-10">
      <div className="rounded-[2rem] bg-white/82 px-6 py-10 shadow-soft backdrop-blur sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">{header.headline}</h2>
          {header.body ? <p className="mt-3 text-base leading-7 text-pet-muted sm:text-lg">{header.body}</p> : null}
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
              const cmsStep = section?.steps?.[index];
              const Icon = step.icon;

              return (
                // Each step reveals sequentially (index-driven stagger) as the
                // section scrolls into view. Reduced-motion users see all four
                // immediately — Reveal gates the transform/fade behind motion-safe.
                <Reveal as="li" key={cmsStep?._key ?? step.title} index={index} className="min-w-0 text-center">
                  <span className="mx-auto flex size-28 items-center justify-center rounded-full bg-pet-cream text-pet-ink shadow-sm">
                    <Icon aria-hidden="true" size={42} strokeWidth={2.25} />
                  </span>
                  <span className="mx-auto mt-4 flex size-8 items-center justify-center rounded-full bg-pet-coral/10 font-display text-sm font-bold text-pet-coral">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold leading-tight text-pet-ink">{cmsStep?.title ?? step.title}</h3>
                  <div className="mx-auto mt-3 max-w-60 text-sm leading-6 text-pet-muted">
                    {cmsStep && "body" in cmsStep && cmsStep.body?.length ? (
                      <RichText value={cmsStep.body} />
                    ) : (
                      <p>{cmsStep?.description ?? step.body}</p>
                    )}
                  </div>
                </Reveal>
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
          <Button href={getCtaHref(primaryCta, "/how-it-works")} variant="secondary">
            {primaryCta?.label ?? "Learn more about sharing your pet"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function HomepageReliefSection({ section }: Readonly<{ section?: HomeCalloutSection | null }>) {
  return (
    <section className="mx-auto w-full max-w-[1440px] min-w-0 px-5 pb-20 sm:px-8 lg:px-10">
      <div className="grid min-w-0 gap-8 rounded-[2rem] bg-pet-mint/20 p-6 shadow-soft sm:p-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:p-12">
        <div className="min-w-0 self-center">
          <p className="font-bold text-pet-coral">{section?.tone ?? "Temporary pet relief"}</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink">
            {section?.headline ?? "Keep the stories. Return the responsibility."}
          </h2>
          <p className="mt-5 text-lg leading-8 text-pet-muted">
            {section?.body ??
              "Pet Share is for short stays, honest expectations, and the kind of weekend plan that ends with someone saying, \"Actually, the tiny instructions were helpful.\""}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={getCtaHref(section?.cta, "/pets")}>{section?.cta?.label ?? "Find a temporary pet"}</Button>
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
          <h2 className="font-display text-4xl font-bold text-pet-ink">Notes from people who agreed to this</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-pet-muted">
            Friendly field notes from temporary hosts, owners, and people who now keep backup lint rollers in the car.
          </p>
        </div>
        <Link
          href="/pets"
          className="inline-flex items-center gap-2 font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
        >
          Browse listings
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <figure className="min-w-0 rounded-[2rem] bg-white/82 p-7 shadow-soft backdrop-blur sm:p-9">
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
            <figure key={testimonial._id} className="min-w-0 rounded-[1.5rem] bg-pet-cream/70 p-5 shadow-sm">
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
  const siteDefaultSeo = await loadSiteDefaultSeo().catch(() => null);

  try {
    const page = await loadHomePage();

    return metadataFromSeo({
      seo: page?.seo,
      siteDefaultSeo,
      fallbackTitle: "Pet Share",
      fallbackDescription: "A bright marketplace for temporary pet relief.",
      path: "/"
    });
  } catch {
    return metadataFromSeo({
      siteDefaultSeo,
      fallbackTitle: "Pet Share",
      fallbackDescription: "A bright marketplace for temporary pet relief.",
      path: "/"
    });
  }
}

/**
 * Renders the CMS-backed homepage route with resilient starter sections.
 */
export default async function HomePage() {
  const { isEnabled } = await draftMode();
  let page: Awaited<ReturnType<typeof loadHomePage>> | null = null;

  try {
    page = await loadHomePage({ preview: isEnabled });
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
  const contentSections = page?.contentSections ?? [];
  const homepageProcess = contentSections.find((section): section is HomeProcessSection => stegaClean(section._type) === "processPathSection");
  const homepageRelief = contentSections.find((section): section is HomeCalloutSection => stegaClean(section._type) === "calloutBlock");

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
            className="inline-flex items-center gap-2 font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
          >
            View all pets
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        {featuredPets.length ? (
          <div className="grid min-w-0 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {featuredPets.map((pet, index) => (
              <Reveal key={pet._id} index={index % 3} className="min-w-0">
                <PetCard pet={pet} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] bg-white/65 p-6 text-sm font-bold text-pet-muted shadow-soft backdrop-blur">
            Featured pets are being coaxed into position.
          </div>
        )}
      </section>

      <Reveal>
        <HomepageProcessSection section={homepageProcess} />
      </Reveal>
      <Reveal>
        <HomepageReliefSection section={homepageRelief} />
      </Reveal>
      <Reveal>
        <HomepageTestimonialsSection testimonials={featuredTestimonials} />
      </Reveal>
    </main>
  );
}
