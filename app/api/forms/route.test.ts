import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendFormAcknowledgementEmail } from "@/lib/email/mailgun";
import type { FORM_DEFINITION_BY_SLUG_QUERY_RESULT } from "@/sanity.types";
import { loadFormDefinitionBySlug } from "@/sanity/lib/loaders";
import { POST } from "./route";

vi.mock("@/lib/diagnostics/logger", () => ({
  logger: { error: vi.fn() }
}));

vi.mock("@/lib/email/mailgun", () => ({
  sendFormAcknowledgementEmail: vi.fn()
}));

vi.mock("@/sanity/lib/loaders", () => ({
  loadFormDefinitionBySlug: vi.fn()
}));

const formDefinition: NonNullable<FORM_DEFINITION_BY_SLUG_QUERY_RESULT> = {
  _id: "form-contact",
  title: "Contact Pet Share",
  slug: "contact",
  description: "Send a message.",
  formType: "contact",
  submitLabel: "Send message",
  successMessage: {
    headline: "Message sent",
    message: "Your message made it through.",
    cta: null
  },
  errorMessage: {
    headline: "Message not sent",
    message: "Please try again.",
    cta: null
  },
  fields: [
    { _key: "name", label: "Name", name: "name", type: "text" as const, required: true, helpText: null, options: [] },
    { _key: "email", label: "Email", name: "email", type: "email" as const, required: true, helpText: null, options: [] },
    { _key: "message", label: "Message", name: "message", type: "textarea" as const, required: true, helpText: null, options: [] }
  ]
};

function requestWithFormData(formData: FormData) {
  return new Request("http://localhost/api/forms", {
    method: "POST",
    body: formData
  });
}

describe("POST /api/forms", () => {
  beforeEach(() => {
    vi.mocked(loadFormDefinitionBySlug).mockReset();
    vi.mocked(sendFormAcknowledgementEmail).mockReset();
  });

  it("silently accepts honeypot submissions without loading or sending", async () => {
    const formData = new FormData();
    formData.set("company", "spam bots incorporated");

    const response = await POST(requestWithFormData(formData));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(loadFormDefinitionBySlug).not.toHaveBeenCalled();
    expect(sendFormAcknowledgementEmail).not.toHaveBeenCalled();
  });

  it("returns validation errors without sending email", async () => {
    vi.mocked(loadFormDefinitionBySlug).mockResolvedValue(formDefinition);
    const formData = new FormData();
    formData.set("formSlug", "contact");
    formData.set("email", "not-an-email");

    const response = await POST(requestWithFormData(formData));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.errors.name).toBe("Name is required.");
    expect(payload.errors.email).toBe("Enter a valid email address.");
    expect(sendFormAcknowledgementEmail).not.toHaveBeenCalled();
  });

  it("sends the thank-you acknowledgement for valid submissions with context", async () => {
    vi.mocked(loadFormDefinitionBySlug).mockResolvedValue(formDefinition);
    vi.mocked(sendFormAcknowledgementEmail).mockResolvedValue({ status: 200, body: "Queued. Thank you." });
    const formData = new FormData();
    formData.set("formSlug", "contact");
    formData.set("name", "Dana");
    formData.set("email", "dana@example.com");
    formData.set("message", "Can I borrow Pip?");
    formData.set("petName", "Pip");

    const response = await POST(requestWithFormData(formData));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(sendFormAcknowledgementEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        formSlug: "contact",
        replyTo: "dana@example.com",
        context: expect.objectContaining({ petName: "Pip" })
      })
    );
  });

  it("returns Sanity-authored delivery error copy when Mailgun fails", async () => {
    vi.mocked(loadFormDefinitionBySlug).mockResolvedValue(formDefinition);
    vi.mocked(sendFormAcknowledgementEmail).mockRejectedValue(new Error("Mailgun down"));
    const formData = new FormData();
    formData.set("formSlug", "contact");
    formData.set("name", "Dana");
    formData.set("email", "dana@example.com");
    formData.set("message", "Can I borrow Pip?");

    const response = await POST(requestWithFormData(formData));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.ok).toBe(false);
    expect(payload.headline).toBe("Message not sent");
    expect(payload.message).toBe("Please try again.");
  });
});
