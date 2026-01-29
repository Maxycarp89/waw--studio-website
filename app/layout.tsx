import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Bangers } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-comic",
})

export const metadata: Metadata = {
  title: "WAW! Studio | Desarrollo Web, IA y Automatizaciones",
  description:
    "Creamos experiencias digitales que te hacen decir WAW! Webs, automatizaciones con IA y software creativo hecho a medida.",
  keywords: ["desarrollo web", "IA", "automatizaciones", "software creativo", "agencia digital"],
  icons: {
    icon: [
      {
        url: "/logo-waw.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/logo-waw.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#FFD633",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${bangers.variable} comic-cursor antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
