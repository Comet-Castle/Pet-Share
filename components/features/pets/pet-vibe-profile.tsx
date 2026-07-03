import { stegaClean } from "@sanity/client/stega";
import { Sparkles } from "lucide-react";
import type { PET_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { joinClassNames } from "@/lib/utils/class-names";
import { RatingMeter } from "./rating-meter";

type Pet = NonNullable<PET_BY_SLUG_QUERY_RESULT>;
type VibeItem = NonNullable<Pet["vibeProfile"]>[number];

const toneClasses = {
  mint: "bg-pet-mint/25",
  coral: "bg-pet-coral/12",
  blue: "bg-pet-blue/20",
  cream: "bg-pet-cream/75"
} as const;

function toneClass(tone: VibeItem["tone"]) {
  const cleanTone = stegaClean(tone) as keyof typeof toneClasses | undefined;
  return cleanTone && cleanTone in toneClasses ? toneClasses[cleanTone] : toneClasses.blue;
}

/**
 * Renders authored pet personality meter rows for the richer detail page.
 */
export function PetVibeProfile({ items }: Readonly<{ items: Pet["vibeProfile"] }>) {
  const validItems = (items ?? []).filter((item) => item.label && typeof item.strength === "number");

  if (!validItems.length) return null;

  return (
    <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
      <div className="flex items-center gap-2">
        <Sparkles aria-hidden="true" size={20} className="text-pet-coral" />
        <h2 className="font-display text-3xl font-bold text-pet-ink">Vibe profile</h2>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {validItems.map((item) => (
          <article key={item._key} className={joinClassNames("rounded-3xl p-4 shadow-sm", toneClass(item.tone))}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold leading-tight text-pet-ink">{item.label}</h3>
                {item.descriptor ? <p className="mt-1 text-sm leading-6 text-pet-muted">{item.descriptor}</p> : null}
              </div>
              <span className="shrink-0 rounded-full bg-white/75 px-2.5 py-1 text-xs font-bold text-pet-muted shadow-sm">
                {item.strength}/5
              </span>
            </div>
            <RatingMeter value={item.strength} label={`${item.label} vibe strength`} className="mt-4" />
          </article>
        ))}
      </div>
    </section>
  );
}
