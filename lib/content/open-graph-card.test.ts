import { describe, expect, it } from "vitest";
import { buildOwnerOgCardData, buildPetOgCardData } from "./open-graph-card";

describe("buildPetOgCardData", () => {
  it("prefers hero images and uses key pet attributes", () => {
    const card = buildPetOgCardData({
      name: "Pip After Midnight",
      breed: "Domestic shorthair",
      listingHeadline: "Will judge your bookshelf from a safe distance.",
      petType: { name: "Cat" },
      owner: { location: "Portland, OR" },
      cardMedia: { image: { image: { asset: { url: "https://example.com/card.jpg" } } } },
      heroImages: [{ image: { asset: { url: "https://example.com/hero.jpg" } } }]
    });

    expect(card).toEqual({
      eyebrow: "Pet Share listing",
      title: "Pip After Midnight",
      description: "Will judge your bookshelf from a safe distance.",
      attributes: ["Cat", "Domestic shorthair", "Portland, OR"],
      imageUrl: "https://example.com/hero.jpg"
    });
  });

  it("falls back gracefully when pet content is absent", () => {
    const card = buildPetOgCardData(null);
    expect(card.title).toBe("Pet Share pet");
    expect(card.attributes).toEqual([]);
    expect(card.imageUrl).toBeUndefined();
  });
});

describe("buildOwnerOgCardData", () => {
  it("uses owner profile fields for social-card content", () => {
    const card = buildOwnerOgCardData({
      name: "Ari",
      tagline: "Accidentally became a bird landlord.",
      location: "Austin, TX",
      memberSince: "2026-01-01",
      portrait: { image: { asset: { url: "https://example.com/ari.jpg" } } }
    });

    expect(card.title).toBe("Ari");
    expect(card.description).toBe("Accidentally became a bird landlord.");
    expect(card.attributes).toEqual(["Austin, TX", "Member since 2026-01-01"]);
    expect(card.imageUrl).toBe("https://example.com/ari.jpg");
  });
});
