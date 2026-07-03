import { stegaClean } from "@sanity/client/stega";

export const hostPayoutUnitLabels = {
  day: "day",
  stay: "stay",
  weekend: "weekend"
} as const;

/**
 * Formats a pet's age from a stored year value or a birth date. Falls back to a
 * neutral label when neither is available so the fact panel never shows "null".
 */
export function formatPetAge(ageYears: number | null | undefined, dateOfBirth: string | null | undefined): string {
  if (typeof ageYears === "number" && ageYears >= 0) {
    if (ageYears < 1) {
      return "Under 1 year old";
    }

    return `${ageYears} ${ageYears === 1 ? "year" : "years"} old`;
  }

  if (dateOfBirth) {
    const birth = new Date(dateOfBirth);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      years -= 1;
    }

    if (years <= 0) {
      return "Under 1 year old";
    }

    return `${years} ${years === 1 ? "year" : "years"} old`;
  }

  return "Age not listed";
}

/**
 * Formats a seed distance in kilometers into a short marketplace label.
 * Returns null when no distance is available so callers can omit the field.
 */
export function formatDistanceKm(distance: number | null | undefined): string | null {
  if (typeof distance !== "number") {
    return null;
  }

  const formatted = Number.isInteger(distance) ? distance.toFixed(0) : distance.toFixed(1);

  return `${formatted} km away`;
}

/**
 * Formats the host payout into a compact marketplace price label.
 * Stega markers are cleaned before currency formatting because draft-mode
 * stega strings break the strict currency-code validation in Intl.
 */
export function formatHostPayout(input: Readonly<{
  amount: number | null | undefined;
  currency: string | null | undefined;
  unit: string | null | undefined;
}>): string | null {
  if (typeof input.amount !== "number") {
    return null;
  }

  const currency = stegaClean(input.currency) ?? "CAD";
  const unitKey = stegaClean(input.unit) as keyof typeof hostPayoutUnitLabels | null;
  const unit = (unitKey && hostPayoutUnitLabels[unitKey]) ?? "day";
  const formattedAmount = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(input.amount) ? 0 : 2
  }).format(input.amount);

  return `${formattedAmount} / ${unit}`;
}
