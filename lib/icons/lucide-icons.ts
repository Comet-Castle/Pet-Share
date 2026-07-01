import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

type IconRegistryItem = Readonly<{
  label: string;
  searchText: string;
  value: string;
}>;

const legacyIconAliases: Record<string, string> = {
  alert: "AlertTriangle",
  calendarCheck: "CalendarCheck",
  check: "CheckCircle2",
  clipboardList: "ClipboardList",
  contact: "Mail",
  cta: "Sparkles",
  heart: "HeartHandshake",
  home: "Home",
  money: "BadgeDollarSign",
  messageCircle: "MessageCircle",
  packageCheck: "PackageCheck",
  paw: "PawPrint",
  price: "BadgeDollarSign",
  rotateCcw: "RotateCcw",
  search: "Search",
  send: "Send",
  shield: "ShieldAlert",
  star: "Star",
  userPlus: "UserPlus",
  video: "Video",
  warning: "ShieldAlert"
};

function isLucideIconExport(name: string, value: unknown): value is LucideIcon {
  return /^[A-Z]/.test(name) && !name.endsWith("Icon") && typeof value === "object" && value !== null && "$$typeof" in value;
}

function labelFromIconName(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .trim();
}

function normalizeIconLookupValue(value: string) {
  const alias = legacyIconAliases[value];

  if (alias) {
    return alias;
  }

  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export const lucideIconRegistry = Object.entries(LucideIcons)
  .filter(([name, value]) => isLucideIconExport(name, value))
  .map(([name]) => ({
    label: labelFromIconName(name),
    searchText: `${name} ${labelFromIconName(name)}`.toLowerCase(),
    value: name
  }))
  .sort((a, b) => a.label.localeCompare(b.label)) satisfies IconRegistryItem[];

/**
 * Resolves CMS icon values to Lucide icon components while preserving legacy seed keys.
 */
export function getLucideIcon(icon?: string | null): LucideIcon | null {
  if (!icon) {
    return null;
  }

  const normalizedIconName = normalizeIconLookupValue(icon);
  const iconComponent = (LucideIcons as Record<string, unknown>)[normalizedIconName];

  return isLucideIconExport(normalizedIconName, iconComponent) ? iconComponent : null;
}

export function getLucideIconLabel(icon?: string | null) {
  if (!icon) {
    return null;
  }

  const normalizedIconName = normalizeIconLookupValue(icon);

  return labelFromIconName(normalizedIconName);
}
