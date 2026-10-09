import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "Steve Mezzo Images | Professional Photography in Texas",
    template: "%s | Steve Mezzo Images",
  },
  description:
    "Premium photography services in Texas. Specializing in portraits, weddings, events, fashion, and commercial photography. Capturing moments, creating memories.",
  keywords: [
    "photography",
    "Texas photographer",
    "wedding photography",
    "portrait photography",
    "event photography",
    "commercial photography",
    "Steve Mezzo",
  ],
  authors: [{ name: "Steve Mezzo" }],
  creator: "Steve Mezzo Images",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Steve Mezzo Images | Professional Photography in Texas",
    description:
      "Premium photography services in Texas. Capturing moments, creating memories.",
    siteName: "Steve Mezzo Images",
  },
  twitter: {
    card: "summary_large_image",
    title: "Steve Mezzo Images | Professional Photography in Texas",
    description:
      "Premium photography services in Texas. Capturing moments, creating memories.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
