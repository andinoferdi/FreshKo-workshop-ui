"use client";

import { useState } from "react";
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
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useHydratedStore } from "@/lib/store";

export default function CartPage() {
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
        <main className="min-h-screen bg-white py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="bg-gray-50 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6">
                <ShoppingCart size={80} className="text-gray-300" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
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
      </main>
      <Footer />
    </>
  );
}
