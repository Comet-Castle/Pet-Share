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
    <div className="flex flex-wrap items-center gap-5 lg:gap-8">
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
              // Active state is conveyed by orange text (paired with aria-current for
              // assistive tech). The keyboard focus ring is separate and still applies.
              "inline-flex min-h-11 items-center gap-1 rounded-full px-2 py-2.5 text-base font-bold transition hover:-rotate-1 hover:text-pet-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2",
              active ? "text-pet-coral" : "text-pet-ink"
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
