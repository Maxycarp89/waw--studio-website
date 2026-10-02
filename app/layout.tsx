import type React from "react"
import type { Metadata, Viewport } from "next"
import { Anton, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" })

export const metadata: Metadata = {
  title: "WAW! Studio | Webs, branding y automatizaciones con IA",
  description:
    "Estudio creativo en Tucumán. Diseñamos webs, identidades y automatizaciones con IA para que tu marca diga WAW!",
  keywords: ["desarrollo web", "branding", "automatizaciones con IA", "estudio creativo", "Tucumán"],
  icons: {
    icon: [
      { url: "/logo-waw.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo-waw.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/logo-waw.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${anton.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
