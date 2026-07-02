import type { Metadata } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditingClient } from "@/components/features/preview/visual-editing";
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

export const metadata: Metadata = {
  title: {
    default: "Pet Share",
    template: "%s | Pet Share"
  },
  description:
    "A satirical marketplace for temporarily sharing pets with extremely questionable references."
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
