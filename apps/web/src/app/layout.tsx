import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.leninmiranda.com"),
  title: "Lenin Miranda | Full-stack Software Engineer",
  description:
    "Full-stack engineering work by Lenin Miranda across product interfaces, backend services, real-time systems, automation, and AI integrations.",
  openGraph: {
    description:
      "Selected full-stack products and engineering work by Lenin Miranda.",
    title: "Lenin Miranda | Full-stack Software Engineer",
    type: "website",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#11110f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
