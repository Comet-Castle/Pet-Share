import { afterEach, describe, expect, it, vi } from "vitest";
import { sendFormAcknowledgementEmail } from "./mailgun";

const submission = {
  formSlug: "contact",
  formTitle: "Contact Pet Share",
  formType: "contact",
  values: {
    name: "Dana",
    email: "dana@example.com",
    message: "Hello"
  },
  context: {
    petName: "Pip"
  },
  replyTo: "dana@example.com"
};

describe("sendFormAcknowledgementEmail", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends a branded acknowledgement to the submitter without exposing credentials", async () => {
    vi.stubEnv("MAILGUN_API_KEY", "test-key");
    vi.stubEnv("MAILGUN_DOMAIN", "mg.example.com");
    vi.stubEnv("MAILGUN_FROM_EMAIL", "Pet Share <forms@example.com>");

    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));

    await sendFormAcknowledgementEmail(submission);

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.mailgun.net/v3/mg.example.com/messages");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ Authorization: expect.stringMatching(/^Basic /) });
    expect(init?.body).toBeInstanceOf(FormData);
    expect((init?.body as FormData).get("to")).toBe("dana@example.com");
    expect((init?.body as FormData).get("subject")).toBe("We received your Pet Share message");
    expect((init?.body as FormData).get("html")).toContain("Pet Share");
    expect((init?.body as FormData).get("html")).toContain("no need to reply");
    expect((init?.body as FormData).get("html")).toContain("sent on behalf of Pet Share");
    expect((init?.body as FormData).get("html")).toContain("not monitored");
    expect((init?.body as FormData).get("html")).toContain("cometcastle.ca");
    expect((init?.body as FormData).get("text")).toContain("cometcastle.ca");
  });

  it("CCs the configured oversight address when set", async () => {
    vi.stubEnv("MAILGUN_API_KEY", "test-key");
    vi.stubEnv("MAILGUN_DOMAIN", "mg.example.com");
    vi.stubEnv("MAILGUN_FROM_EMAIL", "Pet Share <forms@example.com>");
    vi.stubEnv("MAILGUN_CC_EMAIL", "hello@cometcastle.ca");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));

    await sendFormAcknowledgementEmail(submission);

    const body = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(body.get("cc")).toBe("hello@cometcastle.ca");
  });

  it("omits cc when MAILGUN_CC_EMAIL is not set", async () => {
    vi.stubEnv("MAILGUN_API_KEY", "test-key");
    vi.stubEnv("MAILGUN_DOMAIN", "mg.example.com");
    vi.stubEnv("MAILGUN_FROM_EMAIL", "Pet Share <forms@example.com>");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));

    await sendFormAcknowledgementEmail(submission);

    const body = fetchMock.mock.calls[0][1]?.body as FormData;
    expect(body.get("cc")).toBeNull();
  });

  it("skips delivery when there is no reply-to address", async () => {
    vi.stubEnv("MAILGUN_API_KEY", "test-key");
    vi.stubEnv("MAILGUN_DOMAIN", "mg.example.com");
    vi.stubEnv("MAILGUN_FROM_EMAIL", "Pet Share <forms@example.com>");
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const result = await sendFormAcknowledgementEmail({ ...submission, replyTo: undefined });

    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws a safe error when Mailgun rejects delivery", async () => {
    vi.stubEnv("MAILGUN_API_KEY", "test-key");
    vi.stubEnv("MAILGUN_DOMAIN", "mg.example.com");
    vi.stubEnv("MAILGUN_FROM_EMAIL", "Pet Share <forms@example.com>");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("bad", { status: 401 }));

    await expect(sendFormAcknowledgementEmail(submission)).rejects.toThrow("Mailgun delivery failed with status 401: bad");
  });
});
