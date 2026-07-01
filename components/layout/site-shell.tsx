import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ExternalLink, PawPrint } from "lucide-react";
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
  { label: "Pricing", link: { type: "internalPath", path: "/pricing", url: null, openInNewTab: null } },
  { label: "Contact", link: { type: "internalPath", path: "/contact", url: null, openInNewTab: null } },
  { label: "Warranty", link: { type: "internalPath", path: "/warranty", url: null, openInNewTab: null } }
];

const fallbackFooterNavigation: NavigationLink[] = [
  { label: "Pets", link: { type: "internalPath", path: "/pets", url: null, openInNewTab: null } },
  { label: "Process", link: { type: "internalPath", path: "/process", url: null, openInNewTab: null } },
  { label: "Contact", link: { type: "internalPath", path: "/contact", url: null, openInNewTab: null } },
  { label: "Warranty", link: { type: "internalPath", path: "/warranty", url: null, openInNewTab: null } }
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
    <div className="pet-site-background min-h-screen">
      <header className="px-5 py-6 sm:px-8 lg:px-10">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 xl:flex-row xl:items-center xl:justify-between"
        >
          <Link
            href="/"
            className="flex items-center gap-3 font-display text-2xl font-bold text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-pet-coral text-white shadow-sm">
              <PawPrint aria-hidden="true" size={25} />
            </span>
            {siteTitle}
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between xl:justify-end">
            <div className="flex flex-wrap items-center gap-4 lg:gap-7">
              {primaryNavigation.map((item) => (
                <Link
                  key={`${item.label}-${getLinkHref(item)}`}
                  href={getLinkHref(item)}
                  target={isExternalLink(item) ? "_blank" : undefined}
                  rel={isExternalLink(item) ? "noreferrer" : undefined}
                  className="inline-flex min-h-10 items-center gap-1 rounded-full px-1 py-2 text-sm font-bold text-pet-ink transition hover:-rotate-1 hover:text-pet-coral focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
                >
                  {item.label}
                  {isExternalLink(item) ? <ExternalLink aria-hidden="true" size={14} /> : null}
                </Link>
              ))}
            </div>
            <Link
              href="/pricing"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-pet-coral px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-rotate-1 hover:bg-[#f37f61] focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
            >
              List your pet
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="mt-16 bg-pet-cream/70 px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 text-pet-muted md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,0.8fr)] md:items-start">
          <div className="min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-display text-2xl font-bold text-pet-ink transition hover:-rotate-1 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-pet-coral text-white shadow-sm">
                <PawPrint aria-hidden="true" size={25} />
              </span>
              {siteTitle}
            </Link>
            <p className="mt-4 max-w-xl text-sm leading-7">
              Temporary pet relief for households that need one quiet afternoon and a reasonable return window.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="grid gap-2">
            <p className="font-display text-base font-bold text-pet-ink">Explore</p>
            {footerNavigation.map((item) => (
              <Link
                key={`${item.label}-${getLinkHref(item)}`}
                href={getLinkHref(item)}
                target={isExternalLink(item) ? "_blank" : undefined}
                rel={isExternalLink(item) ? "noreferrer" : undefined}
                className="inline-flex w-fit rounded-full py-1 text-sm font-bold transition hover:-rotate-1 hover:text-pet-coral focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="min-w-0">
            <p className="font-display text-base font-bold text-pet-ink">Need a break?</p>
            <p className="mt-3 text-sm leading-7">
              List the pet, set the expectations, and let someone else discover why the houseplants filed a complaint.
            </p>
            <Link
              href="/pricing"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-pet-ink shadow-sm transition hover:-rotate-1 hover:text-pet-coral focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
            >
              List your pet
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
