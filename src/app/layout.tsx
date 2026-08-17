import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { AppLoader } from "@/components/loader/app-loader";
import { Nav } from "@/components/nav/nav";
import { Cursor } from "@/components/ui/cursor";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-utility",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.metaDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.metaDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.metaDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${mono.variable} h-full`}
    >
      <head>
        {/* Reveal wrappers start at opacity 0 for the scroll animation; if JS
            never runs, force them visible so nothing is lost. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal]{opacity:1 !important;transform:none !important}",
            }}
          />
        </noscript>
      </head>
      <body className="min-h-full">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AppLoader />
        <Cursor />
        <SmoothScroll>
          <Nav />
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
