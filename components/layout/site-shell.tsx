import Link from "next/link";
import type { ReactNode } from "react";
import { PawPrint } from "lucide-react";

type SiteShellProps = Readonly<{
  children: ReactNode;
}>;

/**
 * Provides the temporary public layout shell until CMS-driven navigation exists.
 */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-pet-cream">
      <header className="px-5 py-4 sm:px-8 lg:px-10">
        <nav className="mx-auto flex w-full max-w-[1280px] items-center justify-between rounded-full bg-white/75 px-5 py-3 shadow-soft backdrop-blur">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-bold text-pet-ink"
          >
            <PawPrint aria-hidden="true" size={24} />
            Pet Share
          </Link>
          <Link
            href="/studio"
            className="rounded-full px-4 py-2 text-sm font-bold text-pet-muted transition hover:-rotate-1 hover:bg-pet-mint/35 hover:text-pet-ink focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
          >
            Studio
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
