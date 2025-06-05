"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Filter, Grid, List, ChevronDown } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import { products, getCategories } from "@/lib/products"
import type { Product } from "@/lib/store"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [allProducts, setAllProducts] = useState<Product[]>(products)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const categories = getCategories()

  useEffect(() => {
    let filtered = [...allProducts]

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = product.discount ? product.price * (1 - product.discount / 100) : product.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [selectedCategory, sortBy, priceRange])

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900">Shop</span>
            {selectedCategory !== "all" && (
              <>
                <span>/</span>
                <span className="text-gray-900 capitalize">{selectedCategory}</span>
              </>
            )}
          </div>
        </div>

        {/* Page Header */}
        <section className="py-8 lg:py-12">
          <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Shop Fresh Groceries</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our wide selection of fresh produce, quality meats, dairy products, and pantry essentials.
                Everything you need for healthy, delicious meals.
              </p>
            </div>
          </div>
        </section>

        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(!showFilters)} className="p-2 bg-gray-100 rounded-lg">
                    <Filter size={20} />
                  </button>
                </div>

                <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold mb-3">Categories</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          value="all"
                          checked={selectedCategory === "all"}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-primary"
                        />
                        <span className="capitalize">All Products</span>
                      </label>
                      {categories.map((category: string) => (
                        <label key={category} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={selectedCategory === category}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="text-primary"
                          />
                          <span className="capitalize">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-3">Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <h3 className="font-semibold mb-3">Quick Filters</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          const discountedProducts = allProducts.filter((p: Product) => p.discount)
                          setFilteredProducts(discountedProducts)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        On Sale
                      </button>
                      <button
                        onClick={() => {
                          const highRatedProducts = allProducts.filter((p: Product) => p.rating >= 4.5)
                          setFilteredProducts(highRatedProducts)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        Highly Rated (4.5+)
                      </button>
                      <button
                        onClick={() => {
                          const inStockProducts = allProducts.filter((p: Product) => p.inStock)
                          setFilteredProducts(inStockProducts)
                        }}
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        In Stock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      Showing {filteredProducts.length} of {allProducts.length} products
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${viewMode === "grid" ? "bg-primary text-white" : "text-gray-600"} rounded-l-lg`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${viewMode === "list" ? "bg-primary text-white" : "text-gray-600"} rounded-r-lg`}
                      >
                        <List size={20} />
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="name">Sort by Name</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Filter size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange([0, 100])
                      setFilteredProducts(allProducts)
                    }}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <div key={product.id} className={viewMode === "list" ? "bg-white rounded-2xl shadow-sm" : ""}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {filteredProducts.length > 12 && (
                <div className="text-center mt-8">
                  <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200">
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
