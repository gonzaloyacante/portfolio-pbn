import type React from "react"
import type { Metadata } from "next"
import { Great_Vibes } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { DesignProvider } from "@/components/design-provider"
import "./globals.css"

const greatVibes = Great_Vibes({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
})

export const metadata: Metadata = {
  title: "Paola Bolívar Nievas - Maquilladora Profesional",
  description: "Portfolio de Paola Bolívar Nievas, maquilladora especializada en audiovisuales",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={greatVibes.variable}>
      <body className={`font-sans antialiased`}>
        <DesignProvider>
          {children}
        </DesignProvider>
        <Analytics />
      </body>
    </html>
  )
}
