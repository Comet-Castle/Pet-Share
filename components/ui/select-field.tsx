"use client";

import { useId, useRef, useState, type FocusEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

export type SelectFieldOption = Readonly<{ label: string; value: string }>;

type SelectFieldProps = Readonly<{
  name: string;
  options: ReadonlyArray<SelectFieldOption>;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
}>;

/**
 * Custom listbox-style select styled to match the pet-index filter dropdowns
 * (see SortControl), used in place of the native HTML5 <select> in forms.
 * Submits its value through a hidden input so it works with plain form posts.
 */
export function SelectField({
  name,
  options,
  defaultValue = "",
  placeholder = "Choose one",
  required,
  invalid,
  describedBy
}: SelectFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative" onBlur={handleBlur}>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        onClick={() => setIsOpen((current) => !current)}
        className={joinClassNames(
          "flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl bg-white/85 px-4 text-left text-base font-normal shadow-inner outline-none ring-1 ring-pet-blue/20 transition focus-visible:ring-2 focus-visible:ring-pet-coral",
          selectedOption ? "text-pet-ink" : "text-pet-muted"
        )}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
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
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-72 overflow-y-auto rounded-[1.25rem] bg-white p-2 shadow-soft"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setValue(option.value);
                  setIsOpen(false);
                }}
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
