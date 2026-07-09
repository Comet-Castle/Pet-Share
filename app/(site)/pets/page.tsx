import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { SlidersHorizontal } from "lucide-react";
import { PetCard } from "@/components/features/pets/pet-card";
import { Reveal } from "@/components/ui/reveal";
import { PetFilters } from "@/components/features/pets/pet-filters";
import { ActiveFilterChips } from "@/components/features/pets/active-filter-chips";
import { MobileFilterDrawer } from "@/components/features/pets/mobile-filter-drawer";
import { SortControl } from "@/components/features/pets/sort-control";
import { PageSections } from "@/components/features/sections/page-sections";
import { SystemMessage } from "@/components/features/system/system-message";
import { availabilityLabels, urgencyLabels } from "@/components/features/pets/status";
import { logger } from "@/lib/diagnostics/logger";
import { metadataFromSeo } from "@/lib/content/metadata";
import { loadPetIndexPage, loadPetsIndex, loadPetsIndexCount, loadPetTypes, loadSiteDefaultSeo } from "@/sanity/lib/loaders";
import {
  PET_PAGE_SIZE,
  countActiveFilters,
  normalizeMinimumRating,
  normalizePetNameQuery,
  normalizeStringList,
  petsPageHref,
  type PetFilterState
} from "@/components/features/pets/pet-index-state";
import { resolvePetIndexSort } from "@/sanity/queries/pets";

type PetsPageProps = Readonly<{
  searchParams: Promise<{
    page?: string;
    sort?: string;
    name?: string;
    type?: string | string[];
    availability?: string | string[];
    urgency?: string | string[];
    chaos?: string;
    mess?: string;
    energy?: string;
  }>;
}>;

function normalizePage(value: string | undefined) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function normalizePetTypeSlugs(value: string | string[] | undefined) {
  const values = Array.isArray(value) ? value : value ? [value] : [];

  return Array.from(new Set(values.map((slug) => slug.trim()).filter(Boolean)));
}

export async function generateMetadata(): Promise<Metadata> {
  const siteDefaultSeo = await loadSiteDefaultSeo().catch(() => null);

  try {
    const page = await loadPetIndexPage();

    return metadataFromSeo({
      seo: page?.seo,
      siteDefaultSeo,
      fallbackTitle: "Pets",
      fallbackDescription: "Find pets currently available for temporary stays.",
      path: "/pets"
    });
  } catch {
    return metadataFromSeo({
      siteDefaultSeo,
      fallbackTitle: "Pets",
      fallbackDescription: "Find pets currently available for temporary stays.",
      path: "/pets"
    });
  }
}

/**
 * Renders the public pet index as a browse-first marketplace surface with
 * URL-driven filters, sorting, result chips, and server-rendered pagination.
 */
