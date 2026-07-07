import { draftMode } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { stegaClean } from "@sanity/client/stega";
import { CalendarDays, Gauge, HeartHandshake, PawPrint } from "lucide-react";
import { PetImageGallery } from "@/components/features/pets/pet-image-gallery";
import { availabilityLabels, temperamentLabels, urgencyLabels } from "@/components/features/pets/status";
import { SystemMessage } from "@/components/features/system/system-message";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/portable-text";
import { loadPetById } from "@/sanity/lib/loaders";

type PetDocumentPreviewPageProps = Readonly<{
  params: Promise<{
    documentId: string;
  }>;
}>;

/**
 * Renders an unpublished pet listing draft by Sanity document ID.
 */
export default async function PetDocumentPreviewPage({ params }: PetDocumentPreviewPageProps) {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Preview unavailable"
        title="This pet needs a Studio handoff."
        message="Open this listing from Sanity Presentation so Draft Mode can be enabled safely."
        primaryHref="/studio"
        primaryLabel="Open Studio"
      />
    );
  }

  const { documentId } = await params;
  const pet = await loadPetById(decodeURIComponent(documentId), { preview: true });

  if (!pet) {
    notFound();
  }

  if (pet.slug) {
    redirect(`/pets/${pet.slug}`);
  }

  const galleryImages = [pet.cardMedia?.image, ...(pet.heroImages ?? [])].filter((image) => image?.image?.asset?.url);
  const petTypeLabel = pet.petType?.filterLabel ?? "Pet";
  const availabilityStatus = stegaClean(pet.availabilityStatus) as keyof typeof availabilityLabels;
  const pickupUrgency = stegaClean(pet.pickupUrgency) as keyof typeof urgencyLabels;
  const temperament = stegaClean(pet.temperament) as keyof typeof temperamentLabels;

  return (
    <article className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PetImageGallery images={galleryImages} petName={pet.name} />

        <section className="min-w-0 rounded-[2rem] bg-white/75 p-6 shadow-soft backdrop-blur sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{petTypeLabel}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">{pet.name}</h1>
          <p className="mt-3 text-xl font-bold text-pet-muted">{pet.listingHeadline}</p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-pet-mint/25 p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-pet-muted">
                <HeartHandshake aria-hidden="true" size={18} />
                Status
              </dt>
              <dd className="mt-1 font-display text-xl font-bold text-pet-ink">{availabilityLabels[availabilityStatus]}</dd>
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
              <dd className="mt-1 font-display text-xl font-bold text-pet-ink">{urgencyLabels[pickupUrgency]}</dd>
            </div>
            <div className="rounded-3xl bg-white p-4">
              <dt className="flex items-center gap-2 text-sm font-bold text-pet-muted">
                <PawPrint aria-hidden="true" size={18} />
                Temperament
              </dt>
              <dd className="mt-1 font-display text-xl font-bold text-pet-ink">{temperamentLabels[temperament]}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/pets">Back to pets</Button>
            {pet.owner?.slug ? (
              <Button href={`/owners/${pet.owner.slug}`} variant="secondary">
                View owner
              </Button>
            ) : null}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
        <h2 className="font-display text-3xl font-bold text-pet-ink">About {pet.name}</h2>
        <div className="mt-4">
          {pet.description?.length ? <RichText value={pet.description} /> : <p className="leading-7 text-pet-muted">{pet.summary}</p>}
        </div>
      </section>

      {pet.owner ? (
        <section className="mt-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Owner</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">{pet.owner.name}</h2>
          {pet.owner.tagline ? <p className="mt-3 text-base leading-7 text-pet-muted">{pet.owner.tagline}</p> : null}
          {pet.owner.slug ? (
            <Link
              href={`/owners/${pet.owner.slug}`}
              className="mt-5 inline-flex cursor-pointer rounded-full bg-pet-ink px-5 py-3 text-sm font-bold text-white transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
            >
              View owner page
            </Link>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
