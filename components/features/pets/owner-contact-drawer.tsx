"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Mail, Send, X } from "lucide-react";
import { CmsForm } from "@/components/features/forms/cms-form";
import { joinClassNames } from "@/lib/utils/class-names";
import type { FORM_DEFINITION_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type OwnerContactDrawerProps = Readonly<{
  petId: string;
  petName: string;
  ownerId?: string | null;
  ownerName?: string | null;
  ctaLabel: string;
  ownerHref?: string | null;
  form?: FORM_DEFINITION_BY_SLUG_QUERY_RESULT;
}>;

const triggerClass = "bg-pet-coral text-white shadow-soft hover:-rotate-1 hover:bg-[#f37f61]";

/**
 * Renders the pet owner contact drawer with the Sanity-authored owner-contact
 * form and preserves pet/owner context for server-side delivery.
 */
export function OwnerContactDrawer({ petId, petName, ownerId, ownerName, ctaLabel, ownerHref, form }: OwnerContactDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function openDrawer() {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) {
      previousFocusRef.current?.focus();
      return;
    }

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("aria-hidden") && element.tabIndex >= 0 && element.offsetParent !== null);

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const drawer = (
    <div
      className={joinClassNames(
        "fixed inset-0 z-[70] overflow-hidden transition",
        isOpen ? "visible" : "invisible delay-200"
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className={joinClassNames(
          "absolute inset-0 bg-pet-ink/45 transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        aria-label="Close contact drawer"
        onClick={closeDrawer}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={joinClassNames(
          "fixed inset-y-0 right-0 flex h-dvh w-full max-w-[460px] flex-col overflow-y-auto bg-[#fffdf9] shadow-soft transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none",
          isOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-pet-muted/10 p-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Contact owner</p>
            <h2 id={titleId} className="mt-2 font-display text-3xl font-bold leading-tight text-pet-ink">
              Ask about {petName}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-pet-ink shadow-sm transition hover:rotate-6 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
            aria-label="Close contact drawer"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <div className="grid min-w-0 gap-5 p-4 sm:p-6">
          <p id={descriptionId} className="text-sm leading-6 text-pet-muted">
            Send a request through the Pet Share team. Owner contact routes to the master inbox, not a personal owner address.
          </p>

          {form ? (
            <CmsForm
              form={form}
              variant="compact"
              context={{
                petId,
                petName,
                ownerId,
                ownerName,
                currentUrl: typeof window === "undefined" ? undefined : window.location.href
              }}
            />
          ) : (
            <div className="rounded-[1.5rem] bg-pet-coral/12 p-5 shadow-sm">
              <h3 className="font-display text-xl font-bold text-pet-ink">Contact form unavailable</h3>
              <p className="mt-2 text-sm leading-6 text-pet-muted">Use the contact page while this pet request form is being fetched.</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pet-coral px-6 py-3 text-center font-bold text-white shadow-soft transition hover:-rotate-1 hover:bg-[#f37f61] focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2"
                onClick={closeDrawer}
              >
                <Mail aria-hidden="true" size={16} />
                Go to contact page
              </Link>
            </div>
          )}

          {ownerHref ? (
            <Link
              href={ownerHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/75 px-6 py-3 text-center font-bold text-pet-ink shadow-soft backdrop-blur transition hover:rotate-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2"
              onClick={closeDrawer}
            >
              View owner page
            </Link>
          ) : null}
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className={joinClassNames(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2",
          triggerClass
        )}
      >
        <Send aria-hidden="true" size={16} />
        <span>{ctaLabel}</span>
      </button>

      {isMounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
