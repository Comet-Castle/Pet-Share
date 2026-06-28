import { AlertTriangle, ArrowLeft, Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  variant = "empty"
}: SystemMessageProps) {
  const Icon = variantIcon[variant];

  return (
    <section className="mx-auto flex min-h-[60vh] w-full max-w-[960px] items-center px-5 py-16 sm:px-8 lg:px-10">
      <div className="w-full rounded-[2rem] bg-white/75 p-6 text-center shadow-soft backdrop-blur sm:p-10">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-pet-coral/20 text-pet-ink">
          <Icon aria-hidden="true" size={30} />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{eyebrow}</p>
        <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-pet-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-pet-muted">{message}</p>
        {supportCopy ? (
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-pet-muted">{supportCopy}</p>
        ) : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
    </section>
  );
}
