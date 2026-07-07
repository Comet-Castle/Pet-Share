"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

type SiteErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

/**
 * Renders a friendly segment error boundary without exposing technical details.
 */
export default function SiteError({ error, reset }: SiteErrorProps) {
  useEffect(() => {
    console.error("Public route render failed.", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[62vh] w-full max-w-[1440px] items-center px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
      <div className="mx-auto w-full max-w-4xl rounded-[2rem] bg-white/78 p-6 text-center shadow-soft backdrop-blur sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-pet-coral/16 text-pet-ink">
          <AlertTriangle aria-hidden="true" size={30} />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Something slipped the leash</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-wrap font-display text-5xl font-bold leading-[1.04] text-pet-ink sm:text-6xl lg:text-7xl">
          The page got distracted by a squeaky toy.
        </h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-pet-muted sm:text-xl">
          Try again in a moment. If this keeps happening, the debug logs should have the non-secret details.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pet-coral px-6 py-3 text-center font-bold text-white shadow-soft transition duration-200 hover:-rotate-1 hover:bg-[#f37f61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-blue focus-visible:ring-offset-2"
          >
            <RotateCcw aria-hidden="true" size={18} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white/80 px-6 py-3 text-center font-bold text-pet-ink shadow-soft backdrop-blur transition duration-200 hover:rotate-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-blue focus-visible:ring-offset-2"
          >
            <Home aria-hidden="true" size={18} />
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
