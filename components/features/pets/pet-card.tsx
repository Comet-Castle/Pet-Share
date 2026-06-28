import Image from "next/image";
import Link from "next/link";
import { Circle, Gauge, PawPrint, Sparkles } from "lucide-react";
import type { PETS_INDEX_QUERY_RESULT } from "@/sanity.types";
import { availabilityLabels, temperamentLabels } from "./status";

type PetCardData = PETS_INDEX_QUERY_RESULT[number];

type PetCardProps = Readonly<{
  pet: PetCardData;
}>;

/**
 * Renders a responsive pet listing card from the shared pet card query shape.
 */
export function PetCard({ pet }: PetCardProps) {
  const imageUrl = pet.cardMedia.image.image.asset?.url;
  const availabilityLabel = availabilityLabels[pet.availabilityStatus];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white/70 shadow-soft backdrop-blur transition duration-200 hover:-translate-y-1">
      <Link href={`/pets/${pet.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-pet-mint/25">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={pet.cardMedia.image.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-pet-muted">
              <PawPrint aria-hidden="true" size={44} />
            </div>
          )}
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-bold text-pet-ink shadow-soft backdrop-blur">
            <Circle
              aria-hidden="true"
              size={10}
              className={pet.availabilityStatus === "available" ? "fill-pet-mint text-pet-mint" : "fill-pet-coral text-pet-coral"}
            />
            {availabilityLabel}
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-pet-blue/25 px-3 py-1 text-xs font-bold text-pet-ink">
            <Sparkles aria-hidden="true" size={14} />
            {pet.petType.filterLabel}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-pet-mint/30 px-3 py-1 text-xs font-bold text-pet-ink">
            <Gauge aria-hidden="true" size={14} />
            Chaos {pet.chaosLevel}/5
          </span>
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold text-pet-ink">
          <Link href={`/pets/${pet.slug}`} className="focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
            {pet.name}
          </Link>
        </h2>
        <p className="mt-2 text-sm font-bold text-pet-muted">{pet.listingHeadline}</p>
        <p className="mt-3 flex-1 text-sm leading-6 text-pet-muted">{pet.listingSummary}</p>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-pet-muted">
          {temperamentLabels[pet.temperament]} with {pet.owner.name}
        </p>
      </div>
    </article>
  );
}
