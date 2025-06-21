"use client";

import { useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * AOSProvider that prevents hydration errors by ensuring AOS only runs on the client side
 * Uses proper client-side detection to prevent SSR mismatches
 */
export default function AOSProvider({ children }: Props) {
  const [isClient, setIsClient] = useState(false);
  const [isAOSLoaded, setIsAOSLoaded] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === "undefined") return;

    setIsClient(true);

    // Load and initialize AOS only on client side
    let AOS: any = null;

    const initAOS = async () => {
      try {
        // Dynamic import to avoid SSR issues
        AOS = (await import("aos")).default;

        // Dynamically load AOS CSS only if not already loaded
        if (typeof document !== "undefined") {
          const existingLink = document.querySelector('link[href*="aos.css"]');
          if (!existingLink) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/aos@2.3.1/dist/aos.css";
            document.head.appendChild(link);

            // Wait for CSS to load
            link.onload = () => {
              initializeAOS();
            };
          } else {
            initializeAOS();
          }
        }

        function initializeAOS() {
          if (AOS) {
            // Initialize AOS with safe defaults
            AOS.init({
              duration: 1000,
              easing: "ease-in-out",
              once: true,
              mirror: false,
              offset: 100,
              disable: false,
              startEvent: "DOMContentLoaded",
            });

            // Refresh AOS after initialization
            setTimeout(() => {
              AOS.refresh();
              setIsAOSLoaded(true);
            }, 100);
          }
        }
      } catch (error) {
        console.warn("Failed to load AOS:", error);
        setIsAOSLoaded(true); // Set to true even on error to prevent loading state
      }
    };

    // Initialize AOS
    initAOS();

    // Cleanup function
    return () => {
      if (AOS) {
        try {
          AOS.refreshHard();
        } catch (error) {
          console.warn("Error during AOS cleanup:", error);
        }
      }
    };
  }, []);

  // Prevent hydration mismatch by ensuring consistent rendering
  if (!isClient) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <>{children}</>;
}
