import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  CirclePlay,
  Quote,
  ShieldAlert,
  Star
} from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import { RichText } from "@/components/ui/portable-text";
import { SanityImage } from "@/components/ui/sanity-image";
import { joinClassNames } from "@/lib/utils/class-names";
import { SectionCtaGroup, SectionCtaLink } from "./section-cta";
import type { CtaGroupValue, PageSection } from "./section-types";

type PageSectionsProps = Readonly<{
  sections: PageSection[] | null | undefined;
  emptyLabel?: string;
}>;

type SectionHeaderValue = Readonly<{
  eyebrow?: string | null;
  headline: string;
  body?: string | null;
  alignment?: "center" | "left" | null;
}> | null;

type SectionByType<Type extends PageSection["_type"]> = Extract<PageSection, { _type: Type }>;

function SectionFrame({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <section className={joinClassNames("mx-auto w-full max-w-[1280px] px-5 py-12 sm:px-8 lg:px-10", className)}>
      {children}
    </section>
  );
}

function SectionHeader({ header }: Readonly<{ header: SectionHeaderValue }>) {
  if (!header) {
    return null;
  }

  return (
    <div className={joinClassNames("mb-8", header.alignment === "center" && "mx-auto max-w-3xl text-center")}>
      {header.eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{header.eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-pet-ink sm:text-4xl">{header.headline}</h2>
      {header.body ? <p className="mt-4 text-lg leading-8 text-pet-muted">{header.body}</p> : null}
    </div>
  );
}

function HeroSection(section: SectionByType<"hero">) {
  return (
    <SectionFrame>
      <div className="grid min-h-[520px] items-center gap-8 rounded-[2rem] bg-white/65 p-6 shadow-soft backdrop-blur sm:p-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          {section.eyebrow ? (
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{section.eyebrow}</p>
          ) : null}
          <h1 className="mt-3 font-display text-5xl font-bold leading-tight text-pet-ink sm:text-6xl">
            {section.headline}
          </h1>
          {section.body ? <p className="mt-6 max-w-2xl text-lg leading-8 text-pet-muted">{section.body}</p> : null}
          <SectionCtaGroup group={section.ctaGroup} />
        </div>
        <SanityImage
          image={section.image}
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
          className="aspect-[4/3] rounded-[1.5rem]"
        />
      </div>
    </SectionFrame>
  );
}

function HeroSlideSection(section: SectionByType<"heroSlide">) {
  return (
    <SectionFrame>
      <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-white/65 p-6 shadow-soft backdrop-blur sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SanityImage image={section.image} sizes="(min-width: 1024px) 42vw, 100vw" className="aspect-[4/3] rounded-[1.5rem]" />
        <div className="self-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Featured story</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">{section.headline}</h2>
          <p className="mt-5 text-lg leading-8 text-pet-muted">{section.body}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-pet-muted">
            {section.featuredPet ? (
              <Link href={`/pets/${section.featuredPet.slug}`} className="rounded-full bg-pet-mint/30 px-4 py-2 text-pet-ink">
                {section.featuredPet.name}
              </Link>
            ) : null}
            {section.featuredOwner ? (
              <Link href={`/owners/${section.featuredOwner.slug}`} className="rounded-full bg-pet-blue/20 px-4 py-2 text-pet-ink">
                {section.featuredOwner.name}
              </Link>
            ) : null}
          </div>
          <div className="mt-8">
            <SectionCtaLink cta={section.cta} />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function ContentSection(section: SectionByType<"contentSection">) {
  const hasMedia = Boolean(section.media);
  const mediaFirst = section.layoutHint === "mediaLeft";

  return (
    <SectionFrame>
      <div
        className={joinClassNames(
          "grid gap-8 rounded-[2rem] bg-white/60 p-6 shadow-soft backdrop-blur sm:p-8",
          hasMedia && "lg:grid-cols-2"
        )}
      >
        {hasMedia && mediaFirst ? (
          <SanityImage image={section.media} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] rounded-[1.5rem]" />
        ) : null}
        <div className="self-center">
          <SectionHeader header={section.header} />
          <RichText value={section.body} />
          <SectionCtaGroup group={section.ctaGroup} />
        </div>
        {hasMedia && !mediaFirst ? (
          <SanityImage image={section.media} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] rounded-[1.5rem]" />
        ) : null}
      </div>
    </SectionFrame>
  );
}

