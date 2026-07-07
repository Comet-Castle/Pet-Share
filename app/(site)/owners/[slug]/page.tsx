import type { Metadata } from "next";
import Image from "next/image";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, PawPrint } from "lucide-react";
import { PetCard } from "@/components/features/pets/pet-card";
import { SystemMessage } from "@/components/features/system/system-message";
import { portableTextToPlainText } from "@/lib/content/plain-text";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadOwnerBySlug, loadOwnerSlugs } from "@/sanity/lib/loaders";

type OwnerSlugPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export async function generateStaticParams() {
  const owners = await loadOwnerSlugs();

  return owners.map((owner) => ({ slug: owner.slug }));
}

function formatMemberSince(value: string | null | undefined) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

export async function generateMetadata({ params }: OwnerSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  let owner: Awaited<ReturnType<typeof loadOwnerBySlug>> | null = null;

  try {
    owner = await loadOwnerBySlug(slug);
  } catch {
    return metadataFromSeo({
      fallbackTitle: "Owner profile",
      fallbackDescription: "This owner page is temporarily unavailable."
    });
  }

  if (!owner) {
    return metadataFromSeo({
      fallbackTitle: "Owner not found",
      fallbackDescription: "This owner page is not available."
    });
  }

  return metadataFromSeo({
    seo: owner.seo,
    fallbackTitle: owner.name,
    fallbackDescription: owner.tagline,
    path: `/owners/${slug}`
  });
}

/**
 * Renders a direct owner detail page without exposing an owner directory.
 */
export default async function OwnerSlugPage({ params }: OwnerSlugPageProps) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  let owner: Awaited<ReturnType<typeof loadOwnerBySlug>> | null = null;

  try {
    owner = await loadOwnerBySlug(slug, { preview: isEnabled });
  } catch {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Owner unavailable"
        title="This owner stepped away from the handoff desk."
        message="The owner profile could not be loaded right now. Try again after the handoff desk gets its papers sorted."
        primaryHref="/pets"
        primaryLabel="Find a temporary pet"
      />
    );
  }

  if (!owner) {
    notFound();
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
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Owner profile</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-6xl">
            {owner.name}
          </h1>
          <p className="mt-4 text-xl font-bold text-pet-muted">{owner.tagline}</p>
          <p className="mt-6 max-w-3xl whitespace-pre-line leading-8 text-pet-muted">
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
            title="This owner has temporarily reclaimed all chaos."
            message="This owner does not have any pets available right now."
            primaryHref="/pets"
            primaryLabel="Find a temporary pet"
          />
        )}
      </section>
    </article>
  );
}
