import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AOSProvider from "@/components/AOSProvider";
import ScrollToTop from "@/components/ScrollToTop";
import { HydrationFix } from "@/components/HydrationFix";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className="font-body text-light-dark leading-relaxed tracking-wide"
        suppressHydrationWarning
      >
        <HydrationFix />
        <AOSProvider>{children}</AOSProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
