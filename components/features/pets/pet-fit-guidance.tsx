import { CheckCircle2, XCircle } from "lucide-react";
import type { PET_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Pet = NonNullable<PET_BY_SLUG_QUERY_RESULT>;
type FitGuidance = Pet["fitGuidance"];

type GuidanceListProps = Readonly<{
  title: string;
  items: NonNullable<NonNullable<FitGuidance>["goodFitItems"]>;
  variant: "good" | "avoid";
}>;

function GuidanceList({ title, items, variant }: GuidanceListProps) {
  const Icon = variant === "good" ? CheckCircle2 : XCircle;
  const shellClass = variant === "good" ? "bg-pet-mint/25" : "bg-pet-coral/12";
  const iconClass = variant === "good" ? "text-pet-ink" : "text-pet-coral";

  return (
    <div className={`rounded-[1.75rem] p-5 shadow-sm ${shellClass}`}>
      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-pet-ink">
        <Icon aria-hidden="true" size={20} className={iconClass} />
        {title}
      </h3>
      <ul className="mt-4 grid gap-3 text-sm leading-6 text-pet-muted">
        {items.map((item) => (
          <li key={item._key} className="flex gap-2 rounded-2xl bg-white/65 px-3 py-2 shadow-sm">
            <Icon aria-hidden="true" size={16} className={`mt-1 shrink-0 ${iconClass}`} />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders balanced good-fit and maybe-avoid guidance authored in Sanity.
 */
export function PetFitGuidance({ guidance }: Readonly<{ guidance: FitGuidance }>) {
  const goodFitItems = (guidance?.goodFitItems ?? []).filter((item) => item.text);
  const avoidItems = (guidance?.avoidItems ?? []).filter((item) => item.text);

  if (!goodFitItems.length || !avoidItems.length) return null;

  return (
    <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
      <h2 className="font-display text-3xl font-bold text-pet-ink">Good fit guide</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-pet-muted">
        A quick read on who will thrive with this pet and who might want a calmer assignment.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <GuidanceList title={guidance?.goodFitTitle ?? "Good fit if..."} items={goodFitItems} variant="good" />
        <GuidanceList title={guidance?.avoidTitle ?? "Maybe avoid if..."} items={avoidItems} variant="avoid" />
      </div>
    </section>
  );
}
