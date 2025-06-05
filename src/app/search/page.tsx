"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import { useStore } from "@/lib/store"
import { searchProducts } from "@/lib/products"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  const { searchQuery, searchResults, setSearchQuery, setSearchResults } = useStore()

  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query)
      const results = searchProducts(query)
      setSearchResults(results)
    }
  }, [query, searchQuery, setSearchQuery, setSearchResults])

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Home</span>
              <span>/</span>
              <span className="text-gray-900">Search</span>
              {searchQuery && (
                <>
                  <span>/</span>
                  <span className="text-gray-900">"{searchQuery}"</span>
                </>
              )}
            </div>
          </div>

          {/* Search Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <Search size={24} className="text-gray-400" />
              <div>
                <h2 className="text-xl font-semibold">
                  {searchQuery ? `Search results for "${searchQuery}"` : "Search Products"}
                </h2>
                <p className="text-gray-600">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} products`
                    : searchQuery
                      ? "No products found matching your search"
                      : "Enter a search term to find products"}
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          {searchResults.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? "No products found" : "Start searching"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search terms or browse our categories"
                  : "Use the search bar above to find products"}
              </p>
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="text-sm text-gray-500">Popular searches:</span>
                  {["fruits", "vegetables", "dairy", "beverages", "organic"].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term)
                        const results = searchProducts(term)
                        setSearchResults(results)
                      }}
                      className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 capitalize"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
