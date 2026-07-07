import Link from "next/link";
import { stegaClean } from "@sanity/client/stega";
import { Circle, MapPin } from "lucide-react";
import type { PETS_INDEX_QUERY_RESULT } from "@/sanity.types";
import { SanityImage } from "@/components/ui/sanity-image";
import { joinClassNames } from "@/lib/utils/class-names";
import { availabilityLabels } from "./status";
import { formatDistanceKm, formatHostPayout } from "./format";

type PetCardData = PETS_INDEX_QUERY_RESULT[number];

type PetCardProps = Readonly<{
  pet: PetCardData;
  /** Renders the listing summary line. Off on dense catalog grids. */
  showSummary?: boolean;
}>;

function getAvailabilityTone(status: keyof typeof availabilityLabels) {
  return stegaClean(status) === "available" ? "fill-pet-mint text-pet-mint" : "fill-pet-coral text-pet-coral";
}

/**
 * Renders a responsive marketplace pet card aligned with the homepage card family.
 * The entire card is a single link to the pet detail page.
 */
export function PetCard({ pet, showSummary = false }: PetCardProps) {
  const cardImage = pet.cardMedia?.image;
  const availabilityStatus = stegaClean(pet.availabilityStatus) as keyof typeof availabilityLabels;
  const availabilityLabel = availabilityLabels[availabilityStatus] ?? "Pet";
  const petTypeLabel = stegaClean(pet.petType?.filterLabel) ?? "Pet";
  const distanceLabel = formatDistanceKm(pet.distanceKilometers ?? null);
  const payoutLabel = formatHostPayout({
    amount: pet.hostPayoutAmount ?? null,
    currency: pet.hostPayoutCurrency ?? null,
    unit: pet.hostPayoutUnit ?? null
  });
  return (
    <Link
      href={`/pets/${pet.slug}`}
      aria-label={`View ${pet.name}`}
      className="group block min-w-0 cursor-pointer rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-4"
    >
      <article className="min-w-0 overflow-hidden rounded-[1.75rem] bg-white/86 shadow-soft backdrop-blur transition duration-200 group-hover:-translate-y-1">
        <div className="relative">
          <SanityImage
            image={cardImage ?? null}
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="aspect-[4/3]"
            imageClassName="transition duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-pet-ink shadow-sm backdrop-blur">
            <Circle aria-hidden="true" size={9} className={getAvailabilityTone(availabilityStatus)} />
            {availabilityLabel}
          </span>
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          <h2 className="font-display text-[1.45rem] font-bold leading-[1.08] text-pet-ink">{pet.name}</h2>
          <p className="mt-1.5 text-[0.9rem] font-bold leading-5 text-pet-muted">{pet.breed ?? petTypeLabel}</p>
          <p className="mt-3 text-[0.95rem] leading-6 text-pet-muted">{pet.listingHeadline}</p>
          {showSummary && pet.listingSummary ? (
            <p className="mt-2 text-sm leading-6 text-pet-muted line-clamp-3">{pet.listingSummary}</p>
          ) : null}

          <div className="mt-7 flex items-center justify-between gap-4 rounded-[1.25rem] bg-pet-cream/55 px-3 py-3">
            <div className="inline-flex min-w-0 items-center gap-1.5 text-sm font-bold text-pet-muted">
              <MapPin aria-hidden="true" size={17} className="shrink-0 text-pet-coral" />
              <span className={joinClassNames("truncate", !distanceLabel && "text-pet-muted/70")}>
                {distanceLabel ?? "Distance TBD"}
              </span>
            </div>
            <p className={joinClassNames("shrink-0 font-display text-base font-bold leading-none text-pet-ink", !payoutLabel && "text-pet-muted/70")}>
              {payoutLabel ?? "Price TBD"}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
