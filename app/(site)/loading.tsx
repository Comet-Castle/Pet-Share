/**
 * Renders a lightweight loading state for public route transitions.
 */
export default function SiteLoading() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="h-64 animate-pulse rounded-[2rem] bg-white/60 shadow-soft" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-48 animate-pulse rounded-[2rem] bg-white/60 shadow-soft" />
          <div className="h-48 animate-pulse rounded-[2rem] bg-white/60 shadow-soft" />
          <div className="h-48 animate-pulse rounded-[2rem] bg-white/60 shadow-soft sm:col-span-2" />
        </div>
      </div>
    </section>
  );
}
