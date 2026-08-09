import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const editorialFallback = Newsreader({
  subsets: ["latin"],
  variable: "--font-editorial-fallback",
});

export const metadata: Metadata = {
  title: {
    default: "Lenin Miranda | Full-stack software engineer",
    template: "%s | Lenin Miranda",
  },
  description:
    "Selected full-stack products and engineering work by Lenin Miranda.",
  metadataBase: new URL("https://www.leninmiranda.com"),
  openGraph: {
    title: "Lenin Miranda | Full-stack software engineer",
    description:
      "Selected full-stack products and engineering work by Lenin Miranda.",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1418" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${editorialFallback.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
