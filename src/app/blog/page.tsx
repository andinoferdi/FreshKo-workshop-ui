"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Folder, Search, ChevronDown } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { blogPosts } from "@/lib/blog"

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  // Filter and sort blog posts
  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = category === "all" || post.category === category
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })

  // Get unique categories
  const categories = ["all", ...new Set(blogPosts.map((post) => post.category))]

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
            <span className="text-gray-900">Blog</span>
          </div>
        </div>

        {/* Page Header */}
        <section className="py-8 lg:py-12">
          <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Fresh Ideas & Tips</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover recipes, nutrition tips, seasonal guides, and everything you need to make the most of fresh,
                healthy ingredients.
              </p>
            </div>
          </div>
        </section>

        <div className="w-[90%] max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border-0 shadow-sm rounded-lg p-2 lg:p-3 hover:shadow-lg transition-shadow"
                >
                  <div className="overflow-hidden rounded-lg mb-4">
                    <Link href={`/blog/${post.id}`}>
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-auto hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="p-2 lg:p-3">
                    <div className="flex items-center gap-3 lg:gap-4 text-sm text-gray-500 uppercase mb-2 lg:mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Folder size={14} />
                        {post.category}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3">
                      <Link href={`/blog/${post.id}`} className="text-dark hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>

                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setCategory("all")
                }}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/80"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
