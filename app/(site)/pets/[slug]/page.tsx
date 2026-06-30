import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Gauge, HeartHandshake, MapPin, PawPrint, ShieldAlert } from "lucide-react";
import { PetImageGallery } from "@/components/features/pets/pet-image-gallery";
import { SystemMessage } from "@/components/features/system/system-message";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/portable-text";
import { SanityImage } from "@/components/ui/sanity-image";
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
  let pet: Awaited<ReturnType<typeof loadPetBySlug>> | null = null;

  try {
    pet = await loadPetBySlug(slug);
  } catch {
    return metadataFromSeo({
      fallbackTitle: "Pet listing",
      fallbackDescription: "This pet listing is temporarily unavailable."
    });
  }

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
  let pet: Awaited<ReturnType<typeof loadPetBySlug>> | null = null;

  try {
    pet = await loadPetBySlug(slug);
  } catch {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Pet unavailable"
        title="This pet is refusing to leave its blanket."
        message="The listing could not be loaded right now. Try again after the household negotiations settle."
        primaryHref="/pets"
        primaryLabel="Back to pets"
      />
    );
  }

  if (!pet) {
    notFound();
  }

  const galleryImages = [pet.cardMedia?.image, ...(pet.heroImages ?? [])].filter((image) => image?.image?.asset?.url);
  const petTypeLabel = pet.petType?.filterLabel ?? "Pet";
  const ownerName = pet.owner?.name ?? "A very tired owner";

  return (
    <article className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PetImageGallery images={galleryImages} petName={pet.name} />

        <section className="min-w-0 rounded-[2rem] bg-white/75 p-6 shadow-soft backdrop-blur sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">
            {petTypeLabel}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">
            {pet.name}
          </h1>
          <p className="mt-3 text-xl font-bold text-pet-muted">{pet.listingHeadline}</p>

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

      <div className="mt-8 space-y-8">
        <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
          <h2 className="font-display text-3xl font-bold text-pet-ink">About {pet.name}</h2>
          <div className="mt-4">
            {pet.description?.length ? (
              <RichText value={pet.description} />
            ) : (
              <p className="leading-7 text-pet-muted">
                {pet.summary || "The owner has not finished explaining this pet yet."}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] bg-white/70 p-5 shadow-soft backdrop-blur sm:p-6" id="contact-owner">
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center lg:grid-cols-[280px_1fr]">
            <SanityImage
              image={pet.owner?.portrait ?? null}
              sizes="(min-width: 1024px) 280px, (min-width: 768px) 220px, 100vw"
              className="aspect-square rounded-[1.5rem]"
              imageClassName="object-cover"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Owner</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">{ownerName}</h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-pet-muted">
                {pet.owner?.tagline ?? "Owner details are still being gathered from the handoff notes."}
              </p>
            {pet.owner?.location ? (
              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-pet-muted">
                <MapPin aria-hidden="true" size={16} />
                {pet.owner.location}
              </p>
            ) : null}

              {pet.owner?.slug ? (
                <div className="mt-5">
                  <Link
                    href={`/owners/${pet.owner.slug}`}
                    className="inline-flex rounded-full bg-pet-ink px-5 py-3 text-sm font-bold text-white transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
                  >
                    View owner page
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
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
        </div>
      </div>
    </article>
  );
}
