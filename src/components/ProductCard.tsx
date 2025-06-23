"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { useHydratedStore, type Product } from "../lib/store";
import ClientOnly from "./ClientOnly";

interface ProductCardProps {
  product: Product;
}

// Create skeleton for product card
function ProductCardSkeleton() {
  return (
    <div className="modern-card overflow-hidden group">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
      </div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 animate-pulse rounded mb-3"></div>
        <div className="flex items-center mb-3">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gray-200 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
        <div className="h-6 bg-gray-200 animate-pulse rounded mb-4 w-20"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  );
}

function ProductCardContent({ product }: ProductCardProps) {
  const {
    cart,
    addToCart,
    updateQuantity,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useHydratedStore();
  const [imageLoading, setImageLoading] = useState(true);

  const cartItem = cart.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const inWishlist = isInWishlist(product.id);

  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    updateQuantity(product.id, newQuantity);
  };

  const toggleWishlistHandler = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="modern-card overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-500">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoading ? "blur-sm" : "blur-0"
            }`}
            onLoad={() => setImageLoading(false)}
          />
        </Link>

        {/* Modern Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-gradient-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            -{product.discount}%
          </div>
        )}

        {/* Modern Wishlist Button */}
        <button
          onClick={toggleWishlistHandler}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 shadow-lg ${
            inWishlist
              ? "bg-gradient-primary text-white scale-110"
              : "glass-effect text-gray-600 hover:bg-primary/10 hover:text-primary hover:scale-110"
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={inWishlist ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-3 hover:text-primary transition-colors line-clamp-2 text-lg">
            {product.name}
          </h3>
        </Link>

        {/* Modern Rating */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={
                i < Math.floor(product.rating)
                  ? "fill-primary text-primary"
                  : "text-gray-300"
              }
              size={16}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2 font-medium">
            ({product.rating})
          </span>
        </div>

        {/* Modern Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl font-bold gradient-text">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discount && (
            <span className="text-sm text-gray-500 line-through font-medium">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Unit */}
        {product.unit && (
          <p className="text-sm text-gray-500 mb-4 font-medium">
            {product.unit}
          </p>
        )}

        {/* Modern Cart Controls */}
        {quantity > 0 ? (
          <div className="flex items-center modern-input p-0 overflow-hidden">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-3 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-3 min-w-[3rem] text-center font-bold">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-3 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              product.inStock
                ? "btn-primary shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  return <ProductCardContent product={product} />;
}
