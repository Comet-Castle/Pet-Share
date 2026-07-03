import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft, ClipboardCheck, HeartHandshake, MapPin, ShieldAlert, Sparkles } from "lucide-react";
import { OwnerContactDrawer } from "@/components/features/pets/owner-contact-drawer";
import { PetDayTimeline } from "@/components/features/pets/pet-day-timeline";
import { PetFitGuidance } from "@/components/features/pets/pet-fit-guidance";
import { PetImageGallery } from "@/components/features/pets/pet-image-gallery";
import { PetCard } from "@/components/features/pets/pet-card";
import { PetFactGrid } from "@/components/features/pets/pet-fact-grid";
import { PetVibeProfile } from "@/components/features/pets/pet-vibe-profile";
import { SystemMessage } from "@/components/features/system/system-message";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/portable-text";
import { SanityImage } from "@/components/ui/sanity-image";
import { metadataFromSeo } from "@/lib/content/metadata";
import { logger } from "@/lib/diagnostics/logger";
import { loadPetBySlug, loadPetSlugs, loadRelatedPets } from "@/sanity/lib/loaders";
import { formatPetAge } from "@/components/features/pets/format";
import { availabilityLabels } from "@/components/features/pets/status";

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

type Severity = "high" | "low" | "medium" | null | undefined;

const severityLabel: Record<NonNullable<Severity>, string> = {
  low: "Low",
  medium: "Medium",
  high: "High"
};

function severityBadgeLabel(severity: Severity) {
  return severity ? severityLabel[severity] ?? null : null;
}

function severityTone(severity: Severity) {
  if (severity === "high") {
    return "bg-pet-coral/16 text-pet-coral";
  }

  if (severity === "medium") {
    return "bg-pet-blue/25 text-pet-ink";
  }

  return "bg-pet-mint/35 text-pet-ink";
}

type NoteCardProps = Readonly<{
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: string | null;
  badgeTone?: string;
}>;

