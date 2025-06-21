import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import AOSProvider from "@/components/AOSProvider"
import ScrollToTop from "@/components/ScrollToTop"
import NavigationHandler from "@/components/NavigationHandler"
import { HydrationFix } from "@/components/HydrationFix"
import LoadingScreen from "@/components/LoadingScreen"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "FreshKo - Fresh Groceries Delivered Daily",
  description:
    "Get farm-fresh groceries delivered to your doorstep within hours. Quality guaranteed, prices unbeatable.",
  keywords: "groceries, fresh food, delivery, organic, vegetables, fruits",
  authors: [{ name: "FreshKo Team" }],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className="font-body text-foreground leading-relaxed tracking-wide antialiased" suppressHydrationWarning>
        <LoadingScreen />
        <HydrationFix />
        <AOSProvider>
          <NavigationHandler />
          {children}
          <ScrollToTop />
        </AOSProvider>
      </body>
    </html>
  )
}
