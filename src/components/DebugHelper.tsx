"use client";

import { useEffect } from "react";

export default function DebugHelper() {
  useEffect(() => {
    // Dynamically import debug helpers only on client side
    const loadDebugHelpers = async () => {
      try {
        await import("@/lib/debug-helpers");
        console.log("🛠️ Debug helpers loaded successfully");
      } catch (error) {
        console.warn("Could not load debug helpers:", error);
      }
    };

    loadDebugHelpers();
  }, []);

  // This component renders nothing, just loads debug utilities
  return null;
}
