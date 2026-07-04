import { describe, expect, it } from "vitest";
import { isHoneypotTripped, validateFormSubmission } from "./validation";

const form = {
  slug: "contact",
  title: "Contact",
  formType: "contact",
  fields: [
    { name: "name", label: "Name", type: "text" as const, required: true },
    { name: "email", label: "Email", type: "email" as const, required: true },
    { name: "topic", label: "Topic", type: "select" as const, required: true, options: [{ label: "Pets", value: "pets" }] },
    { name: "message", label: "Message", type: "textarea" as const, required: true }
  ]
};

describe("validateFormSubmission", () => {
  it("detects the hidden honeypot field", () => {
    const formData = new FormData();
    formData.set("company", "spam bots incorporated");

    expect(isHoneypotTripped(formData)).toBe(true);
  });
  it("validates required fields, email, and select options", () => {
    const formData = new FormData();
    formData.set("name", "Dana");
    formData.set("email", "not-email");
    formData.set("topic", "bad");

    const result = validateFormSubmission(form, formData);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.email).toBe("Enter a valid email address.");
      expect(result.errors.topic).toBe("Choose a valid topic.");
      expect(result.errors.message).toBe("Message is required.");
    }
  });

  it("returns a formatted submission with owner context", () => {
    const formData = new FormData();
    formData.set("name", "Dana");
    formData.set("email", "dana@example.com");
    formData.set("topic", "pets");
    formData.set("message", "Can I borrow Pip?");
    formData.set("petName", "Pip");
    formData.set("ownerName", "Dana Muffins");

    const result = validateFormSubmission(form, formData);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.submission.replyTo).toBe("dana@example.com");
      expect(result.submission.context.petName).toBe("Pip");
    }
  });
});
