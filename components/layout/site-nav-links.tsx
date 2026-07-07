"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { isActiveNavLink, resolveNavLinks, type NavigationLink } from "./nav-links";
import { joinClassNames } from "@/lib/utils/class-names";

type SiteNavLinksProps = Readonly<{
  items: readonly NavigationLink[];
}>;

/**
 * Renders the primary navigation links with Next.js client-side routing and an
 * `aria-current` active state derived from the current pathname.
 */
export function SiteNavLinks({ items }: SiteNavLinksProps) {
  const pathname = usePathname();
  const links = resolveNavLinks(items);

  return (
    <div className="flex flex-wrap items-center gap-4 lg:gap-7">
      {links.map((item) => {
        const active = isActiveNavLink(pathname, item.href);

        return (
          <Link
            key={`${item.label}-${item.href}`}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            aria-current={active ? "page" : undefined}
            className={joinClassNames(
              "inline-flex min-h-10 items-center gap-1 rounded-full px-1 py-2 text-sm font-bold transition hover:-rotate-1 hover:text-pet-coral focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2",
              active ? "text-pet-coral underline decoration-pet-coral decoration-2 underline-offset-8" : "text-pet-ink"
            )}
          >
            {item.label}
            {item.external ? <ExternalLink aria-hidden="true" size={14} /> : null}
          </Link>
        );
      })}
    </div>
  );
}
