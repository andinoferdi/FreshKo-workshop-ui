"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Handle initial page load - SIMPLE VERSION
  useEffect(() => {
    // Auto hide after 2 seconds
    const hideTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(hideTimeout);
    };
  }, []); // Empty dependency array - run only once

  // Hide loading immediately on navigation
  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/images/logo.png"
          alt="FreshKo"
          width={80}
          height={80}
          className="mx-auto"
          priority
        />
      </div>

      {/* Loading Spinner */}
      <div className="w-12 h-12">
        <div className="w-full h-full border-4 border-gray-200 rounded-full animate-spin">
          <div className="w-full h-full border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
