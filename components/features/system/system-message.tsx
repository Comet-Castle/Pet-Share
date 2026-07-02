import { AlertTriangle, ArrowLeft, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SanityImage, type SanityImageValue } from "@/components/ui/sanity-image";
import { joinClassNames } from "@/lib/utils/class-names";
import { PageSections } from "../sections/page-sections";
import type { PageSection } from "../sections/section-types";

type SystemMessageVariant = "empty" | "error" | "notFound";

type SystemMessageProps = Readonly<{
  eyebrow?: string;
  title: string;
  message: string;
  supportCopy?: string | null;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  variant?: SystemMessageVariant;
  image?: SanityImageValue;
  sections?: PageSection[] | null;
}>;

const variantIcon = {
  empty: SearchX,
  error: AlertTriangle,
  notFound: SearchX
} satisfies Record<SystemMessageVariant, typeof AlertTriangle>;

/**
 * Renders friendly, non-technical empty, not-found, and error states.
 */
export function SystemMessage({
  eyebrow = "Pet Share notice",
  title,
  message,
  supportCopy,
  primaryHref = "/",
  primaryLabel = "Go home",
  secondaryHref,
  secondaryLabel,
  variant = "empty",
  image,
  sections
}: SystemMessageProps) {
  const Icon = variantIcon[variant];
  const hasImage = Boolean(image?.image?.asset?.url);
  const hasSections = Boolean(sections?.length);

  return (
    <>
      <section className="mx-auto flex min-h-[62vh] w-full max-w-[1440px] items-center px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div
          className={joinClassNames(
            "grid w-full gap-8 rounded-[2rem] bg-white/78 p-6 shadow-soft backdrop-blur sm:p-8 lg:p-10",
            hasImage && "lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,0.85fr)] lg:items-center"
          )}
        >
          <div className={joinClassNames("min-w-0", !hasImage && "mx-auto max-w-4xl text-center")}>
            <div
              className={joinClassNames(
                "flex size-16 items-center justify-center rounded-full bg-pet-coral/16 text-pet-ink",
                !hasImage && "mx-auto"
              )}
            >
              <Icon aria-hidden="true" size={30} />
            </div>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{eyebrow}</p>
            <h1 className="mt-3 text-wrap font-display text-5xl font-bold leading-[1.04] text-pet-ink sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className={joinClassNames("mt-5 text-lg leading-8 text-pet-muted sm:text-xl", !hasImage && "mx-auto max-w-3xl")}>
              {message}
            </p>
            {supportCopy ? (
              <p className={joinClassNames("mt-4 text-sm leading-6 text-pet-muted", !hasImage && "mx-auto max-w-2xl")}>
                {supportCopy}
              </p>
            ) : null}
            <div className={joinClassNames("mt-8 flex flex-col gap-3 sm:flex-row", !hasImage && "justify-center")}>
              <Button href={primaryHref} icon={<Home aria-hidden="true" size={18} />}>
                {primaryLabel}
              </Button>
              {secondaryHref && secondaryLabel ? (
                <Button href={secondaryHref} variant="secondary" icon={<ArrowLeft aria-hidden="true" size={18} />}>
                  {secondaryLabel}
                </Button>
              ) : null}
            </div>
          </div>

          {hasImage ? (
            <SanityImage
              image={image ?? null}
              className="min-h-[22rem] rounded-[2rem] shadow-soft"
              imageClassName="object-cover"
              priority
              sizes="(min-width: 1024px) 38vw, 90vw"
            />
          ) : null}
        </div>
      </section>
      {hasSections ? <PageSections sections={sections} /> : null}
    </>
  );
}
