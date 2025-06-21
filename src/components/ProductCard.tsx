"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { useHydratedStore, type Product } from "../lib/store";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg hover:scale-105 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoading ? "blur-sm" : "blur-0"
            }`}
            onLoad={() => setImageLoading(false)}
          />
        </Link>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlistHandler}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            inWishlist
              ? "bg-primary text-white"
              : "bg-white text-gray-600 hover:bg-primary/10 hover:text-primary"
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={inWishlist ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={
                i < Math.floor(product.rating)
                  ? "fill-primary text-primary"
                  : "text-gray-300"
              }
              size={14}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
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
          <p className="text-sm text-gray-500 mb-3">{product.unit}</p>
        )}

        {/* Cart Controls */}
        {quantity > 0 ? (
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 min-w-[2rem] text-center font-medium">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1 ${
              product.inStock
                ? "bg-primary text-white hover:bg-primary/90 hover:scale-105"
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
