"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

type PetNameFilterProps = Readonly<{
  currentValue: string;
  hideLabel?: boolean;
}>;

/**
 * URL-driven pet-name search for the marketplace rail.
 */
export function PetNameFilter({ currentValue, hideLabel = false }: PetNameFilterProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(currentValue);
  const lastCommittedValueRef = useRef(currentValue);

  const pushValue = useCallback((nextValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmedValue = nextValue.trim();

    params.delete("page");

    if (trimmedValue) {
      params.set("name", trimmedValue);
    } else {
      params.delete("name");
    }

    const queryString = params.toString();
    lastCommittedValueRef.current = trimmedValue;
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const trimmedValue = value.trim();

    if (trimmedValue === lastCommittedValueRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      pushValue(value);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [pushValue, value]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushValue(value);
  }

  function clearValue() {
    setValue("");
    pushValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label
        htmlFor="pet-name-filter"
        className={hideLabel
          ? "sr-only"
          : "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-pet-muted"}
      >
        <Search aria-hidden="true" size={15} />
        Pet name
      </label>
      <div className={hideLabel ? "relative" : "relative mt-3"}>
        <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-pet-muted" />
        <input
          id="pet-name-filter"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search by pet name"
          className="w-full rounded-[1.25rem] bg-white/92 py-3 pl-11 pr-11 text-sm font-bold text-pet-ink shadow-sm outline-none transition placeholder:text-pet-muted/70 focus:ring-2 focus:ring-pet-coral focus:ring-inset"
        />
        {value ? (
          <button
            type="button"
            onClick={clearValue}
            className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-pet-muted transition hover:text-pet-ink focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-inset"
            aria-label="Clear pet name search"
          >
            <X aria-hidden="true" size={15} />
          </button>
        ) : null}
      </div>
      <p className="text-xs font-bold text-pet-muted">Search updates automatically.</p>
    </form>
  );
}
