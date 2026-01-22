import type { Metadata } from "next";
import "./globals.css";
import "@/styles/shiki.css";

import { Inter, Gloock } from "next/font/google";
import Footer from "@/app/_footer";
import Navigation from "@/app/_components/Navigation";
import TailwindIndicator from "@/app/_components/TailwindIndicator";
import PlausibleProvider from "next-plausible";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const gloock = Gloock({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gloock",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_URL ?? "https://24letters.com";
const siteTitle = "Anton Timmermans - Human-focused software engineer";
const siteDescription =
  "Human-focused software engineer bringing calm to complex projects.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: "24letters",
    images: [
      {
        url: "/og/home",
        alt: "Portrait of Anton Timmermans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og/home"],
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  // next-plausible checks for VERCEL_ENV so it doesn't trigger on preview envs.
  const plausibleUrl = "24letters.com";

  return (
    <html lang="en" className={`${inter.variable} ${gloock.variable}`}>
      <body className={`font-sans antialiased`}>
        <PlausibleProvider domain={plausibleUrl}>
          <Navigation />
          <main className="pt-16">{children}</main>
          <Footer />
          {process.env.NODE_ENV === "development" && <TailwindIndicator />}
        </PlausibleProvider>
      </body>
    </html>
  );
}
