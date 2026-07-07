"use client";

import { joinClassNames } from "@/lib/utils/class-names";

type CarouselDotsProps = Readonly<{
  /** Total number of slides/images. */
  count: number;
  /** Zero-based index of the active slide. */
  activeIndex: number;
  /** Called with the index to activate when a dot is pressed. */
  onSelect: (index: number) => void;
  /**
   * Container treatment. `"pill"` floats the dots over media inside a translucent
   * white pill (hero carousel); `"bare"` renders them directly on the page
   * background (pet gallery).
   */
  variant?: "pill" | "bare";
  /** Accessible name for the dot group, e.g. "Hero slide navigation". */
  label?: string;
  /** Builds each dot's `aria-label`, e.g. `(i) => \`Show hero slide ${i + 1}\``. */
  dotLabel: (index: number) => string;
  className?: string;
}>;

const containerClasses: Record<NonNullable<CarouselDotsProps["variant"]>, string> = {
  pill: "rounded-full bg-white/75 px-3 py-2 shadow-soft backdrop-blur",
  bare: ""
};

/**
 * Shared carousel pagination dots used by the homepage hero and the pet detail
 * gallery. The active dot is branded orange (`pet-coral`) and animates its width
 * from a circle out to an elongated oval on select; the outgoing dot shrinks back
 * to a circle. The width transition is gated behind `motion-safe:` so
 * reduced-motion users get an instant shape change. Buttons stay keyboard
 * focusable with a branded focus-visible ring and expose `aria-current`.
 */
export function CarouselDots({
  count,
  activeIndex,
  onSelect,
  variant = "bare",
  label,
  dotLabel,
  className
}: CarouselDotsProps) {
  if (count <= 1) {
    return null;
  }

  return (
    <div
      className={joinClassNames("flex items-center gap-2", containerClasses[variant], className)}
      aria-label={label}
    >
      {Array.from({ length: count }).map((_, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={dotLabel(index)}
            aria-current={active ? "true" : undefined}
            className={joinClassNames(
              "h-2.5 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2 motion-reduce:transition-none",
              active
                ? "w-6 bg-pet-coral"
                : variant === "pill"
                  ? "w-2.5 bg-pet-ink/25 hover:bg-pet-ink/45"
                  : "w-2.5 bg-pet-muted/35 hover:bg-pet-muted"
            )}
          />
        );
      })}
    </div>
  );
}
