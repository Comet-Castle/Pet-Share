import { Layers3 } from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

type SectionLike = Readonly<{
  _key?: string;
  _type?: string;
  headline?: string | null;
  title?: string | null;
  header?: {
    headline?: string | null;
    eyebrow?: string | null;
    body?: string | null;
  } | null;
  body?: unknown;
  message?: string | null;
  description?: string | null;
}>;

type SectionPlaceholdersProps = Readonly<{
  sections: SectionLike[] | null | undefined;
  emptyLabel?: string;
}>;

function getSectionTitle(section: SectionLike) {
  return section.headline ?? section.title ?? section.header?.headline ?? section._type ?? "CMS section";
}

function getStringValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function getSectionSummary(section: SectionLike) {
  return getStringValue(section.body) ?? section.message ?? section.description ?? section.header?.body;
}

/**
 * Renders CMS section placeholders until final section renderers are implemented.
 */
export function SectionPlaceholders({
  sections,
  emptyLabel = "CMS sections will appear here after content is seeded."
}: SectionPlaceholdersProps) {
  if (!sections?.length) {
    return (
      <div className="rounded-[2rem] bg-white/65 p-6 text-sm font-bold text-pet-muted shadow-soft backdrop-blur">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((section, index) => (
        <article
          key={section._key ?? `${section._type}-${index}`}
          className={joinClassNames(
            "rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur",
            index === 0 && "md:col-span-2"
          )}
        >
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-pet-mint/45 text-pet-ink">
              <Layers3 aria-hidden="true" size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-pet-muted">
                {section._type ?? "section"}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-pet-ink">{getSectionTitle(section)}</h2>
              {getSectionSummary(section) ? (
                <p className="mt-3 text-sm leading-6 text-pet-muted">{getSectionSummary(section)}</p>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
