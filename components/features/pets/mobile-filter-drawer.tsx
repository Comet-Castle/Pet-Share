"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

type MobileFilterDrawerProps = Readonly<{
  children: ReactNode;
  activeCount: number;
  resultCount: number;
}>;

/**
 * Client-controlled slide-over drawer that hosts the server-rendered pet filter
 * rail on small screens. Following the common mobile filter pattern, the drawer
 * stays open while filters are applied and closes through the result button,
 * backdrop, or Escape so users can stack several filters before committing.
 */
export function MobileFilterDrawer({ children, activeCount, resultCount }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const titleId = useId();

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      openBtnRef.current?.focus();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Move focus into the panel when it opens and run a lightweight Tab trap.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>("a, button, input, select, [tabindex]:not([tabindex='-1'])");
    firstFocusable?.focus();

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel) {
        return;
      }

      const focusables = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex='-1'])");
      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    panel?.addEventListener("keydown", handleTab);
    return () => panel?.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  return (
    <>
      <button
        ref={openBtnRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2.5 text-sm font-bold text-pet-ink shadow-soft backdrop-blur transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2 lg:hidden"
      >
        <SlidersHorizontal aria-hidden="true" size={16} />
        Filters
        {activeCount > 0 ? (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-pet-coral text-xs font-bold text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      <div
        className={joinClassNames(
          "fixed inset-0 z-50 lg:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!isOpen}
      >
        <div
          onClick={() => setIsOpen(false)}
          className={joinClassNames(
            "absolute inset-0 bg-pet-ink/35 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={joinClassNames(
            // Full-width takeover on mobile: the drawer fills the whole screen
            // rather than leaving a sliver of the page behind it.
            "absolute inset-y-0 left-0 flex w-full flex-col bg-pet-cream shadow-soft transition-transform duration-200 ease-out motion-reduce:transition-none",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-pet-ink/10 px-5 py-4">
            <h2 id={titleId} className="flex items-center gap-2 font-display text-xl font-bold text-pet-ink">
              <SlidersHorizontal aria-hidden="true" size={18} />
              Filters
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-sm transition hover:-rotate-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
              aria-label="Close filters"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          <div className="border-t border-pet-ink/10 px-5 py-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex w-full items-center justify-center rounded-full bg-pet-coral px-5 py-3 text-center font-bold text-white shadow-soft transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-blue focus-visible:ring-offset-2"
            >
              Show {resultCount} {resultCount === 1 ? "pet" : "pets"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
