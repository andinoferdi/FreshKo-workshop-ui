"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Share2,
  Truck,
  Shield,
  ArrowLeft,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useHydratedStore, type Product } from "@/lib/store";
import { getProductsByCategory } from "@/lib/products";
import ProductCard from "./ProductCard";
import Header from "./Header";
import Footer from "./Footer";
import ClientOnly from "./ClientOnly";

interface ProductDetailProps {
  productId: string;
}

// Product detail skeleton
function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 animate-pulse rounded-2xl"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-32"></div>
          <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailContent({ productId }: ProductDetailProps) {
  const {
    cart,
    addToCart,
    updateQuantity,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getAllProducts,
    initializeOriginalData,
  } = useHydratedStore();

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomed, setIsZoomed] = useState(false);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const router = useRouter();

  // Initialize data and load products
  useEffect(() => {
    const loadProducts = () => {
      initializeOriginalData();
      const products = getAllProducts();
      setAllProducts(products);
    };

    loadProducts();

    // Listen for product updates
    const handleProductUpdate = () => {
      setTimeout(loadProducts, 100);
    };

    window.addEventListener("productCreated", handleProductUpdate);
    window.addEventListener("productUpdated", handleProductUpdate);
    window.addEventListener("productDeleted", handleProductUpdate);

    return () => {
      window.removeEventListener("productCreated", handleProductUpdate);
      window.removeEventListener("productUpdated", handleProductUpdate);
      window.removeEventListener("productDeleted", handleProductUpdate);
    };
  }, [getAllProducts, initializeOriginalData]);

  const product = allProducts.find((p) => p.id === parseInt(productId));

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image || "");
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <Link href="/shop" className="text-primary hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  // Product images array for thumbnails
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  // Calculate discounted price
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // Get related products
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Fresh, high-quality {product.category} perfect for your daily
              needs.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/shop"
                className="hover:text-primary transition-colors"
              >
                Shop
              </Link>
              <span>/</span>
              <span className="capitalize text-primary">
                {product.category}
              </span>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </div>

          {/* Product Detail */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 lg:p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative bg-white rounded-xl p-8 text-center border border-gray-100">
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 text-sm rounded-full z-10">
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

                {/* Thumbnail images */}
                <div className="flex gap-2 justify-center">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img || "")}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        selectedImage === img
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
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
                    <span
                      className={
                        product.inStock ? "text-primary" : "text-gray-600"
                      }
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`${
                            i < Math.floor(product.rating)
                              ? "text-primary fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">
                      {product.rating}
                    </span>
                    <span className="text-gray-500">(128 reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6">
                    {product.discount ? (
                      <>
                        <span className="text-3xl font-bold text-primary">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium border border-primary/20">
                          Save ${(product.price - discountedPrice).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="text-gray-600 mb-6">
                    <span className="font-medium">Unit:</span>{" "}
                    {product.unit || "1 Unit"}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description ||
                      "Fresh, high-quality product perfect for your daily needs. Carefully selected and stored to ensure maximum freshness and nutritional value."}
                  </p>
                </div>

                {/* Add to Cart Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={decrementQuantity}
                        className="p-3 text-primary hover:bg-primary/10 transition-colors duration-300"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, Number.parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 text-center border-0 text-lg font-semibold bg-white"
                      />
                      <button
                        onClick={incrementQuantity}
                        className="p-3 text-primary hover:bg-primary/10 transition-colors duration-300"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart - ${(discountedPrice * quantity).toFixed(2)}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleWishlistToggle}
                      className={`flex-1 py-3 px-6 rounded-lg font-semibold border-2 flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 ${
                        isWishlisted
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-white border-gray-200 text-gray-600 hover:border-primary/20"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={isWishlisted ? "currentColor" : "none"}
                      />
                      {isWishlisted
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </button>
                  </div>
                </div>

                {/* Product Features */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    Product Features
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      100% Fresh and Natural
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Premium Quality Guaranteed
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Fast Delivery Available
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Money Back Guarantee
                    </li>
                  </ul>

                  {/* Shipping Info */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                      <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">Free Shipping</div>
                      <div className="text-xs text-gray-500">
                        Orders over $50
                      </div>
                    </div>
                    <div className="text-center">
                      <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">
                        Quality Guarantee
                      </div>
                      <div className="text-xs text-gray-500">100% Fresh</div>
                    </div>
                    <div className="text-center">
                      <ArrowRight className="w-6 h-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">Easy Returns</div>
                      <div className="text-xs text-gray-500">30 day policy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Back to Shop */}
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Back to Shop
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  return <ProductDetailContent productId={productId} />;
}
