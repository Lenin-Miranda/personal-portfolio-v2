import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { motionCssProperties } from "./components/motion/tokens";

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
    <html data-scroll-behavior="smooth" lang="en" style={motionCssProperties}>
      <body>
        {children}
        <noscript>
          <style>{`
            .motion-reveal, .reveal-item, .reveal-mask-inner,
            .project-image-reveal, .project-image-frame, .project-image-depth,
            .project-case-heading, #project-case-title,
            .project-case-positioning, .project-case-meta, .project-case-hero-links {
              opacity: 1 !important;
              transform: none !important;
              clip-path: none !important;
            }
          `}</style>
        </noscript>
      </body>
    </html>
  );
}
