"use client";

import { useState } from "react";
import { PawPrint } from "lucide-react";

/**
 * Playful whimsical status lines shown while a route resolves. One is picked at
 * random per mount. Kept intentionally short and on-brand.
 */
const loadingLines = [
  "Gathering the leashes…",
  "Herding the good boys…",
  "Warming up the treat dispenser…",
  "Negotiating with the cats…",
  "Fluffing the couch cushions…",
  "Counting the wagging tails…",
  "Rounding up the usual suspects…",
  "Refilling the water bowls…"
] as const;

const subtextLines = [
  "Fetching pets near you.",
  "This will only take a moment.",
  "Almost ready for belly rubs.",
  "Hang tight — good things incoming."
] as const;

function pickRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

/**
 * A centered, non-structural loading page: a themed spinning paw, a random
 * whimsical status line, and a smaller subtext line. Chosen over a layout skeleton
 * because production rarely shows this state, so a delightful loader beats a
 * layout-accurate one for most routes. Picking the copy on the client (in state
 * initializers) avoids a server/client hydration mismatch on the random choice.
 */
export function WhimsicalLoader() {
  const [line] = useState(() => pickRandom(loadingLines));
  const [subtext] = useState(() => pickRandom(subtextLines));

  return (
    <section
      aria-label="Loading"
      aria-live="polite"
      className="mx-auto flex min-h-[60vh] w-full max-w-[1440px] min-w-0 flex-col items-center justify-center gap-6 px-5 py-16 text-center sm:px-8 lg:px-10"
    >
      <span className="flex size-20 items-center justify-center rounded-full bg-pet-coral/12 text-pet-coral shadow-soft motion-safe:animate-[whimsical-paw-bounce_1.4s_ease-in-out_infinite]">
        <PawPrint aria-hidden="true" size={42} strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-2xl font-bold leading-tight text-pet-ink sm:text-3xl">{line}</p>
        <p className="mt-2 text-sm font-bold text-pet-muted sm:text-base">{subtext}</p>
      </div>
    </section>
  );
}
