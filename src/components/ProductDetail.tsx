"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Plus, Minus, ShoppingCart, ArrowLeft, Share2 } from "lucide-react"
import { useStore, type Product } from "@/lib/store"
import ProductCard from "./ProductCard"
import { allProducts } from "@/lib/products"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image)
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()

  const isWishlisted = isInWishlist(product.id)
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  // Get related products from the same category
  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-gray-50 rounded-xl p-8 text-center">
                {product.discount && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 text-sm rounded z-10">
                    -{product.discount}% OFF
                  </span>
                )}
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full max-w-md mx-auto h-auto"
                />
              </div>

              {/* Thumbnail images - for now showing the same image */}
              <div className="flex gap-2 justify-center">
                {[product.image, product.image, product.image].map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImage === img ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="capitalize">{product.category}</span>
                  <span>•</span>
                  <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={`${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{product.rating}</span>
                  <span className="text-gray-500">(128 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  {product.discount ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">${discountedPrice.toFixed(2)}</span>
                      <span className="text-xl text-gray-500 line-through">${product.price.toFixed(2)}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        Save ${(product.price - discountedPrice).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  )}
                </div>

                <div className="text-gray-600 mb-6">
                  <span className="font-medium">Unit:</span> {product.unit || "1 Unit"}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || "Fresh, high-quality product perfect for your daily needs."}
                </p>
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button onClick={decrementQuantity} className="p-3 text-red-500 hover:bg-red-50 rounded-l-lg">
                      <Minus size={20} />
                    </button>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 text-lg font-semibold"
                    />
                    <button onClick={incrementQuantity} className="p-3 text-green-500 hover:bg-green-50 rounded-r-lg">
                      <Plus size={20} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/80 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart - ${(discountedPrice * quantity).toFixed(2)}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleWishlistToggle}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 ${
                      isWishlisted
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>

                  <button className="py-3 px-6 rounded-lg font-semibold bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center gap-2">
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </div>

              {/* Product Features */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Product Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    100% Fresh and Natural
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Premium Quality Guaranteed
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Fast Delivery Available
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Money Back Guarantee
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}

        {/* Back to Shop */}
        <div className="mt-8 text-center">
          <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
            <ArrowLeft size={20} />
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
