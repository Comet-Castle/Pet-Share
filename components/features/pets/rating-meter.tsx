import { joinClassNames } from "@/lib/utils/class-names";

type RatingMeterProps = Readonly<{
  value: number | null | undefined;
  max?: number;
  label?: string;
  className?: string;
}>;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

/**
 * Renders a rating (0-5 by default) as a segmented fill bar that supports
 * half-step values from the underlying decimal data, with an accessible label.
 */
export function RatingMeter({ value, max = 5, label = "Rating", className }: RatingMeterProps) {
  const safeValue = typeof value === "number" ? clamp(value, 0, max) : 0;
  const displayValue = Number.isInteger(safeValue) ? safeValue.toFixed(0) : safeValue.toFixed(1);

  return (
    <div className={joinClassNames("flex items-center gap-2", className)}>
      <div
        className="flex flex-1 gap-1"
        role="img"
        aria-label={`${label} ${displayValue} out of ${max}`}
      >
        {Array.from({ length: max }, (_, index) => {
          const fill = clamp(safeValue - index, 0, 1);

          return (
            <span key={index} className="relative h-2 flex-1 overflow-hidden rounded-full bg-pet-muted/15">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-pet-coral"
                style={{ width: `${fill * 100}%` }}
              />
            </span>
          );
        })}
      </div>
      <span className="shrink-0 text-xs font-bold text-pet-muted">
        {displayValue}/{max}
      </span>
    </div>
  );
}
