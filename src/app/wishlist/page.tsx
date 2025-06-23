"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientOnly from "@/components/ClientOnly";
import { useHydratedStore, type Product } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

// Wishlist skeleton
function WishlistSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded mb-8 w-32"></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="modern-card overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-4 w-20"></div>
                  <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function WishlistContent() {
  const { wishlist, removeFromWishlist, addToCart, isInWishlist } =
    useHydratedStore();
  const [isRemoving, setIsRemoving] = useState<number | null>(null);

  if (wishlist.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6">
                <Heart size={80} className="text-gray-300" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Your Wishlist is Empty
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Save items you love to your wishlist for easy access later.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <ArrowLeft size={20} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              My Wishlist
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your saved items for future purchases
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link
                href="/"
                className="hover:text-primary transition-colors duration-300"
              >
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900">Wishlist</span>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                Saved Items
                <span className="ml-2 text-primary bg-primary/10 px-3 py-1 rounded-full text-sm font-medium border border-primary/20">
                  {wishlist.length}
                </span>
              </h2>
              <Link
                href="/shop"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-300 hover:underline decoration-2 underline-offset-4"
              >
                Continue Shopping
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Additional Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 hover:scale-105 transition-all duration-300 border border-gray-200"
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
                <button
                  onClick={() =>
                    wishlist.forEach((product) => addToCart(product, 1))
                  }
                  disabled={
                    wishlist.length === 0 || wishlist.every((p) => !p.inStock)
                  }
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <ShoppingCart size={16} />
                  Add All to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const hasRedirected = useRef(false);
  const router = useRouter();
  const { isAuthenticated } = useHydratedStore();

  // Wait for hydration to complete
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/account/login");
    }
  }, [mounted, isAuthenticated, router]);

  // Don't render anything during hydration or if redirecting
  if (!mounted || !isAuthenticated) {
    return null;
  }

  return <WishlistContent />;
}
