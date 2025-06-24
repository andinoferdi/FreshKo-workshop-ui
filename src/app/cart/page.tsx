"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Minus,
  X,
  ShoppingCart,
  ArrowLeft,
  Truck,
  Shield,
  Tag,
  RotateCcw,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientOnly from "@/components/ClientOnly";
import { useHydratedStore, type CartItem } from "@/lib/store";

// Cart page skeleton
function CartSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16 pb-20 px-4 md:pt-20 md:pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="h-6 md:h-8 bg-gray-200 animate-pulse rounded mb-4 md:mb-8 w-32"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-lg p-4 md:p-6"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-5 md:h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-3 md:h-4 bg-gray-200 animate-pulse rounded w-20"></div>
                    </div>
                    <div className="h-5 md:h-6 bg-gray-200 animate-pulse rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-100 rounded-lg p-4 md:p-6 h-fit">
              <div className="h-5 md:h-6 bg-gray-200 animate-pulse rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function CartContent() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useHydratedStore();
  const [isClearing, setIsClearing] = useState(false);

  const cartTotal = getCartTotal();
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + shipping + tax;

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 500);
  };

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-16 md:pt-20 pb-20 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12 md:py-16">
              <div className="bg-gray-50 rounded-full w-24 h-24 md:w-32 md:h-32 mx-auto flex items-center justify-center mb-6">
                <ShoppingCart
                  size={60}
                  className="text-gray-300 md:w-20 md:h-20"
                />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300"
              >
                <ArrowLeft size={18} className="md:w-5 md:h-5" />
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
      <main className="min-h-screen bg-white pt-16 md:pt-20 pb-20 md:pb-16">
        <div className="container mx-auto px-4">
          {/* Mobile: Simplified layout */}
          <div className="block lg:hidden">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Cart Items ({cart.length})
                </h1>
                <button
                  onClick={handleClearCart}
                  disabled={isClearing}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                  {isClearing ? "Clearing..." : "Clear Cart"}
                </button>
              </div>
            </div>

            {/* Cart Items - Mobile */}
            <div className="space-y-4 mb-6">
              {cart.map((item) => {
                const discountedPrice = item.discount
                  ? item.price * (1 - item.discount / 100)
                  : item.price;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg w-20 h-20 object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 text-lg leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {item.unit || "per unit"}
                        </p>

                        {/* Price and quantity controls */}
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-l-lg transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-2 text-primary hover:bg-primary/10 rounded-r-lg transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">
                              ${(discountedPrice * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Price per unit */}
                        <div className="mt-2">
                          {item.discount ? (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-primary text-base">
                                ${discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-primary text-base">
                              ${item.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors self-start"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary - Mobile */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4">
                  <p className="text-sm text-primary">
                    Add ${(50 - cartTotal).toFixed(2)} more to get free
                    shipping!
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop: Original layout */}
          <div className="hidden lg:block">
            {/* Page Header */}
            <div className="mb-8 lg:mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Shopping Cart
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Review your items before checkout
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-gray-900">Cart</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Cart Items ({cart.length})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      disabled={isClearing}
                      className="text-gray-500 hover:text-gray-700 text-sm font-semibold disabled:opacity-50 transition-colors"
                    >
                      {isClearing ? "Clearing..." : "Clear Cart"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => {
                      const discountedPrice = item.discount
                        ? item.price * (1 - item.discount / 100)
                        : item.price;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300"
                        >
                          <div className="flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-lg"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.unit || "1 Unit"}
                            </p>
                            <div className="flex items-center gap-2">
                              {item.discount ? (
                                <>
                                  <span className="font-bold text-primary">
                                    ${discountedPrice.toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-primary">
                                  ${item.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-l-lg transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-2 text-primary hover:bg-primary/10 rounded-r-lg transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right min-w-[80px]">
                              <div className="font-bold text-gray-900">
                                ${(discountedPrice * item.quantity).toFixed(2)}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 sticky top-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6">
                      <p className="text-sm text-primary">
                        Add ${(50 - cartTotal).toFixed(2)} more to get free
                        shipping!
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary/90 hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      href="/shop"
                      className="block w-full bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Shield size={16} className="text-green-500" />
                      Secure Checkout
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-800">
                      <Truck size={16} />
                      <span className="font-semibold">
                        Free shipping on orders over $50
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CartPage() {
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

  return <CartContent />;
}
