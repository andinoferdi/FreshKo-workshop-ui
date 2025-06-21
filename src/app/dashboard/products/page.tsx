"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { products } from "@/lib/products"

export default function DashboardProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in-stock" && product.inStock) ||
      (statusFilter === "out-of-stock" && !product.inStock)
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get unique categories
  const categories = ["all", ...new Set(products.map((product) => product.category).filter(Boolean))]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Products</h1>
            <p className="text-gray-600 font-medium">Manage your product inventory</p>
          </div>
          <button className="mt-4 md:mt-0 btn-primary flex items-center gap-2 hover:scale-105 transition-all duration-300">
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Search and Filters */}
        <div className="modern-card p-6 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="modern-input w-full pl-12 pr-4 py-3 font-medium"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 glass-effect rounded-xl md:hidden hover:bg-white/20 transition-all duration-300 font-semibold"
            >
              <Filter size={20} />
              Filters
            </button>

            <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? "block" : "hidden md:flex"}`}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="modern-input px-4 py-3 font-semibold"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "all"
                      ? "All Categories"
                      : category
                        ? category.charAt(0).toUpperCase() + category.slice(1)
                        : "Unknown"}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="modern-input px-4 py-3 font-semibold"
              >
                <option value="all">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="modern-card overflow-hidden hover:shadow-2xl transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-all duration-300 group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 font-medium">{product.unit}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-full capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                        {product.discount && (
                          <span className="ml-2 text-xs text-primary font-bold">-{product.discount}%</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          product.inStock
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-primary" : "text-gray-300"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-500 font-semibold">({product.rating})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-600 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110">
                          <Trash2 size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 font-medium">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700 font-medium">
              Showing <span className="font-bold">1</span> to{" "}
              <span className="font-bold">{Math.min(10, filteredProducts.length)}</span> of{" "}
              <span className="font-bold">{filteredProducts.length}</span> results
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm glass-effect rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold">
                Previous
              </button>
              <button className="px-4 py-2 text-sm bg-gradient-primary text-white rounded-lg font-semibold">1</button>
              <button className="px-4 py-2 text-sm glass-effect rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
