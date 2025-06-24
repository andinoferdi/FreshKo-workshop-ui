"use client";

import { useState, useEffect } from "react";
import AOS from "aos";
import ProductCard from "./ProductCard";
import { getCategories } from "../lib/products";
import { useHydratedStore } from "../lib/store";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("all");
  const [key, setKey] = useState(0);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { getAllProducts, initializeOriginalData } = useHydratedStore();

  // Force refresh products data
  const refreshProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      initializeOriginalData();
      const products = getAllProducts();
      setAllProducts(products);
      setIsLoading(false);
      setKey((prev) => prev + 1);
    }, 50);
  };

  // Initialize data on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  // Listen for product updates
  useEffect(() => {
    const handleProductUpdate = () => {
      refreshProducts();
    };

    window.addEventListener("productCreated", handleProductUpdate);
    window.addEventListener("productUpdated", handleProductUpdate);
    window.addEventListener("productDeleted", handleProductUpdate);

    return () => {
      window.removeEventListener("productCreated", handleProductUpdate);
      window.removeEventListener("productUpdated", handleProductUpdate);
      window.removeEventListener("productDeleted", handleProductUpdate);
    };
  }, []);

  // Refresh AOS when tab changes
  useEffect(() => {
    const timer = setTimeout(() => {
      AOS.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setKey((prev) => prev + 1);
  };

  const getFilteredProducts = () => {
    let filtered;
    if (activeTab === "featured") {
      filtered = allProducts
        .filter((product) => product.discount && product.discount > 0)
        .slice(0, 8);
    } else if (activeTab === "all") {
      // Sort by newest first (highest ID) and show more products
      filtered = allProducts.sort((a, b) => b.id - a.id).slice(0, 12);
    } else {
      filtered = allProducts
        .filter((product) => product.category === activeTab)
        .sort((a, b) => b.id - a.id)
        .slice(0, 8);
    }

    return filtered;
  };

  // Generate tabs dynamically from loaded products
  const categories =
    allProducts.length > 0
      ? [
          ...new Set(
            allProducts
              .map((product) => product.category)
              .filter(Boolean) as string[]
          ),
        ]
      : getCategories();

  const tabs = [
    { id: "all", label: "All Products" },
    { id: "featured", label: "Featured" },
    ...categories.map((category) => ({
      id: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
    })),
  ];

  const filteredProducts = getFilteredProducts();

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of fresh, quality products carefully
            selected for your needs.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-8"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeTab === tab.id
                  ? "bg-primary text-white border-primary shadow-lg transform scale-105"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
              }`}
              data-aos="zoom-in"
              data-aos-delay={250 + index * 75}
              data-aos-duration="500"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={`${product.id}-${key}`}
              data-aos="fade-up"
              data-aos-delay={100 + index * 100}
              data-aos-duration="600"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* No products message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12" data-aos="fade-up">
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Total products available: {allProducts.length}
            </p>
            <button
              onClick={refreshProducts}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Refresh Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
