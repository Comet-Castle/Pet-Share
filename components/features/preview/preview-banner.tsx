"use client";

import { usePathname, useSearchParams } from "next/navigation";

/**
 * Shows editors when Draft Mode is active and gives them a direct exit action.
 */
export function PreviewBanner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const currentPath = `${pathname}${queryString ? `?${queryString}` : ""}`;
  const exitHref = `/api/draft-mode/disable?redirectTo=${encodeURIComponent(currentPath)}`;

  return (
    <div className="sticky top-0 z-50 border-b border-pet-ink/10 bg-pet-ink px-4 py-3 text-white shadow-soft">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold">
          Draft preview is active. You may be viewing unpublished Sanity content.
        </p>
        {/* Plain anchor (not next/link): draft-mode endpoints need a full browser request so
            the bypass cookie is set/cleared and the redirect is followed by the browser, not the
            App Router client navigator. */}
        <a
          href={exitHref}
          className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-pet-ink transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2 focus-visible:ring-offset-pet-ink"
        >
          Exit preview
        </a>
      </div>
    </div>
  );
}
