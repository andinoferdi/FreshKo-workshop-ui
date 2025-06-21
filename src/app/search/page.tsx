"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { searchProducts } from "@/lib/products";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const { searchQuery, searchResults, setSearchQuery, setSearchResults } =
    useStore();

  useEffect(() => {
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      const results = searchProducts(query);
      setSearchResults(results);
    }
  }, [query, searchQuery, setSearchQuery, setSearchResults]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Search Results
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Find the products you're looking for"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
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
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-lg">
                <Search size={24} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : "Search Products"}
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
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-12 text-center">
              <div className="bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                <Search size={48} className="text-gray-400" />
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
                  <span className="text-sm text-gray-500">
                    Popular searches:
                  </span>
                  {[
                    "fruits",
                    "vegetables",
                    "dairy",
                    "beverages",
                    "organic",
                  ].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        const results = searchProducts(term);
                        setSearchResults(results);
                      }}
                      className="px-3 py-1 bg-white text-sm rounded-full hover:bg-primary hover:text-white transition-colors duration-300 border border-gray-200 capitalize"
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
      </main>

      <Footer />
    </>
  );
}
