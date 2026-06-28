import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { PetCard } from "@/components/features/pets/pet-card";
import { SectionPlaceholders } from "@/components/features/sections/section-placeholders";
import { SystemMessage } from "@/components/features/system/system-message";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/diagnostics/logger";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadPetIndexPage, loadPetsIndex, loadPetsIndexCount, loadPetTypes } from "@/sanity/lib/loaders";

type PetsPageProps = Readonly<{
  searchParams: Promise<{
    page?: string;
  }>;
}>;

const pageSize = 12;

function normalizePage(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await loadPetIndexPage();

    return metadataFromSeo({
      seo: page?.seo,
      fallbackTitle: "Pets",
      fallbackDescription: "Browse fictional pets currently available for satirical sharing."
    });
  } catch {
    return metadataFromSeo({
      fallbackTitle: "Pets",
      fallbackDescription: "Browse fictional pets currently available for satirical sharing."
    });
  }
}

/**
 * Renders the public pet index with URL-driven pagination and starter filters.
 */
export default async function PetsPage({ searchParams }: PetsPageProps) {
  const params = await searchParams;
  const currentPage = normalizePage(params.page);
  let page: Awaited<ReturnType<typeof loadPetIndexPage>> | null = null;
  let pets: Awaited<ReturnType<typeof loadPetsIndex>> = [];
  let totalPets = 0;
  let petTypes: Awaited<ReturnType<typeof loadPetTypes>> = [];
  let loadError = false;

  try {
    [page, pets, totalPets, petTypes] = await Promise.all([
      loadPetIndexPage(),
      loadPetsIndex(currentPage, pageSize),
      loadPetsIndexCount(),
      loadPetTypes()
    ]);
  } catch (error) {
    loadError = true;
    logger.error("Failed to load pet index route.", {
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  if (loadError) {
    return (
      <SystemMessage
        variant="error"
        eyebrow="Pets unavailable"
        title="The pet listings are hiding under the bed."
        message="The CMS data could not be loaded right now, but the route is ready for seeded content."
        primaryHref="/"
        primaryLabel="Go home"
      />
    );
  }

  const totalPages = Math.max(Math.ceil(totalPets / pageSize), 1);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10">
      <section className="mb-10 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Pet marketplace</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-6xl">
          {page?.hero?.headline ?? "Find a pet to temporarily regret."}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-pet-muted">
          {page?.summary ??
            "Use the filters as a planning surface for now. Full filter behavior lands with the index polish milestone."}
        </p>
      </section>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2rem] bg-white/65 p-5 shadow-soft backdrop-blur">
          <div className="flex items-center gap-2 text-pet-ink">
            <SlidersHorizontal aria-hidden="true" size={20} />
            <h2 className="font-display text-xl font-bold">Filters</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-pet-muted">
            {page?.filterIntro ?? "Selectable pills and chaos controls are planned for the finished pet index."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {petTypes.map((type) => (
              <span
                key={type._id}
                className="inline-flex rounded-full bg-pet-mint/30 px-3 py-2 text-sm font-bold text-pet-ink"
              >
                {type.filterLabel}
              </span>
            ))}
          </div>
        </aside>

        <section aria-label="Pet listings">
          {pets.length ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pets.map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
              </div>
              <nav className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-label="Pet pagination">
                <p className="text-sm font-bold text-pet-muted">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={`/pets?page=${Math.max(currentPage - 1, 1)}`}
                    aria-disabled={currentPage === 1}
                    className="rounded-full bg-white/75 px-5 py-3 text-sm font-bold text-pet-ink shadow-soft transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  >
                    Previous
                  </Link>
                  <Link
                    href={`/pets?page=${Math.min(currentPage + 1, totalPages)}`}
                    aria-disabled={currentPage >= totalPages}
                    className="rounded-full bg-white/75 px-5 py-3 text-sm font-bold text-pet-ink shadow-soft transition hover:rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  >
                    Next
                  </Link>
                </div>
              </nav>
            </>
          ) : (
            <SystemMessage
              variant="empty"
              eyebrow="No pets yet"
              title={page?.emptyState?.headline ?? "The kennels are suspiciously quiet."}
              message={page?.emptyState?.body ?? "Seed content will populate this listing once the data milestone runs."}
              primaryHref="/studio"
              primaryLabel="Open Studio"
              secondaryHref="/"
              secondaryLabel="Go home"
            />
          )}
        </section>
      </div>

      <section className="mt-12">
        <SectionPlaceholders sections={page?.contentSections} />
      </section>
    </div>
  );
}
