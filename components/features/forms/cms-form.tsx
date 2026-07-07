"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { FORM_DEFINITION_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { joinClassNames } from "@/lib/utils/class-names";
import { SelectField } from "@/components/ui/select-field";

type FormDefinition = NonNullable<FORM_DEFINITION_BY_SLUG_QUERY_RESULT>;

type CmsFormProps = Readonly<{
  form: FormDefinition;
  eyebrow?: string;
  context?: Record<string, string | null | undefined>;
  variant?: "default" | "compact";
}>;

type SubmitState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "submitting" }>
  | Readonly<{ status: "success"; headline: string; message: string }>
  | Readonly<{ status: "error"; message: string; errors?: Record<string, string> }>;

/**
 * Drives the animated form → success swap:
 * - `form`: the form is interactive.
 * - `exiting`: submission succeeded; the form plays a small grow-then-collapse
 *   while reserving its space, before the success card mounts.
 * - `success`: the success card is mounted (with role="status" for announcement).
 * Reduced-motion users skip `exiting` entirely and jump straight to `success`.
 */
type SuccessPhase = "form" | "exiting" | "success";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

const inputClass = "min-h-12 w-full min-w-0 rounded-2xl border-0 bg-white/85 px-4 text-base font-normal text-pet-ink shadow-inner outline-none ring-1 ring-pet-blue/20 transition focus-visible:ring-2 focus-visible:ring-pet-coral";

/**
 * Renders a Sanity-authored form and posts it to the server-only form endpoint.
 */
export function CmsForm({ form, eyebrow, context, variant = "default" }: CmsFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });
  const [successPhase, setSuccessPhase] = useState<SuccessPhase>("form");
  const errors = submitState.status === "error" ? submitState.errors ?? {} : {};

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    formData.set("formSlug", form.slug);

    for (const [key, value] of Object.entries(context ?? {})) {
      if (value) formData.set(key, value);
    }

    setSubmitState({ status: "submitting" });

    try {
      const response = await fetch("/api/forms", { method: "POST", body: formData });
      const payload = await response.json() as { ok?: boolean; headline?: string; message?: string; errors?: Record<string, string> };

      if (!response.ok || !payload.ok) {
        setSubmitState({ status: "error", message: payload.message ?? "Please try again.", errors: payload.errors });
        return;
      }

      formElement.reset();
      setSubmitState({
        status: "success",
        headline: payload.headline ?? form.successMessage?.headline ?? "Message sent",
        message: payload.message ?? form.successMessage?.message ?? "Your message was sent."
      });
      // Reduced-motion users jump straight to the success card; everyone else sees
      // the form grow-then-collapse first (onAnimationEnd advances to "success").
      setSuccessPhase(prefersReducedMotion() ? "success" : "exiting");
    } catch {
      setSubmitState({ status: "error", message: "The pets could not deliver this message. Please try again." });
    }
  }

  return (
    <div
      className={joinClassNames(
        "grid min-w-0 overflow-hidden rounded-[2rem] bg-white/70 shadow-soft backdrop-blur",
        variant === "compact"
          ? "gap-5 p-4 sm:p-5"
          : "gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-[0.18em] text-pet-muted">{eyebrow}</p> : null}
        <h2 className={joinClassNames("mt-3 font-display font-bold leading-tight text-pet-ink", variant === "compact" ? "text-2xl" : "text-3xl sm:text-4xl")}>{form.title}</h2>
        {form.description ? <p className={joinClassNames("mt-4 text-pet-muted", variant === "compact" ? "text-sm leading-6" : "text-lg leading-8")}>{form.description}</p> : null}
      </div>

      {submitState.status === "success" && successPhase === "success" ? (
        <div
          className="min-w-0 rounded-[1.5rem] bg-pet-mint/25 p-6 shadow-sm motion-safe:animate-[form-success-enter_360ms_ease-out]"
          role="status"
        >
          <h3 className="font-display text-2xl font-bold text-pet-ink">{submitState.headline}</h3>
          <p className="mt-2 leading-7 text-pet-muted">{submitState.message}</p>
          {form.successMessage?.cta?.link ? (
            <Link
              href={form.successMessage.cta.link.path ?? form.successMessage.cta.link.url ?? "/"}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-white/85 px-5 py-2.5 text-sm font-bold text-pet-ink shadow-sm transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
            >
              {form.successMessage.cta.label}
            </Link>
          ) : null}
        </div>
      ) : (
        // During "exiting" the form plays a grow-then-collapse (reserving its
        // space) before onAnimationEnd swaps in the success card. `pointer-events-none`
        // + tabIndex removal keep it inert while it animates out.
        <div
          className={joinClassNames(
            "min-w-0",
            successPhase === "exiting" && "pointer-events-none overflow-hidden motion-safe:animate-[form-grow-collapse_620ms_ease-in-out_forwards]"
          )}
          onAnimationEnd={() => {
            if (successPhase === "exiting") {
              setSuccessPhase("success");
            }
          }}
          aria-hidden={successPhase === "exiting"}
        >
        <form className="grid min-w-0 gap-4" onSubmit={handleSubmit} aria-label={form.title} noValidate>
          <label className="sr-only" aria-hidden="true">
            Company
            <input
              autoComplete="off"
              className="hidden"
              name="company"
              tabIndex={-1}
              type="text"
            />
          </label>
          {form.fields?.map((field) => {
            const error = errors[field.name];
            const describedBy = [field.helpText ? `${field._key}-help` : null, error ? `${field._key}-error` : null].filter(Boolean).join(" ") || undefined;

            return (
              <label key={field._key} className="grid min-w-0 gap-2 text-sm font-bold text-pet-ink">
                {field.label}
                {field.type === "textarea" ? (
                  <textarea
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(error)}
                    className={joinClassNames(inputClass, "min-h-36 py-3 leading-7")}
                    name={field.name}
                    required={field.required}
                  />
                ) : field.type === "select" ? (
                  <SelectField
                    describedBy={describedBy}
                    invalid={Boolean(error)}
                    name={field.name}
                    required={field.required}
                    options={field.options?.map((option) => ({ label: option.label, value: option.value })) ?? []}
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(error)}
                    className="size-5 rounded border-0 text-pet-coral shadow-sm ring-1 ring-pet-blue/20 focus-visible:ring-2 focus-visible:ring-pet-coral"
                    name={field.name}
                    required={field.required}
                    type="checkbox"
                    value="yes"
                  />
                ) : (
                  <input
                    aria-describedby={describedBy}
                    aria-invalid={Boolean(error)}
                    className={inputClass}
                    name={field.name}
                    required={field.required}
                    type={field.type}
                  />
                )}
                {field.helpText ? <span id={`${field._key}-help`} className="min-w-0 text-xs font-bold leading-5 text-pet-muted">{field.helpText}</span> : null}
                {error ? <span id={`${field._key}-error`} className="min-w-0 text-xs font-bold leading-5 text-pet-coral">{error}</span> : null}
              </label>
            );
          })}

          {submitState.status === "error" ? (
            <p className="rounded-2xl bg-pet-coral/12 px-4 py-3 text-sm font-bold text-pet-coral" role="alert">
              {submitState.message}
            </p>
          ) : null}

          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-pet-coral px-6 py-3 text-center font-bold text-white shadow-soft transition hover:-rotate-1 hover:bg-[#f37f61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-blue focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            disabled={submitState.status === "submitting"}
            type="submit"
          >
            {submitState.status === "submitting" ? "Sending..." : form.submitLabel}
          </button>
        </form>
        </div>
      )}
    </div>
  );
}
