"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, X, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

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
            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
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
          </div>

          {/* Wishlist Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                Saved Items
                <span className="ml-2 text-primary bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
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
              {wishlist.map((product) => {
                const discountedPrice = product.discount
                  ? product.price * (1 - product.discount / 100)
                  : product.price;

                return (
                  <div
                    key={product.id}
                    className="bg-gray-50 rounded-xl p-4 relative hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 hover:text-gray-700 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <X size={16} />
                    </button>

                    {/* Product Image */}
                    <div className="relative aspect-square mb-4 bg-white rounded-lg overflow-hidden">
                      <Link href={`/product/${product.id}`}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{product.discount}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors duration-300 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {product.discount && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Unit */}
                      {product.unit && (
                        <p className="text-sm text-gray-600">{product.unit}</p>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          product.inStock
                            ? "bg-primary text-white hover:bg-primary/90 hover:scale-105 hover:shadow-md"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <ShoppingCart size={16} />
                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
                <button
                  onClick={() =>
                    wishlist.forEach((product) => handleAddToCart(product))
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
