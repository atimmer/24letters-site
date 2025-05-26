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

export const metadata: Metadata = {
  title: "24letters",
  description: "Product-focused full-stack software engineer",
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
