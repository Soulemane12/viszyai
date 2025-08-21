import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Viszy - Digital Business Cards for Everyone",
  description: "Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan. No printing costs, always up-to-date.",
  keywords: "digital business card, QR code, networking, contact sharing, professional profile",
  authors: [{ name: "Viszy Team" }],
  openGraph: {
    title: "Viszy - Digital Business Cards for Everyone",
    description: "Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viszy - Digital Business Cards for Everyone",
    description: "Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