export default async function PetsPage({ searchParams }: PetsPageProps) {
  const { isEnabled } = await draftMode();
  const params = await searchParams;
  const currentPage = normalizePage(params.page);
  const sort = resolvePetIndexSort(params.sort);
  const petFilters: PetFilterState = {
    petNameQuery: normalizePetNameQuery(params.name),
    petTypeSlugs: normalizePetTypeSlugs(params.type),
    availabilityStatuses: normalizeStringList(params.availability, Object.keys(availabilityLabels)),
    pickupUrgencies: normalizeStringList(params.urgency, Object.keys(urgencyLabels)),
    minChaos: normalizeMinimumRating(params.chaos),
    minMess: normalizeMinimumRating(params.mess),
    minEnergy: normalizeMinimumRating(params.energy)
  };

  let page: Awaited<ReturnType<typeof loadPetIndexPage>> | null = null;
  let pets: Awaited<ReturnType<typeof loadPetsIndex>> = [];
  let totalPets = 0;
  let petTypes: Awaited<ReturnType<typeof loadPetTypes>> = [];
  let loadError = false;

  try {
    [page, pets, totalPets, petTypes] = await Promise.all([
      loadPetIndexPage({ preview: isEnabled }),
      loadPetsIndex(currentPage, PET_PAGE_SIZE, petFilters, sort, { preview: isEnabled }),
      loadPetsIndexCount(petFilters, { preview: isEnabled }),
      loadPetTypes({ preview: isEnabled })
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
        message="The listings could not be loaded right now. Try again once someone has looked under the bed."
        primaryHref="/"
        primaryLabel="Go home"
      />
    );
  }

  const totalPages = Math.max(Math.ceil(totalPets / PET_PAGE_SIZE), 1);
  const activeCount = countActiveFilters(petFilters);
  const clearHref = "/pets";
  const contentSections = page?.contentSections?.filter(
    (section) => section._key !== "pet-index-final-cta" && !("headline" in section && section.headline === "Still deciding?")
  );

  return (
    <main className="mx-auto w-full max-w-[1440px] min-w-0 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-[2rem] bg-white/72 p-5 shadow-soft backdrop-blur">
            <div className="mb-6 flex items-center gap-2 text-pet-ink">
              <SlidersHorizontal aria-hidden="true" size={20} />
              <h2 className="font-display text-xl font-bold">Filters</h2>
            </div>
            <div className="themed-scrollbar -mr-5 max-h-[calc(100vh-8rem)] overflow-y-auto pr-5 pb-6">
              <PetFilters
                filters={petFilters}
                petTypes={petTypes}
                activeCount={activeCount}
                totalPets={totalPets}
                clearHref={clearHref}
              />
            </div>
          </div>
        </aside>

        <section aria-label="Pet listings" className="min-w-0">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Pet marketplace</p>
              <h1 className="mt-2 text-wrap font-display text-4xl font-bold leading-[1.05] text-pet-ink sm:text-5xl">
                Browse available pets
              </h1>
              <p aria-live="polite" className="mt-3 text-sm font-bold text-pet-muted">
                {totalPets} {totalPets === 1 ? "pet" : "pets"} available
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <MobileFilterDrawer activeCount={activeCount} resultCount={totalPets}>
                <div className="rounded-[1.5rem] bg-white/75 p-4 shadow-soft backdrop-blur">
                  <PetFilters
                    filters={petFilters}
                    petTypes={petTypes}
                    activeCount={activeCount}
                    totalPets={totalPets}
                    clearHref={clearHref}
                  />
                </div>
              </MobileFilterDrawer>
              <SortControl currentSort={sort} />
            </div>
          </div>

          <div className="mt-4">
            <ActiveFilterChips filters={petFilters} petTypes={petTypes} clearHref={clearHref} />
          </div>

          {pets.length ? (
            <>
              <div className="mt-6 grid min-w-0 gap-7 md:grid-cols-2 xl:grid-cols-3">
                {pets.map((pet, index) => (
                  <Reveal key={pet._id} index={index % 3} className="min-w-0">
                    <PetCard pet={pet} />
                  </Reveal>
                ))}
              </div>

              <nav className="mt-8 flex flex-wrap items-center justify-between gap-3" aria-label="Pet pagination">
                <p className="text-sm font-bold text-pet-muted">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={petsPageHref(petFilters, { page: Math.max(currentPage - 1, 1), sort })}
                    aria-disabled={currentPage === 1}
                    className="rounded-full bg-white/75 px-5 py-3 text-sm font-bold text-pet-ink shadow-soft transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  >
                    Previous
                  </Link>
                  <Link
                    href={petsPageHref(petFilters, { page: Math.min(currentPage + 1, totalPages), sort })}
                    aria-disabled={currentPage >= totalPages}
                    className="rounded-full bg-white/75 px-5 py-3 text-sm font-bold text-pet-ink shadow-soft transition hover:rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2 aria-disabled:pointer-events-none aria-disabled:opacity-50"
                  >
                    Next
                  </Link>
                </div>
              </nav>
            </>
          ) : (
            <div className="mt-6">
              <SystemMessage
                variant="empty"
                eyebrow={activeCount > 0 ? "No matches" : "No pets yet"}
                title={
                  activeCount > 0
                    ? page?.emptyState?.headline ?? "No pets match those filters."
                    : "The kennels are suspiciously quiet."
                }
                message={
                  activeCount > 0
                    ? page?.emptyState?.body ?? "That combination is too specific, even for us. They may be hiding."
                    : "Seed content will populate this listing once the data milestone runs."
                }
                primaryHref={activeCount > 0 ? clearHref : "/"}
                primaryLabel={activeCount > 0 ? "Clear filters" : "Go home"}
                secondaryHref="/how-it-works"
                secondaryLabel="Review how it works"
              />
            </div>
          )}
        </section>
      </div>

      {contentSections?.length ? (
        <div className="mt-12">
          <PageSections sections={contentSections} />
        </div>
      ) : null}
    </main>
  );
}