function CalloutBlock(section: SectionByType<"calloutBlock">) {
  return (
    <SectionFrame>
      <div className="rounded-[2rem] bg-pet-mint/30 p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <IconBadge icon={section.icon} className="bg-white/75" />
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{section.tone ?? "callout"}</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">{section.headline}</h2>
            <p className="mt-3 text-lg leading-8 text-pet-muted">{section.body}</p>
            <div className="mt-6">
              <SectionCtaLink cta={section.cta} />
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function AlertBlock(section: SectionByType<"alertBlock">) {
  const toneClass = section.tone === "warning" ? "bg-pet-coral/20" : section.tone === "success" ? "bg-pet-mint/35" : "bg-pet-blue/20";

  return (
    <SectionFrame>
      <div className={joinClassNames("rounded-[2rem] p-6 shadow-soft sm:p-8", toneClass)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <IconBadge icon={section.tone === "warning" ? "warning" : "alert"} className="bg-white/75" />
          <div>
            <h2 className="font-display text-3xl font-bold text-pet-ink">{section.title}</h2>
            <p className="mt-3 text-lg leading-8 text-pet-muted">{section.message}</p>
            <div className="mt-6">
              <SectionCtaLink cta={section.cta} />
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function WarningBlock(section: SectionByType<"warningBlock">) {
  return (
    <SectionFrame>
      <aside className="rounded-[2rem] bg-pet-coral/15 p-6 shadow-soft sm:p-8" aria-label="Warning">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <IconBadge icon={section.icon ?? "warning"} className="bg-white/75" />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">
              {section.severity ? `${section.severity} warning` : "warning"}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">{section.title}</h2>
            <p className="mt-3 text-lg leading-8 text-pet-muted">{section.message}</p>
          </div>
        </div>
      </aside>
    </SectionFrame>
  );
}

function StatBlock(section: SectionByType<"statBlock">) {
  return (
    <SectionFrame className="py-6">
      <div className="rounded-[2rem] bg-white/70 p-6 text-center shadow-soft backdrop-blur sm:p-8">
        <IconBadge icon={section.icon} className="mx-auto" />
        <p className="mt-4 font-display text-5xl font-bold text-pet-ink">{section.value}</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-pet-ink">{section.label}</h2>
        {section.description ? <p className="mx-auto mt-3 max-w-2xl leading-7 text-pet-muted">{section.description}</p> : null}
      </div>
    </SectionFrame>
  );
}

function TestimonialBlock(section: SectionByType<"testimonialBlock">) {
  return (
    <SectionFrame>
      <SectionHeader header={section.header} />
      <div className={joinClassNames("grid gap-5", section.layoutHint === "featured" ? "lg:grid-cols-[1.2fr_0.8fr]" : "md:grid-cols-2 xl:grid-cols-3")}>
        {section.testimonials?.map((testimonial) => (
          <figure key={testimonial._id} className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur">
            <Quote aria-hidden="true" className="text-pet-coral" size={28} />
            <blockquote className="mt-4 text-lg leading-8 text-pet-ink">{testimonial.quote}</blockquote>
            <figcaption className="mt-5">
              <p className="font-display text-xl font-bold text-pet-ink">{testimonial.authorName}</p>
              {testimonial.authorRole ? <p className="text-sm font-bold text-pet-muted">{testimonial.authorRole}</p> : null}
              {testimonial.rating ? (
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-pet-muted">
                  <Star aria-hidden="true" size={16} className="fill-pet-coral text-pet-coral" />
                  {testimonial.rating}/5
                </p>
              ) : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </SectionFrame>
  );
}

function FeatureList(section: SectionByType<"featureList">) {
  return (
    <SectionFrame>
      <SectionHeader header={section.header} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {section.items?.map((item) => (
          <article key={item._key} className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur">
            <IconBadge icon={item.icon} className={section.iconStyle === "outline" ? "bg-white ring-2 ring-pet-mint" : undefined} />
            <h3 className="mt-5 font-display text-2xl font-bold text-pet-ink">{item.title}</h3>
            {item.description ? <p className="mt-3 leading-7 text-pet-muted">{item.description}</p> : null}
            {item.link ? (
              <Link
                href={item.link.type === "externalUrl" ? item.link.url ?? "/" : item.link.path ?? "/"}
                className="mt-5 inline-flex font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              >
                {item.link.label}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

function AccordionSection(section: SectionByType<"accordion">) {
  return (
    <SectionFrame>
      <SectionHeader header={section.header} />
      <div className="space-y-3">
        {section.items?.map((item) => (
          <details key={item._key} className="rounded-[1.5rem] bg-white/70 p-5 shadow-soft backdrop-blur">
            <summary className="cursor-pointer font-display text-xl font-bold text-pet-ink focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2">
              {item.title}
            </summary>
            <div className="mt-4">
              <RichText value={item.body} />
            </div>
          </details>
        ))}
      </div>
    </SectionFrame>
  );
}

function PricingTier(section: SectionByType<"pricingTier">) {
  return (
    <SectionFrame className="py-6">
      <article
        className={joinClassNames(
          "rounded-[2rem] p-6 shadow-soft sm:p-8",
          section.highlighted ? "bg-pet-coral/20 ring-2 ring-pet-coral" : "bg-white/70 backdrop-blur"
        )}
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Pricing</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-pet-ink">{section.name}</h2>
        {section.price ? <p className="mt-4 font-display text-5xl font-bold text-pet-ink">{section.price}</p> : null}
        {section.billingNote ? <p className="mt-2 text-sm font-bold text-pet-muted">{section.billingNote}</p> : null}
        <ul className="mt-6 space-y-3">
          {section.features?.map((feature) => (
            <li key={feature._key} className="flex gap-3 text-pet-muted">
              {feature.included === false ? (
                <AlertTriangle aria-hidden="true" className="mt-1 shrink-0 text-pet-coral" size={18} />
              ) : (
                <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-pet-ink" size={18} />
              )}
              <span>
                <strong className="text-pet-ink">{feature.label}</strong>
                {feature.note ? ` - ${feature.note}` : ""}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <SectionCtaLink cta={section.cta} />
        </div>
      </article>
    </SectionFrame>
  );
}

function PricingComparisonTable(section: SectionByType<"pricingComparisonTable">) {
  const plans = section.plans ?? [];

  return (
    <SectionFrame>
      <SectionHeader header={section.header} />
      <div className="overflow-x-auto rounded-[2rem] bg-white/75 shadow-soft backdrop-blur">
        <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              <th className="w-[34%] p-5 font-display text-xl font-bold text-pet-ink">Feature</th>
              {plans.map((plan) => (
                <th
                  key={plan._key}
                  className={joinClassNames(
                    "p-5 align-top",
                    plan.highlighted && "bg-pet-mint/25"
                  )}
                >
                  <span className="block font-display text-xl font-bold text-pet-ink">{plan.name}</span>
                  {plan.price ? <span className="mt-1 block text-lg font-bold text-pet-coral">{plan.price}</span> : null}
                  {plan.note ? <span className="mt-1 block text-sm font-bold text-pet-muted">{plan.note}</span> : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows?.map((row) => (
              <tr key={row._key} className="border-t border-pet-ink/10">
                <th className="border-t border-pet-ink/10 p-5 align-top">
                  <span className="block font-bold text-pet-ink">{row.feature}</span>
                  {row.description ? <span className="mt-1 block text-sm leading-6 text-pet-muted">{row.description}</span> : null}
                </th>
                {plans.map((plan) => {
                  const value = row.values?.find((item) => item.planKey === plan._key || item.planKey === plan.name);
                  const included = value?.included ?? false;

                  return (
                    <td
                      key={`${row._key}-${plan._key}`}
                      className={joinClassNames(
                        "border-t border-pet-ink/10 p-5 align-top text-sm font-bold text-pet-muted",
                        plan.highlighted && "bg-pet-mint/20"
                      )}
                    >
                      <span className="inline-flex items-start gap-2">
                        {included ? (
                          <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-pet-ink" size={18} />
                        ) : (
                          <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-pet-coral" size={18} />
                        )}
                        <span>{value?.note ?? (included ? "Included" : "Not included")}</span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <SectionCtaLink cta={section.cta} />
      </div>
    </SectionFrame>
  );
}

function ProcessStep(section: SectionByType<"processStep">) {
  return (
    <SectionFrame className="py-6">
      <article className="rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-pet-blue/25 font-display text-2xl font-bold text-pet-ink">
            {section.order ?? <IconBadge icon={section.icon} />}
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-pet-ink">{section.title}</h2>
            <p className="mt-3 text-lg leading-8 text-pet-muted">{section.description}</p>
            <div className="mt-6">
              <SectionCtaLink cta={section.cta} />
            </div>
          </div>
        </div>
      </article>
    </SectionFrame>
  );
}

function getVideoEmbedUrl(section: SectionByType<"videoEmbed">) {
  if (section.provider === "youtube") {
    const match = section.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  }

  if (section.provider === "vimeo") {
    const match = section.url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : null;
  }

  return null;
}

function VideoEmbed(section: SectionByType<"videoEmbed">) {
  const embedUrl = getVideoEmbedUrl(section);

  return (
    <SectionFrame>
      <div className="rounded-[2rem] bg-white/70 p-5 shadow-soft backdrop-blur sm:p-6">
        <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-pet-ink">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={section.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <Link href={section.url} className="flex size-full items-center justify-center text-white">
              <CirclePlay aria-hidden="true" size={54} />
              <span className="sr-only">Open video</span>
            </Link>
          )}
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-pet-ink">{section.title}</h2>
        {section.description ? <p className="mt-2 leading-7 text-pet-muted">{section.description}</p> : null}
      </div>
    </SectionFrame>
  );
}

function CtaGroupSection(section: SectionByType<"ctaGroup">) {
  return (
    <SectionFrame>
      <div className="rounded-[2rem] bg-pet-blue/20 p-6 text-center shadow-soft sm:p-8">
        <p className="font-display text-3xl font-bold text-pet-ink">Ready for short-term questionable judgment?</p>
        <SectionCtaGroup group={section as CtaGroupValue} />
      </div>
    </SectionFrame>
  );
}

function renderSection(section: PageSection) {
  switch (section._type) {
    case "hero":
      return <HeroSection key={section._key} {...section} />;
    case "heroSlide":
      return <HeroSlideSection key={section._key} {...section} />;
    case "contentSection":
      return <ContentSection key={section._key} {...section} />;
    case "calloutBlock":
      return <CalloutBlock key={section._key} {...section} />;
    case "alertBlock":
      return <AlertBlock key={section._key} {...section} />;
    case "warningBlock":
      return <WarningBlock key={section._key} {...section} />;
    case "statBlock":
      return <StatBlock key={section._key} {...section} />;
    case "testimonialBlock":
      return <TestimonialBlock key={section._key} {...section} />;
    case "featureList":
      return <FeatureList key={section._key} {...section} />;
    case "accordion":
      return <AccordionSection key={section._key} {...section} />;
    case "pricingTier":
      return <PricingTier key={section._key} {...section} />;
    case "pricingComparisonTable":
      return <PricingComparisonTable key={section._key} {...section} />;
    case "processStep":
      return <ProcessStep key={section._key} {...section} />;
    case "videoEmbed":
      return <VideoEmbed key={section._key} {...section} />;
    case "ctaGroup":
      return <CtaGroupSection key={section._key} {...section} />;
    default:
      return null;
  }
}

/**
 * Renders Sanity page-builder sections through a typed server component registry.
 */
export function PageSections({ sections, emptyLabel = "This section is still being negotiated by the pets." }: PageSectionsProps) {
  if (!sections?.length) {
    return (
      <SectionFrame>
        <div className="rounded-[2rem] bg-white/65 p-6 text-sm font-bold text-pet-muted shadow-soft backdrop-blur">
          {emptyLabel}
        </div>
      </SectionFrame>
    );
  }

  return <>{sections.map(renderSection)}</>;
}
