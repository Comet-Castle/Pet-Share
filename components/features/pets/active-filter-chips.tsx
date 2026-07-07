import Link from "next/link";
import { stegaClean } from "@sanity/client/stega";
import { X } from "lucide-react";
import type { PET_TYPES_QUERY_RESULT } from "@/sanity.types";
import { availabilityLabels, urgencyLabels } from "./status";
import { petsPageHref, type PetFilterState } from "./pet-index-state";

type ActiveFilterChipsProps = Readonly<{
  filters: PetFilterState;
  petTypes: PET_TYPES_QUERY_RESULT;
  clearHref: string;
}>;

type Chip = Readonly<{ key: string; label: string; href: string }>;

/**
 * Renders each active filter as a removable chip above the listing so the current
 * filter state stays visible and shareable. Chips reset pagination to page one.
 */
export function ActiveFilterChips({ filters, petTypes, clearHref }: ActiveFilterChipsProps) {
  const petTypeBySlug = new Map(petTypes.map((type) => [stegaClean(type.slug), type]));

  const chips: Chip[] = [];

  if (filters.petNameQuery) {
    chips.push({
      key: "pet-name",
      label: `Name: ${filters.petNameQuery}`,
      href: petsPageHref({ ...filters, petNameQuery: "" })
    });
  }

  filters.petTypeSlugs.forEach((slug) => {
    const type = petTypeBySlug.get(slug);
    chips.push({
      key: `type-${slug}`,
      label: stegaClean(type?.filterLabel) ?? slug,
      href: petsPageHref({ ...filters, petTypeSlugs: filters.petTypeSlugs.filter((value) => value !== slug) })
    });
  });

  filters.availabilityStatuses.forEach((value) => {
    chips.push({
      key: `availability-${value}`,
      label: availabilityLabels[value as keyof typeof availabilityLabels] ?? value,
      href: petsPageHref({ ...filters, availabilityStatuses: filters.availabilityStatuses.filter((item) => item !== value) })
    });
  });

  filters.pickupUrgencies.forEach((value) => {
    chips.push({
      key: `urgency-${value}`,
      label: urgencyLabels[value as keyof typeof urgencyLabels] ?? value,
      href: petsPageHref({ ...filters, pickupUrgencies: filters.pickupUrgencies.filter((item) => item !== value) })
    });
  });

  if (filters.minChaos) {
    chips.push({
      key: "chaos",
      label: `Chaos ${filters.minChaos} or higher`,
      href: petsPageHref({ ...filters, minChaos: null })
    });
  }

  if (filters.minMess) {
    chips.push({
      key: "mess",
      label: `Mess ${filters.minMess} or higher`,
      href: petsPageHref({ ...filters, minMess: null })
    });
  }

  if (filters.minEnergy) {
    chips.push({
      key: "energy",
      label: `Energy ${filters.minEnergy} or higher`,
      href: petsPageHref({ ...filters, minEnergy: null })
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Link
          key={chip.key}
          href={chip.href}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-bold text-pet-ink shadow-sm backdrop-blur transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
          aria-label={`Remove filter: ${chip.label}`}
        >
          {chip.label}
          <X aria-hidden="true" size={14} />
        </Link>
      ))}
      <Link
        href={clearHref}
        className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold text-pet-muted underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:text-pet-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
      >
        Clear all
      </Link>
    </div>
  );
}
