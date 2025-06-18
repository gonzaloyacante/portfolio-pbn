"use client";

import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import "@/styles/globals.css";
import "@/styles/gallery.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Portfolio - Paola Bolivar Nievas</title>
        <meta name="description" content="Portfolio de Paola Bolivar Nievas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon/favicon-32x32.png"
          sizes="32x32"
          type="image/png"
        />
        <link
          rel="icon"
          href="/favicon/favicon-16x16.png"
          sizes="16x16"
          type="image/png"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AppProvider>
            <div className="min-h-screen bg-background text-foreground flex flex-col">
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
