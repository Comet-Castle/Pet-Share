import { stegaClean } from "@sanity/client/stega";
import { CalendarClock } from "lucide-react";
import type { PET_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { joinClassNames } from "@/lib/utils/class-names";

type Pet = NonNullable<PET_BY_SLUG_QUERY_RESULT>;
type ScheduleItem = NonNullable<Pet["dailySchedule"]>[number];

const toneClasses = {
  mint: "bg-pet-mint/25",
  coral: "bg-pet-coral/12",
  blue: "bg-pet-blue/20",
  cream: "bg-pet-cream/75"
} as const;

function toneClass(tone: ScheduleItem["tone"]) {
  const cleanTone = stegaClean(tone) as keyof typeof toneClasses | undefined;
  return cleanTone && cleanTone in toneClasses ? toneClasses[cleanTone] : toneClasses.cream;
}

/**
 * Renders the authored day-with-this-pet timeline in Sanity order.
 */
export function PetDayTimeline({ items }: Readonly<{ items: Pet["dailySchedule"] }>) {
  const validItems = (items ?? []).filter((item) => item.timeLabel && item.title);

  if (!validItems.length) return null;

  return (
    <section className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
      <div className="flex items-center gap-2">
        <CalendarClock aria-hidden="true" size={20} className="text-pet-coral" />
        <h2 className="font-display text-3xl font-bold text-pet-ink">A day with this pet</h2>
      </div>
      <ol className="mt-5 grid gap-3">
        {validItems.map((item) => (
          <li key={item._key} className={joinClassNames("grid gap-3 rounded-3xl p-4 shadow-sm sm:grid-cols-[9rem_1fr]", toneClass(item.tone))}>
            <time className="font-display text-lg font-bold text-pet-ink">{item.timeLabel}</time>
            <div>
              <h3 className="font-display text-lg font-bold leading-tight text-pet-ink">{item.title}</h3>
              {item.description ? <p className="mt-1 text-sm leading-6 text-pet-muted">{item.description}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
