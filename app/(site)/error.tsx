"use client";

import { useEffect } from "react";
import { Home, RotateCcw } from "lucide-react";
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
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[960px] items-center px-5 py-16 sm:px-8 lg:px-10">
      <div className="w-full rounded-[2rem] bg-white/75 p-6 text-center shadow-soft backdrop-blur sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Something slipped the leash</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">
          The page got distracted by a squeaky toy.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-pet-muted">
          Try again in a moment. If this keeps happening, the debug logs should have the non-secret details.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-pet-coral px-6 py-3 text-center font-bold text-white shadow-soft transition duration-200 hover:-rotate-1 hover:bg-[#f37f61] focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2"
          >
            <RotateCcw aria-hidden="true" size={18} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white/80 px-6 py-3 text-center font-bold text-pet-ink shadow-soft backdrop-blur transition duration-200 hover:rotate-1 hover:bg-white focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2"
          >
            <Home aria-hidden="true" size={18} />
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
