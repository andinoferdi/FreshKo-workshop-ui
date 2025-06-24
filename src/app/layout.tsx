import type React from "react";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AOSProvider from "@/components/AOSProvider";
import ScrollToTop from "@/components/ScrollToTop";
import NavigationHandler from "@/components/NavigationHandler";
import { HydrationFix } from "@/components/HydrationFix";
import { Toaster } from "sonner";
import NextAuthSessionProvider from "@/components/providers/SessionProvider";
import GoogleUserSync from "@/components/GoogleUserSync";
import DebugHelper from "@/components/DebugHelper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FreshKo - Fresh Groceries Delivered Daily",
  description:
    "Get farm-fresh groceries delivered to your doorstep within hours. Quality guaranteed, prices unbeatable.",
  keywords: "groceries, fresh food, delivery, organic, vegetables, fruits",
  authors: [{ name: "FreshKo Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body
        className="font-body text-foreground leading-relaxed tracking-wide antialiased"
        suppressHydrationWarning
      >
        <NextAuthSessionProvider>
          <GoogleUserSync />
          <DebugHelper />
          <HydrationFix />
          <AOSProvider>
            <NavigationHandler />
            {children}
            <ScrollToTop />
            <Toaster
              position="top-right"
              expand={false}
              richColors
              closeButton
              toastOptions={{
                style: {
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                },
              }}
            />
          </AOSProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
