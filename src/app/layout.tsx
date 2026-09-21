import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider/providers";

/* ── Typography ── */
const fraunces = Fraunces({
  variable: "--font-playfair", // Kept var name for compatibility with existing components
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-geist-sans", // Kept var name for compatibility
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono", // Kept var name for compatibility
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

/* ── SEO & Metadata ── */
// TODO: Replace with your actual deployed domain name
const baseUrl = "https://expresshighway.vercel.app"; 

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Express Highway Inn - Where the Highway Leads to Luxury",
    template: "%s | Express Highway Inn",
  },
  description:
    "Express Highway Inn brings fine dining, an exclusive Club & Lounge, and everyday convenience together in one address. A premium retreat for travellers and members on the Dhaka-Chittagong highway.",
  keywords: [
    "Express Highway Inn",
    "Sampan Group",
    "Luxury Hotel Bangladesh",
    "Dhaka Chittagong Highway",
    "VVIP Lounge",
    "Club and Lounge",
    "Fine Dining",
    "Corporate Events",
    "Mirsarai Hotel",
  ],
  authors: [{ name: "Sampan Group", url: "https://www.sampangroup.com.bd" }],
  creator: "Sampan Group",
  publisher: "Sampan Group",
  applicationName: "Express Highway Inn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Express Highway Inn",
    title: "Express Highway Inn - Where the Highway Leads to Luxury",
    description:
      "A premium retreat on the Dhaka-Chittagong highway. Experience fine dining, an exclusive Club & Lounge, and world-class facilities.",
    images: [
      {
        url: "/expresslogo.jpg", // Using your logo for OG sharing
        width: 1200,
        height: 630,
        alt: "Express Highway Inn - Sampan Group",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Express Highway Inn - Where the Highway Leads to Luxury",
    description:
      "A premium retreat on the Dhaka-Chittagong highway. Experience fine dining, an exclusive Club & Lounge, and world-class facilities.",
    images: ["/expresslogo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/expresslogo.jpg", type: "image/jpeg" }
    ],
    shortcut: [{ url: "/expresslogo.jpg", type: "image/jpeg" }],
    apple: [{ url: "/expresslogo.jpg", type: "image/jpeg" }],
  },
  manifest: "/manifest.json", // Optional: if you have a PWA manifest
};

export const viewport: Viewport = {
  themeColor: "#0c0b0b", // Matches your dark luxury theme
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ── Structured Data (JSON-LD) for SEO ── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Express Highway Inn",
  description: "Where the Highway Leads to Luxury. Fine dining, exclusive Club & Lounge, and everyday convenience on the Dhaka-Chittagong highway.",
  url: baseUrl,
  logo: `${baseUrl}/expresslogo.jpg`,
  image: `${baseUrl}/expresslogo.jpg`,
  telephone: "+8801906896327",
  email: "info@sampangroup.com.bd",
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sampan 21st Century, House-284, Block-B Road-1/A, Bashundhara",
    addressLocality: "Dhaka",
    postalCode: "1229",
    addressCountry: "BD"
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Sampan Group",
    url: "https://www.sampangroup.com.bd"
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "VVIP Lounge", value: true },
    { "@type": "LocationFeatureSpecification", name: "Fine Dining", value: true },
    { "@type": "LocationFeatureSpecification", name: "Salon & Spa", value: true },
    { "@type": "LocationFeatureSpecification", name: "EV Car Charging", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 Open", value: true }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Explicit Favicon link for maximum browser compatibility */}
        <link rel="icon" href="/expresslogo.jpg" type="image/jpeg" sizes="any" />
        <link rel="apple-touch-icon" href="/expresslogo.jpg" />
      </head>
      <body
        className={`${fraunces.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased bg-[#0c0b0b] text-white selection:bg-[#007DC6] selection:text-white`}
      >
        {/* Inject Structured Data for Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}