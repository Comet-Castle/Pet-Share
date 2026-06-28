import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

/**
 * Builds a Sanity CDN image URL from an image asset reference or image field.
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
