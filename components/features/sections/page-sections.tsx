import Link from "next/link";
import { stegaClean } from "@sanity/client/stega";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Home,
  ListChecks,
  Megaphone,
  PawPrint,
  Search,
  Star
} from "lucide-react";
import { IconBadge } from "@/components/ui/icon-badge";
import { Reveal } from "@/components/ui/reveal";
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
  alignment?: "center" | "left" | "right" | null;
}> | null;

type SectionByType<Type extends PageSection["_type"]> = Extract<PageSection, { _type: Type }>;

// Fallback leading icon for standard-page hero CTAs that have no authored icon,
// so hero button icon presence stays consistent across marketing pages (warranty,
// contact, pricing, process, …). Authored `cta.icon` values still take priority.
const heroCtaDefaultIcon = <PawPrint aria-hidden="true" size={20} />;

function SectionFrame({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <section className={joinClassNames("mx-auto w-full max-w-[1440px] min-w-0 px-5 py-12 sm:px-8 lg:px-10", className)}>
      {children}
    </section>
  );
}

function SectionHeader({ header, className }: Readonly<{ header: SectionHeaderValue; className?: string }>) {
  if (!header) {
    return null;
  }

  const alignment = stegaClean(header.alignment);

  return (
    <div
      className={joinClassNames(
        "mb-8",
        alignment === "center" && "mx-auto max-w-3xl text-center",
        alignment === "right" && "ml-auto max-w-3xl text-right",
        className
      )}
    >
      {header.eyebrow ? (
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{header.eyebrow}</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-pet-ink sm:text-4xl">{header.headline}</h2>
      {header.body ? <p className="mt-4 text-lg leading-8 text-pet-muted">{header.body}</p> : null}
    </div>
  );
}

function HeroSection(section: SectionByType<"hero">) {
  if (stegaClean(section.layoutHint) === "centered") {
    return (
      <SectionFrame className="pb-8 pt-10 lg:pb-10 lg:pt-16">
        <div className="mx-auto max-w-5xl text-center">
          {section.eyebrow ? (
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{section.eyebrow}</p>
          ) : null}
          <h1 className="text-wrap font-display text-5xl font-bold leading-[1.02] text-pet-ink sm:text-6xl lg:text-7xl">
            {section.headline}
          </h1>
          {section.body ? <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-pet-muted sm:text-xl">{section.body}</p> : null}
          <SectionCtaGroup group={section.ctaGroup} defaultIcon={heroCtaDefaultIcon} />
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame>
      <div className="grid min-h-[520px] min-w-0 items-center gap-8 rounded-[2rem] bg-white/65 p-6 shadow-soft backdrop-blur sm:p-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="min-w-0">
          {section.eyebrow ? (
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{section.eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-wrap font-display text-4xl font-bold leading-tight text-pet-ink sm:text-6xl">
            {section.headline}
          </h1>
          {section.body ? <p className="mt-6 max-w-2xl text-lg leading-8 text-pet-muted">{section.body}</p> : null}
          <SectionCtaGroup group={section.ctaGroup} defaultIcon={heroCtaDefaultIcon} />
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
      <div className="grid min-w-0 gap-8 overflow-hidden rounded-[2rem] bg-white/65 p-6 shadow-soft backdrop-blur sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SanityImage image={section.image} sizes="(min-width: 1024px) 42vw, 100vw" className="aspect-[4/3] rounded-[1.5rem]" />
        <div className="min-w-0 self-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">Featured story</p>
          <h2 className="mt-3 text-wrap font-display text-3xl font-bold leading-tight text-pet-ink sm:text-5xl">{section.headline}</h2>
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
            <SectionCtaLink cta={section.cta} defaultIcon={heroCtaDefaultIcon} />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}

function ContentSection(section: SectionByType<"contentSection">) {
  const hasMedia = Boolean(section.media);
  const mediaFirst = stegaClean(section.layoutHint) === "mediaLeft";

  return (
    <SectionFrame>
      <div
        className={joinClassNames(
          "grid min-w-0 gap-8 rounded-[2rem] bg-white/60 p-6 shadow-soft backdrop-blur sm:p-8",
          hasMedia && "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
        )}
      >
        {hasMedia && mediaFirst ? (
          <SanityImage image={section.media} sizes="(min-width: 1024px) 45vw, 100vw" className="aspect-[4/3] rounded-[1.5rem]" />
        ) : null}
        <div className="min-w-0 self-center">
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
          <div className="min-w-0 max-w-3xl">
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

function FeatureList(section: SectionByType<"featureList">) {
  const iconStyle = stegaClean(section.iconStyle);

  return (
    <SectionFrame>
      <SectionHeader header={section.header} />
      <div className="grid min-w-0 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {section.items?.map((item) => (
          <article key={item._key} className="min-w-0 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur">
            <IconBadge icon={item.icon} className={iconStyle === "outline" ? "bg-white ring-2 ring-pet-mint" : undefined} />
            <h3 className="mt-5 font-display text-2xl font-bold text-pet-ink">{item.title}</h3>
            {item.description ? <p className="mt-3 leading-7 text-pet-muted">{item.description}</p> : null}
            {item.link ? (
              <Link
                href={stegaClean(item.link.type) === "externalUrl" ? item.link.url ?? "/" : item.link.path ?? "/"}
                className="mt-5 inline-flex font-bold text-pet-ink underline decoration-pet-coral decoration-2 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
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
            <summary className="cursor-pointer font-display text-xl font-bold text-pet-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2">
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

const pricingToneClasses = {
  coral: "bg-pet-coral/14 text-pet-coral",
  mint: "bg-pet-mint/35 text-pet-ink",
  blue: "bg-pet-blue/25 text-pet-ink",
  cream: "bg-pet-cream text-pet-ink"
} as const;

function PricingValueSection(section: SectionByType<"pricingValueSection">) {
  return (
    <SectionFrame className="pb-16 pt-0 lg:pb-20">
      {section.valueItems?.length ? (
        <div className="grid gap-5 rounded-[2rem] bg-white/72 p-5 shadow-soft backdrop-blur sm:grid-cols-3 sm:p-7">
          {section.valueItems.map((item) => (
            <article key={item._key} className="flex min-w-0 gap-4 rounded-[1.5rem] bg-white/70 p-5">
              <IconBadge icon={item.icon} className="size-12 bg-pet-coral/12 text-pet-coral" />
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold leading-tight text-pet-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-pet-muted">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </SectionFrame>
  );
}

function PricingPackageGrid(section: SectionByType<"pricingPackageGrid">) {
  return (
    <SectionFrame className="pb-20">
      <div className="mb-9 flex flex-col gap-4 text-center sm:items-center">
        <SectionHeader header={section.header} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {section.packages?.map((plan) => (
          // Clean tone before class lookup because stega strings include invisible source-map markers in Presentation.
          <article
            key={plan._key}
            className={joinClassNames(
              "relative grid min-w-0 gap-5 rounded-[2rem] bg-white/86 p-6 shadow-soft backdrop-blur transition duration-200 hover:-translate-y-1 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-7",
              plan.highlighted && "ring-2 ring-pet-coral/45"
            )}
          >
            {plan.badge ? (
              <span className="absolute right-5 top-5 rounded-full bg-pet-coral px-3 py-1 text-xs font-bold text-white">
                {plan.badge}
              </span>
            ) : null}
            <IconBadge
              icon={plan.icon}
              className={joinClassNames(
                "size-16",
                pricingToneClasses[(stegaClean(plan.tone) || "mint") as keyof typeof pricingToneClasses]
              )}
            />
            <div className="min-w-0 pr-0 sm:pr-24">
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <h3 className="font-display text-2xl font-bold leading-tight text-pet-ink">{plan.name}</h3>
                <p className="font-display text-3xl font-bold leading-none text-pet-ink">{plan.price}</p>
                <p className="pb-1 text-sm font-bold text-pet-muted">{plan.duration}</p>
              </div>
              <p className="mt-3 max-w-2xl text-base leading-7 text-pet-muted">{plan.description}</p>
              <ul className="mt-5 grid gap-3 text-sm font-bold text-pet-ink sm:grid-cols-2">
                {plan.features?.map((feature) => (
                  <li key={feature._key} className="flex min-w-0 items-start gap-2">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-pet-coral" size={17} strokeWidth={3} />
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </SectionFrame>
  );
}

function PricingCtaBand(section: SectionByType<"pricingCtaBand">) {
  return (
    <SectionFrame className="pb-4 pt-0">
      <div className="grid gap-8 rounded-[2rem] bg-pet-coral/14 p-6 shadow-soft sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-12">
        <div className="min-w-0">
          <IconBadge icon={section.icon ?? "Megaphone"} className="mb-5 size-16 bg-white text-pet-coral shadow-sm" />
          <h2 className="font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">{section.headline}</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-pet-muted">{section.body}</p>
          <SectionCtaGroup group={section.ctaGroup} />
        </div>
        {section.proofItems?.length ? (
          <div className="grid min-w-0 gap-4 sm:grid-cols-3 lg:w-[28rem]">
            {section.proofItems.map((item) => (
              <div
                key={item._key}
                className="flex min-h-36 flex-col items-center justify-center rounded-[1.5rem] bg-white/80 p-5 text-center shadow-sm"
              >
                <IconBadge icon={item.icon} className="size-12 bg-transparent text-pet-coral" />
                <p className="mt-3 text-sm font-bold leading-5 text-pet-ink">{item.label}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </SectionFrame>
  );
}

const warrantyToneClasses = {
  covered: {
    shell: "bg-pet-mint/28",
    icon: "bg-white/80 text-pet-ink",
    label: "text-pet-ink"
  },
  excluded: {
    shell: "bg-pet-coral/14",
    icon: "bg-white/85 text-pet-coral",
    label: "text-pet-coral"
  },
  evidence: {
    shell: "bg-pet-blue/22",
    icon: "bg-white/85 text-pet-ink",
    label: "text-pet-ink"
  }
} as const;

function WarrantyConditionGrid(section: SectionByType<"warrantyConditionGrid">) {
  return (
    <SectionFrame className="pb-16 pt-4">
      <SectionHeader header={section.header} />
      <div className="grid gap-5 lg:grid-cols-3">
        {section.items?.map((item) => {
          const tone = warrantyToneClasses[(stegaClean(item.tone) || "covered") as keyof typeof warrantyToneClasses];

          return (
            <article
              key={item._key}
              className={joinClassNames("min-w-0 rounded-[2rem] p-6 shadow-soft transition duration-200 hover:-translate-y-1 sm:p-7", tone.shell)}
            >
              <IconBadge icon={item.icon} className={joinClassNames("mb-7 size-16 shadow-sm", tone.icon)} />
              <h2 className={joinClassNames("font-display text-2xl font-bold leading-tight", tone.label)}>{item.title}</h2>
              <p className="mt-4 text-base leading-7 text-pet-muted">{item.body}</p>
            </article>
          );
        })}
      </div>
    </SectionFrame>
  );
}

function WarrantyNoticeSection(section: SectionByType<"warrantyNoticeSection">) {
  return (
    <SectionFrame className="py-14">
      <section id={section.anchorId ?? undefined} className="rounded-[2rem] bg-white/78 p-6 shadow-soft backdrop-blur sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <SectionHeader header={section.header} className="mb-0 lg:max-w-4xl" />
          {section.badgeLabel ? (
            <span className="w-fit rounded-full bg-pet-cream px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-pet-muted">
              {section.badgeLabel}
            </span>
          ) : null}
        </div>
        <div className="mt-8 rounded-[1.5rem] bg-pet-cream/65 p-5 sm:p-7">
          <RichText value={section.body} />
        </div>
      </section>
    </SectionFrame>
  );
}

function WarrantyClaimPrep(section: SectionByType<"warrantyClaimPrep">) {
  return (
    <SectionFrame className="pb-10 pt-8">
      <section
        id={section.anchorId ?? undefined}
        className="grid gap-8 rounded-[2rem] bg-pet-coral/12 p-6 shadow-soft sm:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:p-10"
      >
        <div className="min-w-0">
          <SectionHeader header={section.header} className="mb-0" />
          <SectionCtaGroup group={section.ctaGroup} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {section.items?.map((item) => (
            <article key={item._key} className="min-w-0 rounded-[1.5rem] bg-white/78 p-5 shadow-sm">
              <IconBadge icon={item.icon} className="mb-4 size-12 bg-pet-cream text-pet-ink" />
              <h3 className="font-display text-xl font-bold leading-tight text-pet-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-pet-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </SectionFrame>
  );
}

function ProcessPathSection(section: SectionByType<"processPathSection">) {
  const tone = stegaClean(section.tone);
  const toneClass = tone === "owner" ? "bg-pet-mint/25" : tone === "host" ? "bg-pet-blue/20" : "bg-white/70";
  const HeaderIcon = tone === "owner" ? Home : tone === "host" ? Search : ListChecks;
  const header = section.header ?? {
    headline: section.title ?? "Process path",
    body: section.body ?? null,
    alignment: "left" as const
  };

  return (
    <SectionFrame>
      <section className={joinClassNames("rounded-[2rem] p-6 shadow-soft sm:p-8", toneClass)}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <SectionHeader header={header} className="mb-0" />
          </div>
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/85 text-pet-ink shadow-sm">
            {section.icon ? <IconBadge icon={section.icon} className="size-14 bg-transparent" /> : <HeaderIcon aria-hidden="true" size={28} />}
          </span>
        </div>

        <ol className="grid min-w-0 gap-5 lg:grid-cols-4">
          {section.steps?.map((step, index) => (
            <li key={step._key} className="min-w-0 rounded-[1.5rem] bg-white/82 p-5 shadow-sm backdrop-blur">
              <div className="mb-5 flex items-center justify-between gap-4">
                <IconBadge icon={step.icon} className="bg-pet-cream text-pet-ink" />
                <span className="font-display text-3xl font-bold text-pet-coral/45">{index + 1}</span>
              </div>
              <h3 className="font-display text-xl font-bold leading-tight text-pet-ink">{step.title}</h3>
              <div className="mt-3 text-sm">
                {step.body?.length ? <RichText value={step.body} /> : <p className="leading-6 text-pet-muted">{step.description}</p>}
              </div>
              <div className="mt-5">
                <SectionCtaLink cta={step.cta} />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8">
          <SectionCtaLink cta={section.cta} />
        </div>
      </section>
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
    case "statBlock":
      return <StatBlock key={section._key} {...section} />;
    case "featureList":
      return <FeatureList key={section._key} {...section} />;
    case "accordion":
      return <AccordionSection key={section._key} {...section} />;
    case "pricingComparisonTable":
      return <PricingComparisonTable key={section._key} {...section} />;
    case "pricingValueSection":
      return <PricingValueSection key={section._key} {...section} />;
    case "pricingPackageGrid":
      return <PricingPackageGrid key={section._key} {...section} />;
    case "pricingCtaBand":
      return <PricingCtaBand key={section._key} {...section} />;
    case "processPathSection":
      return <ProcessPathSection key={section._key} {...section} />;
    case "warrantyConditionGrid":
      return <WarrantyConditionGrid key={section._key} {...section} />;
    case "warrantyNoticeSection":
      return <WarrantyNoticeSection key={section._key} {...section} />;
    case "warrantyClaimPrep":
      return <WarrantyClaimPrep key={section._key} {...section} />;
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

  return (
    <>
      {sections.map((section, index) =>
        // The first section is above the fold, so it renders without an entry
        // transition; later sections fade/slide up as they scroll into view.
        index === 0 ? (
          renderSection(section)
        ) : (
          <Reveal key={section._key}>{renderSection(section)}</Reveal>
        )
      )}
    </>
  );
}
