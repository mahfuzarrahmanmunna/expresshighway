import type { Metadata } from "next";
import { Fraunces, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider/providers";

/* ── Typography ── */
const fraunces = Fraunces({
  variable: "--font-playfair", // Kept var name for compatibility with existing components
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-geist-sans", // Kept var name for compatibility
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono", // Kept var name for compatibility
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Express Highway Inn — Where the Highway Leads to Luxury",
  description:
    "Express Highway Inn brings fine dining, an exclusive Club & Lounge, and everyday convenience together in one address, for every traveller on the road and every member who calls it their stop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${fraunces.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
