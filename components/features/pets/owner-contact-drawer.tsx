"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CalendarClock, Mail, Send, X } from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

type OwnerContactDrawerProps = Readonly<{
  petName: string;
  ownerName?: string | null;
  ctaLabel: string;
  ownerHref?: string | null;
}>;

const triggerClass = "bg-pet-coral text-white shadow-soft hover:-rotate-1 hover:bg-[#f37f61]";

/**
 * Renders the pet owner contact drawer shell without submission plumbing. The
 * delivery form/server action is intentionally deferred to the form milestone.
 */
export function OwnerContactDrawer({ petName, ownerName, ctaLabel, ownerHref }: OwnerContactDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={joinClassNames(
          "absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col overflow-y-auto bg-[#fffdf9] shadow-soft transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
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

        <div className="grid gap-5 p-6">
          <p id={descriptionId} className="text-sm leading-6 text-pet-muted">
            This drawer is ready for the Pet Share contact flow. Submission delivery is intentionally not wired yet, so no message is sent from this panel.
          </p>

          <div className="rounded-[1.5rem] bg-white/80 p-5 shadow-sm">
            <h3 className="font-display text-xl font-bold text-pet-ink">Request context</h3>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="font-bold text-pet-muted">Pet</dt>
                <dd className="mt-1 text-pet-ink">{petName}</dd>
              </div>
              <div>
                <dt className="font-bold text-pet-muted">Owner</dt>
                <dd className="mt-1 text-pet-ink">{ownerName ?? "Owner details pending"}</dd>
              </div>
              <div>
                <dt className="font-bold text-pet-muted">Pickup window</dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-pet-ink">
                  <CalendarClock aria-hidden="true" size={16} className="text-pet-coral" />
                  Confirmed during follow-up
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[1.5rem] bg-pet-mint/25 p-5 shadow-sm">
            <h3 className="font-display text-xl font-bold text-pet-ink">Next implementation step</h3>
            <p className="mt-2 text-sm leading-6 text-pet-muted">
              Milestone 11 should add the actual contact form fields, validation, server submission, and email delivery. Until then, use the contact page as the safe fallback.
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pet-coral px-6 py-3 text-center font-bold text-white shadow-soft transition hover:-rotate-1 hover:bg-[#f37f61] focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2"
              onClick={closeDrawer}
            >
              <Mail aria-hidden="true" size={16} />
              Go to contact page
            </Link>
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
