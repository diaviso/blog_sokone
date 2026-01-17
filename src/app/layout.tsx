import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/context";
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
  title: {
    default: "Khidmatoul Quran - Keur Cheikh El Hadji Amadou DEME",
    template: "%s | Khidmatoul Quran",
  },
  description: "Khidmatoul Quran - Keur Cheikh El Hadji Amadou DEME. Incarner l'excellence au service du Livre Saint, le Coran. Une plateforme dédiée à la spiritualité, la rigueur et l'engagement.",
  keywords: ["islam", "coran", "quran", "spiritualité", "foi", "communauté", "blog", "enseignements", "sokone", "sénégal"],
  authors: [{ name: "Khidmatoul Quran" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Khidmatoul Quran",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
            <Toaster position="top-right" richColors />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
