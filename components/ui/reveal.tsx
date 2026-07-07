"use client";

import type { ElementType, ReactNode } from "react";
import { useInView } from "@/lib/hooks/use-in-view";
import { joinClassNames } from "@/lib/utils/class-names";

type RevealProps = Readonly<{
  children: ReactNode;
  /** Wrapper element type. Defaults to `div`; use `li`/`section` to keep valid markup. */
  as?: ElementType;
  className?: string;
  /**
   * Stagger position within a group. Each step adds a short delay so grids and
   * lists cascade in instead of appearing all at once. Capped so late items are
   * not left waiting noticeably long.
   */
  index?: number;
}>;

// Delay per stagger step, capped so a long grid does not trail off. Kept in the
// same subtle range as the existing hero/gallery keyframes (~120-260ms).
const STAGGER_STEP_MS = 70;
const MAX_STAGGER_MS = 420;

/**
 * Reveals its children with a subtle fade + slide-up the first time they scroll
 * into view. Motion is gated behind `motion-safe:` so users with
 * `prefers-reduced-motion` see content immediately with no transform. Children
 * are rendered normally (server components pass straight through), so this only
 * adds a thin client wrapper for the entry transition.
 */
export function Reveal({ children, as, className, index = 0 }: RevealProps) {
  const Wrapper = (as ?? "div") as ElementType;
  const { ref, isInView } = useInView<HTMLElement>();
  const delayMs = Math.min(index * STAGGER_STEP_MS, MAX_STAGGER_MS);

  return (
    <Wrapper
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={joinClassNames(
        "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out",
        isInView
          ? "opacity-100 motion-safe:translate-y-0"
          : "motion-safe:translate-y-4 motion-safe:opacity-0",
        className
      )}
    >
      {children}
    </Wrapper>
  );
}
