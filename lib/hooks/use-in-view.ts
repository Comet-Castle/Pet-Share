"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = Readonly<{
  /** How much of the element must be visible before it counts as in view. */
  threshold?: number;
  /** Margin around the root, e.g. to trigger slightly before the element enters. */
  rootMargin?: string;
  /** Stop observing after the first time the element enters the viewport. */
  once?: boolean;
}>;

/**
 * Small IntersectionObserver hook for scroll-triggered entry animations. Returns
 * a ref to attach to the observed element and whether it is currently in view.
 *
 * Kept intentionally minimal per the dependency decision log: a single shared
 * hook rather than a broad custom animation framework. When IntersectionObserver
 * is unavailable (SSR, old browsers), it reports `true` so content is never
 * hidden.
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  once = true
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      // No observer support: reveal immediately so nothing stays hidden.
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (once) {
              observer.disconnect();
            }
          } else if (!once) {
            setIsInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isInView };
}
