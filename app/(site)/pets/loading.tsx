/**
 * Loading state scoped to the `/pets` index. Unlike the shared whimsical loader,
 * this page re-triggers its loading state on every filter/sort/pagination
 * navigation, so a centered whimsical loader would flash jarringly on each
 * change. A stable grid skeleton that mirrors the marketplace layout keeps the
 * page from reflowing on filter changes.
 */
export default function PetsLoading() {
  return (
    <section
      aria-hidden="true"
      className="mx-auto w-full max-w-[1440px] min-w-0 px-5 py-8 sm:px-8 lg:px-10 lg:py-12"
    >
      {/* Heading row: title + supporting line, matching the pets index header. */}
      <div className="mb-8 flex flex-col gap-3">
        <div className="h-9 w-64 max-w-[70%] animate-pulse rounded-full bg-white/70" />
        <div className="h-4 w-80 max-w-[85%] animate-pulse rounded-full bg-white/55" />
      </div>

      {/* Card grid: same responsive columns and card shape as the pet index. */}
      <div className="grid min-w-0 gap-7 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] bg-white/70 shadow-soft"
          >
            {/* Media block echoes the pet card image aspect. */}
            <div className="aspect-[4/3] w-full animate-pulse bg-pet-mint/25" />
            <div className="flex flex-col gap-3 p-5 sm:p-6">
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-white/80" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/60" />
              <div className="h-4 w-full animate-pulse rounded-full bg-white/50" />
              <div className="mt-2 h-11 w-full animate-pulse rounded-[1.25rem] bg-pet-cream/70" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