function NoteCard({ title, description, icon, badge, badgeTone }: NoteCardProps) {
  return (
    <article className="flex h-full min-w-0 flex-col gap-2 rounded-[1.5rem] bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        {icon ? (
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-pet-mint/35 text-pet-ink">
            {icon}
          </span>
        ) : (
          <span className="size-9" aria-hidden="true" />
        )}
        {badge ? (
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeTone ?? "bg-pet-mint/35 text-pet-ink"}`}>
            {badge}
          </span>
        ) : null}
      </div>
      <h3 className="font-display text-lg font-bold leading-tight text-pet-ink">{title}</h3>
      <p className="text-sm leading-6 text-pet-muted">{description}</p>
    </article>
  );
}

function SectionShell({ children }: Readonly<{ children: ReactNode }>) {
  return <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">{children}</section>;
}

/**
 * Renders one public pet listing as a polished, image-forward detail page with
 * structured facts, care notes, owner context, and related pets.
 */
export default async function PetSlugPage({ params }: PetSlugPageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  let pet: Awaited<ReturnType<typeof loadPetBySlug>> | null = null;

  try {
    pet = await loadPetBySlug(slug, { preview: isEnabled });
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

  const galleryImages = [pet.cardMedia?.image, ...(pet.heroImages ?? [])].filter(
    (image) => image?.image?.asset?.url
  );
  const petTypeLabel = pet.petType?.filterLabel ?? "Pet";
  const ownerName = pet.owner?.name ?? "A very tired owner";
  const availabilityLabel = availabilityLabels[pet.availabilityStatus as keyof typeof availabilityLabels] ?? "Pet";
  const ageLabel = formatPetAge(pet.ageYears ?? null, pet.dateOfBirth ?? null);
  const isAvailable = pet.availabilityStatus === "available";
  const contactLabel = pet.contactOwnerCta?.label ?? "Ask about this pet";
  const ownerHref = pet.owner?.slug ? `/owners/${pet.owner.slug}` : null;
  const hasVibeContent = Boolean(pet.vibeProfile?.length);
  const hasFitContent = Boolean(pet.fitGuidance?.goodFitItems?.length && pet.fitGuidance.avoidItems?.length);
  const hasTimelineContent = Boolean(pet.dailySchedule?.length);
  const hasCareContent = Boolean(pet.careNotes?.length || pet.borrowTerms?.length || pet.warnings?.length);

  let relatedPets: Awaited<ReturnType<typeof loadRelatedPets>> = [];
  try {
    relatedPets = await loadRelatedPets(pet._id, pet.petType?._id ?? "", pet.owner?._id ?? null, {
      preview: isEnabled
    });
  } catch (error) {
    // Related pets are non-critical; log and continue without the section.
    logger.error("Failed to load related pets.", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      {/* Back link + status row. */}
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold text-pet-muted">
        <Link
          href="/pets"
          className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur transition hover:-rotate-1 hover:text-pet-ink focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
        >
          <ArrowLeft aria-hidden="true" size={15} />
          Back to pets
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
          <Sparkles aria-hidden="true" size={14} className="text-pet-coral" />
          {petTypeLabel}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur">
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-full ${isAvailable ? "bg-pet-mint" : "bg-pet-coral"}`}
          />
          {availabilityLabel}
        </span>
      </div>

      {/* Hero gallery + sticky about panel. */}
      <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <PetImageGallery images={galleryImages} petName={pet.name} />

        <section className="lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-[2rem] bg-white/80 p-6 shadow-soft backdrop-blur sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{petTypeLabel}</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">{pet.name}</h1>
            <p className="mt-3 text-xl font-bold text-pet-muted">{pet.listingHeadline}</p>
            <p className="mt-4 text-base leading-7 text-pet-muted">{pet.summary || pet.listingSummary}</p>

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-3xl bg-pet-cream/60 px-4 py-3 text-sm font-bold text-pet-ink sm:gap-3">
              <span
                aria-hidden="true"
                className={`size-3 shrink-0 rounded-full ${isAvailable ? "bg-pet-mint" : "bg-pet-coral"}`}
              />
              <span>{availabilityLabel}</span>
              {pet.breed ? <span className="text-pet-muted">· {pet.breed}</span> : null}
              {ageLabel !== "Age not listed" ? <span className="text-pet-muted">· {ageLabel}</span> : null}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <OwnerContactDrawer petName={pet.name} ownerName={ownerName} ctaLabel={contactLabel} ownerHref={ownerHref} />
              <Button href={ownerHref ?? "#owner"} variant="secondary">
                Meet the owner
              </Button>
            </div>
            <p className="mt-4 text-xs leading-5 text-pet-muted">
              Contact requests route through the Pet Share team — not a personal owner inbox.
            </p>

            <nav className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-pet-muted" aria-label="Pet detail sections">
              <span className="mr-1">Quick jumps</span>
              <a href="#facts" className="inline-flex rounded-full bg-pet-mint/30 px-3 py-1.5 text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
                Facts
              </a>
              <a href="#about" className="inline-flex rounded-full bg-pet-blue/25 px-3 py-1.5 text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
                About
              </a>
              {hasVibeContent ? (
                <a href="#vibe" className="inline-flex rounded-full bg-pet-mint/30 px-3 py-1.5 text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
                  Vibe
                </a>
              ) : null}
              {hasFitContent ? (
                <a href="#fit" className="inline-flex rounded-full bg-pet-blue/25 px-3 py-1.5 text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
                  Fit
                </a>
              ) : null}
              {hasTimelineContent ? (
                <a href="#timeline" className="inline-flex rounded-full bg-pet-cream px-3 py-1.5 text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
                  Timeline
                </a>
              ) : null}
              {hasCareContent ? (
                <a href="#care" className="inline-flex rounded-full bg-pet-cream px-3 py-1.5 text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
                  Care
                </a>
              ) : null}
              <a href="#owner" className="inline-flex rounded-full bg-white/75 px-3 py-1.5 text-pet-ink shadow-sm transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
                Owner
              </a>
            </nav>
          </div>
        </section>
      </div>

      {/* Structured facts. */}
      <div id="facts" className="mt-8 scroll-mt-8">
        <PetFactGrid pet={pet} />
      </div>

      {/* Description. */}
      <div className="mt-8">
        <section id="about" className="scroll-mt-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
          <h2 className="font-display text-3xl font-bold text-pet-ink">About {pet.name}</h2>
          <div className="mt-4 max-w-3xl text-base leading-7 text-pet-muted">
            {pet.description?.length ? (
              <RichText value={pet.description} />
            ) : (
              <p>{pet.summary || "The owner has not finished explaining this pet yet."}</p>
            )}
          </div>

          {pet.personalityTraits?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {pet.personalityTraits.map((trait) => (
                <span
                  key={trait._key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-pet-mint/30 px-3 py-1.5 text-sm font-bold text-pet-ink"
                >
                  {trait.label}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      {hasVibeContent ? (
        <div id="vibe" className="mt-8 scroll-mt-8">
          <PetVibeProfile items={pet.vibeProfile} />
        </div>
      ) : null}

      {hasFitContent ? (
        <div id="fit" className="mt-8 scroll-mt-8">
          <PetFitGuidance guidance={pet.fitGuidance} />
        </div>
      ) : null}

      {hasTimelineContent ? (
        <div id="timeline" className="mt-8 scroll-mt-8">
          <PetDayTimeline items={pet.dailySchedule} />
        </div>
      ) : null}

      {/* Care notes, borrow terms, warnings. */}
      {hasCareContent ? (
        <div id="care" className="mt-8 grid scroll-mt-8 gap-6 lg:grid-cols-3">
          {pet.careNotes?.length ? (
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-pet-ink">
                <HeartHandshake aria-hidden="true" size={20} className="text-pet-coral" />
                Care notes
              </h2>
              <div className="grid gap-3">
                {pet.careNotes.map((note) => (
                  <NoteCard
                    key={note._key}
                    title={note.title}
                    description={note.description}
                    icon={<HeartHandshake aria-hidden="true" size={16} />}
                    badge={severityBadgeLabel(note.severity as Severity)}
                    badgeTone={severityTone(note.severity as Severity)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {pet.borrowTerms?.length ? (
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-pet-ink">
                <ClipboardCheck aria-hidden="true" size={20} className="text-pet-coral" />
                Borrowing terms
              </h2>
              <div className="grid gap-3">
                {pet.borrowTerms.map((term) => (
                  <NoteCard
                    key={term._key}
                    title={term.title}
                    description={term.description}
                    icon={<ClipboardCheck aria-hidden="true" size={16} />}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {pet.warnings?.length ? (
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-pet-ink">
                <ShieldAlert aria-hidden="true" size={20} className="text-pet-coral" />
                Warnings
              </h2>
              <div className="grid gap-3">
                {pet.warnings.map((warning) => (
                  <NoteCard
                    key={warning._key}
                    title={warning.title}
                    description={warning.description}
                    icon={<ShieldAlert aria-hidden="true" size={16} />}
                    badge={severityBadgeLabel(warning.severity as Severity)}
                    badgeTone={severityTone(warning.severity as Severity)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Owner summary + contact anchor. */}
      <section className="mt-8 scroll-mt-8" id="owner">
        <SectionShell>
          <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center lg:grid-cols-[280px_1fr]">
            <SanityImage
              image={pet.owner?.portrait ?? null}
              sizes="(min-width: 1024px) 280px, (min-width: 768px) 220px, 60vw"
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
                  <MapPin aria-hidden="true" size={16} className="text-pet-coral" />
                  {pet.owner.location}
                </p>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <OwnerContactDrawer petName={pet.name} ownerName={ownerName} ctaLabel={contactLabel} ownerHref={ownerHref} />
                {ownerHref ? (
                  <Button href={ownerHref} variant="secondary">
                    View owner page
                  </Button>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-pet-muted">
                Contact requests are handled through the Pet Share team, not direct owner inboxes.
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      {/* Related pets. */}
      {relatedPets.length ? (
        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-bold text-pet-ink">More pets like {pet.name}</h2>
            <Link
              href="/pets"
              className="inline-flex items-center gap-1.5 font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
            >
              Browse all
              <ArrowLeft aria-hidden="true" size={16} className="rotate-180" />
            </Link>
          </div>
          <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedPets.map((relatedPet) => (
              <PetCard key={relatedPet._id} pet={relatedPet} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
