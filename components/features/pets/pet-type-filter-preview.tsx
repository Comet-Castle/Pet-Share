"use client";

import type { KeyboardEvent } from "react";
import { useId, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Search, X } from "lucide-react";
import type { PET_TYPES_QUERY_RESULT } from "@/sanity.types";

type PetTypeFilterPreviewProps = Readonly<{
  petTypes: PET_TYPES_QUERY_RESULT;
  selectedSlugs: string[];
}>;

/**
 * Provides a URL-driven pet-type picker for the pet index filters.
 */
export function PetTypeFilterPreview({ petTypes, selectedSlugs }: PetTypeFilterPreviewProps) {
  const inputId = useId();
  const listboxId = useId();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedPetTypes = selectedSlugs
    .map((slug) => petTypes.find((type) => type.slug === slug))
    .filter((type): type is PET_TYPES_QUERY_RESULT[number] => Boolean(type));
  const filteredPetTypes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return petTypes.filter((type) => {
      if (!normalizedQuery) return true;

      return `${type.filterLabel} ${type.name} ${type.category}`.toLowerCase().includes(normalizedQuery);
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
      selectPetType(filteredPetTypes[activeIndex].slug);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-xs font-bold uppercase tracking-[0.16em] text-pet-muted">
        Pet type
      </label>
      <div className="relative mt-3">
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
          className="w-full rounded-2xl bg-white py-3 pl-11 pr-4 text-sm font-bold text-pet-ink shadow-sm outline-none transition placeholder:text-pet-muted/70 focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
        />

        {isOpen ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-72 overflow-y-auto rounded-2xl bg-white p-2 shadow-soft"
            aria-label="Pet type options"
          >
            {filteredPetTypes.length ? (
              filteredPetTypes.map((type, index) => {
                const isSelected = selectedSlugs.includes(type.slug);

                return (
                <button
                  key={type._id}
                  id={`${listboxId}-${type._id}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    selectPetType(type.slug);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={index === activeIndex || isSelected
                    ? "flex w-full items-center justify-between gap-3 rounded-xl bg-pet-mint/25 px-3 py-2 text-left text-sm font-bold text-pet-ink transition hover:bg-pet-mint/30 focus:outline-none focus:ring-2 focus:ring-pet-coral"
                    : "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-pet-ink transition hover:bg-pet-mint/25 focus:outline-none focus:ring-2 focus:ring-pet-coral"}
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
              onClick={() => removePetType(type.slug)}
              className="inline-flex items-center gap-1 rounded-full bg-pet-mint/35 px-3 py-2 text-sm font-bold text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              aria-label={`Remove ${type.filterLabel} pet type`}
            >
              {type.filterLabel}
              <X aria-hidden="true" size={14} />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-white/65 px-3 py-2 text-sm font-bold text-pet-muted">
          Choose one or more pet types.
        </p>
      )}
    </div>
  );
}
