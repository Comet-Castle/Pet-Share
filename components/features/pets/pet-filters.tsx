"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronDown, Gauge, PawPrint, Search, Truck } from "lucide-react";
import type { PET_TYPES_QUERY_RESULT } from "@/sanity.types";
import { joinClassNames } from "@/lib/utils/class-names";
import { availabilityLabels, urgencyLabels } from "./status";
import { PetNameFilter } from "./pet-name-filter";
import { PetTypeFilterPreview } from "./pet-type-filter-preview";
import { RATING_STEPS, petsPageHref, toggleListValue, type PetFilterState } from "./pet-index-state";

type PetFiltersProps = Readonly<{
  filters: PetFilterState;
  petTypes: PET_TYPES_QUERY_RESULT;
  activeCount: number;
  totalPets: number;
  clearHref: string;
}>;

const availabilityEntries = Object.entries(availabilityLabels) as Array<[string, string]>;
const urgencyEntries = Object.entries(urgencyLabels) as Array<[string, string]>;

/**
 * Renders the full server-driven pet filter rail. Used in both the desktop
 * sticky aside and the mobile filter drawer so the controls stay in sync.
 */
export function PetFilters({ filters, petTypes, activeCount, totalPets, clearHref }: PetFiltersProps) {
  return (
    <div className="space-y-5 pr-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-pet-muted shadow-sm">
          {totalPets} {totalPets === 1 ? "pet" : "pets"}
        </span>
        {activeCount > 0 ? (
          <Link
            href={clearHref}
            className="rounded-sm text-xs font-bold text-pet-muted underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:text-pet-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset"
          >
            Clear all ({activeCount})
          </Link>
        ) : null}
      </div>

      <FilterGroup label="Pet Name" icon={<Search aria-hidden="true" size={13} />} defaultOpen>
        <PetNameFilter key={filters.petNameQuery} currentValue={filters.petNameQuery} hideLabel />
      </FilterGroup>

      <FilterGroup label="Pet Type" icon={<PawPrint aria-hidden="true" size={13} />} defaultOpen allowOverflow>
        <PetTypeFilterPreview hideLabel petTypes={petTypes} selectedSlugs={filters.petTypeSlugs} />
      </FilterGroup>

      <FilterGroup label="Availability" icon={<Search aria-hidden="true" size={13} />}>
        <div className="grid gap-2">
          {availabilityEntries.map(([value, label]) => (
            <FilterButtonLink
              key={value}
              href={petsPageHref({ ...filters, availabilityStatuses: toggleListValue(filters.availabilityStatuses, value) })}
              isActive={filters.availabilityStatuses.includes(value)}
              label={label}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Pickup Urgency" icon={<Truck aria-hidden="true" size={13} />}>
        <div className="grid gap-2">
          {urgencyEntries.map(([value, label]) => (
            <FilterButtonLink
              key={value}
              href={petsPageHref({ ...filters, pickupUrgencies: toggleListValue(filters.pickupUrgencies, value) })}
              isActive={filters.pickupUrgencies.includes(value)}
              label={label}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Household Impact" icon={<Gauge aria-hidden="true" size={13} />}>
        <div className="space-y-3">
          <FilterScaleControl
            emoji="😈"
            label="Chaos"
            activeValue={filters.minChaos}
            hrefForValue={(value) => petsPageHref({ ...filters, minChaos: value })}
          />
          <FilterScaleControl
            emoji="💩"
            label="Mess"
            activeValue={filters.minMess}
            hrefForValue={(value) => petsPageHref({ ...filters, minMess: value })}
          />
          <FilterScaleControl
            emoji="⚡"
            label="Energy"
            activeValue={filters.minEnergy}
            hrefForValue={(value) => petsPageHref({ ...filters, minEnergy: value })}
          />
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  label,
  icon,
  children,
  defaultOpen = false,
  allowOverflow = false
}: Readonly<{ label: string; icon: ReactNode; children: ReactNode; defaultOpen?: boolean; allowOverflow?: boolean }>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="pb-3 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2.5 rounded-md py-0.5 text-left font-display text-[0.95rem] font-bold text-pet-ink/88 transition-colors hover:text-pet-ink focus-visible:outline-none focus:text-pet-ink"
      >
        <span className="inline-flex items-center gap-1.25">
          {icon}
          {label}
        </span>
        <ChevronDown
          aria-hidden="true"
          size={13}
          className={joinClassNames("text-pet-muted/70 transition duration-200 ease-out motion-reduce:transition-none", isOpen && "rotate-180")}
        />
      </button>
      <div
        className={joinClassNames(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className={joinClassNames("px-1", allowOverflow ? "overflow-visible" : "overflow-hidden")}>
          <div
            className={joinClassNames(
              "pb-1 pt-2 transition-opacity duration-150 ease-out motion-reduce:transition-none",
              isOpen ? "opacity-100" : "opacity-0"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

type FilterButtonLinkProps = Readonly<{
  href: string;
  isActive: boolean;
  label: string;
  icon?: ReactNode;
}>;

function FilterButtonLink({ href, isActive, label, icon }: FilterButtonLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "true" : undefined}
      className={joinClassNames(
        "flex w-full items-center gap-3 rounded-[1.15rem] px-4 py-2.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset",
        isActive
          ? "bg-pet-blue/20 text-pet-ink ring-1 ring-pet-blue/35"
          : "bg-white/78 text-pet-muted hover:bg-white hover:text-pet-ink"
      )}
    >
      <span className="inline-flex min-w-0 items-center gap-2.5">
        {icon ? <span className="shrink-0 text-pet-muted">{icon}</span> : null}
        <span>{label}</span>
      </span>
      {isActive ? (
        <span className="ml-auto inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-white/90 px-2 text-[0.7rem] font-bold text-pet-ink">
          <Check aria-hidden="true" size={14} />
        </span>
      ) : null}
    </Link>
  );
}

type FilterScaleControlProps = Readonly<{
  emoji: string;
  label: string;
  activeValue: number | null;
  hrefForValue: (value: number | null) => string;
}>;

function FilterScaleControl({ emoji, label, activeValue, hrefForValue }: FilterScaleControlProps) {
  return (
    <div className="py-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-pet-ink">{label}</p>
          <p className="mt-1 text-xs font-bold text-pet-muted">
            {activeValue ? `${label} ${activeValue} or higher` : `Any ${label.toLowerCase()} level`}
          </p>
        </div>
        {activeValue ? (
          <Link
            href={hrefForValue(null)}
            className="rounded-sm text-xs font-bold text-pet-muted underline decoration-pet-coral decoration-2 underline-offset-4 transition hover:text-pet-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset"
          >
            Reset
          </Link>
        ) : null}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-2" role="group" aria-label={`${label} minimum filter`}>
        {RATING_STEPS.map((value) => {
          const isSelected = activeValue === value;
          const isFilled = activeValue !== null && value <= activeValue;

          return (
            <Link
              key={`${label}-${value}`}
              href={hrefForValue(isSelected ? null : value)}
              aria-label={`${label} ${value} or higher`}
              aria-current={isSelected ? "true" : undefined}
              className={joinClassNames(
                "flex aspect-square min-h-12 items-center justify-center rounded-[0.9rem] border text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset",
                isSelected && "border-pet-coral bg-pet-coral/14 text-pet-ink",
                !isSelected && isFilled && "border-pet-blue/35 bg-pet-blue/12 text-pet-ink",
                !isSelected && !isFilled && "border-transparent bg-pet-cream/65 text-pet-muted hover:bg-pet-mint/25 hover:text-pet-ink"
              )}
            >
              <span className="flex items-center justify-center" aria-hidden="true">
                <span className="text-[1.2rem] leading-none">{emoji}</span>
              </span>
              <span className="sr-only">{label} {value} or higher</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
