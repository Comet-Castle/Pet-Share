"use client";

import { useId, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowDownUp, Check, ChevronDown } from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";
import type { PetIndexSort } from "@/sanity/queries/pets";
import { petIndexSortOptions } from "./pet-index-state";

type SortControlProps = Readonly<{
  currentSort: PetIndexSort;
}>;

/**
 * Keyboard-accessible sort selector styled to match the pet-type dropdown family.
 */
export function SortControl({ currentSort }: SortControlProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const currentOption = petIndexSortOptions.find((option) => option.value === currentSort) ?? petIndexSortOptions[0];

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "featured") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    setIsOpen(false);
  }

  return (
    <div className="relative min-w-[12rem]">
      <label className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-pet-muted">
        <ArrowDownUp aria-hidden="true" size={14} />
        Sort by
      </label>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((current) => !current)}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
            setIsOpen(false);
          }
        }}
        className="flex w-full items-center justify-between gap-3 rounded-[1.25rem] bg-white/92 py-3 pl-4 pr-4 text-left text-sm font-bold text-pet-ink shadow-sm outline-none transition hover:bg-white focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset"
      >
        <span className="inline-flex items-center gap-2.5">
          <ArrowDownUp aria-hidden="true" size={16} className="text-pet-muted" />
          <span>{currentOption.label}</span>
        </span>
        <ChevronDown
          aria-hidden="true"
          size={16}
          className={joinClassNames("shrink-0 text-pet-muted transition duration-200", isOpen && "rotate-180")}
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Sort pets"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 rounded-[1.25rem] bg-white p-2 shadow-soft"
        >
          {petIndexSortOptions.map((option) => {
            const isSelected = option.value === currentSort;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleChange(option.value)}
                className={joinClassNames(
                  "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-pet-ink transition hover:bg-pet-mint/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-inset",
                  isSelected && "bg-pet-mint/25"
                )}
              >
                <span>{option.label}</span>
                {isSelected ? <Check aria-hidden="true" size={16} className="text-pet-coral" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
