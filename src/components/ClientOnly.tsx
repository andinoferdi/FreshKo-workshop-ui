"use client";

import { useEffect, useState } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ClientOnly component that only renders children on the client side
 * Helps prevent hydration errors by avoiding server-client mismatches
 */
export default function ClientOnly({
  children,
  fallback = null,
}: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // No delay - immediate mount
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Enhanced skeleton component for auth pages
export function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="modern-card p-8">
            {/* Logo skeleton */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
            </div>

            {/* Form skeleton */}
            <div className="space-y-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-100 rounded-xl animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  ></div>
                ))}
              </div>

              <div className="h-12 bg-primary/20 rounded-xl animate-pulse delay-500"></div>

              <div className="flex justify-center space-x-4">
                <div className="h-10 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-100 rounded-lg animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple loading skeleton for other components
export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-200 rounded h-4 w-full mb-2"></div>
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-200 rounded h-4 w-1/2"></div>
    </div>
  );
}
