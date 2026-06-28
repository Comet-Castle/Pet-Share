import { PawPrint, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

/**
 * Renders the temporary homepage until Sanity-authored page sections are available.
 */
export default function HomePage() {
  return (
    <SiteShell>
      <section className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-[1280px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-pet-muted shadow-soft backdrop-blur">
            <Sparkles aria-hidden="true" size={18} />
            Sanity-powered satire, temporarily housebroken
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight text-pet-ink sm:text-6xl lg:text-7xl">
            Pet Share is warming up the leash.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-pet-muted">
            The CMS foundation is being assembled for a bright, responsive demo
            marketplace where fictional owners can lend out fictional pets with
            deeply questionable confidence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/studio" icon={<PawPrint aria-hidden="true" size={20} />}>
              Open Studio
            </Button>
            <Button href="/pets" variant="secondary">
              Preview future listings
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white/65 p-5 shadow-soft backdrop-blur sm:p-8">
          <div className="aspect-[4/3] rounded-[1.5rem] bg-[radial-gradient(circle_at_30%_20%,#ffcfbf,transparent_36%),radial-gradient(circle_at_80%_10%,#a8e6cf,transparent_34%),linear-gradient(135deg,#fff8ef,#d9f0ff)] p-6">
            <div className="flex h-full flex-col justify-end">
              <div className="max-w-sm rounded-3xl bg-white/80 p-5 text-pet-ink shadow-soft backdrop-blur">
                <p className="font-display text-2xl font-bold">Coming next</p>
                <p className="mt-2 text-sm leading-6 text-pet-muted">
                  Schemas, seed tooling, responsive routes, and pet listings
                  with enough charm to require a damage deposit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
