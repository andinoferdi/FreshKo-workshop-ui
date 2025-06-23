"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

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

  // Listen for custom toast events
  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      const { message, type } = event.detail;

      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;
        default:
          toast(message);
      }
    };

    window.addEventListener("show-toast" as any, handleToast);

    return () => {
      window.removeEventListener("show-toast" as any, handleToast);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
