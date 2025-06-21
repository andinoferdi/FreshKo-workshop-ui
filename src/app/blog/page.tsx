"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Folder, Search, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/blog";

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Filter and sort blog posts
  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === "all" || post.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // Get unique categories
  const categories = [
    "all",
    ...new Set(blogPosts.map((post) => post.category)),
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Fresh Ideas & Tips
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover recipes, nutrition tips, seasonal guides, and everything
              you need to make the most of fresh, healthy ingredients.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-900">Blog</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           transition-all duration-300"
                />
              </div>

              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           appearance-none transition-all duration-300"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                           appearance-none transition-all duration-300"
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
                  className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden
                           hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                  <div className="overflow-hidden">
                    <Link href={`/blog/${post.id}`}>
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Folder size={14} />
                        <span className="capitalize">{post.category}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-gray-900 hover:text-primary transition-colors duration-300"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-primary font-medium hover:text-primary/80 
                               transition-colors duration-300 group/link"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCategory("all");
                }}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium
                         hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
