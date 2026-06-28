import type { Metadata, Viewport } from "next";
import { Studio } from "./studio";

export const metadata: Metadata = {
  referrer: "same-origin",
  robots: {
    index: false,
    follow: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

/**
 * Mounts Sanity Studio inside the Next.js app at /studio.
 */
export default function StudioPage() {
  return <Studio />;
}
