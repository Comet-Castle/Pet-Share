import { requireServerEnv } from "../../config/env";
import type { ValidatedFormSubmission } from "../forms/validation";
import { formatAcknowledgementHtmlEmail } from "../forms/validation";

type MailgunMessage = Readonly<{
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}>;

type MailgunSendResult = Readonly<{
  status: number;
  body: string;
}>;

function mailgunConfig() {
  return {
    apiKey: requireServerEnv("MAILGUN_API_KEY"),
    domain: requireServerEnv("MAILGUN_DOMAIN"),
    from: requireServerEnv("MAILGUN_FROM_EMAIL"),
    apiBase: process.env.MAILGUN_API_BASE ?? "https://api.mailgun.net",
    ccEmail: process.env.MAILGUN_CC_EMAIL || undefined
  };
}

async function sendMailgunMessage(message: MailgunMessage): Promise<MailgunSendResult> {
  const { apiKey, domain, from, apiBase, ccEmail } = mailgunConfig();
  const body = new FormData();
  body.set("from", from);
  body.set("to", message.to);
  body.set("subject", message.subject);
  body.set("text", message.text);
  if (message.html) body.set("html", message.html);
  if (message.replyTo) body.set("h:Reply-To", message.replyTo);
  if (ccEmail) body.set("cc", ccEmail);

  const response = await fetch(`${apiBase.replace(/\/$/, "")}/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`
    },
    body
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Mailgun delivery failed with status ${response.status}: ${responseText.slice(0, 240)}`);
  }

  return { status: response.status, body: responseText };
}

/**
 * Sends a branded do-not-reply acknowledgement to the person who submitted a form.
 * This is the only email Pet Share sends for a form submission.
 */
export async function sendFormAcknowledgementEmail(submission: ValidatedFormSubmission) {
  if (!submission.replyTo) return null;

  return sendMailgunMessage({
    to: submission.replyTo,
    subject: "We received your Pet Share message",
    text: [
      "Thanks — we received your Pet Share message.",
      "",
      `Form: ${submission.formTitle}`,
      submission.context.currentUrl ? `Sent from: ${submission.context.currentUrl}` : null,
      "",
      "This email was sent on behalf of Pet Share.",
      "This inbox is not monitored — please do not reply to this email.",
      "",
      "Pet Share is a satirical demo site built to showcase Sanity and Next.js.",
      "Want a website built for your business? Visit cometcastle.ca."
    ].filter(Boolean).join("\n"),
    html: formatAcknowledgementHtmlEmail(submission)
  });
}
