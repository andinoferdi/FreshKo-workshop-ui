"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Star,
  DollarSign,
  Tag,
  Calendar,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useHydratedStore } from "@/lib/store";
import type { Product } from "@/lib/store";
import { toast } from "sonner";

export default function DashboardProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const { getProductById, deleteProduct } = useHydratedStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadProduct = () => {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct || null);
      setIsLoading(false);
    };

    loadProduct();

    // Listen for product updates
    const handleProductUpdate = () => {
      setTimeout(loadProduct, 100);
    };

    window.addEventListener("productUpdated", handleProductUpdate);
    window.addEventListener("productDeleted", handleProductUpdate);

    return () => {
      window.removeEventListener("productUpdated", handleProductUpdate);
      window.removeEventListener("productDeleted", handleProductUpdate);
    };
  }, [productId, getProductById]);

  const handleDeleteProduct = async () => {
    if (!product) return;

    if (product.isEditable === false) {
      toast.error("Cannot delete original products");
      return;
    }

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setIsDeleting(true);
      try {
        const result = await deleteProduct(product.id);
        if (result.success) {
          toast.success("Product deleted successfully");
          window.location.href = "/dashboard/products";
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete product");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return notFound();
  }

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/dashboard/products"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Products
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Product ID: {product.id}</span>
                <span>•</span>
                <span>Category: {product.category || "General"}</span>
                <span>•</span>
                <span
                  className={`font-semibold ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {product.isEditable !== false && (
                <>
                  <Link
                    href={`/dashboard/products/edit/${product.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    <Edit size={16} />
                    Edit Product
                  </Link>

                  <button
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete Product
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image & Gallery */}
          <div className="lg:col-span-1">
            <div className="modern-card p-6">
              <div className="relative w-full h-80 mb-4">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="rounded-lg object-cover"
                />
                {product.discount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    -{product.discount}%
                  </div>
                )}
              </div>

              {/* Product Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500" size={16} />
                    <span className="text-sm font-medium">Rating</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {product.rating}/5
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-green-500" size={16} />
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary">
                      ${discountedPrice.toFixed(2)}
                    </span>
                    {product.discount && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="text-blue-500" size={16} />
                    <span className="text-sm font-medium">Stock Status</span>
                  </div>
                  <span
                    className={`font-bold ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "Available" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Product Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-900">
                      {product.name}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {product.category || "General"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.unit && (
                      <span className="text-gray-600 ml-1">
                        per {product.unit}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">
                      {product.discount
                        ? `${product.discount}%`
                        : "No discount"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {product.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Status
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span
                      className={`font-semibold ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {product.description ||
                    "No description available for this product."}
                </p>
              </div>
            </div>

            {/* Management Information */}
            <div className="modern-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Management Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Tag className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Product ID</p>
                    <p className="font-semibold text-gray-900">{product.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Created By</p>
                    <p className="font-semibold text-gray-900">
                      {product.createdBy || "System"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Editable</p>
                    <p className="font-semibold text-gray-900">
                      {product.isEditable !== false ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="text-primary" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p
                      className={`font-semibold ${
                        product.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.inStock ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {product.isEditable !== false && (
              <div className="modern-card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/products/edit/${product.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    <Edit size={16} />
                    Edit Product
                  </Link>

                  <Link
                    href={`/product/${product.id}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    <Eye size={16} />
                    View on Website
                  </Link>

                  <button
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Delete Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
