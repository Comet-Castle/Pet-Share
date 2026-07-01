import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import type { CtaGroupValue, CtaLinkValue, CtaValue } from "./section-types";
import { joinClassNames } from "@/lib/utils/class-names";

type CtaLinkProps = Readonly<{
  cta: CtaValue;
}>;

type CtaGroupProps = Readonly<{
  group: CtaGroupValue;
}>;

function getHref(link: CtaLinkValue) {
  if (link.type === "externalUrl") {
    return link.url ?? "/";
  }

  if (link.type === "action") {
    return link.action === "openOwnerContactDrawer" ? "#contact-owner" : "#contact";
  }

  return link.path ?? "/";
}

function isExternal(link: CtaLinkValue) {
  return link.type === "externalUrl" || link.openInNewTab === true;
}

/**
 * Renders one CMS-authored CTA as an accessible link.
 */
export function SectionCtaLink({ cta }: CtaLinkProps) {
  if (!cta) {
    return null;
  }

  const external = isExternal(cta.link);

  return (
    <Link
      href={getHref(cta.link)}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={joinClassNames(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2",
        cta.style === "primary" && "bg-pet-coral text-white shadow-soft hover:-rotate-1 hover:bg-[#f37f61]",
        cta.style === "secondary" && "bg-white/80 text-pet-ink shadow-soft backdrop-blur hover:rotate-1 hover:bg-white",
        cta.style === "text" && "px-0 text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 hover:-rotate-1"
      )}
    >
      {cta.icon ? <IconBadge icon={cta.icon} className="size-5 bg-transparent text-current" /> : null}
      <span>{cta.label}</span>
      {external ? <ExternalLink aria-hidden="true" size={18} /> : <ArrowRight aria-hidden="true" size={18} />}
    </Link>
  );
}

/**
 * Renders primary and secondary CMS CTAs with alignment from the page builder.
 */
export function SectionCtaGroup({ group }: CtaGroupProps) {
  if (!group?.primary && !group?.secondary) {
    return null;
  }

  return (
    <div className={joinClassNames("mt-8 flex flex-col gap-3 sm:flex-row", group.alignment === "center" && "justify-center")}>
      <SectionCtaLink cta={group.primary} />
      <SectionCtaLink cta={group.secondary} />
    </div>
  );
}
