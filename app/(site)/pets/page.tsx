import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Circle, Gauge, HeartHandshake, SlidersHorizontal, Sparkles, Zap } from "lucide-react";
import { PetCard } from "@/components/features/pets/pet-card";
import { PetTypeFilterPreview } from "@/components/features/pets/pet-type-filter-preview";
import { PageSections } from "@/components/features/sections/page-sections";
import { SystemMessage } from "@/components/features/system/system-message";
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
      fallbackDescription: "Find pets currently available for temporary stays."
    });
  } catch {
    return metadataFromSeo({
      fallbackTitle: "Pets",
      fallbackDescription: "Find pets currently available for temporary stays."
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
        message="The listings could not be loaded right now. Try again once someone has looked under the bed."
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
      </section>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-[2rem] bg-white/70 p-5 shadow-soft backdrop-blur lg:sticky lg:top-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-pet-ink">
              <SlidersHorizontal aria-hidden="true" size={20} />
              <h2 className="font-display text-xl font-bold">Filters</h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-pet-muted shadow-sm">
              {totalPets} pets
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-pet-muted">
            {page?.filterIntro ?? "Narrow the field by species, mess risk, cuddle policy, and other warning signs."}
          </p>

          <div className="mt-6 space-y-6">
            <PetTypeFilterPreview petTypes={petTypes} />

            <section aria-labelledby="availability-filter-preview">
              <h3 id="availability-filter-preview" className="text-xs font-bold uppercase tracking-[0.16em] text-pet-muted">
                Availability
              </h3>
              <div className="mt-3 grid gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-pet-ink">
                  <Circle aria-hidden="true" size={10} className="fill-pet-mint text-pet-mint" />
                  Available
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-2 text-sm font-bold text-pet-muted">
                  <Circle aria-hidden="true" size={10} className="fill-pet-coral text-pet-coral" />
                  Taking a nap
                </span>
              </div>
            </section>

            <section aria-labelledby="rating-filter-preview">
              <h3 id="rating-filter-preview" className="text-xs font-bold uppercase tracking-[0.16em] text-pet-muted">
                Household impact
              </h3>
              <div className="mt-3 space-y-3">
                <FilterScalePreview icon={<Gauge aria-hidden="true" size={16} />} label="Chaos" filledCount={4} />
                <FilterScalePreview icon={<Sparkles aria-hidden="true" size={16} />} label="Mess" filledCount={3} />
                <FilterScalePreview icon={<Zap aria-hidden="true" size={16} />} label="Energy" filledCount={3} />
              </div>
            </section>

            <section aria-labelledby="policy-filter-preview">
              <h3 id="policy-filter-preview" className="text-xs font-bold uppercase tracking-[0.16em] text-pet-muted">
                Borrowing rules
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-pet-blue/20 px-3 py-2 text-sm font-bold text-pet-ink">
                  <HeartHandshake aria-hidden="true" size={15} />
                  Consent required
                </span>
                <span className="inline-flex rounded-full bg-white px-3 py-2 text-sm font-bold text-pet-muted">
                  After snacks
                </span>
                <span className="inline-flex rounded-full bg-white px-3 py-2 text-sm font-bold text-pet-muted">
                  Appointment
                </span>
              </div>
            </section>
          </div>
        </aside>

        <section aria-label="Pet listings">
          {pets.length ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {pets.map((pet) => (
                  <PetCard key={pet._id} pet={pet} showSummary={false} />
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
              primaryHref="/"
              primaryLabel="Go home"
              secondaryHref="/process"
              secondaryLabel="Review the process"
            />
          )}
        </section>
      </div>

      <PageSections sections={page?.contentSections} />
    </div>
  );
}

type FilterScalePreviewProps = Readonly<{
  icon: ReactNode;
  label: string;
  filledCount: number;
}>;

function FilterScalePreview({ icon, label, filledCount }: FilterScalePreviewProps) {
  return (
    <div className="rounded-3xl bg-white/65 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-pet-ink">
          {icon}
          {label}
        </span>
        <span className="text-xs font-bold text-pet-muted">{filledCount}+</span>
      </div>
      <div className="mt-2 flex gap-1" aria-label={`${label}: ${filledCount} out of 5 preview`}>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={`${label}-${index}`}
            className={index < filledCount ? "h-2 flex-1 rounded-full bg-pet-coral" : "h-2 flex-1 rounded-full bg-pet-muted/15"}
          />
        ))}
      </div>
    </div>
  );
}
