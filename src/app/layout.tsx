import type { Metadata, Viewport } from "next";
import { Jersey_10, Pixelify_Sans, Silkscreen } from "next/font/google";
import "./globals.css";

/** Display — titles, headings, big numbers. */
const display = Jersey_10({
  variable: "--font-jersey",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

/** UI — labels, buttons, HUD, in-world signs (designed on an 8px grid). */
const ui = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

/** Body — dialogue and reading text; a pixel face that stays legible at 16px. */
const body = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muneeb Qureshi — Product Designer · Pixel Portfolio",
  description:
    "Muneeb Qureshi — Product Designer, UI/UX Designer and Framer Developer at Xtarc. Explore a pixel-art world to discover projects like Mortime, Auton8 and Soal Labs.",
};

export const viewport: Viewport = {
  themeColor: "#120d0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${ui.variable} ${body.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
