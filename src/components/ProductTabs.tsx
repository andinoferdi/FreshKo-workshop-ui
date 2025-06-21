"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import {
  products,
  getProductsByCategory,
  getFeaturedProducts,
} from "../lib/products";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredProducts = () => {
    switch (activeTab) {
      case "featured":
        return getFeaturedProducts().slice(0, 8);
      case "fruits":
        return getProductsByCategory("fruits");
      case "vegetables":
        return getProductsByCategory("vegetables");
      case "dairy":
        return getProductsByCategory("dairy");
      case "meat":
        return getProductsByCategory("meat");
      case "beverages":
        return getProductsByCategory("beverages");
      default:
        return products.slice(0, 8);
    }
  };

  const tabs = [
    { id: "all", label: "All Products" },
    { id: "featured", label: "Featured" },
    { id: "fruits", label: "Fruits" },
    { id: "vegetables", label: "Vegetables" },
    { id: "dairy", label: "Dairy" },
    { id: "meat", label: "Meat" },
    { id: "beverages", label: "Beverages" },
  ];

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
              onClick={() => setActiveTab(tab.id)}
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
          {getFilteredProducts().map((product, index) => {
            // Create staggered animations with different directions
            const animationTypes = [
              "fade-up",
              "fade-left",
              "fade-right",
              "zoom-in",
            ];
            const animationType = animationTypes[index % 4];
            const delay = 400 + index * 150;

            return (
              <div
                key={product.id}
                data-aos={animationType}
                data-aos-delay={delay}
                data-aos-duration="600"
                data-aos-easing="ease-out-cubic"
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>

        {getFilteredProducts().length === 0 && (
          <div
            className="text-center py-12"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <p className="text-gray-500 text-lg">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
