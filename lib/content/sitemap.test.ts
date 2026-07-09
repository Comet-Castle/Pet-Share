import { describe, expect, it } from "vitest";
import { buildSitemapEntries } from "./sitemap";

describe("buildSitemapEntries", () => {
  it("builds absolute URLs for static, marketing, pet, and owner routes", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://petshare.example",
      pets: [{ slug: "beans", _updatedAt: "2026-07-01T00:00:00Z" }],
      owners: [{ slug: "casey" }],
      marketingPages: [{ slug: "pricing" }]
    });

    expect(entries.map((entry) => entry.url)).toEqual([
      "https://petshare.example/",
      "https://petshare.example/pets",
      "https://petshare.example/pricing",
      "https://petshare.example/pets/beans",
      "https://petshare.example/owners/casey"
    ]);
    expect(entries.find((entry) => entry.url.endsWith("/pets/beans"))?.lastModified).toBe(
      "2026-07-01T00:00:00Z"
    );
  });

  it("excludes noIndex and missing-slug CMS routes", () => {
    const entries = buildSitemapEntries({
      siteUrl: "https://petshare.example",
      pets: [
        { slug: "visible" },
        { slug: "private", noIndex: true },
        { slug: null }
      ],
      owners: [{ slug: "" }],
      marketingPages: [{ slug: "guarantee", noIndex: false }]
    });

    expect(entries.map((entry) => entry.url)).toEqual([
      "https://petshare.example/",
      "https://petshare.example/pets",
      "https://petshare.example/guarantee",
      "https://petshare.example/pets/visible"
    ]);
  });
});
