import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

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
  manifest: "/manifest.json",
  icons: {
    icon: '/logo.PNG',
    apple: '/logo.PNG',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Viszy",
  },
  openGraph: {
    title: "Viszy - Digital Business Cards for Everyone",
    description: "Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Viszy Logo',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Viszy - Digital Business Cards for Everyone",
    description: "Create your professional digital business card in minutes. Share your contact info, social media, and more with a simple QR code scan.",
    images: ['/logo.PNG'],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#4f46e5",
    "msapplication-TileColor": "#4f46e5",
  }
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
