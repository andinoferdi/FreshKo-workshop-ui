"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * NavigationHandler component that manages scroll position and animations
 * when navigating between pages to ensure consistent UX
 */
export default function NavigationHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Handle navigation changes
    const handleNavigation = async () => {
      // Force scroll to top immediately on navigation
      window.scrollTo({ top: 0, behavior: "instant" });

      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Refresh AOS animations for new page content
        if (typeof window !== "undefined") {
          import("aos")
            .then((AOS) => {
              AOS.default.refreshHard();
            })
            .catch(() => {
              console.warn("AOS refresh failed on navigation");
            });
        }
      }, 50);
    };

    handleNavigation();
  }, [pathname]);

  // This component doesn't render anything
  return null;
}
