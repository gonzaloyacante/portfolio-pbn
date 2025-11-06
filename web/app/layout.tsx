import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import "@/styles/gallery.css";
import Providers from "@/app/providers";
import { initSentry } from "@/lib/sentry";

// Initialize Sentry in production
if (typeof window === 'undefined') {
  initSentry();
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Portfolio - Paola Bolivar Nievas",
    template: "%s | Portfolio - Paola Bolivar Nievas"
  },
  description: "Portfolio profesional de Paola Bolivar Nievas - Diseñadora y desarrolladora creativa",
  keywords: ["portfolio", "diseño", "desarrollo", "creativo", "Paola Bolivar Nievas"],
  authors: [{ name: "Paola Bolivar Nievas" }],
  creator: "Paola Bolivar Nievas",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.NEXT_PUBLIC_VERCEL_ENV === "production" || process.env.VERCEL_ENV === "production"
        ? "https://portfolio-pbn.vercel.app"
        : "https://dev-portfolio-pbn.vercel.app")
  ),
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Portfolio - Paola Bolivar Nievas",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@paolabn",
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

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded"
        >
          Saltar al contenido principal
        </a>
        <Providers>
          <main id="main-content" className="container mx-auto px-4 py-8 flex-grow" role="main">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
