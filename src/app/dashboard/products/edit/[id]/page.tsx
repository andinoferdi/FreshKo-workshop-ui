"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  Save,
  Eye,
  Package,
  DollarSign,
  Tag,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getCategories } from "@/lib/products";
import { useHydratedStore } from "@/lib/store";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  unit: string;
  discount: number;
  inStock: boolean;
  image: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const {
    getProductById,
    updateProduct,
    deleteProduct,
    initializeOriginalData,
  } = useHydratedStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    unit: "",
    discount: 0,
    inStock: true,
    image: "",
  });

  const categories = getCategories();

  // Initialize data on mount
  useEffect(() => {
    initializeOriginalData();
  }, [initializeOriginalData]);

  // Load existing product data
  useEffect(() => {
    const product = getProductById(productId);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        category: product.category || "",
        unit: product.unit || "",
        discount: product.discount || 0,
        inStock: product.inStock !== false,
        image: product.image || "",
      });
      setImagePreview(product.image || "");
    }
  }, [productId, getProductById]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleToggleStock = () => {
    setFormData((prev) => ({
      ...prev,
      inStock: !prev.inStock,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData((prev) => ({
          ...prev,
          image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProduct(productId, {
        ...formData,
        rating: product?.rating || 4.0, // Keep existing rating
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/products");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteProduct(productId);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/products");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreview = () => {
    toast.info("Preview functionality coming soon!");
  };

  const product = getProductById(productId);

  if (!product) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Product Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/dashboard/products")}
              className="btn-primary"
            >
              Back to Products
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="glass-effect p-3 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Edit Product
              </h1>
              <p className="text-gray-600 font-medium">
                Update product information
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handlePreview}
              className="btn-secondary flex items-center gap-2 hover:scale-105 transition-all duration-300"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Package className="text-primary" size={24} />
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="modern-input w-full resize-none"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Unit *
                    </label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="modern-input w-full"
                      placeholder="e.g., per lb, each, 12 pack"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <DollarSign className="text-primary" size={24} />
                Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="modern-input w-full"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              {formData.price > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Final Price:
                    </span>
                    <div className="text-right">
                      {formData.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          ${formData.price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-primary">
                        $
                        {(
                          (formData.price * (100 - formData.discount)) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Image */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Upload className="text-primary" size={24} />
                Product Image
              </h2>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors duration-300 relative">
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                      />
                      <p className="text-gray-500 font-medium">
                        Click to upload product image
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Tag className="text-primary" size={24} />
                Stock Status
              </h2>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-bold text-gray-900">In Stock</span>
                  <p className="text-sm text-gray-500">
                    Available for purchase
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleStock}
                  className={`transition-all duration-300 ${
                    formData.inStock ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {formData.inStock ? (
                    <ToggleRight size={32} />
                  ) : (
                    <ToggleLeft size={32} />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="modern-card p-6 hover:shadow-lg transition-all duration-300">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isLoading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
