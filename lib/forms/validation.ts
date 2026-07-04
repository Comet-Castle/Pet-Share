import { publicEnv } from "../../config/env";

export type FormFieldDefinition = Readonly<{
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox";
  required: boolean;
  options?: ReadonlyArray<Readonly<{ value: string; label: string }>> | null;
}>;

export type FormDefinitionLike = Readonly<{
  slug: string;
  title: string;
  formType: string;
  fields?: ReadonlyArray<FormFieldDefinition> | null;
}>;

export type ValidatedFormSubmission = Readonly<{
  formSlug: string;
  formTitle: string;
  formType: string;
  values: Record<string, string>;
  context: Record<string, string>;
  replyTo?: string;
}>;

export type FormValidationResult =
  | Readonly<{ ok: true; submission: ValidatedFormSubmission }>
  | Readonly<{ ok: false; errors: Record<string, string> }>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contextKeys = ["petId", "petName", "ownerId", "ownerName", "currentUrl"] as const;
const honeypotFieldName = "company";

function valueFromFormData(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function maxLengthForType(type: FormFieldDefinition["type"]) {
  return type === "textarea" ? 2000 : 240;
}

/**
 * Returns true when the hidden anti-spam honeypot field has been filled.
 */
export function isHoneypotTripped(formData: FormData) {
  return valueFromFormData(formData, honeypotFieldName).length > 0;
}

/**
 * Validates a submitted CMS form against its Sanity field definition.
 */
export function validateFormSubmission(definition: FormDefinitionLike, formData: FormData): FormValidationResult {
  const errors: Record<string, string> = {};
  const values: Record<string, string> = {};
  const fields = definition.fields ?? [];

  for (const field of fields) {
    const rawValue = valueFromFormData(formData, field.name);
    const label = field.label || field.name;

    if (field.required && !rawValue) {
      errors[field.name] = `${label} is required.`;
      continue;
    }

    if (!rawValue) {
      values[field.name] = "";
      continue;
    }

    if (rawValue.length > maxLengthForType(field.type)) {
      errors[field.name] = `${label} is too long.`;
      continue;
    }

    if (field.type === "email" && !emailPattern.test(rawValue)) {
      errors[field.name] = "Enter a valid email address.";
      continue;
    }

    if (field.type === "select") {
      const allowedValues = new Set((field.options ?? []).map((option) => option.value));
      if (allowedValues.size > 0 && !allowedValues.has(rawValue)) {
        errors[field.name] = `Choose a valid ${label.toLowerCase()}.`;
        continue;
      }
    }

    values[field.name] = rawValue;
  }

  const context: Record<string, string> = {};
  for (const key of contextKeys) {
    const value = valueFromFormData(formData, key);
    if (value) context[key] = value.slice(0, 500);
  }

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  const replyToField = fields.find((field) => field.type === "email");
  const replyTo = replyToField ? values[replyToField.name] : undefined;

  return {
    ok: true,
    submission: {
      formSlug: definition.slug,
      formTitle: definition.title,
      formType: definition.formType,
      values,
      context,
      replyTo
    }
  };
}

const emailBrandName = "Pet Share";
const cometCastleUrl = "https://cometcastle.ca";

function petShareTileBackgroundUrl() {
  return `${publicEnv.siteUrl}/email/pattern-tile.png`;
}

function petShareEmailLogo() {
  const logoUrl = `${publicEnv.siteUrl}/email/logo-badge.png`;
  return `<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto;"><tr><td style="vertical-align:middle;padding-right:10px;"><img src="${logoUrl}" width="40" height="40" alt="" style="display:block;border:0;border-radius:50%;" /></td><td style="vertical-align:middle;font-family:'Quicksand','Trebuchet MS',Arial,sans-serif;font-size:27px;line-height:1;font-weight:800;color:#263238;letter-spacing:-0.02em;">Pet Share</td></tr></table>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Formats the user-facing thank-you acknowledgement email sent to the person
 * who submitted a form. This is intentionally do-not-reply copy.
 */
export function formatAcknowledgementHtmlEmail(submission: ValidatedFormSubmission) {
  const sentFrom = submission.context.currentUrl ?? "Pet Share website";
  const petName = submission.context.petName;
  const contextLine = petName
    ? `Your message about ${escapeHtml(petName)} has reached the Pet Share team.`
    : "Your message has reached the Pet Share team.";

  const patternUrl = petShareTileBackgroundUrl();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@700;800&family=Nunito+Sans:wght@400;700&display=swap" />
  </head>
  <body style="margin:0;background:#ffffff;font-family:'Nunito Sans','Trebuchet MS',Arial,sans-serif;color:#263238;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Thanks — we received your Pet Share message.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" background="${patternUrl}" style="background-color:#ffffff;background-image:url('${patternUrl}');background-repeat:repeat;background-size:320px 320px;padding:34px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;">
            <tr><td align="center" style="padding:0 0 20px;">${petShareEmailLogo()}</td></tr>
            <tr>
              <td style="background:#fff8ef;border-radius:28px;padding:32px 30px;box-shadow:0 24px 80px rgba(38,50,56,0.12);">
                <p style="margin:0 0 8px;color:#ff8f70;font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;">Message received</p>
                <h1 style="margin:0;color:#263238;font-family:'Quicksand','Trebuchet MS',Arial,sans-serif;font-size:31px;line-height:1.12;font-weight:800;">Thanks — we got it.</h1>
                <p style="margin:16px 0 0;color:#5f6f73;font-size:16px;line-height:1.65;">${contextLine}</p>
                <p style="margin:14px 0 0;color:#5f6f73;font-size:16px;line-height:1.65;">It came in through <strong style="color:#263238;">${escapeHtml(submission.formTitle)}</strong> from <strong style="color:#263238;">${escapeHtml(sentFrom)}</strong>. We'll get back to you shortly.</p>

                <p style="margin:26px 0 0;color:#5f6f73;font-size:13px;line-height:1.6;">This is an automated message — no need to reply. If we need more details, the Pet Share team will follow up separately.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px 12px 0;">
                <p style="margin:0;max-width:480px;color:#93a1a4;font-size:12px;line-height:1.6;text-align:center;">
                  This email was sent on behalf of ${escapeHtml(emailBrandName)}.<br />
                  This inbox is not monitored — please do not reply to this email.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:10px 12px 0;">
                <p style="margin:0;max-width:480px;color:#93a1a4;font-size:12px;line-height:1.6;text-align:center;">
                  ${escapeHtml(emailBrandName)} is a satirical demo site built to showcase Sanity and Next.js. Want a website built for your business? <a href="${cometCastleUrl}" style="color:#93a1a4;text-decoration:underline;">Visit cometcastle.ca</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
