import type { Metadata } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
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
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${nunitoSans.variable} ${quicksand.variable}`}>
      <body>{children}</body>
    </html>
  );
}
