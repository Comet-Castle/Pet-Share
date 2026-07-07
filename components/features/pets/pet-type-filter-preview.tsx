"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stegaClean } from "@sanity/client/stega";
import { Check, Search, X } from "lucide-react";
import type { PET_TYPES_QUERY_RESULT } from "@/sanity.types";
import { joinClassNames } from "@/lib/utils/class-names";

type PetTypeFilterPreviewProps = Readonly<{
  petTypes: PET_TYPES_QUERY_RESULT;
  selectedSlugs: string[];
  hideLabel?: boolean;
  label?: string;
  icon?: ReactNode;
}>;

/**
 * Provides a URL-driven pet-type picker for the pet index filters.
 */
export function PetTypeFilterPreview({
  petTypes,
  selectedSlugs,
  hideLabel = false,
  label = "Pet type",
  icon
}: PetTypeFilterPreviewProps) {
  const inputId = useId();
  const listboxId = useId();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedPetTypes = selectedSlugs
    .map((slug) => petTypes.find((type) => stegaClean(type.slug) === slug))
    .filter((type): type is PET_TYPES_QUERY_RESULT[number] => Boolean(type));
  const filteredPetTypes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return petTypes.filter((type) => {
      if (!normalizedQuery) return true;

      return `${stegaClean(type.filterLabel)} ${stegaClean(type.name)} ${stegaClean(type.category)}`.toLowerCase().includes(normalizedQuery);
    });
  }, [petTypes, query]);
  const activeOptionId = filteredPetTypes[activeIndex]?._id ? `${listboxId}-${filteredPetTypes[activeIndex]._id}` : undefined;

  function updateSelectedSlugs(nextSlugs: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("page");
    nextSlugs.forEach((slug) => params.append("type", slug));
    const queryString = params.toString();

    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }

  function selectPetType(slug: string) {
    if (!slug) return;
    const nextSlugs = selectedSlugs.includes(slug)
      ? selectedSlugs.filter((selectedSlug) => selectedSlug !== slug)
      : [...selectedSlugs, slug];
    updateSelectedSlugs(nextSlugs);
    setIsOpen(true);
  }

  function removePetType(slug: string) {
    updateSelectedSlugs(selectedSlugs.filter((selectedSlug) => selectedSlug !== slug));
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setIsOpen(true);
    setActiveIndex(0);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => Math.min(current + 1, Math.max(filteredPetTypes.length - 1, 0)));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    }

    if (event.key === "Enter" && isOpen && filteredPetTypes[activeIndex]) {
      event.preventDefault();
      selectPetType(stegaClean(filteredPetTypes[activeIndex].slug));
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className={hideLabel
          ? "sr-only"
          : "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-pet-muted"}
      >
        {icon}
        {label}
      </label>
      <div className={joinClassNames("relative", !hideLabel && "mt-3")}>
        <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pet-muted" />
        <input
          id={inputId}
          type="text"
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={isOpen ? activeOptionId : undefined}
          placeholder="Search pet types"
          className="w-full rounded-[1.25rem] bg-white/92 py-3 pl-11 pr-4 text-sm font-bold text-pet-ink shadow-sm outline-none transition placeholder:text-pet-muted/70 focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset"
        />

        {isOpen ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-72 overflow-y-auto rounded-[1.25rem] bg-white p-2 shadow-soft"
            aria-label="Pet type options"
          >
            {filteredPetTypes.length ? (
              filteredPetTypes.map((type, index) => {
                const cleanSlug = stegaClean(type.slug);
                const isSelected = selectedSlugs.includes(cleanSlug);

                return (
                  <button
                    key={type._id}
                    id={`${listboxId}-${type._id}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectPetType(cleanSlug);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={isSelected || index === activeIndex
                      ? "flex w-full items-center justify-between gap-3 rounded-xl bg-pet-mint/25 px-3 py-2 text-left text-sm font-bold text-pet-ink transition hover:bg-pet-mint/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset"
                      : "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-pet-ink transition hover:bg-pet-mint/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset"}
                  >
                    {type.filterLabel}
                    {isSelected ? <Check aria-hidden="true" size={16} className="text-pet-coral" /> : null}
                  </button>
                );
              })
            ) : (
              <p className="px-3 py-2 text-sm font-bold text-pet-muted">No matching pet types.</p>
            )}
          </div>
        ) : null}
      </div>

      {selectedPetTypes.length ? (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Selected pet types">
          {selectedPetTypes.map((type) => (
            <button
              key={type._id}
              type="button"
              onClick={() => removePetType(stegaClean(type.slug))}
              className="inline-flex items-center gap-1 rounded-full bg-pet-mint/35 px-3 py-2 text-sm font-bold text-pet-ink transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset"
              aria-label={`Remove ${type.filterLabel} pet type`}
            >
              {type.filterLabel}
              <X aria-hidden="true" size={14} />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-[1.25rem] bg-white/70 px-3 py-2 text-sm font-bold text-pet-muted">
          Choose one or more pet types.
        </p>
      )}
    </div>
  );
}
