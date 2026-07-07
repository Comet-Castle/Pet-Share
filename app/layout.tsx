import type { Metadata } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditingClient } from "@/components/features/preview/visual-editing";
import { publicEnv } from "@/config/env";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito-sans"
});

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand"
});

// Resolve the metadataBase defensively: an invalid NEXT_PUBLIC_SITE_URL must not
// break every route's metadata collection at build time. Falls back to localhost.
function resolveMetadataBase(): URL {
  try {
    return new URL(publicEnv.siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  // Makes the static OG fallback (`/og-default.png`) and any relative/canonical
  // URLs resolve to absolute URLs, which OG/Twitter scrapers require. Sourced from
  // NEXT_PUBLIC_SITE_URL (falls back to localhost in dev via config/env).
  metadataBase: resolveMetadataBase(),
  title: {
    default: "Pet Share",
    template: "%s | Pet Share"
  },
  description:
    "A satirical marketplace for temporarily sharing pets with extremely questionable references.",
  openGraph: {
    type: "website",
    siteName: "Pet Share",
    title: "Pet Share",
    description:
      "A satirical marketplace for temporarily sharing pets with extremely questionable references.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, type: "image/png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Share",
    description:
      "A satirical marketplace for temporarily sharing pets with extremely questionable references.",
    images: ["/og-default.png"]
  }
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

/**
 * Defines the global document shell and font variables for every route.
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en" className={`${nunitoSans.variable} ${quicksand.variable}`}>
      <body>
        {children}
        <SanityLive includeDrafts={isEnabled && Boolean(process.env.SANITY_API_BROWSER_READ_TOKEN)} />
        {isEnabled ? <VisualEditingClient /> : null}
      </body>
    </html>
  );
}
