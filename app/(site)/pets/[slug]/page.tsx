import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Gauge, HeartHandshake, MapPin, PawPrint, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { portableTextToPlainText } from "@/lib/content/plain-text";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadPetBySlug, loadPetSlugs } from "@/sanity/lib/loaders";
import { availabilityLabels, cuddlePolicyLabels, temperamentLabels, urgencyLabels } from "@/components/features/pets/status";

type PetSlugPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export async function generateStaticParams() {
  const pets = await loadPetSlugs();

  return pets.map((pet) => ({ slug: pet.slug }));
}

export async function generateMetadata({ params }: PetSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pet = await loadPetBySlug(slug);

  if (!pet) {
    return metadataFromSeo({
      fallbackTitle: "Pet not found",
      fallbackDescription: "This pet listing is not available."
    });
  }

  return metadataFromSeo({
    seo: pet.seo,
    fallbackTitle: pet.name,
    fallbackDescription: pet.listingSummary
  });
}

/**
 * Renders one public pet listing from the approved Sanity pet document.
 */
export default async function PetSlugPage({ params }: PetSlugPageProps) {
  const { slug } = await params;
  const pet = await loadPetBySlug(slug);

  if (!pet) {
    notFound();
  }

  const heroImage = pet.heroImages[0] ?? pet.cardMedia.image;
  const heroImageUrl = heroImage.image.asset?.url;
  const description = portableTextToPlainText(pet.description);

  return (
    <article className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[2rem] bg-white/65 shadow-soft backdrop-blur">
          <div className="relative aspect-[4/3] bg-pet-mint/25">
            {heroImageUrl ? (
              <Image
                src={heroImageUrl}
                alt={heroImage.alt}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-pet-muted">
                <PawPrint aria-hidden="true" size={64} />
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white/75 p-6 shadow-soft backdrop-blur sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">
            {pet.petType.filterLabel}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">
            {pet.name}
          </h1>
          <p className="mt-3 text-xl font-bold text-pet-muted">{pet.listingHeadline}</p>
          <p className="mt-5 leading-7 text-pet-muted">{pet.listingSummary}</p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-pet-mint/25 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-pet-muted">
                <HeartHandshake aria-hidden="true" size={18} />
                Status
              </dt>
              <dd className="mt-1 font-display text-xl font-bold text-pet-ink">{availabilityLabels[pet.availabilityStatus]}</dd>
            </div>
            <div className="rounded-3xl bg-pet-blue/20 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-pet-muted">
                <Gauge aria-hidden="true" size={18} />
                Chaos
              </dt>
              <dd className="mt-1 font-display text-xl font-bold text-pet-ink">{pet.chaosLevel}/5</dd>
            </div>
            <div className="rounded-3xl bg-pet-coral/15 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-pet-muted">
                <CalendarDays aria-hidden="true" size={18} />
                Pickup
              </dt>
              <dd className="mt-1 font-display text-xl font-bold text-pet-ink">{urgencyLabels[pet.pickupUrgency]}</dd>
            </div>
            <div className="rounded-3xl bg-white p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-pet-muted">
                <PawPrint aria-hidden="true" size={18} />
                Temperament
              </dt>
              <dd className="mt-1 font-display text-xl font-bold text-pet-ink">{temperamentLabels[pet.temperament]}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact-owner">{pet.contactOwnerCta?.label ?? "Ask about this pet"}</Button>
            <Button href="/pets" variant="secondary">
              Back to pets
            </Button>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
          <h2 className="font-display text-3xl font-bold text-pet-ink">About {pet.name}</h2>
          <p className="mt-4 whitespace-pre-line leading-8 text-pet-muted">
            {description || pet.summary || "Full pet biography will render here when seeded Portable Text content exists."}
          </p>
        </section>

        <aside className="space-y-5">
          <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur" id="contact-owner">
            <h2 className="font-display text-2xl font-bold text-pet-ink">Owner</h2>
            <p className="mt-2 text-lg font-bold text-pet-ink">{pet.owner.name}</p>
            <p className="mt-2 text-sm leading-6 text-pet-muted">{pet.owner.tagline}</p>
            {pet.owner.location ? (
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-pet-muted">
                <MapPin aria-hidden="true" size={16} />
                {pet.owner.location}
              </p>
            ) : null}
            <Link
              href={`/owners/${pet.owner.slug}`}
              className="mt-5 inline-flex rounded-full bg-pet-ink px-5 py-3 text-sm font-bold text-white transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
            >
              View owner page
            </Link>
          </section>

          <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur">
            <h2 className="font-display text-2xl font-bold text-pet-ink">Borrowing terms</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-pet-muted">
              <li>Cuddle policy: {cuddlePolicyLabels[pet.cuddlePolicy]}</li>
              <li>Energy level: {pet.energyLevel}/5</li>
              <li>Mess risk: {pet.messRisk}/5</li>
            </ul>
          </section>

          {pet.warnings?.length ? (
            <section className="rounded-[2rem] bg-pet-coral/15 p-6 shadow-soft backdrop-blur">
              <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-pet-ink">
                <ShieldAlert aria-hidden="true" size={22} />
                Warnings
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-pet-muted">
                {pet.warnings.map((warning) => (
                  <li key={warning._key}>
                    <strong className="text-pet-ink">{warning.title}:</strong> {warning.description}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
