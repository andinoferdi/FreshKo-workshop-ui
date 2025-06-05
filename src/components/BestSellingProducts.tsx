"use client"

import ProductCard from "./ProductCard"
import { getBestSellingProducts } from "../lib/products"

export default function BestSellingProducts() {
  const bestSellingProducts = getBestSellingProducts()

  return (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Best Selling Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our most popular products loved by customers worldwide</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
