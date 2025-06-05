"use client"

import { useState } from "react"
import ProductCard from "./ProductCard"
import { products, getProductsByCategory, getFeaturedProducts } from "../lib/products"

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("all")

  const getFilteredProducts = () => {
    switch (activeTab) {
      case "featured":
        return getFeaturedProducts().slice(0, 8)
      case "fruits":
        return getProductsByCategory("fruits")
      case "vegetables":
        return getProductsByCategory("vegetables")
      case "dairy":
        return getProductsByCategory("dairy")
      default:
        return products.slice(0, 8)
    }
  }

  const tabs = [
    { id: "all", label: "All Products" },
    { id: "featured", label: "Featured" },
    { id: "fruits", label: "Fruits" },
    { id: "vegetables", label: "Vegetables" },
    { id: "dairy", label: "Dairy" },
  ]

  return (
    <section className="py-12 lg:py-16">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of fresh, quality products carefully selected for your needs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeTab === tab.id 
                  ? "bg-yellow-400 text-white border-yellow-400 shadow-lg transform scale-105" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getFilteredProducts().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {getFilteredProducts().length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
