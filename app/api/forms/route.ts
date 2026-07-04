import { NextResponse } from "next/server";
import { logger } from "@/lib/diagnostics/logger";
import { sendFormAcknowledgementEmail } from "@/lib/email/mailgun";
import { isHoneypotTripped, validateFormSubmission } from "@/lib/forms/validation";
import { loadFormDefinitionBySlug } from "@/sanity/lib/loaders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "The form payload could not be read." }, { status: 400 });
  }

  if (isHoneypotTripped(formData)) {
    return NextResponse.json({ ok: true, message: "Message sent.", headline: "Message sent" });
  }

  const formSlug = formData.get("formSlug");
  if (typeof formSlug !== "string" || !/^[a-z0-9-]+$/.test(formSlug)) {
    return NextResponse.json({ ok: false, message: "Missing form configuration." }, { status: 400 });
  }

  const definition = await loadFormDefinitionBySlug(formSlug, { preview: false });
  if (!definition) {
    return NextResponse.json({ ok: false, message: "This form is not available right now." }, { status: 404 });
  }

  const validation = validateFormSubmission(definition, formData);
  if (!validation.ok) {
    return NextResponse.json(
      { ok: false, message: "Please fix the highlighted fields.", errors: validation.errors },
      { status: 400 }
    );
  }

  try {
    await sendFormAcknowledgementEmail(validation.submission);
  } catch (error) {
    logger.error("Failed to deliver form acknowledgement email.", {
      formSlug,
      formType: definition.formType,
      error: error instanceof Error ? error.message : "Unknown error"
    });

    return NextResponse.json(
      {
        ok: false,
        message: definition.errorMessage?.message ?? "The pets could not deliver this message. Please try again.",
        headline: definition.errorMessage?.headline ?? "Message not sent"
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: definition.successMessage?.message ?? "Message sent.",
    headline: definition.successMessage?.headline ?? "Message sent"
  });
}
