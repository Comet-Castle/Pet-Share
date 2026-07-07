import Link from "next/link";
import type { ReactNode } from "react";
import { stegaClean } from "@sanity/client/stega";
import { ArrowRight, ExternalLink } from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import type { CtaGroupValue, CtaLinkValue, CtaValue } from "./section-types";
import { joinClassNames } from "@/lib/utils/class-names";

type CtaLinkProps = Readonly<{
  cta: CtaValue;
  /**
   * Leading icon used when the CTA has no authored `icon`. Lets hero renderers
   * guarantee consistent icon presence across standard-page heroes regardless of
   * which authored CTAs exist. Ignored for the `text` style (inline links).
   */
  defaultIcon?: ReactNode;
}>;

type CtaGroupProps = Readonly<{
  group: CtaGroupValue;
  /** Forwarded to each rendered CTA as its fallback leading icon. */
  defaultIcon?: ReactNode;
}>;

function getHref(link: CtaLinkValue) {
  const linkType = stegaClean(link.type);
  const action = stegaClean(link.action);

  if (linkType === "externalUrl") {
    return link.url ?? "/";
  }

  if (linkType === "action") {
    return action === "openOwnerContactDrawer" ? "#contact-owner" : "#contact";
  }

  return link.path ?? "/";
}

function isExternal(link: CtaLinkValue) {
  return stegaClean(link.type) === "externalUrl" || link.openInNewTab === true;
}

/**
 * Renders one CMS-authored CTA as an accessible link.
 */
export function SectionCtaLink({ cta, defaultIcon }: CtaLinkProps) {
  if (!cta) {
    return null;
  }

  const external = isExternal(cta.link);
  const style = stegaClean(cta.style);
  // Inline text links stay icon-free; buttons fall back to `defaultIcon` when the
  // CTA has no authored icon so hero button icon presence stays consistent.
  const leadingIcon = cta.icon
    ? <IconBadge icon={cta.icon} className="size-5 bg-transparent text-current" />
    : style !== "text"
      ? defaultIcon
      : null;

  return (
    <Link
      href={getHref(cta.link)}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={joinClassNames(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-blue focus-visible:ring-offset-2",
        style === "primary" && "bg-pet-coral text-white shadow-soft hover:-rotate-1 hover:bg-[#f37f61]",
        style === "secondary" && "bg-white/80 text-pet-ink shadow-soft backdrop-blur hover:rotate-1 hover:bg-white",
        style === "text" && "px-0 text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 hover:-rotate-1"
      )}
    >
      {leadingIcon}
      <span>{cta.label}</span>
      {external ? <ExternalLink aria-hidden="true" size={18} /> : <ArrowRight aria-hidden="true" size={18} />}
    </Link>
  );
}

/**
 * Renders primary and secondary CMS CTAs with alignment from the page builder.
 */
export function SectionCtaGroup({ group, defaultIcon }: CtaGroupProps) {
  if (!group?.primary && !group?.secondary) {
    return null;
  }

  const alignment = stegaClean(group.alignment);

  return (
    <div
      className={joinClassNames(
        "mt-8 flex flex-col gap-3 sm:flex-row",
        alignment === "center" && "justify-center",
        alignment === "right" && "justify-end"
      )}
    >
      <SectionCtaLink cta={group.primary} defaultIcon={defaultIcon} />
      <SectionCtaLink cta={group.secondary} defaultIcon={defaultIcon} />
    </div>
  );
}
