import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Custom hook to handle visibility issues with hero sections
 * Ensures elements are visible immediately and handles navigation properly
 */
export function useVisibilityFix(initialDelay: number = 50) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Reset states on navigation
    setIsVisible(true);
    setIsLoaded(false);

    // Set loaded state after a small delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [pathname, initialDelay]);

  return { isLoaded, isVisible };
}

/**
 * Hook specifically for AOS refresh on navigation
 */
export function useAOSRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        import("aos")
          .then((AOS) => {
            AOS.default.refresh();
          })
          .catch(() => {
            console.warn("AOS refresh failed");
          });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [pathname]);
}
