import { describe, expect, it } from "vitest";
import { metadataFromSeo } from "./metadata";

// Narrow helpers to read the OG image out of the returned Metadata without
// wrestling with Next's broad union types in assertions.
function ogImage(meta: ReturnType<typeof metadataFromSeo>) {
  const images = meta.openGraph?.images;
  const first = Array.isArray(images) ? images[0] : images;
  return first as { url: string; type?: string; width?: number; height?: number; alt?: string };
}

const sanityImageSeo = {
  openGraphImage: {
    image: { asset: { url: "https://cdn.sanity.io/images/p/dataset/abc-1200x800.jpg" } },
    alt: "A very tired dog"
  }
};

describe("metadataFromSeo OG image", () => {
  it("forces a Sanity OG image to a 1200x630 PNG", () => {
    const meta = metadataFromSeo({ seo: sanityImageSeo, fallbackTitle: "Pet" });
    const image = ogImage(meta);

    expect(image.url).toContain("fm=png");
    expect(image.url).toContain("w=1200");
    expect(image.url).toContain("h=630");
    expect(image.type).toBe("image/png");
    expect(image.width).toBe(1200);
    expect(image.height).toBe(630);
    expect(image.alt).toBe("A very tired dog");
  });

  it("falls back to the static branded PNG when no image is authored", () => {
    const meta = metadataFromSeo({ fallbackTitle: "Pet" });
    expect(ogImage(meta).url).toBe("/og-default.png");
  });

  it("uses the site default OG image when the page has none", () => {
    const meta = metadataFromSeo({
      fallbackTitle: "Pet",
      siteDefaultSeo: sanityImageSeo
    });
    expect(ogImage(meta).url).toContain("fm=png");
  });

  it("prefers the page image over the site default", () => {
    const meta = metadataFromSeo({
      seo: {
        openGraphImage: {
          image: { asset: { url: "https://cdn.sanity.io/images/p/dataset/page-800x800.png" } },
          alt: "Page image"
        }
      },
      fallbackTitle: "Pet",
      siteDefaultSeo: sanityImageSeo
    });
    expect(ogImage(meta).url).toContain("page-800x800.png");
  });

  it("uses a stable dynamic route image before authored or site-default images", () => {
    const meta = metadataFromSeo({
      seo: sanityImageSeo,
      fallbackTitle: "Pet",
      dynamicImagePath: "/pets/beans/opengraph-image"
    });
    expect(ogImage(meta).url).toBe("/pets/beans/opengraph-image");
    expect(meta.twitter?.images).toEqual(["/pets/beans/opengraph-image"]);
  });

  it("leaves non-Sanity image URLs untouched (no fm=png)", () => {
    const meta = metadataFromSeo({
      seo: { openGraphImage: { image: { asset: { url: "https://example.com/pic.jpg" } } } },
      fallbackTitle: "Pet"
    });
    const url = ogImage(meta).url;
    expect(url).toBe("https://example.com/pic.jpg");
    expect(url).not.toContain("fm=png");
  });

  it("emits a canonical URL and og:url when a path is provided", () => {
    const meta = metadataFromSeo({ fallbackTitle: "Pet", path: "/pets/beans" });
    expect(meta.alternates?.canonical).toContain("/pets/beans");
    expect(meta.openGraph?.url).toContain("/pets/beans");
  });

  it("marks noIndex SEO as non-indexable", () => {
    const meta = metadataFromSeo({ seo: { noIndex: true }, fallbackTitle: "Pet" });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("uses absolute metadata titles when CMS titles already include the site name", () => {
    const meta = metadataFromSeo({ seo: { title: "Pricing | Pet Share" }, fallbackTitle: "Pricing" });
    expect(meta.title).toEqual({ absolute: "Pricing | Pet Share" });
    expect(meta.openGraph?.title).toBe("Pricing | Pet Share");
  });
});
