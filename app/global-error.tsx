"use client";

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
          <section className="mx-auto max-w-[760px] rounded-[2rem] bg-white/75 p-8 text-center shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Server error</p>
            <h1 className="mt-3 font-display text-4xl font-bold">The whole kennel sneezed.</h1>
            <p className="mt-4 text-pet-muted">
              Something failed before the page could render. Technical details are logged server-side when available.
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
