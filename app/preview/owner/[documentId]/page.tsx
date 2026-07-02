import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CalendarDays, MapPin, PawPrint } from "lucide-react";
import { PetCard } from "@/components/features/pets/pet-card";
import { SystemMessage } from "@/components/features/system/system-message";
import { portableTextToPlainText } from "@/lib/content/plain-text";
import { loadOwnerById } from "@/sanity/lib/loaders";

type OwnerDocumentPreviewPageProps = Readonly<{
  params: Promise<{
    documentId: string;
  }>;
}>;

function formatMemberSince(value: string | null | undefined) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

/**
 * Renders an unpublished owner profile draft by Sanity document ID.
 */
export default async function OwnerDocumentPreviewPage({ params }: OwnerDocumentPreviewPageProps) {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Preview unavailable"
        title="This owner profile needs Draft Mode."
        message="Open this profile from Sanity Presentation so the preview session is authorized."
        primaryHref="/studio"
        primaryLabel="Open Studio"
      />
    );
  }

  const { documentId } = await params;
  const owner = await loadOwnerById(decodeURIComponent(documentId), { preview: true });

  if (!owner) {
    notFound();
  }

  if (owner.slug) {
    redirect(`/owners/${owner.slug}`);
  }

  const portraitUrl = owner.portrait?.image?.asset?.url;
  const bio = portableTextToPlainText(owner.bio);
  const memberSince = formatMemberSince(owner.memberSince);

  return (
    <article className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10">
      <section className="grid gap-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8 lg:grid-cols-[320px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-pet-mint/25">
          {portraitUrl ? (
            <Image
              src={portraitUrl}
              alt={owner.portrait?.alt ?? ""}
              fill
              priority
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-pet-muted">
              <PawPrint aria-hidden="true" size={56} />
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Owner profile preview</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-6xl">{owner.name}</h1>
          <p className="mt-4 text-xl font-bold text-pet-muted">{owner.tagline}</p>
          <p className="mt-6 max-w-3xl leading-8 text-pet-muted">
            {bio || "This owner has not finished filling out their profile yet."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-pet-muted">
            {owner.location ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                <MapPin aria-hidden="true" size={16} />
                {owner.location}
              </span>
            ) : null}
            {memberSince ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                <CalendarDays aria-hidden="true" size={16} />
                Member since {memberSince}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Listed pets</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">Available through this owner</h2>
        </div>
        {owner.pets.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {owner.pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        ) : (
          <SystemMessage
            variant="empty"
            eyebrow="No pets listed"
            title="This owner has temporarily reclaimed all responsibility."
            message="This owner does not have any pets available right now."
            primaryHref="/pets"
            primaryLabel="Find a temporary pet"
          />
        )}
      </section>
    </article>
  );
}
