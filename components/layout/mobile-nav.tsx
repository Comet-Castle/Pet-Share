"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ExternalLink, Menu, X } from "lucide-react";
import { isActiveNavLink, resolveNavLinks, type NavigationLink } from "./nav-links";
import { joinClassNames } from "@/lib/utils/class-names";

type MobileNavProps = Readonly<{
  items: readonly NavigationLink[];
}>;

/**
 * Mobile primary navigation: a hamburger toggle that opens a full-height menu
 * with the primary links and the "List your pet" CTA. Shown only below the
 * breakpoint where the inline desktop nav takes over (the shell gates this with
 * `md:hidden`). Mirrors the site drawer a11y pattern: `aria-expanded`/
 * `aria-controls` on the toggle, `role="dialog"` + `aria-modal` on the panel,
 * Escape-to-close, a focus trap, focus restore, and body scroll lock. The menu
 * closes automatically on navigation (pathname change).
 */
export function MobileNav({ items }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const menuId = useId();
  const titleId = useId();
  const links = resolveNavLinks(items);

  // Restore focus to the toggle when the menu closes.
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      toggleRef.current?.focus();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

  // Escape-to-close + body scroll lock while open.
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
    const firstFocusable = panel?.querySelector<HTMLElement>("a[href], button:not([disabled])");
    firstFocusable?.focus();

    function handleTab(event: KeyboardEvent) {
      if (event.key !== "Tab" || !panel) {
        return;
      }

      const focusables = panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
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
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Open navigation menu"
        className="inline-flex size-11 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-sm backdrop-blur transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
      >
        <Menu aria-hidden="true" size={22} />
      </button>

      <div
        id={menuId}
        className={joinClassNames(
          "fixed inset-0 z-50",
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
            "absolute inset-y-0 right-0 flex w-full flex-col bg-pet-cream shadow-soft transition-transform duration-200 ease-out motion-reduce:transition-none",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-pet-ink/10 px-5 py-4">
            <h2 id={titleId} className="font-display text-xl font-bold text-pet-ink">
              Menu
            </h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex size-9 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-sm transition hover:-rotate-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
              aria-label="Close navigation menu"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6">
            {links.map((item) => {
              const active = isActiveNavLink(pathname, item.href);

              return (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={joinClassNames(
                    "inline-flex min-h-12 items-center gap-2 rounded-2xl px-4 text-lg font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2",
                    active ? "bg-pet-coral/10 text-pet-coral" : "text-pet-ink hover:bg-white/70"
                  )}
                >
                  {item.label}
                  {item.external ? <ExternalLink aria-hidden="true" size={16} /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-pet-ink/10 px-5 py-5">
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-pet-coral px-5 py-3 text-center font-bold text-white shadow-soft transition hover:-rotate-1 hover:bg-[#f37f61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
            >
              List your pet
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
