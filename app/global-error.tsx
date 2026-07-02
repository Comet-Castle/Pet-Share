"use client";

import { AlertTriangle } from "lucide-react";

type GlobalErrorProps = Readonly<{
  error: Error & { digest?: string };
}>;

/**
 * Renders the last-resort application error boundary.
 */
export default function GlobalError({ error }: GlobalErrorProps) {
  console.error("Global application render failed.", {
    message: error.message,
    digest: error.digest
  });

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-pet-cream px-5 py-16 text-pet-ink">
          <section className="mx-auto max-w-4xl rounded-[2rem] bg-white/78 p-8 text-center shadow-soft backdrop-blur sm:p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-pet-coral/16 text-pet-ink">
              <AlertTriangle aria-hidden="true" size={30} />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Server error</p>
            <h1 className="mt-3 text-wrap font-display text-5xl font-bold leading-[1.04] sm:text-6xl lg:text-7xl">
              The whole kennel sneezed.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-pet-muted sm:text-xl">
              Something failed before the page could render. Technical details are logged server-side when available.
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
