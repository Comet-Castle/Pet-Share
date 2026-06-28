import Link from "next/link";
import type { ReactNode } from "react";
import { ExternalLink, PawPrint } from "lucide-react";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity.types";

type SiteShellProps = Readonly<{
  children: ReactNode;
  settings?: SITE_SETTINGS_QUERY_RESULT;
}>;

type NavigationLink = Readonly<{
  label: string;
  link: {
    type: "action" | "externalUrl" | "internalPath";
    path: string | null;
    url: string | null;
    openInNewTab: boolean | null;
  };
}>;

const fallbackPrimaryNavigation: NavigationLink[] = [
  { label: "Pets", link: { type: "internalPath", path: "/pets", url: null, openInNewTab: null } },
  { label: "About", link: { type: "internalPath", path: "/about", url: null, openInNewTab: null } },
  { label: "Process", link: { type: "internalPath", path: "/process", url: null, openInNewTab: null } },
  { label: "Pricing", link: { type: "internalPath", path: "/pricing", url: null, openInNewTab: null } }
];

const fallbackFooterNavigation: NavigationLink[] = [
  { label: "Pets", link: { type: "internalPath", path: "/pets", url: null, openInNewTab: null } },
  { label: "Studio", link: { type: "internalPath", path: "/studio", url: null, openInNewTab: null } }
];

function getLinkHref(item: NavigationLink) {
  if (item.link.type === "externalUrl") {
    return item.link.url ?? "/";
  }

  return item.link.path ?? "/";
}

function isExternalLink(item: NavigationLink) {
  return item.link.type === "externalUrl" || item.link.openInNewTab === true;
}

/**
 * Provides the public site shell with CMS-driven navigation and safe fallbacks.
 */
export function SiteShell({ children, settings }: SiteShellProps) {
  const siteTitle = settings?.title ?? "Pet Share";
  const primaryNavigation = settings?.primaryNavigation?.length
    ? settings.primaryNavigation
    : fallbackPrimaryNavigation;
  const footerNavigation = settings?.footerNavigation?.length
    ? settings.footerNavigation
    : fallbackFooterNavigation;

  return (
    <div className="min-h-screen bg-pet-cream">
      <header className="px-5 py-4 sm:px-8 lg:px-10">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 rounded-[2rem] bg-white/75 px-5 py-4 shadow-soft backdrop-blur sm:rounded-full lg:flex-row lg:items-center lg:justify-between lg:px-6"
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-bold text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
          >
            <PawPrint aria-hidden="true" size={24} />
            {siteTitle}
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {primaryNavigation.map((item) => (
              <Link
                key={`${item.label}-${getLinkHref(item)}`}
                href={getLinkHref(item)}
                target={isExternalLink(item) ? "_blank" : undefined}
                rel={isExternalLink(item) ? "noreferrer" : undefined}
                className="inline-flex min-h-10 items-center gap-1 rounded-full px-4 py-2 text-sm font-bold text-pet-muted transition hover:-rotate-1 hover:bg-pet-mint/35 hover:text-pet-ink focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              >
                {item.label}
                {isExternalLink(item) ? <ExternalLink aria-hidden="true" size={14} /> : null}
              </Link>
            ))}
            <Link
              href="/studio"
              className="inline-flex min-h-10 items-center rounded-full bg-pet-ink px-4 py-2 text-sm font-bold text-white transition hover:rotate-1 hover:bg-pet-muted focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
            >
              Studio
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="px-5 pb-8 pt-12 sm:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 rounded-[2rem] bg-white/60 px-6 py-6 text-pet-muted shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg font-bold text-pet-ink">{siteTitle}</p>
            <p className="mt-1 max-w-xl text-sm">
              A Sanity-powered demo marketplace for fictional pet-sharing decisions.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-2">
            {footerNavigation.map((item) => (
              <Link
                key={`${item.label}-${getLinkHref(item)}`}
                href={getLinkHref(item)}
                target={isExternalLink(item) ? "_blank" : undefined}
                rel={isExternalLink(item) ? "noreferrer" : undefined}
                className="rounded-full px-3 py-2 text-sm font-bold transition hover:bg-white hover:text-pet-ink focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
