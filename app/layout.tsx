import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Loader } from "@/components/loader";
import { profile } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/** Display face specified by the design tokens doc, self-hosted (FFL licensed). */
const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muneebqureshi.design"),
  title: {
    default: "Muneeb Qureshi — Product Designer & Framer Dev",
    template: "%s — Muneeb Qureshi",
  },
  description: profile.metaDescription,
  applicationName: "Muneeb Qureshi",
  keywords: [
    "Product Designer",
    "UI/UX Designer",
    "Framer Developer",
    "Design Systems",
    "SaaS Design",
    "Brand Designer",
    "Karachi",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Muneeb Qureshi — Product Designer & Framer Developer",
    description: profile.metaDescription,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muneeb Qureshi — Product Designer & Framer Developer",
    description: profile.metaDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.roles.join(", "),
  email: `mailto:${profile.email}`,
  url: "https://muneebqureshi.design",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karachi",
    addressCountry: "PK",
  },
  sameAs: profile.socials
    .map((s) => s.href)
    .filter((href) => href.startsWith("http")),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${generalSans.variable} ${jetbrains.variable} grain h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {/* Without JS neither the intro nor the scroll reveals can resolve
            themselves, so content must be forced visible. */}
        <noscript>
          <style>{`#mq-loader{display:none !important}
[style*="opacity:0"]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <Loader />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
